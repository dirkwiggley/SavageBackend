import { createError } from "../utils/error.js";
import DBUtils from "./DBUtils.js";
import Express from "express";

interface DocumentInterface {
  id: number;
  ownerid: number;
  campaignid: number;
  title: string;
  desc: string;
  text: string;
  read: string;
  write: string;
  delete: string;
}

class DBDocuments {
  private dbUtils: DBUtils | null = null;

  constructor() {
    this.dbUtils = new DBUtils();
  }

  getDocDescriptionsByCampaign = (campaignId: number, res: Express.Response, next: any) => {

  }

  getDocsByCampaign = (campaignId: number, res: Express.Response, next: any) => {
    try {
      let db = this.dbUtils.getDb();

      const getDocs = db.prepare("SELECT * FROM documents WHERE campaignid = ?");
      const results = getDocs.all(campaignId);
      res.status(200).send(results);
    } catch (err) {
      console.error(err);
      return next(err);
    }
  }

  getDocById = (documentId: number, res: Express.Response, next: any) => {
    try {
      let db = this.dbUtils.getDb();

      const select = db.prepare("SELECT * FROM documents WHERE id = ?");
      const results = select.get(documentId);
      res.status(200).send(results);
    } catch (err) {
      console.error(err);
      return next(err);
    }
  }

  createDocument = (documentInfo: DocumentInterface, res: Express.Response, next: any) => {
    try {
      let db = this.dbUtils.getDb();

      // Skip if this document title already exists
      const select = db.prepare("SELECT id FROM documents WHERE title = ? AND ownerid = ?");
      const documentExists = select.get(documentInfo.title, documentInfo.ownerid);
      if (!documentExists) {
        const insert = db.prepare("INSERT INTO documents (ownerid, campaignid, title, desc, text, read, write, delete) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");

        const result = insert.run(
          documentInfo.ownerid,
          documentInfo.campaignid,
          documentInfo.title,
          documentInfo.desc,
          documentInfo.text,
          documentInfo.read,
          documentInfo.write,
          documentInfo.delete
        );
      } else {
        return next(createError(500, "A document with this title already exists"));  
      }
    } catch (err) {
      console.error(err);
      return next(createError(500, "Illegal document params"));
    }
    res.status(200).send();

  }

  updateDocument = (documentInfo: DocumentInterface, res: Express.Response, next: any) => {
    if (!documentInfo.id) return next(createError(500, "Document Id required"));

    try {
      let db = this.dbUtils.getDb();
      const updateStmt = db.prepare(`UPDATE documents SET ownerid = ?, campaignid = ?, title = ?, desc = ?, text = ?, read = ?, write = ?, delete = ? WHERE id = ?`);
      updateStmt.run(
        documentInfo.ownerid,
        documentInfo.campaignid,
        documentInfo.title,
        documentInfo.desc,
        documentInfo.text,
        documentInfo.read,
        documentInfo.write,
        documentInfo.delete,
        documentInfo.id
      );
    } catch(err) {
      console.error(err)
      return next(createError(500, "Illegal document params"))
    }
    res.status(200).send({ response: "Documents updated"})
  }

  init = (res: Express.Response, next: any) => {
    try {
      let db = this.dbUtils.getDb()
      const drop = db.prepare("DROP TABLE IF EXISTS documents")
      drop.run();

      const create = db.prepare(
        "CREATE TABLE IF NOT EXISTS documents (id INTEGER PRIMARY KEY AUTOINCREMENT, ownerid number, campaignid number, title TEXT, desc TEXT, text TEXT, read TEXT, write TEXT, del TEXT)"
      );
      create.run();

      res.status(200).send("Initialized documents");
    } catch (err) {
      console.error(err);
      return next(err);
    }
  };

  drop = (res: Express.Response, next: any) => {
    try {
      let db = this.dbUtils.getDb();
      const drop = db.prepare("DROP TABLE documents");
      drop.run();
      console.log("Dropped table");
      res.status(200).send("Dropped documents table");
    } catch (err) {
      console.error(err);
      return next(err);
    }
  };
}

export default DBDocuments;
