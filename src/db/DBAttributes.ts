import { createError } from "../utils/error.js";
import DBUtils from "./DBUtils.js";
import Express from "express";

class DBATTRIBUTES {
  private dbUtils: DBUtils | null = null;

  constructor() {
    this.dbUtils = new DBUtils();
  }

  getDBAttributes = (res: Express.Response, next: any) => {
    try {
      let db = this.dbUtils.getDb();

      const select = db.prepare("SELECT * FROM attributes");
      const results = select.all();
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
        "CREATE TABLE IF NOT EXISTS attributes (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, abbr TEXT, desc TEXT, source TEXT)"
      );
      create.run();

      const attributes = [
        { name: "Agility", abbr: "AGI", desc: "Nimbleness, dexterity, and overall physical coordination of muscles and reflexes.", source: "SWADE" },
        { name: "Smarts", abbr: "SMA", desc: "Raw intellect, perception, and ability to sort and make use of complex information.", source: "SWADE" },
        { name: "Spirit", abbr: "SPI", desc: "Inner strength and willpower.", source: "SWADE" },
        { name: "Strength", abbr: "STR", desc: "Raw muscle power.", source: "SWADE" },
        { name: "Vigor", abbr: "VIG", desc: "Endurance, health, and constitution.", source: "SWADE" },
      ];

      const insert = db.prepare(
        "INSERT INTO attributes(name, abbr, desc, source) VALUES (?, ?, ?, ?)"
      );
      attributes.forEach((ability) => {
        insert.run(ability.name, ability.abbr, ability.desc, ability.source);
      });
      res.status(200).send("Initialized attributes");
    } catch (err) {
      console.error(err);
      return next(err);
    }
  };

  updateAttribute = (id: number, name: string, abbreviation: string, description: string, source: string, res: Express.Response, next: any) => {
    let db = this.dbUtils.getDb();

    try {
      const updateStmt = db.prepare(`UPDATE attributes SET name = ?, abbr = ?, desc = ?, source = ? WHERE id = ?`);
      updateStmt.run(
        name,
        abbreviation,
        description,
        source,
        id
      );
    } catch(err) {
      console.error(err);
      return next(createError(500, "Illegal attribute params"));
    }
    res.status(200).send({ response: "Attribute updated"})
  };

  insertAttribute = (name: string, abbr: string, desc: string, source: string, res: Express.Response, next: any) => {
    try {
      let db = this.dbUtils.getDb();
      const insert = db.prepare(
        "INSERT INTO attributes (name, abbr, desc, source) VALUES (?, ?, ?, ?)"
      );

      insert.run(
        name,
        abbr,
        desc,
        source
      );
    } catch (err) {
      console.error(err);
      return next(createError(500, "Illegal attribute params"));
    }
    res.status(204).send();
  };

  drop = (res: Express.Response, next: any) => {
    try {
      let db = this.dbUtils.getDb();
      const drop = db.prepare("DROP TABLE attributes");
      drop.run("DROP TABLE attributes", function (err: any) {
        if (err) {
          console.log(err);
          res.send(err);
        } else {
          console.log("Dropped table");
          res.status(200).send("Dropped attributes table");
        }
      });
    } catch (err) {
      console.error(err);
      return next(err);
    }
  };
}

export default DBATTRIBUTES;
