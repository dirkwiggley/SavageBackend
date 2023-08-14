import express from "express"
import DBPlayers from "../db/DBPlayers.js"
import { verifyUser } from "../middleware/auth.js";

const router = express.Router()

router.get('/campaign/:campaignId', verifyUser, function(req: any, res: any, next: any) {
  const dBPlayers = new DBPlayers();
  const campaignId = req.params.campaignId;
  dBPlayers.getPlayers(campaignId, res, next);
});

router.get('/player/:playerId', verifyUser, function(req: any, res: any, next: any) {
    const dBPlayers = new DBPlayers();
    const playerid = req.params.playerId;
    dBPlayers.getPlayerById(playerid, res, next);
});

router.get('/init', function (req, res, next) {
  const dBPlayers = new DBPlayers();
  dBPlayers.init(res, next);
});

router.get('/drop', function (req, res, next) {
  const dBPlayers = new DBPlayers();
  dBPlayers.drop(res, next);
});

export default router;