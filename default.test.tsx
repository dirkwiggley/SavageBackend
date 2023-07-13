import { checkCharacterMeetsCriteria, Dice, Attribute, Hindrance, RAbility, Edge, Skill, RaceInterface, DiceInterface, CharacterInterface } from "./src/requirementsTests";

beforeEach(()=> {

})

afterEach(()=> {

})

describe("Initial Test", () => {
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
    const criteria = { and: [ {skill:fighting}, {skill:shooting} ]};
    let character = {
        rabilities: [],
        attributes: [],
        hindrances: [],
        edges: [],
        skills: [ 
            { name: "Fighting", attribute: attr1, dice: d8, type: "Combat" },
            { name: "Shooting", attribute: attr1, dice: d8, type: "Combat" },
        ]
    }
    it('Returns true for fighting and shooting', () => {
        const result = checkCharacterMeetsCriteria(criteria, character);
        expect(result).toBe(true);
    })
})

describe("Fail Test", () => {
    const d4minus2: Dice = { name: "d4", rank: 1}
    const d4: Dice = { name: "d4", rank: 2 };
    const d6: Dice = { name: "d6", rank: 3 };
    const d8: Dice = { name: "d8", rank: 4 };
    const attr1: Attribute = { name: "Agility", };
    const skill1: Skill = {
        name:"Fighting",
        dice: d8,
        source:""
    }
    const skill2: Skill = {
        name:"Shooting",
        dice: d8,
        source:""
    }
    const skill3: Skill = {
        name: "Stealth",
        dice: d4,
        source:""
    }
    const criteria = { or: [ { and: [ {skill:skill1}, {skill:skill2} ] }, {skill:skill3} ] };
    let character = {
        rabilities: [],
        attributes: [],
        hindrances: [],
        edges: [],
        skills: [ 
            { name: "Stealth", attribute: attr1, dice: d4minus2, type: "Combat" },
        ]
    }
    it('Returns false for conditions', () => {
        const result = checkCharacterMeetsCriteria(criteria, character);
        expect(result).toBe(false);
    })
})

describe("Complex test", () => {
    const d4minus2: Dice = { name: "d4", rank: 1}
    const d4: Dice = { name: "d4", rank: 2 };
    const d6: Dice = { name: "d6", rank: 3 };
    const d8: Dice = { name: "d8", rank: 4 };
    const attr1: Attribute = { name: "Agility", };
    const skill1: Skill = {
        name:"Fighting",
        dice: d8,
        source:""
    }
    const skill2: Skill = {
        name:"Shooting",
        dice: d8,
        source:""
    }
    const skill3: Skill = {
        name: "Stealth",
        dice: d4,
        source:""
    }
    const criteria = { or: [ { and: [ {skill:skill1}, {skill:skill2}, {rank: "Seasoned"} ] }, { and: [ {skill:skill3, rank: "Seasoned"} ] } ] };
    let character = {
        rabilities: [],
        attributes: [],
        hindrances: [],
        edges: [],
        skills: [ 
            { name: "Stealth", attribute: attr1, dice: d8, type: "Combat" },
        ],
        advances: 5
    }
    it('Returns true for conditions, checking rank', () => {
        const result = checkCharacterMeetsCriteria(criteria, character);
        expect(result).toBe(true);
    })
})

describe("Complex test", () => {
    const d4minus2: Dice = { name: "d4", rank: 1}
    const d4: Dice = { name: "d4", rank: 2 };
    const d6: Dice = { name: "d6", rank: 3 };
    const d8: Dice = { name: "d8", rank: 4 };
    const attr1: Attribute = { name: "Agility", };
    const skill1: Skill = {
        name:"Fighting",
        dice: d8,
        source:""
    }
    const skill2: Skill = {
        name:"Shooting",
        dice: d8,
        source:""
    }
    const skill3: Skill = {
        name: "Stealth",
        dice: d4,
        source:""
    }
    const criteria = { or: [ { and: [ {skill:skill1}, {skill:skill2}, {rank: "Seasoned"} ] }, { and: [ {skill:skill3}, {rank: "Seasoned"} ] } ] };
    let character = {
        rabilities: [],
        attributes: [],
        hindrances: [],
        edges: [],
        skills: [ 
            { name: "Stealth", attribute: attr1, dice: d8, type: "Combat" },
        ],
        advances: 3
    }
    it('Returns false for conditions, checking rank', () => {
        const result = checkCharacterMeetsCriteria(criteria, character);
        expect(result).toBe(false);
    })
})