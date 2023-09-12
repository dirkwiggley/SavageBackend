import express from "express"
import DBDocuments from "../db/DBDocuments.js"
import { verifyUser } from "../middleware/auth.js";

const router = express.Router()

router.get('/init', function(req: any, res: any, next: any) {
  const dbDocuments = new DBDocuments()
  dbDocuments.init(res, next)
});


router.get('/campaign/:campaignId', verifyUser, function(req: any, res: any, next: any) {
  const dbDocuments = new DBDocuments()
  const campaignId = req.params.campaignId
  dbDocuments.getDocsByCampaign(campaignId, res, next)
});

router.get('/id/:documentId', verifyUser, function(req: any, res: any, next: any) {
    const dbDocuments = new DBDocuments()
    const documentId = req.params.documentId
    dbDocuments.getDocById(documentId, res, next)
});

router.post('/', verifyUser, function(req: any, res: any, next: any) {
  const dbDocuments = new DBDocuments()
  const documentInfo = req.body.documentInfo
  dbDocuments.createDocument(documentInfo, res, next)
});

router.put('/', verifyUser, function(req: any, res: any, next: any) {
  const dbDocuments = new DBDocuments()
  const documentInfo = req.body.documentInfo
  dbDocuments.updateDocument(documentInfo, res, next)
});

router.get('/init', function (req, res, next) {
  const dbDocuments = new DBDocuments()
  dbDocuments.init(res, next)
});

router.get('/drop', function (req, res, next) {
  const dbDocuments = new DBDocuments()
  dbDocuments.drop(res, next)
});

export default router