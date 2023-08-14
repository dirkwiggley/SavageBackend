import { createError } from "../utils/error.js";
import DBUtils from "./DBUtils.js";
import Express from "express";

interface UserInterface {
  id: number,
  nickname: string
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

    const select = db.prepare("SELECT playerid FROM players WHERE campaignid = ?");
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
      const players = this.getCampaignPlayers(results.id);
      results.players = players;
      res.status(200).send(results);
    } catch(err) {
      console.error(err);
      return next(err);
    }
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

  updateCampaign = (id: number, name: string, ownerid: number, ownernickname: string, hindrances: number, attributes: number, skills: number, res: Express.Response, next: any) => {
    let db = this.dbUtils.getDb();

    try {
      const updateStmt = db.prepare(`UPDATE campaigns SET name = ?, ownerid = ?, ownernickname = ?, hindrances = ?, attributes = ?, skills = ? WHERE id = ?`);
      updateStmt.run(
        name,
        ownerid,
        ownernickname,
        hindrances,
        attributes,
        skills,
        id
      );
    } catch(err) {
      console.error(err);
      return next(createError(500, "Illegal campaigns params"));
    }
    res.status(200).send({ response: "Campaigns updated"})
  };

  insertCampaign = (name: string, ownerid: number, ownernickname: string, hindrances: number, attributes: number, skills: number, res: Express.Response, next: any) => {
    try {
      let db = this.dbUtils.getDb();
      const insert = db.prepare(
        "INSERT INTO campaigns VALUES (@id, @name, @ownerid, @ownernickname, @hindrances, @attributes, @skills)"
      );

      insert.run({
        id: null,
        name: name,
        ownerid: ownerid,
        ownernickname: ownernickname,
        hindrances: hindrances,
        attributes: attributes,
        skills: skills
      });
    } catch (err) {
      console.error(err);
      return next(createError(500, "Illegal campaigns params"));
    }
    res.status(204).send();
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
