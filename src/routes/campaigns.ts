import express from "express"
import DBCampaigns from "../db/DBCampaigns.js"
import { verifyUser } from "../middleware/auth.js";

const router = express.Router()

router.get('/', verifyUser, function(req: any, res: any, next: any) {
  const dBCampaigns = new DBCampaigns();
  dBCampaigns.getCampaigns(res, next);
});

router.get('/name/:campaignName', verifyUser, function(req: any, res: any, next: any) {
    const dBCampaigns = new DBCampaigns();
    const campaignName = req.params.campaignName;
    dBCampaigns.getCampaignByName(campaignName, res, next);
});

router.get('/id/:campaignId', verifyUser, function(req: any, res: any, next: any) {
  const dBCampaigns = new DBCampaigns();
  const campaignId = req.params.campaignId;
  dBCampaigns.getCampaignById(campaignId, res, next);
});

router.get('/init', function (req, res, next) {
  const dBCampaigns = new DBCampaigns();
  dBCampaigns.init(res, next);
});

router.get('/drop', function (req, res, next) {
  const dBCampaigns = new DBCampaigns();
  dBCampaigns.drop(res, next);
});

export default router;