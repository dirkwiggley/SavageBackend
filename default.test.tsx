import { checkCharacterMeetsCriteria, Dice, Attribute, Hindrance, RAbility, Edge, Skill, RaceInterface, DiceInterface, CharacterInterface, ATTRIBUTES } from "./src/attributeValidation";
import { DICE, RANKS } from "./src/attributeValidation";

describe('characterValidation', () => {
    const NOVICE = 0;
    const SEASONED = 4;
    const VETERAN = 8;
    const HEROIC = 12;
    const LEGENDARY = 16;
    const AGILITY: Attribute = { name: "Agility" };
    const FIGHTING: Skill = {
        name:"Fighting",
        dice: DICE.D8,
        source:""
    }
    const SHOOTING: Skill = {
        name:"Shooting",
        dice: DICE.D8,
        source:""
    }
    const STEALTH: Skill = {
        name: "Stealth",
        dice: DICE.D4,
        source: ""
    }
    let character: CharacterInterface = {
        rabilities: [],
        attributes: [],
        hindrances: [],
        edges: [],
        skills: [],
        advances: SEASONED,
        wildcard: true
    }
  
    beforeEach(() => {
        character = {
            rabilities: [],
            attributes: [],
            hindrances: [],
            edges: [],
            skills: [],
            advances: SEASONED + 1,
            wildcard: true
        }
    })

    afterEach(() => {
 
    })

    describe("Empty criteria", () => {
        const criteria = {};
        it('Returns true for empty criteria', () => {
            const result = checkCharacterMeetsCriteria(criteria, character);
            expect(result).toBe(true);
        })
    })

    describe("Single criteria rank", () => {
        it('Returns true for char rank >= Novice', () => {
            const criteria = { rank: "Novice" };
            const result = checkCharacterMeetsCriteria(criteria, character);
            expect(result).toBe(true);
        })

        it('Returns false for char rank >= Heroic', () => {
            const criteria = { rank: "Heroic" };
            const result = checkCharacterMeetsCriteria(criteria, character);
            expect(result).toBe(false);
        })
    })

    describe("Single criteria, skill Fighting", () => {
        const criteria = { skill: FIGHTING };
        it('Returns true for char FIGHTING skill >= d8', () => {
            character.skills = [FIGHTING]
            const result = checkCharacterMeetsCriteria(criteria, character);
            expect(result).toBe(true);
        })
    })

    describe("Single criteria wildcard", () => {
        it('Returns true for char with wildcard = true', () => {
            const criteria = { wildcard: true }
            const result = checkCharacterMeetsCriteria(criteria, character);
            expect(result).toBe(true);
        })

        it('Returns true for char with wildcard = false', () => {
            const criteria = { wildcard: false }
            character.wildcard = false;
            const result = checkCharacterMeetsCriteria(criteria, character);
            expect(result).toBe(true);
        })
    })

    describe("ANDing two skills", () => {
        const criteria = { and: [{ skill: FIGHTING }, { skill: SHOOTING }] };
        it('Returns true for char FIGHTING and SHOOTING skills >= d8', () => {
            character.skills = [FIGHTING, SHOOTING]
            const result = checkCharacterMeetsCriteria(criteria, character);
            expect(result).toBe(true);
        })
    })

    describe("ORing an and with 2 skills with a single skill", () => {
        const criteria = { or: [{ and: [{ skill: FIGHTING }, { skill: SHOOTING }] }, { skill: STEALTH }] };
        it('Returns false for char (FIGHTING & SHOOTING skills >= d8 *FALSE*) OR char STEALTH skill >= d4 *FALSE* ', () => {
            character.skills = [ { name: "Stealth", attribute: AGILITY, dice: DICE.D4minus2, type: "Combat" } ];
            const result = checkCharacterMeetsCriteria(criteria, character);
            expect(result).toBe(false);
        })
    })

    describe("ORing an and with 2 skills with a single skill", () => {
        const criteria = { or: [{ and: [{ skill: FIGHTING }, { skill: SHOOTING }] }, { skill: STEALTH }] };
        it('Returns true for char (FIGHTING & SHOOTING skills >= d8 *FALSE*) OR char STEALTH skill >= d4 *TRUE* ', () => {
            character.skills = [ { name: "Stealth", attribute: AGILITY, dice: DICE.D4, type: "Combat" } ];
            const result = checkCharacterMeetsCriteria(criteria, character);
            expect(result).toBe(true);
        })
    })

    describe("ORing an And with 2 skills and a rank with an And with a skill and a rank", () => {
        const criteria = { or: [{ and: [{ skill: FIGHTING }, { skill: SHOOTING }, { rank: "Seasoned" }] }, { and: [{ skill: STEALTH, rank: "Seasoned" }] }] };
        it('Returns true for conditions, checking rank', () => {
            character.skills = [ { name: "Stealth", attribute: AGILITY, dice: DICE.D4, type: "Combat" } ];
            const result = checkCharacterMeetsCriteria(criteria, character);
            expect(result).toBe(true);
        })
    })

    describe("ORing an And with 2 skills and a rank with an And with a skill and a rank", () => {
        const criteria = { or: [{ and: [{ skill: FIGHTING }, { skill: SHOOTING }, { rank: "Seasoned" }] }, { and: [{ skill: STEALTH }, { rank: "Seasoned" }] }] };
        it('Returns false for conditions, checking rank', () => {
            character.skills = [ { name: "Stealth", attribute: AGILITY, dice: DICE.D8, type: "Combat" } ];
            character.advances = NOVICE + 3;
            const result = checkCharacterMeetsCriteria(criteria, character);
            expect(result).toBe(false);
        })
    })

    describe("Single Attribute Agi d8, critera d8", () => {
        const AGI = { 
            name: ATTRIBUTES.AGI,
            dice: DICE.D8,
        }
        const criteria = { attribute: AGI };
        it('Returns true for conditions, checking attribute AGI', () => {
            character.attributes = [AGI];
            const result = checkCharacterMeetsCriteria(criteria, character);
            expect(result).toBe(true);
        })
    })

    describe("Single Attribute Agi d12, critera d8", () => {
        const AGI = { 
            name: ATTRIBUTES.AGI,
            dice: DICE.D12,
        }
        const criteria = { attribute: AGI }
        it('Returns true for conditions, checking attribute AGI', () => {
            character.attributes = [AGI]
            const result = checkCharacterMeetsCriteria(criteria, character);
            expect(result).toBe(true);
        })
    })

    describe("Single Attribute Agi d6", () => {
        const CHAR_AGI = { 
            name: ATTRIBUTES.AGI,
            dice: DICE.D6,
        }
        const CRITERIA_AGI = { 
            name: ATTRIBUTES.AGI,
            dice: DICE.D8,
        }
        const criteria = { attribute: CRITERIA_AGI }
        it('Returns false for conditions, Attribute AGI >= d8', () => {
            character.attributes = [CHAR_AGI]
            const result = checkCharacterMeetsCriteria(criteria, character);
            expect(result).toBe(false);
        })
    })

    describe("ANDing Rank and Attribute Agi", () => {
        const CHAR_AGI = { 
            name: ATTRIBUTES.AGI,
            dice: DICE.D8,
        }
        const CRITERIA_AGI = { 
            name: ATTRIBUTES.AGI,
            dice: DICE.D8,
        }
        it('Returns true for conditions, rank >= novice & attribute AGI >= d8', () => {
            const criteria = { and: [ {rank: RANKS.NOVICE }, {attribute: CRITERIA_AGI} ] }
            character.attributes = [CHAR_AGI]
            character.advances = NOVICE + 3
            const result = checkCharacterMeetsCriteria(criteria, character);
            expect(result).toBe(true);
        })

        it('Returns false for conditions, rank >= seasoned *FALSE* & attribute AGI >= d8 *TRUE*', () => {
            const criteria = { and: [ {rank: RANKS.SEASONED }, {attribute: CRITERIA_AGI} ] }
            character.attributes = [CHAR_AGI];
            character.advances = NOVICE + 3;
            const result = checkCharacterMeetsCriteria(criteria, character);
            expect(result).toBe(false);
        })

        it('Returns false for conditions, rank >= veteran *FALSE* & attribute AGI >= d8 *TRUE*', () => {
            const criteria = { and: [ {rank: RANKS.VETERAN }, {attribute: CRITERIA_AGI} ] }
            character.attributes = [CHAR_AGI]
            character.advances = SEASONED
            const result = checkCharacterMeetsCriteria(criteria, character);
            expect(result).toBe(false);
        })

        it('Returns false for conditions, rank >= veteran *FALSE* & attribute AGI >= d8 *TRUE*', () => {
            const criteria = { and: [ {rank: RANKS.VETERAN }, {attribute: CRITERIA_AGI} ] }
            character.attributes = [CHAR_AGI]
            character.advances = SEASONED
            const result = checkCharacterMeetsCriteria(criteria, character);
            expect(result).toBe(false);
        })
    })

    describe("ANDing Rank and Attributes Str and Vig", () => {
        const CHAR_STR = { 
            name: ATTRIBUTES.STR,
            dice: DICE.D8,
        }
        const CHAR_VIG = { 
            name: ATTRIBUTES.VIG,
            dice: DICE.D8,
        }
        const CRITERIA_STR = { 
            name: ATTRIBUTES.STR,
            dice: DICE.D6,
        }
        const CRITERIA_VIG = { 
            name: ATTRIBUTES.VIG,
            dice: DICE.D6,
        }
        const criteria = { and: [ {rank: RANKS.NOVICE }, {attribute: CRITERIA_STR}, {attribute: CRITERIA_VIG} ] }
        it('Returns true for conditions, rank >= novice *TRUE* & attributes Str & VIG >= d6 *TRUE*', () => {
            character.attributes = [CHAR_STR, CHAR_VIG]
            character.advances = NOVICE + 3
            const result = checkCharacterMeetsCriteria(criteria, character);
            expect(result).toBe(true);
        })
    })

    describe("ANDing Rank and Edge attractive", () => {
        const EDGE_ATTRACTIVE = { 
            name: "Attractive",
            source: "SWADE",
        }
        const criteria = { and: [ {rank: RANKS.NOVICE }, {edge: EDGE_ATTRACTIVE} ] }
        it('Returns true for conditions, char rank >= novice *TRUE* & char edge = attractive *TRUE*', () => {
            character.edges = [EDGE_ATTRACTIVE]
            const result = checkCharacterMeetsCriteria(criteria, character);
            expect(result).toBe(true);
        })

        it('Returns false for conditions, char rank >= novice *TRUE* & char edge = attractive *FALSE*', () => {
            character.edges = []
            const result = checkCharacterMeetsCriteria(criteria, character);
            expect(result).toBe(false);
        })
    })
})