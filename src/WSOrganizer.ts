/*
    This class servers serveral purposes
    1. It contains a WebSocket
    2. It holds meta data associated with a WebSocket
    3. It manages subscriptions and sends messages to allow the app
        to iterate over a list of these objects, calling a method and
        sending a message on all of the websockets that are part of 
        the subscription

export interface WebSocketItemInterface {
  id: number;
  ws: WebSocket;
  userId: number;
  userName: string;
}        
*/

import { Socket } from "socket.io";


export interface WSOrganizerInterface {
    id: number;
    // ws: WebSocket;
    ws: Socket;
    userId: number;
    userName: string;
    subscriptions: Array<string>;

    subscribe(subscriptionName: string) : void;
    unsubscribe(subscriptionName: string) : void;
    sendMessage(message: string) : void;
    checkAndSend(subscriptionName: string, message: string) : void;
};


export class WSOrganizer implements WSOrganizerInterface{
    id: number;
    // ws: WebSocket;
    ws: Socket;
    userId: number;
    userName: string;
    subscriptions: Array<string> = [];
    static nextId: number = 1;

    // constructor(ws: WebSocket, userId: number, userName: string) {
    constructor(ws: Socket, userId: number, userName: string) {        
        this.id = WSOrganizer.nextId++;
        this.ws = ws;
        this.userId = userId;
        this.userName = userName;
    }

    subscribe(subscriptionName: string) {
        if (!this.subscriptions.includes(subscriptionName)) {
            this.subscriptions.push(subscriptionName);
        }
    }

    unsubscribe(subscriptionName: string) {
        let newSubscriptions = this.subscriptions.filter(subscription => {
            subscription !== subscriptionName;
        });
        this.subscriptions = newSubscriptions;
    }

    sendMessage(message: string) {
        this.ws.send(message);
    }

    checkAndSend(subscriptionName: string, message: string) {
        if (this.subscriptions.includes(subscriptionName)) {
            this.ws.send(message);
        }
    }

}
