import express from "express"
import DBAttributes from "../db/DBAttributes.js";

const router = express.Router()

/* GET test listing. */
router.get('/', function(req: any, res: any, next: any) {
  const dBAttributes = new DBAttributes();
  dBAttributes.getDBAttributes(res, next);
});

router.get('/init', function (req, res, next) {
  const dBAttributes = new DBAttributes();
  dBAttributes.init(res, next);
});

router.get('/drop', function (req, res, next) {
  const dBAttributes = new DBAttributes();
  dBAttributes.drop(res, next);
});

export default router;
