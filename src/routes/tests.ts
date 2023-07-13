import express from "express"
import DBTest from "../db/DBTest.js"
import DBUsers from "../db/DBUsers.js";

import { checkCharacterMeetsCriteria, Dice, Attribute, Hindrance, RAbility, Edge, Skill, RaceInterface, DiceInterface, CharacterInterface } from "../requirementsTests.js";

const router = express.Router()

/* GET test listing. */
router.get('/', function(req: any, res: any, next: any) {
  // const dBTest = new DBTest()
  // dBTest.getTest(res, next)
  const d4minus2: Dice = { name: "d4", rank: 1}
  const d4: Dice = { name: "d4", rank: 2 };
  const d6: Dice = { name: "d6", rank: 3 };
  const d8: Dice = { name: "d8", rank: 4 };
  const attr1: Attribute = { name: "Agility" };
  const fighting: Skill = {
      name:"Fighting",
      dice: d8,
      source:""
  }
  const shooting: Skill = {
      name:"Shooting",
      dice: d8,
      source:""
  }
  const criteria = { rank:"Heroic"};
  let character = {
      rabilities: [],
      attributes: [],
      hindrances: [],
      edges: [],
      skills: [ 
          { name: "Fighting", attribute: attr1, dice: d8, type: "Combat" },
          { name: "Shooting", attribute: attr1, dice: d8, type: "Combat" },
      ],
      advances: 5
  }
  res.send(checkCharacterMeetsCriteria(criteria, character));
});

router.get('/init', function (req, res, next) {
  const dBTest = new DBTest();
  dBTest.init(res, next);
});

router.get('/drop', function (req, res, next) {
  const dBTest = new DBTest();
  dBTest.drop(res, next);
});

export default router;
