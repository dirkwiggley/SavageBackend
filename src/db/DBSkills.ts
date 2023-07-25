import { createError } from "../utils/error.js";
import DBUtils from "./DBUtils.js";
import Express from "express";

class DBSKILLS {
  private dbUtils: DBUtils | null = null;

  constructor() {
    this.dbUtils = new DBUtils();
  }

  getDBSkills = (res: Express.Response, next: any) => {
    try {
      let db = this.dbUtils.getDb();

      const select = db.prepare("SELECT * FROM skills");
      const results = select.all();
      res.status(200).send(results);
    } catch (err) {
      console.error(err);
      return next(err);
    }
  };

  init = (res: Express.Response, next: any) => {
    try {
      let db = this.dbUtils.getDb();
      const create = db.prepare(
        "CREATE TABLE IF NOT EXISTS skills (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, attr TEXT, desc TEXT, type TEXT, source TEXT)"
      );
      create.run();

      const skills = [
        { name: "Academics", attr: "SMA", desc: "Knowledge of liberal arts, social sciences, literature, history, etc.", type: "GENERAL", source: "SWADE" },
        { name: "Athletics", attr: "AGI", desc: "Overall athletic coordination and ability. Climbing, jumping, balancing, wrestling, skiing, swimming, throwing, or catching.", type: "COMBAT_GENERAL", source: "SWADE" },
        { name: "Battle", attr: "SMA", desc: "Strategy, tactics, and understanding military operations. A key skill in Mass Battles.", type: "COMBAT", source: "SWADE" },
        { name: "Boating", attr: "AGI", desc: "Ability to sail or pilot a boat, ship, or other watercraft.", type: "COMBAT_GENERAL", source: "SWADE" },
        { name: "Common Knowledge", attr: "SMA", desc: "General knowledge of a character's world.", type: "GENERAL", source: "SWADE" },
        { name: "Driving", attr: "AGI", desc: "The ability to control, steer, and operate ground vehicles.", type: "COMBAT_GENERAL", source: "SWADE" },
        { name: "Electronics", attr: "SMA", desc: "The use of electronic devices and systems.", type: "GENERAL", source: "SWADE" },
        { name: "Faith", attr: "SPI", desc: "The arcane skill for Arcane Background (Miracles).", type: "ARCANE", source: "SWADE" },
        { name: "Fighting", attr: "AGI", desc: "Skill in armed and unarmed combat.", type: "COMBAT", source: "SWADE" },
        { name: "Focus", attr: "SPI", desc: "The arcane skill for Arcane Background (Gifted).", type: "ARCANE", source: "SWADE" },
        { name: "Gambling", attr: "SMA", desc: "Skill and familiarity with games of chance.", type: "GENERAL", source: "SWADE" },
        { name: "Hacking", attr: "SMA", desc: "Coding, programming, and breaking into computer systems.", type: "GENERAL", source: "SWADE" },
        { name: "Healing", attr: "SMA", desc: "The ability to treat and heal Wounds and diseases, and decipher forensic evidence.", type: "GENERAL", source: "SWADE" },
        { name: "Intimidation", attr: "SPI", desc: "A character's ability to threaten others into doing what she wants.", type: "", source: "SWADE" },
        { name: "Language", attr: "SMA", desc: "Knowledge and fluency in a particular language.", type: "GENERAL", source: "SWADE" },
        { name: "Notice", attr: "SMA", desc: "General awareness and perception.", type: "GENERAL", source: "SWADE" },
        { name: "Occult", attr: "SMA", desc: "Knowledge of supernatural events, creatures, history, and ways.", type: "GENERAL", source: "SWADE" },
        { name: "Performance", attr: "SPI", desc: "Singing, dancing, acting, or other forms of public expression.", type: "GENERAL", source: "SWADE" },
        { name: "Persuasion", attr: "SPI", desc: "The ability to convince others to do what you want.", type: "GENERAL", source: "SWADE" },
        { name: "Piloting", attr: "AGI", desc: "Skill with maneuvering vehicles that operate in three dimensions, such as airplanes,helicopters, spaceships, etc.", type: "COMBAT_GENERAL", source: "SWADE" },
        { name: "Psionics", attr: "SMA", desc: "The arcane skill for Arcane Background (Psionics).", type: "ARCANE", source: "SWADE" },
        { name: "Repair", attr: "SMA", desc: "The ability to fix mechanical and electrical gadgets.", type: "GENERAL", source: "SWADE" },
        { name: "Research", attr: "SMA", desc: "Finding written information from various sources.", type: "GENERAL", source: "SWADE" },
        { name: "Riding", attr: "AGI", desc: "A character's skill in mounting, controlling, and riding a tamed beast.", type: "COMBAT_GENERAL", source: "SWADE" },
        { name: "Science", attr: "SMA", desc: "Knowledge of scientific fields such as biology, chemistry, geology, engineering, etc.", type: "GENERAL", source: "SWADE" },
        { name: "Shooting", attr: "AGI", desc: "Precision with any type of ranged weapon.", type: "COMBAT", source: "SWADE" },
        { name: "Spellcasting", attr: "SMA", desc: "The arcane skill for Arcane Background (Magic).", type: "ARCANE", source: "SWADE" },
        { name: "Stealth", attr: "AGI", desc: "The ability to sneak and hide.", type: "GENERAL", source: "SWADE" },
        { name: "Survival", attr: "SMA", desc: "How to find food, water, or shelter, and tracking.", type: "GENERAL", source: "SWADE" },
        { name: "Taunt", attr: "SMA", desc: "Insulting or belittling another. Almost always done as a Test (page 108).", type: "COMBAT_GENERAL", source: "SWADE" },
        { name: "Thievery", attr: "AGI", desc: "Sleight of hand, pickpocketing, lockpicking, and other typically shady feats.", type: "GENERAL", source: "SWADE" },
        { name: "Weird Science", attr: "SMA", desc: "The arcane skill for Arcane Background (Weird Science).", type: "ARCANE", source: "SWADE" },
      ];

      const insert = db.prepare(
        "INSERT INTO skills(name, attr, desc, type, source) VALUES (?, ?, ?, ?, ?)"
      );
      skills.forEach((ability) => {
        insert.run(ability.name, ability.attr, ability.desc, ability.type, ability.source);
      });
      res.status(200).send("Initialized skills");
    } catch (err) {
      console.error(err);
      return next(err);
    }
  };

  updateSkill = (id: number, name: string, abbr: string, desc: string, type: string, source: string, res: Express.Response, next: any) => {
    let db = this.dbUtils.getDb();

    try {
      const updateStmt = db.prepare(`UPDATE skills SET name = ?, abbr = ?, desc = ?, type = ?, source = ? WHERE id = ?`);
      updateStmt.run(
        name,
        abbr,
        desc,
        type,
        source,
        id
      );
    } catch(err) {
      console.error(err);
      return next(createError(500, "Illegal skill params"));
    }
    res.status(200).send({ response: "Skill updated"})
  };

  insertSkill = (name: string, abbr: string, desc: string, type: string, source: string, res: Express.Response, next: any) => {
    try {
      let db = this.dbUtils.getDb();
      const insert = db.prepare(
        "INSERT INTO skills VALUES (@id, @name, @abbr, @desc, @source)"
      );

      insert.run({
        id: null,
        name: name,
        abbr: abbr,
        desc: desc,
        source: source
      });
    } catch (err) {
      console.error(err);
      return next(createError(500, "Illegal skill params"));
    }
    res.status(204).send();
  };

  drop = (res: Express.Response, next: any) => {
    try {
      let db = this.dbUtils.getDb();
      const drop = db.prepare("DROP TABLE skills");
      drop.run();
      console.log("Dropped table");
      res.status(200).send("Dropped skills table");
    } catch (err) {
      console.error(err);
      return next(err);
    }
  };
}

export default DBSKILLS;
