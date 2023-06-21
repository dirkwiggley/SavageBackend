import express from "express"
import DBSkills from "../db/DBSkills.js";

const router = express.Router()

/* GET test listing. */
router.get('/', function(req: any, res: any, next: any) {
  const dBSkills = new DBSkills();
  dBSkills.getDBSkills(res, next);
});

router.get('/init', function (req, res, next) {
  const dBSkills = new DBSkills();
  dBSkills.init(res, next);
});

router.get('/drop', function (req, res, next) {
  const dBSkills = new DBSkills();
  dBSkills.drop(res, next);
});

export default router;
