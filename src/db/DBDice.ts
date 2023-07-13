import { createError } from "../utils/error.js";
import DBUtils from "./DBUtils.js";
import Express from "express";

class DBDICE {
  private dbUtils: DBUtils | null = null;

  constructor() {
    this.dbUtils = new DBUtils();
  }

  getDBDice = (res: Express.Response, next: any) => {
    try {
      let db = this.dbUtils.getDb();

      const select = db.prepare("SELECT * FROM dice");
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
        "CREATE TABLE IF NOT EXISTS dice (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, rank number)"
      );
      create.run();

      const dice = [
        { name: "d4-2", rank: 0 },
        { name: "d4-1", rank: 1 },
        { name: "d4", rank: 2 },
        { name: "d6", rank: 3 },
        { name: "d8", rank: 4 },
        { name: "d10", rank: 5 },
        { name: "d12", rank: 6 },
        { name: "d12+1", rank: 7 },
        { name: "d12+2", rank: 8 },
        { name: "d12+3", rank: 9 },
        { name: "d12+4", rank: 10 },
        { name: "d12+5", rank: 11 },
        { name: "d12+6", rank: 12 },
        { name: "d12+7", rank: 13 },
        { name: "d12+8", rank: 14 },
      ];

      const insert = db.prepare(
        "INSERT INTO dice(name, rank) VALUES (?, ?)"
      );
      dice.forEach((ability) => {
        insert.run(ability.name, ability.rank);
      });
      res.status(200).send("Initialized dice");
    } catch (err) {
      console.error(err);
      return next(err);
    }
  };

  updateSkill = (id: number, name: string, rank: number, res: Express.Response, next: any) => {
    let db = this.dbUtils.getDb();

    try {
      const updateStmt = db.prepare(`UPDATE dice SET name = ?, rank = ? WHERE id = ?`);
      updateStmt.run(
        name,
        rank,
        id
      );
    } catch(err) {
      console.error(err);
      return next(createError(500, "Illegal dice params"));
    }
    res.status(200).send({ response: "Dice updated"})
  };

  insertSkill = (name: string, rank: number, res: Express.Response, next: any) => {
    try {
      let db = this.dbUtils.getDb();
      const insert = db.prepare(
        "INSERT INTO dice VALUES (@id, @name, @rank)"
      );

      insert.run({
        id: null,
        name: name,
        rank: rank
      });
    } catch (err) {
      console.error(err);
      return next(createError(500, "Illegal dice params"));
    }
    res.status(204).send();
  };

  drop = (res: Express.Response, next: any) => {
    try {
      let db = this.dbUtils.getDb();
      const drop = db.prepare("DROP TABLE dice");
      drop.run("DROP TABLE dice", function (err) {
        if (err) {
          console.log(err);
          res.send(err);
        } else {
          console.log("Dropped table");
          res.status(200).send("Dropped dice table");
        }
      });
    } catch (err) {
      console.error(err);
      return next(err);
    }
  };
}

export default DBDICE;
