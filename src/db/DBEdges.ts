import { createError } from "../utils/error.js";
import DBUtils from "./DBUtils.js";
import Express from "express";

class DBEDGES {
  private dbUtils: DBUtils | null = null;

  constructor() {
    this.dbUtils = new DBUtils();
  }

  getDBEdges = (res: Express.Response, next: any) => {
    try {
      let db = this.dbUtils.getDb();

      const select = db.prepare("SELECT * FROM edges");
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
        "CREATE TABLE IF NOT EXISTS edges (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, type TEXT, subtype: TEXT, desc TEXT, source TEXT)"
      );
      create.run();

      const edges = [
        { name: "", type: "", subtype: "", desc: "", source: "SWADE" },
      ];

      const insert = db.prepare(
        "INSERT INTO edges(name, type, subtype, desc, source) VALUES (?, ?, ?, ?, ?)"
      );
      edges.forEach((ability) => {
        insert.run(ability.name, ability.type, ability.subtype, ability.desc, ability.source);
      });
      res.status(200).send("Initialized edges");
    } catch (err) {
      console.error(err);
      return next(err);
    }
  };

  updateEdge = (id: number, name: string, type: string, subtype: string, desc: string, source: string, res: Express.Response, next: any) => {
    let db = this.dbUtils.getDb();

    try {
      const updateStmt = db.prepare(`UPDATE edges SET name = ?, type = ?, subtype = ?, desc = ?, source = ? WHERE id = ?`);
      updateStmt.run(
        name,
        type,
        subtype,
        desc,
        source,
        id
      );
    } catch(err) {
      console.error(err);
      return next(createError(500, "Illegal edge params"));
    }
    res.status(200).send({ response: "Edge updated"})
  };

  insertEdge = (name: string, type: string, subtype: string, desc: string, source: string, res: Express.Response, next: any) => {
    try {
      let db = this.dbUtils.getDb();
      const insert = db.prepare(
        "INSERT INTO edges VALUES (@id, @name, @type, @subtype, @desc, @source)"
      );

      insert.run({
        id: null,
        name: name,
        type: type,
        subtype: subtype,
        desc: desc,
        source: source
      });
    } catch (err) {
      console.error(err);
      return next(createError(500, "Illegal edge params"));
    }
    res.status(204).send();
  };

  drop = (res: Express.Response, next: any) => {
    try {
      let db = this.dbUtils.getDb();
      const drop = db.prepare("DROP TABLE edges");
      drop.run("DROP TABLE edges", function (err) {
        if (err) {
          console.log(err);
          res.send(err);
        } else {
          console.log("Dropped table");
          res.status(200).send("Dropped edges table");
        }
      });
    } catch (err) {
      console.error(err);
      return next(err);
    }
  };
}

export default DBEDGES;
