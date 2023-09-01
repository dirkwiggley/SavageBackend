import { createError } from "../utils/error.js";
import DBUtils from "./DBUtils.js";
import Express from "express";

class DBCoreSkills {
  private dbUtils: DBUtils | null = null;

  constructor() {
    this.dbUtils = new DBUtils();
  }

  getCoreSkills = (campaignId: number, res: Express.Response, next: any) => {
    try {
      let db = this.dbUtils.getDb();

      const select = db.prepare("SELECT * FROM coreskills WHERE campaignid = ?");
      const results = select.all(campaignId);
      res.status(200).send(results);
    } catch (err) {
      console.error(err);
      return next(err);
    }
  };

  init = (res: Express.Response, next: any) => {
    try {
      let db = this.dbUtils.getDb();
      const create = db.prepare(
        "CREATE TABLE IF NOT EXISTS coreskills (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, campaignid number, source TEXT)"
      );
      create.run();

      const coreskills = [
        { name: "Athletics", campaignid: 1, source: "SWADE" },
        { name: "Common Knowledge", campaignid: 1, source: "SWADE"},
        { name: "Notice", campaignid: 1, source: "SWADE" },
        { name: "Persuasion", campaignid: 1, source: "SWADE" },
        { name: "Stealth", campaignid: 1, source: "SWADE" },
      ];

      const insert = db.prepare(
        "INSERT INTO coreskills(name, campaignid, source) VALUES (?, ?, ?)"
      );
      coreskills.forEach((skill) => {
        insert.run(skill.name, skill.campaignid, skill.source);
      });
      res.status(200).send("Initialized coreskills");
    } catch (err) {
      console.error(err);
      return next(err);
    }
  };

  updateCoreSkills = (id: number, name: string, campaignId: number, source: string, res: Express.Response, next: any) => {
    let db = this.dbUtils.getDb();

    try {
      const updateStmt = db.prepare(`UPDATE coreskills SET name = ?, campaignid = ?, source = ? WHERE id = ?`);
      updateStmt.run(
        name,
        campaignId,
        source,
        id
      );
    } catch(err) {
      console.error(err);
      return next(createError(500, "Illegal core skill params"));
    }
    res.status(200).send({ response: "Core Skills updated"})
  };

  insertCoreSkill = (name: string, campaignid: number, source: string, res: Express.Response, next: any) => {
    try {
      let db = this.dbUtils.getDb();
      const insert = db.prepare(
        "INSERT INTO coreskills (name, campaignid, source) VALUES (?, ?, ?)"
      );

      insert.run(
        name,
        campaignid,
        source
      );
    } catch (err) {
      console.error(err);
      return next(createError(500, "Illegal coreskills params"));
    }
    res.status(204).send();
  };

  drop = (res: Express.Response, next: any) => {
    try {
      let db = this.dbUtils.getDb();
      const drop = db.prepare("DROP TABLE coreskills");
      drop.run();
      console.log("Dropped table coreskills");
      res.status(200).send("Dropped coreskills table");
    } catch (err) {
      console.error(err);
      return next(err);
    }
  };
}

export default DBCoreSkills;
