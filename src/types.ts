export interface UserInterface {
  id: number;
  login: string;
  password: string;
  nickname: string;
  email: string;
  roles: string;
  campaignid?: number;
  campaignname?: string;
  locale: string;
  active: number;
  resetpwd: number;
  refreshtoken: string;
}

export interface TokenInterface {
  exp: number;
  iat: number;
  isAdmin: boolean;
  login: string;
  timestamp: number;
  user_id: number;
}

export interface CombatTrackerInterface {
  tracker: TrackerUserInterface;
  id?: number;
  name: string;
  gamemaster_id: number;
  gamemaster_name: string;
  touched?: number;
  users?: Array<TrackerUserInterface>;
}

export interface TrackerUserInterface {
  tracker_id?: number;
  user_id: number;
  user_name: string;
}

export interface WebSocketItemInterface {
  id: number;
  ws: WebSocket;
  userId: number;
  userName: string;
}

export interface TrackerResponseInteface {
  response: string;
  status: number;
  data?: any;
}

export const OPEN = "OPEN";
export const GET_COMBAT_TRACKERS = "GET_COMBAT_TRACKERS";
export const CREATE_COMBAT_TRACKER = "CREATE_COMBAT_TRACKER";
export const JOIN_COMBAT_TRACKER = "JOIN_COMBAT_TRACKER";
export const GET_TRACKER_USERS = "GET_TRACKER_USERS";
export const REMOVE_TRACKER = "REMOVE_TRACKER";
export const REMOVE_USER_FROM_TRACKER = "REMOVE_USER_FROM_TRACKER";
export const SEND_MESSAGE = "SEND_MESSAGE";
export const MISC = "MISC";

// TODO: flesh this out
export const objectIsDecodedToken = (obj: unknown): obj is TokenInterface => {
  const test: any = obj;
  return test.timestamp !== null && test.timestamp !== undefined;
};
