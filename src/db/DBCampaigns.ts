import { createError } from "../utils/error.js";
import DBUtils from "./DBUtils.js";
import Express from "express";

interface UserInterface {
  id: number,
  nickname: string
}

interface CampaignInterface {
  id?: number,
  name: string,
  ownerid: number,
  ownernickname: string,
  hindrances: number,
  attributes: number,
  skills: number,
  players?: UserInterface[];
}

class DBCampaigns {
  private dbUtils: DBUtils | null = null;

  constructor() {
    this.dbUtils = new DBUtils();
  }

  getUser = (users: Array<UserInterface>, userId: number) => {
    return  users.find(user => user.id === userId);
  }

  getCampaigns = (res: Express.Response, next: any) => {
    try {
      let db = this.dbUtils.getDb();

      const getUsers = db.prepare("SELECT id, nickname FROM users");
      const users = getUsers.all();
      
      const select = db.prepare("SELECT * FROM campaigns");
      const results = select.all();
      results.forEach(campaign=> {
        const playerIds = this.getCampaignPlayers(campaign.id);
        const players: Array<UserInterface> = [];
        playerIds.forEach(element => {
          players.push(this.getUser(users, element.playerid));
        });
        campaign.players = players;
      });

      res.status(200).send(results);
    } catch (err) {
      console.error(err);
      return next(err);
    }
  }

  getCampaignNames = (res: Express.Response, next: any) => {
    try {
      let db = this.dbUtils.getDb();

      const select = db.prepare("SELECT name FROM campaigns");
      const results = select.all();
      res.status(200).send(results);
    } catch (err) {
      console.error(err);
      return next(err);
    }
  }

  getCampaignPlayers = (campaignId: number) => {
    let db = this.dbUtils.getDb();

    const select = db.prepare("SELECT * FROM players WHERE campaignid = ?");
    return select.all(campaignId);
}

  getCampaignByName = (name: string, res: Express.Response, next: any) => {
    try {
      let db = this.dbUtils.getDb();

      const select = db.prepare("SELECT * FROM campaigns WHERE name = ?");
      const results = select.get(name);
      const players = this.getCampaignPlayers(results.id);
      results.players = players;
      res.status(200).send(results);
    } catch(err) {
      console.error(err);
      return next(err);
    }
  }

  getCampaignById = (id: number, res: Express.Response, next: any) => {
    try {
      let db = this.dbUtils.getDb();

      const select = db.prepare("SELECT * FROM campaigns WHERE id = ?");
      const results = select.get(id);
      if (results) {
        const players = this.getCampaignPlayers(id);
        results.players = players;
        res.status(200).send(results);
      } else {
        res.status(500).send("Campaign not found");
      }

    } catch(err) {
      console.error(err);
      return next(err);
    }
  }

  insertPlayers = (db, campaignId: number, campaignName: string, players: UserInterface[]) => {
    if (campaignId) {
      // Clean up possible detritus
      const findPlayers = db.prepare("SELECT id FROM players WHERE campaignid = ?");
      const oldPlayers = findPlayers.get(campaignId);
      if (oldPlayers) {
        const deletePlayers = db.prepare("DELETE FROM players WHERE campaignid = ?");
        deletePlayers.run(campaignId);
      }
      if (players) {
        const insertPlayer = db.prepare("INSERT INTO players VALUES (@id, @playerid, @playernickname, @campaignid, @campaignname)");
        players.forEach(player => {
          insertPlayer.run({
            id: null,
            playerid: player.id,
            playernickname: player.nickname,
            campaignid: campaignId,
            campaignname: campaignName
          });
        });
      }
    }
  }

  createCampaign = (campaignInfo: CampaignInterface, res: Express.Response, next: any) => {
    try {
      let db = this.dbUtils.getDb();

      // Skip if this campaign name already exists
      const select = db.prepare("SELECT id FROM campaigns WHERE name = ?");
      const campaignExists = select.get(campaignInfo.name);
      if (!campaignExists) {
        const insert = db.prepare("INSERT INTO campaigns VALUES (@id, @name, @ownerid, @ownernickname, @hindrances, @attributes, @skills)");

        const result = insert.run({
          id: null,
          name: campaignInfo.name,
          ownerid: campaignInfo.ownerid,
          ownernickname: campaignInfo.ownernickname,
          hindrances: campaignInfo.hindrances,
          attributes: campaignInfo.attributes,
          skills: campaignInfo.skills
        });

        const campaignId = result.lastInsertRowid;
        if (campaignInfo.players && campaignInfo.players.length > 0) {
            this.insertPlayers(db, Number(campaignId), campaignInfo.name, campaignInfo.players)
        }
      } else {
        return next(createError(500, "A campaign with this name already exists"));  
      }
    } catch (err) {
      console.error(err);
      return next(createError(500, "Illegal campaigns params"));
    }
    res.status(204).send();

  }

  updateCampaign = (campaignInfo: CampaignInterface, res: Express.Response, next: any) => {
    if (!campaignInfo.id) return next(createError(500, "Campaign Id required"));

    try {
      let db = this.dbUtils.getDb();
      const updateStmt = db.prepare(`UPDATE campaigns SET name = ?, ownerid = ?, ownernickname = ?, hindrances = ?, attributes = ?, skills = ? WHERE id = ?`);
      updateStmt.run(
        campaignInfo.name,
        campaignInfo.ownerid,
        campaignInfo.ownernickname,
        campaignInfo.hindrances,
        campaignInfo.attributes,
        campaignInfo.skills,
        campaignInfo.id,
      );

      if (campaignInfo.players) {
          this.insertPlayers(db, campaignInfo.id, campaignInfo.name, campaignInfo.players)
      }
    } catch(err) {
      console.error(err);
      return next(createError(500, "Illegal campaigns params"));
    }
    res.status(204).send({ response: "Campaigns updated"})
  }

  init = (res: Express.Response, next: any) => {
    try {
      let db = this.dbUtils.getDb();
      const create = db.prepare(
        "CREATE TABLE IF NOT EXISTS campaigns (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, ownerid number, ownernickname TEXT, hindrances number, attributes number, skills number)"
      );
      create.run();

      const campaigns = [
        { name: "SWADE", ownerid: -1, ownernickname: "admin", hindrances: 4, attributes: 5, skills: 12 },
      ];

      const insert = db.prepare(
        "INSERT INTO campaigns(name, ownerid, ownernickname, hindrances, attributes, skills) VALUES (?, ?, ?, ?, ?, ?)"
      );
      campaigns.forEach((campaign) => {
        insert.run(campaign.name, campaign.ownerid, campaign.ownernickname, campaign.hindrances, campaign.attributes, campaign.skills);
      });

      res.status(200).send("Initialized campaigns");
    } catch (err) {
      console.error(err);
      return next(err);
    }
  };

  drop = (res: Express.Response, next: any) => {
    try {
      let db = this.dbUtils.getDb();
      const drop = db.prepare("DROP TABLE campaigns");
      drop.run();
      console.log("Dropped table");
      res.status(200).send("Dropped campaigns table");
    } catch (err) {
      console.error(err);
      return next(err);
    }
  };
}

export default DBCampaigns;
