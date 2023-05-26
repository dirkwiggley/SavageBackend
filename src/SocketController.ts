import { WebSocketServer, WebSocket } from "ws";
import { TrackerUserInterface } from "./types.js";
import CombatTracker from "./CombatTracker.js";
import { OPEN, GET_COMBAT_TRACKERS, CREATE_COMBAT_TRACKER, JOIN_COMBAT_TRACKER, GET_TRACKER_USERS, REMOVE_TRACKER, MISC, SEND_MESSAGE, REMOVE_USER_FROM_TRACKER } from "./types.js";
import { WSOrganizerInterface, WSOrganizer } from "./WSOrganizer.js";
interface WSData {
    id?: number;
    request?: string;
    response?: string;
    status: number;
    data?: string;
}

const UNKNOWN = 0;
const ERROR = 500;
const SUCCESS = 200;
 
class SocketController {
    wss = new WebSocketServer({ port: 8081 });
    wsId : number = 1;
    static wsArray : Array<WSOrganizerInterface> = [];

    wsForIdExists(wsId: number): boolean {
        SocketController.wsArray.forEach(item => {
            if (item.id === wsId) {
                return true;
            }
        });
        return false;
    }

    wsForUserIdExists(userId: number) {
        SocketController.wsArray.forEach(item => {
            if (item.userId === userId) {
                return true;
            }
        });
        return false;
    }

    getWsForUserId(userId: number) : WebSocket{
        let socket = null;
        SocketController.wsArray.forEach(item => {
            if (item.userId === userId) {
                socket = item.ws;
            }
        });
        return socket;
    }

    // This is called at application startup
    wsInit() {
        this.wss.on('connection', (ws: WebSocket) => {
            ws.on('error', console.error);
        
            ws.on('message', (data: WSData) => this.wsMessage(data, ws));
        })
    }

    wsMessage(data: WSData, ws: any) {
        const request = JSON.parse(data.toString());
        const requestOption = request.request;
        const requestData = request.data;
        const combatTracker = new CombatTracker();
        if (requestOption == OPEN) {
            let responseMsg: WSData = { response: OPEN, status: 0, data: "" };
            // Don't allow duplicate WebSockets to be added
            if (this.wsForUserIdExists(request.data.user_id)) {
                responseMsg.status = ERROR;
                responseMsg.data = "Web socket already exists for user";
            } else {
                responseMsg.id = this.wsId++;
                let newWSOrganizer = new WSOrganizer(ws, requestData.id, requestData.nickname);
                SocketController.wsArray.push(newWSOrganizer);
                responseMsg.data = "Web socket added to list";
                console.log("Option: "+requestOption);
                responseMsg.status = 200;
                console.log(JSON.stringify(requestData,null,2));
            }
            ws.send(JSON.stringify(responseMsg));
        } else if (requestOption === GET_COMBAT_TRACKERS) { 
            const response = combatTracker.getCombatTrackers();
            ws.send(JSON.stringify(response));
        } else if (requestOption === CREATE_COMBAT_TRACKER) {
            const response = combatTracker.addTracker(request.data);
            ws.send(JSON.stringify(response));
        } else if (requestOption === JOIN_COMBAT_TRACKER) {
            const trackerUserInfo: TrackerUserInterface = { 
                tracker_id: request.data.tracker_id,
                user_id: request.data.user_id,
                user_name: request.data.user_name
            }
            const response = combatTracker.addUserToTracker(trackerUserInfo);
            ws.send(JSON.stringify(response));
        } else if (requestOption === GET_TRACKER_USERS) {
            const response = combatTracker.getTrackerUsers(request.data);
            ws.send(JSON.stringify(response));
        } else if (requestOption === REMOVE_TRACKER) {
            const newTrackerArray = SocketController.wsArray.filter(socketItem => {
                socketItem.id !== requestData.id;
            });
        } else if (requestOption === "MISC") {
            const response: WSData = {id: request.id, response: "MISC", data: request, status: SUCCESS}
            ws.send(JSON.stringify(response))
        } else if (requestOption === REMOVE_USER_FROM_TRACKER) { 
            const response = combatTracker.removeUserFromTracker(request.data.tracker_id, request.data.user_id);
            ws.send(JSON.stringify(response));
        } else if (requestOption === SEND_MESSAGE) { 
            // find the send to socket
            let socketItem: (WSOrganizerInterface | null) = null;
            SocketController.wsArray.forEach(element => {
                if (element.userId === request.data.toUserId) {
                    socketItem = element;
                }
            });
            const response: WSData = { id: 0, response: SEND_MESSAGE, data: request.data.message, status: SUCCESS };
            socketItem.ws.send(request.data.message);
            ws.send(JSON.stringify(response));
        } else {
            console.log("Unknown request");
            ws.send(JSON.stringify({ response: requestOption, status: 500, data: "Unknown request option"}));
        }
    }
}

export default SocketController