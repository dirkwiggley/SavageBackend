import { checkCharacterMeetsCriteria, Dice, Attribute, Hindrance, RAbility, Edge, Skill, RaceInterface, DiceInterface, CharacterInterface } from "./src/attributeValidation";

describe('attributeValidation', () => {
    const d4minus2: Dice = { name: "d4minus2", rank: 1}
    const d4: Dice = { name: "d4", rank: 2 };
    const d6: Dice = { name: "d6", rank: 3 };
    const d8: Dice = { name: "d8", rank: 4 };
    const agility: Attribute = { name: "Agility" };
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
    const stealth: Skill = {
        name: "Stealth",
        dice: d4,
        source: ""
    }
    let character: CharacterInterface = {
        rabilities: [],
        attributes: [],
        hindrances: [],
        edges: [],
        skills: [ 
            { name: "Fighting", attribute: agility, dice: d8, type: "Combat" },
            { name: "Shooting", attribute: agility, dice: d8, type: "Combat" },
        ],
        advances: 5
    }
  
    beforeEach(() => {
    })

    afterEach(() => {
        character = {
            rabilities: [],
            attributes: [],
            hindrances: [],
            edges: [],
            skills: [ 
                { name: "Fighting", attribute: agility, dice: d8, type: "Combat" },
                { name: "Shooting", attribute: agility, dice: d8, type: "Combat" },
            ],
            advances: 5
        }
    })

    describe("Single criteria, rank Novice", () => {
        const criteria = { rank: "Novice" };
        it('Returns true for Novice rank', () => {
            const result = checkCharacterMeetsCriteria(criteria, character);
            expect(result).toBe(true);
        })
    })

    describe("Single criteria, rank Heroic", () => {
        const criteria = { rank: "Heroic" };
        it('Returns false for Heroic rank', () => {
            const result = checkCharacterMeetsCriteria(criteria, character);
            expect(result).toBe(false);
        })
    })

    describe("Single criteria, skill Fighting", () => {
        const criteria = { skill: fighting };
        it('Returns true for skill d8', () => {
            const result = checkCharacterMeetsCriteria(criteria, character);
            expect(result).toBe(true);
        })
    })

    describe("ANDing two skills", () => {
        const criteria = { and: [{ skill: fighting }, { skill: shooting }] };
        it('Returns true for fighting and shooting', () => {
            const result = checkCharacterMeetsCriteria(criteria, character);
            expect(result).toBe(true);
        })
    })

    describe("ORing an and with 2 skills with a single skill", () => {
        let character: CharacterInterface = {
            rabilities: [],
            attributes: [],
            hindrances: [],
            edges: [],
            skills: [ 
                { name: "Stealth", attribute: agility, dice: d4minus2, type: "Combat" }
            ],
            advances: 5
        }
    
        const criteria = { or: [{ and: [{ skill: fighting }, { skill: shooting }] }, { skill: stealth }] };
        it('Returns false for conditions', () => {
            const result = checkCharacterMeetsCriteria(criteria, character);
            expect(result).toBe(false);
        })
    })

    describe("ORing an And with 2 skills and a rank with an And with a skill and a rank", () => {
        const criteria = { or: [{ and: [{ skill: fighting }, { skill: shooting }, { rank: "Seasoned" }] }, { and: [{ skill: stealth, rank: "Seasoned" }] }] };
        let character = {
            rabilities: [],
            attributes: [],
            hindrances: [],
            edges: [],
            skills: [
                { name: "Stealth", attribute: agility, dice: d8, type: "Combat" },
            ],
            advances: 5
        }
        it('Returns true for conditions, checking rank', () => {
            const result = checkCharacterMeetsCriteria(criteria, character);
            expect(result).toBe(true);
        })
    })

    describe("ORing an And with 2 skills and a rank with an And with a skill and a rank", () => {
        const criteria = { or: [{ and: [{ skill: fighting }, { skill: shooting }, { rank: "Seasoned" }] }, { and: [{ skill: stealth }, { rank: "Seasoned" }] }] };
        let character = {
            rabilities: [],
            attributes: [],
            hindrances: [],
            edges: [],
            skills: [
                { name: "Stealth", attribute: agility, dice: d8, type: "Combat" },
            ],
            advances: 3
        }
        it('Returns false for conditions, checking rank', () => {
            const result = checkCharacterMeetsCriteria(criteria, character);
            expect(result).toBe(false);
        })
    })
})