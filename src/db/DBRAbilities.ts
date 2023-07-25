import DBUtils from "./DBUtils.js";
import Express from "express";

class DBRABILITIES {
  private dbUtils: DBUtils | null = null;

  constructor() {
    this.dbUtils = new DBUtils();
  }

  getDBRAbilites = (res: Express.Response, next: any) => {
    try {
      let db = this.dbUtils.getDb();

      const select = db.prepare("SELECT * FROM rabilities");
      const results = select.all();
      res.send(results);
    } catch (err) {
      console.error(err);
      return next(err);
    }
  };

  init = (res: Express.Response, next: any) => {
    try {
      let db = this.dbUtils.getDb();
      const create = db.prepare(
        "CREATE TABLE IF NOT EXISTS rabilities (id INTEGER PRIMARY KEY AUTOINCREMENT, type TEXT, name TEXT, cost TEXT, maxranks INTEGER, desc TEXT, source TEXT)"
      );
      create.run();

      const rabilities = [
        { type: "Positive", name: "Adaptable", cost: "[2]", maxranks: 1, desc: "The race has great variation among its people and cultures. Characters start with a free Novice Edge of their choice (and must meet all the Edge's Requirements).", source: "SWADE" },
        { type: "Positive", name: "Additional Action", cost: "[3]", maxranks: 1, desc: "The being has additional appendages, enhanced reflexes, or exceptional eye-hand coordination. He may ignore 2 points of Multi-Action penalties each turn.", source: "SWADE" },
        { type: "Positive", name: "Aquatic/Semi Aquatic", cost: "[1,2]", maxranks: 1, desc: "For one point the character is semi-aquatic and can hold his breath for 15 minutes before checking for drowning. For two, he's native to the water. He cannot drownin oxygenated liquid and moves his full Pace when swimming (see Movement, page 92).", source: "SWADE" },
        { type: "Positive", name: "Armor", cost: "[1]", maxranks: 3, desc: "Armor (3): The species has a thick hide or is encrusted in solid material like scaly plating or even rock. This grants Armor +2 each time it's taken.", source: "SWADE" },
        { type: "Positive", name: "Attribute Increase", cost: "[2]", maxranks: 99, desc: "Attribute Increase (U): During character creation, the species increases a particular attribute (Agility, Smarts, Spirit, Strength, or Vigor) one die type. This increases the Trait's maximum by one as well.", source: "SWADE" },
        { type: "Positive", name: "Bite", cost: "[1]", maxranks: 1, desc: "The race has fangs that cause Strength+d4 damage. See Natural Weapons, page 104 for more information.", source: "SWADE" },
        { type: "Positive", name: "Burrowing", cost: "[1]", maxranks: 1, desc: "The species can burrow into loose earth and move through it at half normal Pace (he cannot run). He cannot normally be attacked while burrowing, and can attempt to surprise opponents who didn't see him coming by making an opposed Stealth vs. Notice roll. If successful, the burrower adds +2 to his attack and damage rolls that round, or +4 with a raise (he has The Drop, page 100).", source: "SWADE" },
        { type: "Positive", name: "Claws", cost: "[2,3,4]", maxranks: 1, desc: "The race has claws that cause Str+d4 damage. One more point may be spent to increase their damage to Strength+d6, and/or another to add AP 2. See Natural Weapons, page 104 for more information.", source: "SWADE" },
        { type: "Positive", name: "Construct", cost: "[8]", maxranks: 1, desc: "Constructs are artificial beings made of inorganic material. They add +2 to recover from being Shaken, ignore one level of Wound modifiers, don't breathe, and are immune to disease and poison. Wounds must be mended via the Repair skill. Each attempt takes one hour per current Wound level and ignores the Golden Hour. Many Constructshave the Dependency Negative Racial Ability (reflecting their need for a power source).", source: "SWADE" },
        { type: "Positive", name: "Doesn't Breathe", cost: "[2]", maxranks: 1, desc: "The species does not breathe. Individuals aren't affected by inhaled toxins, can't drown, and don't suffocate in a vacuum. (They may still freeze, however.)", source: "SWADE" },
        { type: "Positive", name: "Novice Edge", cost: "[2]", maxranks: 99, desc: "All members of this race have the same innate Edge chosen from those available in the setting. Unlike Adaptable, this ability ignores Requirements except other Edges. Each Rank beyond Novice costs an additional point to a maximum of Heroic Rank (5).", source: "SWADE" },
        { type: "Positive", name: "Seasoned Edge", cost: "[3]", maxranks: 99, desc: "All members of this race have the same innate Edge chosen from those available in the setting. Unlike Adaptable, this ability ignores Requirements except other Edges. Each Rank beyond Novice costs an additional point to a maximum of Heroic Rank (5).", source: "SWADE" },
        { type: "Positive", name: "Veteran Edge", cost: "[4]", maxranks: 99, desc: "All members of this race have the same innate Edge chosen from those available in the setting. Unlike Adaptable, this ability ignores Requirements except other Edges. Each Rank beyond Novice costs an additional point to a maximum of Heroic Rank (5).", source: "SWADE" },
        { type: "Positive", name: "Heroic Edge", cost: "[5]", maxranks: 99, desc: "All members of this race have the same innate Edge chosen from those available in the setting. Unlike Adaptable, this ability ignores Requirements except other Edges. Each Rank beyond Novice costs an additional point to a maximum of Heroic Rank (5).", source: "SWADE" },
        { type: "Positive", name: "Legendary Edge", cost: "[6]", maxranks: 99, desc: "All members of this race have the same innate Edge chosen from those available in the setting. Unlike Adaptable, this ability ignores Requirements except other Edges. Each Rank beyond Novice costs an additional point to a maximum of Heroic Rank (5).", source: "SWADE" },
        { type: "Positive", name: "Environmental Resistance", cost: "[1]", maxranks: 99, desc: "The species receives a +4 bonus to resist a single negative environmental effect, such as heat, cold, lack of air, radiation, etc. Damage from that source is also reduced by 4.", source: "SWADE" },
        { type: "Positive", name: "Flight", cost: "[2,4,6]", maxranks: 1, desc: "The species can fly at Pace 6 (or 12 for 4 points) and 'run' for extra movement as usual. For 6 points, the being can fly at Pace 24 and may 'run' for 2d6 of additiona movement. Maneuvering uses the Athletics skill. Racial flight presumes some kind of wings which can be targeted or fouled (a Bound or Entangled character cannot fly).", source: "SWADE" },
        { type: "Positive", name: "Hardy", cost: "[2]", maxranks: 1, desc: "A second Shaken result in combat does not cause a Wound.", source: "SWADE" },
        { type: "Positive", name: "Horns", cost: "[1,2]", maxranks: 1, desc: "The being has a horn or horns that cause Str+d4 damage (or Str+d6 for 2 points). See Natural Weapons, page 104, for more information.", source: "SWADE" },
        { type: "Positive", name: "Immune to Poison", cost: "[1]", maxranks: 1, desc: "The species is immune to poison.", source: "SWADE" },
        { type: "Positive", name: "Immune to Disease", cost: "[1]", maxranks: 1, desc: "The species is immune to disease.", source: "SWADE" },
        { type: "Positive", name: "Infravision", cost: "[1]", maxranks: 1, desc: "The creature 'sees' heat, either through eyes or other sensory organs. This halves Illumination penalties when attacking warm targets (including invisible beings).", source: "SWADE" },
        { type: "Positive", name: "Leaper", cost: "[2]", maxranks: 1, desc: "The character can jump twice as far as listed under Movement, page 92. Inaddition, he adds +4 to damage when leaping as part of a Wild Attack instead of the usual+2 (unless in a closed or confined space where he cannot leap horizontally or vertically - GM's call).", source: "SWADE" },
        { type: "Positive", name: "Low Light Vision", cost: "[1]", maxranks: 1, desc: "The being ignores penalties for Dim or Dark illumination (but not Pitch Darkness).", source: "SWADE" },
        { type: "Positive", name: "No Vital Organs", cost: "[1]", maxranks: 1, desc: "These species have hidden, extremely tough, or redundant vital1 organs. Called Shots do no extra damage against them.", source: "SWADE" },
        { type: "Positive", name: "Pace", cost: "[2]", maxranks: 2, desc: "The character's Pace is increased by +2 and his running die is increased a die type.", source: "SWADE" },
        { type: "Positive", name: "Parry", cost: "[1]", maxranks: 3, desc: "The creature's natural Parry is increased by +1. This may be due to a prehensile tail, extra limbs, enhanced reflexes, or even latent psi-sense.", source: "SWADE" },
        { type: "Positive", name: "Poisonous Touch", cost: "[1/3]", maxranks: 1, desc: "With a successful Touch Attack (page 108), bite, or claw, the victimmust roll Vigor or suffer the effects of Mild Poison. For 3 points the poison can be upgraded to Knockout, Lethal, or Paralyzing instead, but each use causes the hero Fatigue. The character may always choose whether or not to use her poison touch. See page 128 for Poison and its effects.", source: "SWADE" },
        { type: "Positive", name: "Power", cost: "[2,1]", maxranks: 99, desc: "The race has an innate ability that functions like a power (see page 147). For 2 points, she has Arcane Background (Gifted) and a power that reflects her unusual ability. Each time this is taken after the first costs 1 point and grants another power. It does not increase her Power Points use the Power Points Edge for that.", source: "SWADE" },
        { type: "Positive", name: "Reach", cost: "[1]", maxranks: 3, desc: "Long limbs, tentacles, etc. grant the creature Reach +1 (add +1 each time it's taken after the first).", source: "SWADE" },
        { type: "Positive", name: "Regeneration", cost: "[2,3]", maxranks: 1, desc: "The being heals damage quickly. She may make a natural healing roll once per day (rather than every five days). For 3 points, permanent injuries may be recovered once all other Wounds are regenerated. Treat each injury as an additional Wound for purposes of recovery (the being may try once per week).", source: "SWADE" },
        { type: "Positive", name: "Size +1", cost: "[1]", maxranks: 3, desc: "The creature is larger than normal. Each point of Size adds directly to Toughness and increases maximum Strength one step. Large species may have difficulty using equipment designed for more traditional humanoids. See page 106 for more on Size.", source: "SWADE" },
        { type: "Positive", name: "Skill", cost: "[1/2]", maxranks: 1, desc: "The character starts with a d4 in a skill inherent to her race. For 2 points (or 1 if already a core skill), it starts at d6 and the skill's maximum increases to d12+1.", source: "SWADE" },
        { type: "Positive", name: "Skill Bonus", cost: "[2]", maxranks: 1, desc: "The character has a +2 bonus when using a particular skill (this may only be taken once per skill).", source: "SWADE" },
        { type: "Positive", name: "Sleep Reduction", cost: "[1]", maxranks: 2, desc: "The being needs half the normal amount of sleep as humans. If taken a second time, the being never sleeps.", source: "SWADE" },
        { type: "Positive", name: "Super Powers", cost: "[2]", maxranks: 1, desc: "The race has truly extraordinary abilities taken from the Savage Worlds Super Powers Companion. The cost is 2 for Arcane Background (Super Powers) plus the actual cost of the power selected (X). Make sure you have the GM's permission before taking this powerful ability.", source: "SWADE" },
        { type: "Positive", name: "Toughness", cost: "[1]", maxranks: 3, desc: "The character has hardened skin, scales, or extremely dense tissue that increases his base Toughness by +1.", source: "SWADE" },
        { type: "Positive", name: "Wall Walker", cost: "[1]", maxranks: 1, desc: "The species may walk on vertical surfaces normally, or inverted surfaces at half Pace.", source: "SWADE" },
        { type: "Negative", name: "Attribute Penalty", cost: "[-2,-3]", maxranks: 1, desc: "One attribute (but not its linked skills) suffers a -1 penalty. For 3 points, it suffers a -2 penalty.", source: "SWADE" },
        { type: "Negative", name: "Big", cost: "[-2]", maxranks: 1, desc: "The race is particularly large in a world where most others aren't. He subtracts 2 from Trait rolls when using equipment that wasn't specifically designed for his race and cannot wear their armor or clothing. Equipment, food, and clothing cost double the listed price.", source: "SWADE" },
        { type: "Negative", name: "Cannot Speak", cost: "[-1]", maxranks: 1, desc: "The race has no vocal cords or cannot form the sounds made by most other races. He can communicate with members of his own race naturally (through song, pheromones, body language, etc.). Other races can't speak his 'language' but may learn to understand him if they take the proper Language skill. The species can hear and understand other typical languages and may communicate via electronic devices or the like.", source: "SWADE" },
        { type: "Negative", name: "Dependency", cost: "[-2]", maxranks: 1, desc: "The race must consume or have contact with some sort of relatively common substance for an hour out of every 24. Creatures from water-based worlds, for example, might need to immerse themselves in water; plant people might need sunlight. Without the required contact, a character becomes Fatigued each day until Incapacitated. A day after that, they perish. Each hour spent recovering with the appropriate substance restores a level of Fatigue. ", source: "SWADE" },
        { type: "Negative", name: "Environmental Weakness", cost: "[-1]", maxranks: 99, desc: "The race suffers a -4 penalty to resist a particular environmental effect, such as heat, cold, etc. If the being suffers an attack based on that form, the penalty acts as a bonus to damage.", source: "SWADE" },
        { type: "Negative", name: "Frail", cost: "[-1]", maxranks: 2, desc: "The creature is less durable than most. Reduce its Toughness by 1.", source: "SWADE" },
        { type: "Negative", name: "Hindrance", cost: "[-1,-2]", maxranks: 99, desc: "The race has an inherent Minor Hindrance for 1 point, or a Major Hindrance for 2. This doesn't affect the ability to choose other Hindrances during character creation.", source: "SWADE" },
        { type: "Negative", name: "Poor Parry", cost: "[-1]", maxranks: 3, desc: "These beings are poor melee defenders; -1 Parry.", source: "SWADE" },
        { type: "Negative", name: "Racial Enemy", cost: "[-1]", maxranks: 99, desc: "This species dislikes another species relatively common to the setting. They suffer a -2 penalty to Persuasion rolls when dealing with their rivals and may become hostile with little provocation. This may only be taken once per race. ", source: "SWADE" },
        { type: "Negative", name: "Reduced Core Skills", cost: "[-1]", maxranks: 5, desc: "This race starts with one less core skill. The skill may be gained normally but does not start at a d4. This may be taken once per core skill affected.", source: "SWADE" },
        { type: "Negative", name: "Reduced Pace", cost: "[-1,-2]", maxranks: 1, desc: "For -1 point, reduce Pace by 1 and the running die a die type (d4 is reduced to d4-1). For -2 points, reduce Pace another 2 points and subtract 2 from Athletics and rolls to resist Athletics where movement and mobility are integral to the challenge (GM's call).", source: "SWADE" },
        { type: "Negative", name: "Size", cost: "[1]", maxranks: 1, desc: "The entity is smaller than average, reducing its Size and Toughness by 1 (see the Size Table, page 179).", source: "SWADE" },
        { type: "Negative", name: "Skill Penalty", cost: "[-1,-2]", maxranks: 1, desc: "The race suffers a -1 penalty to a very commonly used skill such as Fighting, Persuasion, or even Piloting in a game focused on airplanes (the GM decides based on her campaign). If the skill is less common or only comes up in certain situations, the penalty is -2. For 2 points, the penalty is -2/-4 instead.", source: "SWADE" },
      ];

      const insert = db.prepare(
        "INSERT INTO rabilities(type, name, cost, maxranks, desc, source) VALUES (?, ?, ?, ?, ?, ?)"
      );
      rabilities.forEach((ability) => {
        insert.run(ability.type, ability.name, ability.cost, ability.maxranks, ability.desc, ability.source);
      });
      res.send("Initialized rabilities");
    } catch (err) {
      console.error(err);
      return next(err);
    }
  };

  drop = (res: Express.Response, next: any) => {
    try {
      let db = this.dbUtils.getDb();
      const drop = db.prepare("DROP TABLE rabilities");
      drop.run();
      console.log("Dropped table");
      res.send("Dropped rability table");
    } catch (err) {
      console.error(err);
      return next(err);
    }
  };
}

export default DBRABILITIES;
