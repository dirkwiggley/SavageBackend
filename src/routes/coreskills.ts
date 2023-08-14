import express from "express"
import DBCoreSkills from "../db/DBCoreSkills.js"

const router = express.Router()

router.get('/campaign/:campaignId', function(req: any, res: any, next: any) {
  const dBCoreSkills = new DBCoreSkills();
  const campaignId = req.params.campaignId;
  dBCoreSkills.getCoreSkills(campaignId, res, next);
});

router.get('/init', function (req, res, next) {
  const dBCoreSkills = new DBCoreSkills();
  dBCoreSkills.init(res, next);
});

router.get('/drop', function (req, res, next) {
  const dBCoreSkills = new DBCoreSkills();
  dBCoreSkills.drop(res, next);
});

export default router;