import express from "express"
import DBEdges from "../db/DBEdges.js";

const router = express.Router()

/* GET test listing. */
router.get('/', function(req: any, res: any, next: any) {
  const dbEdges = new DBEdges();
  dbEdges.getDBEdges(res, next);
});

router.get('/init', function (req, res, next) {
  const dbEdges = new DBEdges();
  dbEdges.init(res, next);
});

router.get('/drop', function (req, res, next) {
  const dbEdges = new DBEdges();
  dbEdges.drop(res, next);
});

export default router;
