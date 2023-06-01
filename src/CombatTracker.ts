import Express from "express";
import { CombatTrackerInterface, TrackerUserInterface, TrackerResponseInteface } from "./types.js";
import { GET_COMBAT_TRACKERS, CREATE_COMBAT_TRACKER, JOIN_COMBAT_TRACKER, GET_TRACKER_USERS, REMOVE_TRACKER, MISC, SEND_MESSAGE, REMOVE_USER_FROM_TRACKER } from "./types.js";
import SocketController from "./SocketController.js";

class CombatTracker {
    static combatTrackerData: Array<CombatTrackerInterface> | null = null;
    static trackerId = 1;

    constructor() {
    }

    trackersExist() : boolean {
        return (CombatTracker.combatTrackerData && CombatTracker.combatTrackerData.length > 0)
    }

    createResponse(request: string, status: number, data: any) : TrackerResponseInteface {
        return { response: request, status: status, data: data };
    }

    addTracker(trackerInfo: CombatTrackerInterface) : TrackerResponseInteface {
        const newId = CombatTracker.trackerId++;
        let newTracker = { id: newId, ...trackerInfo };
        if (!newTracker.users) {
            newTracker.users = [];
        }
        if (CombatTracker.combatTrackerData && CombatTracker.combatTrackerData.length > 0) {
            CombatTracker.combatTrackerData.push(newTracker);
        } else {
            CombatTracker.combatTrackerData = [newTracker];
        }
        return this.createResponse(CREATE_COMBAT_TRACKER, 200, { id: newId });
    }

    removeTracker(trackerId: number, res: Express.Response) {
        if (this.trackersExist()) {
            let newTrackers = CombatTracker.combatTrackerData.filter(function(tracker) {
                tracker.id !== trackerId;
            });
            CombatTracker.combatTrackerData = newTrackers;
            res.status(200).send();
        } else {
            res.status(500).send("Could not find tracker");
        }
    }

    updateTracker(tracker: CombatTrackerInterface, res: Express.Response) {
        if (this.trackersExist()) {
            let newTrackers = CombatTracker.combatTrackerData.filter(function(currentTracker) {
                currentTracker.id !== tracker.id;
            });
            newTrackers.push(tracker);
            res.status(200).send(newTrackers);
        }
        res.status(500).send("Could not locate tracker to update");
    }

    getCombatTrackers() : TrackerResponseInteface {
        if (this.trackersExist()) {
            return this.createResponse(GET_COMBAT_TRACKERS, 200, { trackers: CombatTracker.combatTrackerData });
        } else {
            return this.createResponse(GET_COMBAT_TRACKERS, 500, { trackers: null });
        }
    }

    findTracker(trackerId: number) : CombatTrackerInterface | null {
        let foundTracker: CombatTrackerInterface | null = null;
        if (this.trackersExist()) {
            const array = CombatTracker.combatTrackerData;
            for (let x = 0; x < array.length; x++) {
                if (array[x].id === trackerId) {
                    foundTracker = array[x];
                    break;
                }
            }
            foundTracker = CombatTracker.combatTrackerData[0];
            console.log(foundTracker);
        } 
        
        return foundTracker;
    }

    addUserToTracker(userInfo: TrackerUserInterface) : TrackerResponseInteface {
        if (!userInfo.tracker_id) { 
            return this.createResponse(JOIN_COMBAT_TRACKER, 500, { error: "No tracker id supplied" });
        }
        if (this.trackersExist()) {
            const tracker = this.findTracker(userInfo.tracker_id);
            if (tracker) {
                const userId = userInfo.user_id;
                let userNotFound = true;
                tracker.users.forEach(user => {
                    if (userId === user.user_id) userNotFound = false;
                });
                if (userNotFound) {
                    if (tracker.users) {
                        tracker.users.push(userInfo)
                    } else {
                        tracker.users = [userInfo];
                    }
                }
            } else {
                return this.createResponse(JOIN_COMBAT_TRACKER, 500, { error: "Tracker not found" });
            }
            return this.createResponse(JOIN_COMBAT_TRACKER, 200, { data: "SUCCESS"});
        }
        return this.createResponse(JOIN_COMBAT_TRACKER, 500, { error: "No trackers found" });
    }

    removeUserFromTracker(trackerId: number, userId: number) : TrackerResponseInteface {
        if (this.trackersExist()) {
            const tracker: CombatTrackerInterface = this.findTracker(trackerId);
            if (tracker) {
                 const newUsers = tracker.users.filter(current => {
                    current.user_id === userId;
                });
                tracker.users = newUsers;
                return this.createResponse(REMOVE_USER_FROM_TRACKER, 200, { data: "SUCCESS" });
            } else {
                return this.createResponse(REMOVE_USER_FROM_TRACKER, 500, { error: "Could not find tracker"});
            }
        } else {
            return this.createResponse(REMOVE_USER_FROM_TRACKER, 500, { error: "No trackers exist"});
        }
    }

    getTrackerUsers(trackerId: number) : TrackerResponseInteface {
        const tracker = this.findTracker(trackerId);
        if (tracker && tracker.users && tracker.users.length >= 0) {
            return this.createResponse(GET_TRACKER_USERS, 200, { data: { trackerId: trackerId, users: tracker.users }});
        } else {
            return this.createResponse(GET_TRACKER_USERS, 500, { error: "No users in tracker" });
        }
    }

    // Web Service test
    sendMessage(fromUserId: number, toUserId: number, message: string, res: Express.Response) {
        // TODO: Update
        // const controller : SocketController = new SocketController()
        // const socket = controller.getWsForUserId(toUserId);
        // const msg = this.createResponse(SEND_MESSAGE,200, message);
        // socket.send(JSON.stringify(msg));
        // res.status(200).send("SUCCESS");
    }

    init(res: Express.Response) {
        res.status(200).send();
    }
}

export default CombatTracker;