import { createError } from "../utils/error.js";
import DBUtils from "./DBUtils.js";
import Express from "express";

class DBPlayers {
  private dbUtils: DBUtils | null = null;

  constructor() {
    this.dbUtils = new DBUtils();
  }

  getPlayers = (campaignId: number, res: Express.Response, next: any) => {
    try {
      let db = this.dbUtils.getDb();

      const select = db.prepare("SELECT * FROM players WHERE campaignid = ?");
      const results = select.all(campaignId);
      res.status(200).send(results);
    } catch (err) {
      console.error(err);
      return next(err);
    }
  }

  getPlayerById = (id: number, res: Express.Response, next: any) => {
    try {
      let db = this.dbUtils.getDb();

      const select = db.prepare("SELECT * FROM players WHERE id = ?");
      const results = select.get(id);
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
        "CREATE TABLE IF NOT EXISTS players (id INTEGER PRIMARY KEY AUTOINCREMENT, playerid number, playernickname TEXT, campaignid number, campaignname TEXT)"
      );
      create.run();

      const players = [
        { playerid: 2, playernickname: "User", campaignid: 1, campaignname: "SWADE" },
      ];

      const insert = db.prepare(
        "INSERT INTO players VALUES (@id, @playerid, @playernickname, @campaignid, @campaignname)"
      );

      players.forEach((player) => {
        insert.run({
          id: null,
          playerid: player.playerid, 
          playernickname: player.playernickname, 
          campaignid: player.campaignid, 
          campaignname: player.campaignname
        });
      });
      res.status(200).send("Initialized players");
    } catch (err) {
      console.error(err);
      return next(err);
    }
  };

  updateplayers = (id: number, playerid: number, playernickname: string, campaignid: number, campaignname: string, res: Express.Response, next: any) => {
    let db = this.dbUtils.getDb();

    try {
      const updateStmt = db.prepare(`UPDATE players SET playerid = ?, playernickname = ?, campaignid = ? campaignname = ? WHERE id = ?`);
      updateStmt.run(
        playerid,
        playernickname,
        campaignid,
        campaignname,
        id
      );
    } catch(err) {
      console.error(err);
      return next(createError(500, "Illegal player params"));
    }
    res.status(200).send({ response: "Player updated"})
  };

  insertPlayer = (playerid: number, playernickname: string, campaignid: number, campaignname: string, res: Express.Response, next: any) => {
    try {
      let db = this.dbUtils.getDb();
      const insert = db.prepare(
        "INSERT INTO players VALUES (@id, @playerid, @playernickname, @campaignid, @campaignname)"
      );

      insert.run({
        id: null,
        playerid: playerid,
        playernickname: playernickname,
        campaignid: campaignid,
        campaignname: campaignname
      });
    } catch (err) {
      console.error(err);
      return next(createError(500, "Illegal player params"));
    }
    res.status(204).send();
  };

  drop = (res: Express.Response, next: any) => {
    try {
      let db = this.dbUtils.getDb();
      const drop = db.prepare("DROP TABLE players");
      drop.run();
      console.log("Dropped table");
      res.status(200).send("Dropped players table");
    } catch (err) {
      console.error(err);
      return next(err);
    }
  };
}

export default DBPlayers;
