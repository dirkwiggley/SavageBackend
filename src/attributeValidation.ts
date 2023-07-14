export interface Dice {
    id?: number;
    name: string;
    rank: number;
}

export interface Attribute {
    id?: number;
    name: string;
    dice?: Dice;
    source?: string;
    max?: Dice;
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
    type: string;
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
    advances?: number
}
  
export interface RankInterface {
  id?: number;
  advances: number;
  name: string;
}

export const ranks: Array<RankInterface> = [
  { 
    advances: 0,
    name: "Novice"
  },
  {
    advances: 4,
    name: "Seasoned"
  },
  {
    advances: 8,
    name: "Veteran"
  },
  {
    advances: 12,
    name: "Heroic"
  },{
    advances: 16,
    name: "Legendary"
  }
]

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
      default:
        return false;
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
        param: {attribute:{name:"",die:{},source:""}}
        param: {hindrance:{name:"",source:""}}
        param: {edge:{name:"",[type:""],source:""}}
        param: {skill:{name:"",die:{},source:""}}
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
    const edge = edges.find(edge => edge.name === criteria.name);
    if (edge) {
      return true;
    }
    return false;
  }
  
  function checkSkillsCriteria(criteria: any, skills: Skill[]): boolean {
    const skill = skills.find(skill => skill.name === criteria.name);
    if (skill && skill.dice.rank >= criteria.dice.rank)
      return true;
    return false;
  }
  
  function checkRankCriteria(criteria: any, advances: number): boolean {
    const criteriaAdvances = getMinAdvances(criteria);
    return (advances >= criteriaAdvances);
  }