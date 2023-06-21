import express from "express"
import DBRAbilities from "../db/DBHindrances.js"

const router = express.Router()

/* GET test listing. */
router.get('/', function(req: any, res: any, next: any) {
  const dBHindrnces = new DBRAbilities();
  dBHindrnces.getDBHindrances(res, next);
});

router.get('/init', function (req, res, next) {
  const dBRAbilities = new DBRAbilities();
  dBRAbilities.init(res, next);
});

router.get('/drop', function (req, res, next) {
  const dBRAbilities = new DBRAbilities();
  dBRAbilities.drop(res, next);
});

export default router;
