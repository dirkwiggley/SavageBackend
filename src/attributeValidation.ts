export interface Dice {
    id?: number;
    name: string;
    rank: number;
}

export const DICE = {
  "D4minus2":{ id: 1, name: "d4-2", rank: 1 },
  "D4minus1":{ id: 2, name: "d4-1", rank: 2 },
  "D4":{ id: 3, name: "d4", rank: 3 },
  "D6":{ id: 4, name: "d6", rank: 4 },
  "D8":{ id: 5, name: "d8", rank: 5 },
  "D10":{ id: 6, name: "d10", rank: 6 },
  "D12":{ id: 7, name: "d12", rank: 7 },
  "D12plus1":{ id: 8, name: "d12+1", rank: 8 },
  "D12plus2":{ id: 9, name: "d12+2", rank: 9 },
  "D12plus3":{ id: 10, name: "d12+3", rank: 10 },
  "D12plus4":{ id: 11, name: "d12+4", rank: 11 },
  "D12plus5":{ id: 12, name: "d12+5", rank: 12 },
  "D12plus6":{ id: 13, name: "d12+6", rank: 13 },
}
export interface Attribute {
    id?: number;
    name: string;
    dice?: Dice;
    source?: string;
    max?: Dice;
}

export const ATTRIBUTES = {
  AGI: "Agi",
  SMA: "Sma",
  SPI: "Spi",
  STR: "Str",
  VIG: "Vig",
}

export interface Hindrance {
    id?: number;
    name: string;
    type?: string;
    desc?: string;
    summary?: string;
    source?: string;
}

export interface RAbility {
    id: number;
    name: string;
    cost?: Array<number>;
    maxRanks?: number;
    desc?: string;
    source?: string;
}

export interface Edge {
    id?: number;
    name: string; 
    type?: string;
    desc?: string;
    source?: string;
}

export interface Skill {
    id?: number;
    name: string;
    attribute?: Attribute;
    dice?: DiceInterface;
    description?: string;
    type?: string;
    source?: string;
}

export interface RaceInterface {
    id: number;
    name: string;
    rabilities: Array<RAbility>
}

export interface DiceInterface {
    id?: number;
    name: string;
    rank: number;
}

export interface CharacterInterface {
    id?: number;
    race?: RaceInterface;
    rabilities: Array<RAbility>;
    attributes: Array<Attribute>;
    hindrances?: Array<Hindrance>;
    edges?: Array<Edge>;
    skills?: Array<Skill>;
    advances?: number;
    wildcard?: boolean;
}
  
export interface RankInterface {
  id?: number;
  advances: number;
  name: string;
}

export const RANKS = {
  NOVICE: "Novice",
  SEASONED: "Seasoned",
  VETERAN: "Veteran",
  HEROIC: "Heroic",
  LEGENDARY: "Legendary"
}

export const ranks: Array<RankInterface> = [
  { 
    advances: 0,
    name: RANKS.NOVICE
  },
  {
    advances: 4,
    name: RANKS.SEASONED
  },
  {
    advances: 8,
    name: RANKS.VETERAN
  },
  {
    advances: 12,
    name: RANKS.HEROIC
  },{
    advances: 16,
    name: RANKS.LEGENDARY
  }
]

// Take the rank name and get the minimum number of advances
// required for it
export const getMinAdvances = (rankName: string) => {
  const rank = ranks.find(rank => rank.name === rankName);
  return rank.advances;
}

const checkCriteria = (parameter: any, character) => {
  const criteriaKey = Object.keys(parameter)[0];
  const criteriaValue = parameter[criteriaKey];

  switch (criteriaKey) {
      case 'race': 
        return checkRaceCriteria(criteriaValue, character.race);
      case 'rability': 
        return checkRAbilitiesCriteria(criteriaValue, character.rabilities);
      case 'attribute':
        return checkAttributesCriteria(criteriaValue, character.attributes);
      case 'hindrance':
        return checkHindrancesCriteria(criteriaValue, character.hindrances);
      case 'edge':
        return checkEdgesCriteria(criteriaValue, character.edges);
      case 'skill':
        return checkSkillsCriteria(criteriaValue, character.skills);
      case 'rank':
        return checkRankCriteria(criteriaValue, character.advances);
      case 'wildcard':
        return checkWildcardCriteria(criteriaValue, character.wildCard);
      default: // The no criteria case
        return true;
    }
}

const isOperand = (elementKey: string) : boolean => {
  const operators = ["and", "or", "not"];
  return operators.includes(elementKey);
}

/*
  Parameters are key/object pairs with the key being either param, and, or, not
    Assume that any element with a pameter means "that value or higher"
    jsonCriteria:
      // operands
      { and: [{}, {}, ...] }
      { or: [{}, {}, ...] }
      { not: {} }
      // complex
      { or: [ and: [{}, {}, ...], {}, ...] }
      // single param
      {}

    Params:
        param: {attribute:{name:"",dice:{},source:""}}
        param: {hindrance:{name:"",source:""}}
        param: {edge:{name:"",[type:""],source:""}}
        param: {skill:{name:"",dice:{},source:""}}
*/
export function checkCharacterMeetsCriteria(jsonCriteria: any, character: CharacterInterface): boolean {
    const parameterKey = Object.keys(jsonCriteria)[0];
    const elements = jsonCriteria[parameterKey];
    
    // Check if the parameter has logical constructions
    if (parameterKey === 'and') {
      // if any elements of an and clause are false 
      // stop iterating and return false
      for (const element of elements) {
        const elementKey = Object.keys(element)[0];
        if (isOperand(elementKey)) {
          if (!checkCharacterMeetsCriteria(element, character)) {
            return false;
          }
        } else {
          const pass = checkCriteria(element, character);
          if (!pass) {
            return false;
          }
        }
      }
      // Got through list with 0 failures
      return true;
    } else if (parameterKey === 'or') {
      // if any elements of an or clause are true 
      // stop iterating and return true
      for (const element of elements) {
        const elementKey = Object.keys(element)[0];
        if (isOperand(elementKey)) {
          if (checkCharacterMeetsCriteria(element, character)) {
            return true;
          }
        } else {
          const pass = checkCriteria(element, character);
          if (pass) {
            return true;
          }
        }
      }
      // Got through list with 0 successes
      return false;
    } else if (parameterKey === 'not') {
      for (const element of elements) {
        const elementKey = Object.keys(element)[0];
        // reverse value in all cases
        if (isOperand(elementKey)) {
           return checkCharacterMeetsCriteria(element, character);
        } else {
          const pass = checkCriteria(element, character);
          return !pass;  
        }
      }
      return false;
    } else {
      // In this case there should be only 1 element in jsonCriteria
      return checkCriteria(jsonCriteria, character);
    }
  }
  
  function checkRaceCriteria(criteria: any, race: RaceInterface): boolean {
    // A character has only one race
    return criteria.name === race.name;
  }
  
  function checkRAbilitiesCriteria(criteria: any, rabilities: RAbility[]): boolean {
    const rAbility = rabilities.find(rability => {
      rability.name === criteria.name;
    })
    if (rAbility) {
      return true;
    }
    return false;
  }
  
  function checkAttributesCriteria(criteria: any, attributes: Attribute[]): boolean {
    const attribute = attributes.find(attribute => attribute.name === criteria.name);
    if (attribute && attribute.dice.rank >= criteria.dice.rank)
      return true;
    return false;
  }
  
  function checkHindrancesCriteria(criteria: any, hindrances: Hindrance[]): boolean {
    const hindrance = hindrances.find(hindrance => hindrance.name === criteria.name);
    if (hindrance) {
      return true;
    }
    return false;
  }
  
  function checkEdgesCriteria(criteria: any, edges: Edge[]): boolean {
    const edge = edges.find(edge => (edge.name === criteria.name && edge.source === criteria.source));
    if (edge) {
      return true;
    }
    return false;
  }
  
  function checkSkillsCriteria(criteria: any, skills: Skill[]): boolean {
    const skill = skills.find(skill => skill.name === criteria.name);
// console.log("<= checkSkillsCriteria =>")
// console.log(`criteria ${criteria.name}:  `,JSON.stringify(criteria));
// console.log("criteria.dice.rank: "+criteria.dice.rank);
// if (skill) {
//   console.log("skill.dice.rank >= criteria.dice.rank: "+skill.dice.rank >= criteria.dice.rank)
//   console.log(`skill ${skill.name}: `,JSON.stringify(skill,null,2));
//   console.log("skill.dice.rank: "+skill.dice.rank);
// } else {
//   console.log(`Skill ${criteria.name} does not exist`);
// }
    if (skill && skill.dice.rank >= criteria.dice.rank)
      return true;
    return false;
  }
  
  function checkRankCriteria(criteria: any, advances: number): boolean {
    const criteriaAdvances = getMinAdvances(criteria);
    return (advances >= criteriaAdvances);
  }

  function checkWildcardCriteria(criteria: any, wildcard: boolean): boolean {
    return criteria.wildcard === wildcard;
  }
