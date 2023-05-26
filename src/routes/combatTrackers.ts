import express from "express";

import DBCombatTracker from "../db/DBCombatTrackers.js";
import CombatTracker from "../CombatTracker.js";
import SocketController from "../SocketController.js";
import { verifyAdmin, verifyUser } from "../middleware/auth.js";

const router = express.Router();
const combatTrackers = new CombatTracker();

router.get('/init', function(req, res, next) {  
// router.get('/init', verifyAdmin, function(req, res, next) {
  combatTrackers.init(res);
});

router.post('/sendmessage', function(req, res, next) {
  const fromUserId = req.body.fromUserId;
  const toUserId = req.body.toUserId;
  const msg = req.body.message;
  combatTrackers.sendMessage(fromUserId, toUserId, msg, res);
});
  
export default router;
