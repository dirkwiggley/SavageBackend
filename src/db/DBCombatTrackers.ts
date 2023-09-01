import DBUtils from "./DBUtils.js";
import Express from "express";

import { createError } from "../utils/error.js";
import { CombatTrackerInterface, TrackerUserInterface } from "../types.js";

/*
  // COMBAT_TRACKER
  (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, gamemaster_id number, gamemaster_name TEXT)"
  (id INTEGER PRIMARY KEY AUTOINCREMENT, tracker_id INTEGER, user_id number, user_name TEXT)"
*/

const TRACKER_ROLE_ADMIN = "TRACKER_ROLE_ADMIN"
const TRACKER_ROLE_USER = "TRACKER_ROLE_USER"

class DBCombatTracker {
  private dbUtils: DBUtils | null = null

  constructor() {
    this.dbUtils = new DBUtils()
  }

  updateTracker = (trackerInfo: CombatTrackerInterface, res: Express.Response, next: any) => {
    let db = this.dbUtils.getDb();

    if (trackerInfo.id === null) {
      throw new Error("Invalid tracker");
    } else {
      try {
        const updateStmt = db.prepare(`UPDATE combat_trackers SET name = ?, gamemaster_id = ?, gamemaster_name = ? WHERE id = ?`);
        updateStmt.run(
          trackerInfo.name,
          trackerInfo.gamemaster_id,
          trackerInfo.gamemaster_name,
        );
        res.send("SUCCESS");
      } catch(err) {
        console.error(err);
        throw err;
      }
    }
  };

  insertTracker = (trackerInfo: CombatTrackerInterface, res: Express.Response, next: any) => {
    try {
      let db = this.dbUtils.getDb();
      const insert = db.prepare(
        "INSERT INTO combat_trackers (name, gamemaster_id, gamemaster_name) VALUES (?, ?, ?)"
      );

      insert.run(
        trackerInfo.name,
        trackerInfo.gamemaster_id,
        trackerInfo.gamemaster_name,
      );
    } catch (err) {
      console.error(err);
      return next(err);
    }
    res.status(204).send();
  };

  updateTrackerUser = (trackerUserInfo: TrackerUserInterface, res: Express.Response, next: any) => {
    let db = this.dbUtils.getDb();

    if (trackerUserInfo.user_id === null) {
      throw new Error("Invalid tracker user");
    } else {
      try {
        const updateStmt = db.prepare(`UPDATE tracker_users SET tracker_id = ?, user_id = ?, user_name = ? WHERE id = ?`);
        updateStmt.run(
          trackerUserInfo.tracker_id,
          trackerUserInfo.user_id,
          trackerUserInfo.user_name,
          trackerUserInfo.user_id,
        );
      } catch(err) {
        console.error(err);
        throw err;
      }
    }
  };

  insertTrackerUser = (trackerUserInfo: TrackerUserInterface, res: Express.Response, next: any) => {
    try {
      let db = this.dbUtils.getDb();
      const insert = db.prepare(
        "INSERT INTO tracker_users (tracker_id, user_id, user_name) VALUES (?, ?, ?)"
      );

      insert.run(
        trackerUserInfo.tracker_id,
        trackerUserInfo.user_id,
        trackerUserInfo.user_name,
      );
    } catch (err) {
      console.error(err);
      return next(err);
    }
    res.status(204).send();
  };

  deleteTrackerUser = (tracker_id: number, user_id: number, res: Express.Response, next: any) => {
    try {
      let db = this.dbUtils.getDb()
      const deleteTrackerUserStatement = db.prepare(`DELETE FROM tracker_users WHERE tracker_id = ${tracker_id} AND user_id = ${user_id}`)
      deleteTrackerUserStatement.run()
      res.send("Success")
    } catch (err) {
      console.error(err);
      return next(err);
    }
  };

  deleteTrackerAndUsers = (id: number, res: Express.Response, next: any) => {
    try {
      let db = this.dbUtils.getDb()
      const deleteUsersStatement = db.prepare(`DELETE FROM tracker_users WHERE tracker_id = ${id}`)
      const deleteStatement = db.prepare(`DELETE FROM combat_trackers WHERE id = ${id}`)
      deleteUsersStatement.run()
      deleteStatement.run()
      res.send("Success")
    } catch (err) {
      console.error(err);
      return next(err);
    }
  };

  getTrackers = (res: Express.Response, next: any) => {
    try {
      let db = this.dbUtils.getDb();
      const select = db.prepare("SELECT * FROM combat_trackers");
      const data = select.get();
      if (!data) {
        return next(createError(500, "No data"));
      } else {
        res.send({ trackers: data });
      } 
    } catch (err) {
      return next(err);
    }
  };

  getUsersByTrackerId = (id: number, res: Express.Response, next: any) => {
    try {
      let db = this.dbUtils.getDb();
      const select = db.prepare("SELECT * FROM combat_trackers");
      const data = select.get(id);
      if (!data) {
        return next(createError(500, "No data"));
      } else {
        res.send({ users: data });
      } 
    } catch (err) {
      return next(err);
    }
  };

  init = (res: Express.Response, next: any) => {
    try {
      let db = this.dbUtils.getDb();
      try {
        const dropCt = db.prepare("DROP TABLE IF EXISTS combat_trackers")
        let changes = dropCt.run()
        console.log(changes)
        const dropTu = db.prepare("DROP TABLE IF EXISTS tracker_users")
        changes = dropTu.run()
        console.log(changes)
      } catch (err) {
        console.error(err)
      }

      const createCt = db.prepare(
        "CREATE TABLE IF NOT EXISTS combat_trackers (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, gamemaster_id number, gamemaster_name TEXT)"
      );
      createCt.run();
      const createTu = db.prepare(
        "CREATE TABLE IF NOT EXISTS tracker_users (id INTEGER PRIMARY KEY AUTOINCREMENT, tracker_id INTEGER, user_id number, user_name TEXT)"
      );
      createTu.run();


      res.send("Initialized combat_trackers, tracker_users table")
    } catch (err) {
      return next(err);
    }
  };
}

export default DBCombatTracker;
