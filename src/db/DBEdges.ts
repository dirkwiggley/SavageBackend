import { createError } from "../utils/error.js";
import DBUtils from "./DBUtils.js";
import Express from "express";
import { RANKS, ATTRIBUTES, DICE } from "../attributeValidation.js";

class DBEdges {
  private dbUtils: DBUtils | null = null;

  constructor() {
    this.dbUtils = new DBUtils();
  }

  getDBEdges = (res: Express.Response, next: any) => {
    try {
      let db = this.dbUtils.getDb();

      const select = db.prepare("SELECT * FROM edges");
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
        "CREATE TABLE IF NOT EXISTS edges (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, type TEXT, subtype TEXT, desc TEXT, validation TEXT, source TEXT)"
      );
      create.run();

      const EDGE_ARCANE_RESISTANCE = {edge: {name:"Arcane Resistance",source:"SWADE"}}
      const EDGE_ATTRACTIVE = {edge:{name:"Attractive",source:"SWADE"}}
      const EDGE_BLOCK = {edge:{name:"Block",source:"SWADE"}}
      const EDGE_BRAWLER = {edge:{name:"Brawler",source:"SWADE"}}
      const EDGE_COUNTERATTACK = {edge:{name:"Counterattack",source:"SWADE"}}
      const EDGE_DODGE = {edge:{name:"Dodge",source:"SWADE"}}
      const EDGE_EXTRACTION = {edge:{name:"Extraction",source:"SWADE"}}
      const EDGE_FAME = {edge:{name:"Fame",source:"SWADE"}}
      const EDGE_FAMOUS = {edge:{name:"Famous",source:"SWADE"}}
      const EDGE_FILTHY_RICH = {edge:{name:"Filthy Rich",source:"SWADE"}}
      const EDGE_FIRST_STRIKE = {edge:{name:"First Strike",source:"SWADE"}}
      const EDGE_FRENZY = {edge:{name:"Frenzy",source:"SWADE"}}
      const EDGE_GREAT_LUCK = {edge:{name:"Great Luck",source:"SWADE"}}
      const EDGE_HARD_TO_KILL = {edge:{name:"Hard to Kill"}}
      const EDGE_IMPROVED_ARCANE_RESISTANCE = {edge: {name:"Improved Arcane Resistance",source:"SWADE"}}
      const EDGE_IMPROVED_BLOCK = {edge:{name:"Improved Block",source:"SWADE"}}
      const EDGE_IMPROVED_COUNTERATTACK = {edge:{name:"Improved Counterattack",source:"SWADE"}}
      const EDGE_IMPROVED_EXTRACTION = {edge:{name:"Improved Extraction",source:"SWADE"}}
      const EDGE_IMPROVED_FIRST_STRIKE = {edge:{name:"Improved First Strike",source:"SWADE"}}
      const EDGE_IMPROVED_FRENZY = {edge:{name:"Improved Frenzy",source:"SWADE"}}
      const EDGE_IMPROVED_LEVEL_HEADED = {edge:{name:"Improved Level Headed",source:"SWADE"}}
      const EDGE_IMPROVED_NERVES_OF_STEEL = {edge:{name:"Improved Nerves of Steel",source:"SWADE"}}
      const EDGE_IMPROVED_RAPID_FIRE = {edge:{name:"Improved Rapid Fire",source:"SWADE"}}
      const EDGE_IMPROVED_SWEEP = {edge:{name:"Improved Sweep",source:"SWADE"}}
      const EDGE_IMPROVED_TRADEMARK_WEAPON_ATHLETICS = {edge:{name:"Improved Trademark Weapon - Athletics",source:"SWADE"}}
      const EDGE_IMPROVED_TRADEMARK_WEAPON_FIGHTING = {edge:{name:"Improved Trademark Weapon - Fighting",source:"SWADE"}}
      const EDGE_IMPROVED_TRADEMARK_WEAPON_SHOOTING = {edge:{name:"Improved Trademark Weapon - Shooting",source:"SWADE"}}
      const EDGE_LEVEL_HEADED = {edge:{name:"Level Headed",source:"SWADE"}}
      const EDGE_LUCK = {edge:{name:"Luck",source:"SWADE"}}
      const EDGE_MARTIAL_ARTIST = {edge:{name:"Martial Artist",source:"SWADE"}}
      const EDGE_NERVES_OF_STEEL = {edge:{name:"Nerves of Steel",source:"SWADE"}}
      const EDGE_RAPID_FIRE = {edge:{name:"Rapid Fire",source:"SWADE"}}
      const EDGE_RICH = {edge:{name:"Rich",source:"SWADE"}}
      const EDGE_SWEEP = {edge:{name:"Sweep",source:"SWADE"}}
      const EDGE_TRADEMARK_WEAPON_ATHLETICS = {edge:{name:"Trademark Weapon - Athletics",source:"SWADE"}}
      const EDGE_TRADEMARK_WEAPON_FIGHTING = {edge:{name:"Trademark Weapon - Fighting",source:"SWADE"}}
      const EDGE_TRADEMARK_WEAPON_SHOOTING = {edge:{name:"Trademark Weapon - Shooting",source:"SWADE"}}
      const EDGE_VERY_ATTRACTIVE = {edge: {name:"Very Attractive",source:"SWADE"}}
      const RANK_NOVICE = {rank:RANKS.NOVICE,source:"SWADE"}
      const RANK_SEASONED = {rank:RANKS.SEASONED,source:"SWADE"}
      const RANK_VETERAN = {rank:RANKS.VETERAN,source:"SWADE"}
      const RANK_HEROIC = {rank:RANKS.HEROIC,source:"SWADE"}
      const SKILL_ATHLETICS_D8 = {skill:{name:"Athletics",dice:DICE.D8,source:"SWADE"}}
      const SKILL_FIGHTING_D6 = {skill:{name:"Fighting",dice:DICE.D6,source:"SWADE"}}
      const SKILL_FIGHTING_D8 = {skill:{name:"Fighting",dice:DICE.D8,source:"SWADE"}}
      const SKILL_SHOOTING_D6 = {skill:{name:"Shooting",dice:DICE.D6,source:"SWADE"}}
      const SKILL_SHOOTING_D8 = {skill:{name:"Shooting",dice:DICE.D8,source:"SWADE"}}
      const AGI_D6 = {attribute:{name:ATTRIBUTES.AGI,dice:DICE.D6,source:"SWADE"}}
      const AGI_D8 = {attribute:{name:ATTRIBUTES.AGI,dice:DICE.D8,source:"SWADE"}}
      const SMA_D6 = {attribute:{name:ATTRIBUTES.SMA,dice:DICE.D6,source:"SWADE"}}
      const SMA_D8 = {attribute:{name:ATTRIBUTES.SMA,dice:DICE.D8,source:"SWADE"}}
      const SPI_D6 = {attribute:{name:ATTRIBUTES.SPI,dice:DICE.D6,source:"SWADE"}}
      const SPI_D8 = {attribute:{name:ATTRIBUTES.SPI,dice:DICE.D8,source:"SWADE"}}
      const STR_D6 = {attribute:{name:ATTRIBUTES.STR,dice:DICE.D6,source:"SWADE"}}
      const STR_D8 = {attribute:{name:ATTRIBUTES.STR,dice:DICE.D8,source:"SWADE"}}
      const VIG_D6 = {attribute:{name:ATTRIBUTES.VIG,dice:DICE.D6,source:"SWADE"}}
      const VIG_D8 = {attribute:{name:ATTRIBUTES.VIG,dice:DICE.D8,source:"SWADE"}}
      const WILDCARD_TRUE = {wildcard:true}
      const edges = [
        { name: "Alertness", type: "Background", subtype: {}, desc: "+2 to Notice rolls.", validation: RANK_NOVICE, source: "SWADE" },
        { name: "Ambidexterous", type: "Background", subtype: {}, desc: "+2 to Common Knowledge and networking with upper class.", validation: RANK_NOVICE, source: "SWADE" },
        { name: "Arcane Background", type: "Background", subtype: {formula:{name:"string",skill:"string",starting_powers:"number",power_points:"number",source:"string"}}, desc: "Allows access to the Arcane Backgrounds listed in Chapter Five.", validation: RANK_NOVICE, source: "SWADE" },
        { name: "Arcane Resistance", type: "Background", subtype: {hide:EDGE_IMPROVED_ARCANE_RESISTANCE}, desc: "Arcane skills targeting the hero suffer a −2 penalty (even if cast by allies!); magical damage is reduced by 2.", validation: SPI_D8, source: "SWADE" },
        { name: "Aristocrat", type: "Background", subtype: {}, desc: "+2 to Common Knowledge and networking with upper class.", validation: RANK_NOVICE, source: "SWADE" },
        { name: "Attractive", type: "Background", subtype: {hide:EDGE_VERY_ATTRACTIVE}, desc: "+1 to Performance and Persuasion rolls.", validation: {and:[RANK_NOVICE,VIG_D6]}, source: "SWADE" },
        { name: "Berserk", type: "Background", subtype: {}, desc: "After being Shaken or Wounded, melee attacks must be Wild Attacks, +1 die type to Strength, +2 to Toughness, ignore one level of Wound penalties, Critical Failure on Fighting roll hits random target. Take Fatigue after every five consecutive rounds, may choose to end rage with Smarts roll –2.", validation: RANK_NOVICE, source: "SWADE" },
        { name: "Brave", type: "Background", subtype: {}, desc: "+2 to Fear checks and –2 to rolls on the Fear Table.", validation: {and:[RANK_NOVICE,SPI_D6]}, source: "SWADE" },
        { name: "Brawny", type: "Background", subtype: {}, desc: "Size (and therefore Toughness) +1. Treat Strength as one die type higher for Encumbrance and Minimum Strength to use weapons, armor, or equipment.", validation: {and:[RANK_NOVICE,STR_D6,VIG_D6]}, source: "SWADE" },
        { name: "Brute", type: "Background", subtype: {}, desc: "Link Athletics to Strength instead of Agility (including resistance). Short Range of any thrown item increased by +1. Double that for the adjusted Medium Range, and double again for Long Range.", validation: {and:[RANK_NOVICE,STR_D6,VIG_D6]}, source: "SWADE" },
        { name: "Charismatic", type: "Background", subtype: {}, desc: "Free reroll when using Persuasion.", validation: {and:[RANK_NOVICE, SPI_D8]}, source: "SWADE" },
        { name: "Elan", type: "Background", subtype: {}, desc: "+2 when spending a Benny to reroll a Trait roll.", validation: {and:[RANK_NOVICE, SPI_D8]}, source: "SWADE" },
        { name: "Fame", type: "Background", subtype: {hide:EDGE_FAMOUS}, desc: "+1 Persuasion rolls when recognized (Common Knowledge), double usual fee for Performance.", validation: RANK_NOVICE, source: "SWADE" },
        { name: "Famous", type: "Background", subtype: {}, desc: "+2 Persuasion when recognized, 5× or more usual fee for Performance.", validation: {and:[RANK_SEASONED,EDGE_FAME]}, source: "SWADE" },
        { name: "Fast Healer", type: "Background", subtype: {}, desc: "+2 Vigor when rolling for natural healing; check every 3 days.", validation: {and:[RANK_NOVICE,VIG_D8]}, source: "SWADE" },
        { name: "Filthy Rich", type: "Background", subtype: {}, desc: "", validation: {and:[RANK_NOVICE,EDGE_RICH]}, source: "SWADE" },
        { name: "Fleet Footed", type: "Background", subtype: {}, desc: "Pace +2, increase running die one step.", validation: {and:[RANK_NOVICE,AGI_D6]}, source: "SWADE" },
        { name: "Great Luck", type: "Background", subtype: {}, desc: "+2 Bennies at the start of each session.", validation: {and:[RANK_NOVICE,EDGE_LUCK]}, source: "SWADE" },
        { name: "Improved Arcane Resistance", type: "Background", subtype: {}, desc: "As Arcane Resistance except penalty is increased to −4 and magical damage is reduced by 4.", validation: {and:[RANK_NOVICE,EDGE_ARCANE_RESISTANCE]}, source: "SWADE" },
        { name: "Linguist", type: "Background", subtype: {}, desc: "Character has d6 in languages equal to half her Smarts die.", validation: {and:[RANK_NOVICE,SMA_D6]}, source: "SWADE" },
        { name: "Luck", type: "Background", subtype: {hide:EDGE_GREAT_LUCK}, desc: "+1 Benny at the start of each session.", validation: RANK_NOVICE, source: "SWADE" },
        { name: "Quick", type: "Background", subtype: {}, desc: "The hero may discard and redraw Action Cards of 5 or lower.", validation: {and:[RANK_NOVICE,AGI_D8]}, source: "SWADE" },
        { name: "Rich", type: "Background", subtype: {hide:EDGE_FILTHY_RICH}, desc: "Character starts with three times the starting funds and a $150K annual salary.", validation: RANK_NOVICE, source: "SWADE" },
        { name: "Very Attractive", type: "Background", subtype: {}, desc: "+2 to Performance and Persuasion rolls.", validation: {and:[RANK_NOVICE,EDGE_ATTRACTIVE]}, source: "SWADE" },
        { name: "Block", type: "Combat", subtype: {hide:EDGE_IMPROVED_BLOCK}, desc: "+1 Parry, ignore 1 point of Gang Up bonus.", validation: {and:[RANK_SEASONED,SKILL_FIGHTING_D8]}, source: "SWADE" },
        { name: "Brawler", type: "Combat", subtype: {}, desc: "Toughness +1, add d4 to damage from fists; or increase it a die type if combined with Martial Artist, Claws, or similar abilities.", validation: {and:[RANK_NOVICE,STR_D8,VIG_D8]}, source: "SWADE" },
        { name: "Bruiser", type: "Combat", subtype: {}, desc: "Increase unarmed Strength damage a die type and Toughness another +1.", validation: {and:[RANK_SEASONED,EDGE_BRAWLER]}, source: "SWADE" },
        { name: "Calculating", type: "Combat", subtype: {}, desc: "Ignore up to 2 points of penalties on one action with an Action Card of Five or less.", validation: {and:[RANK_NOVICE,SMA_D8]}, source: "SWADE" },
        { name: "Combat Reflexes", type: "Combat", subtype: {}, desc: "+2 Spirit to recover from being Shaken or Stunned.", validation: RANK_SEASONED, source: "SWADE" },
        { name: "Counterattack", type: "Combat", subtype: {hide:EDGE_IMPROVED_COUNTERATTACK}, desc: "Free attack against one foe per turn who failed a Fighting roll.", validation: {and:[RANK_SEASONED,SKILL_FIGHTING_D8]}, source: "SWADE" },
        { name: "Dead Shot", type: "Combat", subtype: {}, desc: "", validation: {and:[RANK_NOVICE,WILDCARD_TRUE]}, source: "SWADE" },
        { name: "Dodge", type: "Combat", subtype: {}, desc: "−2 to be hit by ranged attacks.", validation: {and:[RANK_SEASONED,AGI_D8]}, source: "SWADE" },
        { name: "Double Tap", type: "Combat", subtype: {}, desc: "+1 to hit and damage when firing no more than RoF 1 per action.", validation: {and:[RANK_SEASONED,SKILL_SHOOTING_D6]}, source: "SWADE" },
        { name: "Extraction", type: "Combat", subtype: {hide:EDGE_IMPROVED_EXTRACTION}, desc: "One adjacent foe doesn’t get a free attack when you withdraw from close combat.", validation: {and:[RANK_NOVICE,AGI_D8]}, source: "SWADE" },
        { name: "Feint", type: "Combat", subtype: {}, desc: "You may choose to make foe resist with Smarts instead of Agility during a Fighting Test.", validation: {and:[RANK_NOVICE,SKILL_FIGHTING_D8]}, source: "SWADE" },
        { name: "First Strike", type: "Combat", subtype: {hide:EDGE_IMPROVED_FIRST_STRIKE}, desc: "Free Fighting attack once per round when foe moves within Reach.", validation: {and:[RANK_NOVICE,AGI_D8]}, source: "SWADE" },
        { name: "Free Runner", type: "Combat", subtype: {}, desc: "Ignore Difficult Ground and add +2 to Athletics in foot chases and Athletics (climbing).", validation: {and:[RANK_NOVICE,AGI_D8]}, source: "SWADE" },
        { name: "Frenzy", type: "Combat", subtype: {hide:EDGE_IMPROVED_FRENZY}, desc: "Roll a second Fighting die with one melee attack per turn.", validation: {and:[RANK_SEASONED,SKILL_FIGHTING_D8]}, source: "SWADE" },
        { name: "Giant Killer", type: "Combat", subtype: {}, desc: "+1d6 damage vs. creatures three Sizes larger or more.", validation: RANK_VETERAN, source: "SWADE" },
        { name: "Hard to Kill", type: "Combat", subtype: {}, desc: "Ignore Wound penalties when making Vigor rolls to avoid Bleeding Out.", validation: {and:[RANK_NOVICE,SPI_D8]}, source: "SWADE" },
        { name: "Harder to Kill", type: "Combat", subtype: {}, desc: "Roll a die if the character perishes. Even if he’s Incapacitated, he survives somehow.", validation: {and:[RANK_VETERAN,EDGE_HARD_TO_KILL]}, source: "SWADE" },
        { name: "Improved Block", type: "Combat", subtype: {}, desc: "+2 Parry, ignore 2 points of Gang Up bonus.", validation: {and:[RANK_VETERAN,EDGE_BLOCK]}, source: "SWADE" },
        { name: "Improved Counterattack", type: "Combat", subtype: {}, desc: "As Counterattack, but against three failed attacks per turn.", validation: {and:[RANK_VETERAN,EDGE_COUNTERATTACK]}, source: "SWADE" },
        { name: "Improved Dodge", type: "Combat", subtype: {}, desc: "+2 to Evasion totals.", validation: {and:[RANK_SEASONED,EDGE_DODGE]}, source: "SWADE" },
        { name: "Improved Extraction", type: "Combat", subtype: {}, desc: "Three adjacent foes don’t get free attacks when you withdraw from combat.", validation: {and:[RANK_SEASONED,EDGE_EXTRACTION]}, source: "SWADE" },
        { name: "Improved First Strike", type: "Combat", subtype: {}, desc: "Free Fighting attack against up to three foes when they move within Reach.", validation: {and:[RANK_HEROIC,EDGE_FIRST_STRIKE]}, source: "SWADE" },
        { name: "Improved Frenzy", type: "Combat", subtype: {}, desc: "Roll a second Fighting die with up to two melee attacks per turn.", validation: {and:[RANK_VETERAN,EDGE_FRENZY]}, source: "SWADE" },
        { name: "Improved Level Headed", type: "Combat", subtype: {}, desc: "Draw two additional Action Cards each round in combat and choose which one to use.", validation: {and:[RANK_SEASONED,EDGE_LEVEL_HEADED]}, source: "SWADE" },
        { name: "Improved Nerves of Steel", type: "Combat", subtype: {}, desc: "Ignore up to two levels of Wound penalties.", validation: {and:[RANK_NOVICE,EDGE_NERVES_OF_STEEL]}, source: "SWADE" },
        { name: "Improved Rapid Fire", type: "Combat", subtype: {}, desc: "Increase RoF by 1 for up to two Shooting attacks per turn.", validation: {and:[RANK_VETERAN,EDGE_RAPID_FIRE]}, source: "SWADE" },
        { name: "Improved Sweep", type: "Combat", subtype: {}, desc: "weep As above, but ignore the –2 penalty.", validation: {and:[RANK_VETERAN,EDGE_SWEEP]}, source: "SWADE" },
        { name: "Improved Trademark Weapon - Athletics", type: "Combat", subtype: {}, desc: "+2 to Athletics (throwing), Fighting, or Shooting total with a related skill specific weapon; +1 Parry while weapon is readied.", validation: {and:[RANK_SEASONED,SKILL_ATHLETICS_D8,EDGE_TRADEMARK_WEAPON_ATHLETICS]}, source: "SWADE" },
        { name: "Improved Trademark Weapon - Fighting", type: "Combat", subtype: {}, desc: "+2 to Athletics (throwing), Fighting, or Shooting total with a related skill specific weapon; +1 Parry while weapon is readied.", validation: {and:[RANK_SEASONED,SKILL_FIGHTING_D8,EDGE_TRADEMARK_WEAPON_FIGHTING]}, source: "SWADE" },
        { name: "Improved Trademark Weapon - Shooting", type: "Combat", subtype: {}, desc: "+2 to Athletics (throwing), Fighting, or Shooting total with a related skill specific weapon; +1 Parry while weapon is readied.", validation: {and:[RANK_SEASONED,SKILL_SHOOTING_D8,EDGE_TRADEMARK_WEAPON_SHOOTING]}, source: "SWADE" },
        { name: "Improvisational Fighter", type: "Combat", subtype: {}, desc: "Ignore –2 penalty when attacking with improvised weapons.", validation: {and:[RANK_SEASONED,SMA_D6]}, source: "SWADE" },
        { name: "Iron Jaw", type: "Combat", subtype: {}, desc: "+2 to Soak and Vigor rolls to avoid Knockout Blows.", validation: {and:[RANK_NOVICE,VIG_D8]}, source: "SWADE" },
        { name: "Killer Instinct", type: "Combat", subtype: {}, desc: "The hero gets a free reroll in any opposed Test he initiates.", validation: RANK_SEASONED, source: "SWADE" },
        { name: "Level Headed", type: "Combat", subtype: {hide:EDGE_IMPROVED_LEVEL_HEADED}, desc: "Draw an additional Action Card each round in combat and choose which one to use.", validation: {and:[RANK_SEASONED,SMA_D8]}, source: "SWADE" },
        { name: "Marksman Seasoned", type: "Combat", subtype: {}, desc: "Ignore up to 2 points of penalties from Range, Cover, Called Shot, Scale, or Speed; or add +1 to first Athletics (throwing) or Shooting roll. Character may not move or fire greater than RoF 1.", validation: {and:[RANK_SEASONED, {or:[SKILL_ATHLETICS_D8,SKILL_SHOOTING_D8]}]}, source: "SWADE" },
        { name: "Martial Artist", type: "Combat", subtype: {}, desc: "Unarmed Fighting +1, fists and feet count as Natural Weapons, add d4 damage die to unarmed Fighting attacks (or increase die a step if you already have it).", validation: {and:[RANK_NOVICE,SKILL_FIGHTING_D6]}, source: "SWADE" },
        { name: "Martial Warrior", type: "Combat", subtype: {}, desc: "Unarmed Fighting +2, increase damage die type a step.", validation: {and:[RANK_SEASONED,EDGE_MARTIAL_ARTIST]}, source: "SWADE" },
        { name: "Mighty Blow", type: "Combat", subtype: {}, desc: "On first successful Fighting roll, double damage when dealt a Joker.", validation: {and:[RANK_NOVICE,WILDCARD_TRUE,SKILL_FIGHTING_D8]}, source: "SWADE" },
        { name: "Nerves of Steel", type: "Combat", subtype: {hide:EDGE_IMPROVED_NERVES_OF_STEEL}, desc: "Ignore one level of Wound penalties.", validation: {and:[RANK_NOVICE,VIG_D8]}, source: "SWADE" },
        { name: "No Mercy", type: "Combat", subtype: {}, desc: "+2 damage when spending a Benny to reroll damage.", validation: RANK_SEASONED, source: "SWADE" },
        { name: "Rapid Fire", type: "Combat", subtype: {hide:EDGE_IMPROVED_RAPID_FIRE}, desc: "Increase RoF by 1 for one Shooting attack per turn.", validation: {and:[RANK_SEASONED,SKILL_SHOOTING_D6]}, source: "SWADE" },
        { name: "Rock and Roll!", type: "Combat", subtype: {}, desc: "Ignore the Recoil penalty when firing weapons with a RoF of 2 or more. Character may not move.", validation: {and:[RANK_SEASONED,SKILL_SHOOTING_D8]}, source: "SWADE" },
        { name: "Steady Hands", type: "Combat", subtype: {}, desc: "Ignore Unstable Platform penalty; reduce running penalty to –1.", validation: {and:[RANK_NOVICE,AGI_D8]}, source: "SWADE" },
        { name: "Sweep", type: "Combat", subtype: {hide:EDGE_IMPROVED_SWEEP}, desc: "Fighting roll at –2 to hit all targets in weapon’s Reach, no more than once per turn.", validation: {and:[RANK_NOVICE,STR_D8,SKILL_FIGHTING_D8]}, source: "SWADE" },
        { name: "Trademark Weapon - Athletics", type: "Combat", subtype: {hide:EDGE_IMPROVED_TRADEMARK_WEAPON_ATHLETICS}, desc: "+1 to Athletics (throwing), Fighting, or Shooting total with a related skill specific weapon; +1 Parry while weapon is readied.", validation: {and:[RANK_NOVICE,SKILL_ATHLETICS_D8]}, source: "SWADE" },
        { name: "Trademark Weapon - Fighting", type: "Combat", subtype: {hide:EDGE_IMPROVED_TRADEMARK_WEAPON_FIGHTING}, desc: "+1 to Athletics (throwing), Fighting, or Shooting total with a related skill specific weapon; +1 Parry while weapon is readied.", validation: {and:[RANK_NOVICE,SKILL_FIGHTING_D8]}, source: "SWADE" },
        { name: "Trademark Weapon - Shooting", type: "Combat", subtype: {hide:EDGE_IMPROVED_TRADEMARK_WEAPON_SHOOTING}, desc: "+1 to Athletics (throwing), Fighting, or Shooting total with a related skill specific weapon; +1 Parry while weapon is readied.", validation: {and:[RANK_NOVICE,SKILL_SHOOTING_D8]}, source: "SWADE" },
        { name: "Two-Fisted", type: "Combat", subtype: {}, desc: "Make one extra Fighting roll with a second melee weapon in the off-hand at no Multi-Action penalty.", validation: {and:[RANK_NOVICE,AGI_D8]}, source: "SWADE" },
        { name: "Two-Gun Kid", type: "Combat", subtype: {}, desc: "Make one extra Shooting (or Athletics (throwing) roll with a second ranged weapon in the off-hand at no Multi-Action penalty.", validation: {and:[RANK_NOVICE,AGI_D8]}, source: "SWADE" },
      ];

      const insert = db.prepare(
        "INSERT INTO edges(name, type, subtype, desc, validation, source) VALUES (?, ?, ?, ?, ?, ?)"
      );
      edges.forEach((edge) => {
        insert.run(edge.name, edge.type, JSON.stringify(edge.subtype), edge.desc, JSON.stringify(edge.validation), edge.source);
      });
      res.status(200).send("Initialized edges");
    } catch (err) {
      console.error(err);
      return next(err);
    }
  };

  updateEdge = (id: number, name: string, type: string, subtype: string, desc: string, source: string, res: Express.Response, next: any) => {
    let db = this.dbUtils.getDb();

    try {
      const updateStmt = db.prepare(`UPDATE edges SET name = ?, type = ?, subtype = ?, desc = ?, source = ? WHERE id = ?`);
      updateStmt.run(
        name,
        type,
        subtype,
        desc,
        source,
        id
      );
    } catch(err) {
      console.error(err);
      return next(createError(500, "Illegal edge params"));
    }
    res.status(200).send({ response: "Edge updated"})
  };

  insertEdge = (name: string, type: string, subtype: string, desc: string, source: string, res: Express.Response, next: any) => {
    try {
      let db = this.dbUtils.getDb();
      const insert = db.prepare(
        "INSERT INTO edges VALUES (name, type, subtype, desc, source) VALUES (?, ?, ?, ?)"
      );

      insert.run(
        name,
        type,
        subtype,
        desc,
        source
      );
    } catch (err) {
      console.error(err);
      return next(createError(500, "Illegal edge params"));
    }
    res.status(204).send();
  };

  drop = (res: Express.Response, next: any) => {
    try {
      let db = this.dbUtils.getDb();
      const drop = db.prepare("DROP TABLE edges");
      drop.run();
      console.log("Dropped table");
      res.status(200).send("Dropped edges table");
    } catch (err) {
      console.error(err);
      return next(err);
    }
  };
}

export default DBEdges;
