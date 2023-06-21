import express from "express"
import DBRAbilities from "../db/DBRAbilities.js"

const router = express.Router()

/* GET test listing. */
router.get('/', function(req: any, res: any, next: any) {
  const dBRAbilities = new DBRAbilities();
  dBRAbilities.getDBRAbilites(res, next);
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
