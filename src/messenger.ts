import { KeyValuePair } from "./common/key-value-pair";
import { v4 as uuid } from 'uuid';

export type EventHandler = (...args) => void;

declare global {
    type EventWithPayload<T> = {
        payload: T,
        meta: any
    }
    interface EventTypes {
        TEST_MESSAGE: [string];
    }
};



type EventHandlers =  {
    [key in keyof EventTypes]: {
        before: Set<any>;
        on: Set<any>;
        after: Set<any>;
    }
};

export default class Messenger{
    static postMessage(_arg0: string) {
      throw new Error("Method not implemented.");
    }
    private dictionary: KeyValuePair<KeyValuePair<EventHandler>>;
    private messageListeners: KeyValuePair<EventHandler>;
    private events: EventHandlers;
    lastMessage: string;
    constructor() {
        this.dictionary = {};
        this.messageListeners = {};
        this.events = {} as EventHandlers;
        this.lastMessage = "";
    }
    addMessageHandler(message: string, handler: EventHandler): string[] {
        const id = uuid();
        if (!this.dictionary[message]) {
            this.dictionary[message] = {
                [id]: handler
            }
            return [message, id];
        } else {
            this.dictionary[message][id] = handler;
            return [message, id];
        }
    }
    removeMessage(message: string) {
        if (this.dictionary[message]) {
            delete this.dictionary[message];
        }
    }
    removeMessageHandler(message: string, id: string) {
        if (this.dictionary[message][id]) {
            delete this.dictionary[message][id];
        }
    }
    postMessage(message: string, ...args) {
        if (message !== this.lastMessage) {
            this.lastMessage = message;
        }
        // if message exists
        if (this.dictionary[message]) {
            // accumulates the results of each handler
            let accumulator = [] as any[];
            
            // for each message handler
            Object.keys(this.dictionary[message]).forEach(key => {
                // call the message handler with the acculated results and the original arguments
                const results = this.dictionary[message][key](accumulator, ...args);
                accumulator.push(results);
            })
            return accumulator;
        }
        return [] as any[];
    }
    before<T extends keyof EventTypes>(event: T, callback: (e: EventTypes[T]) => void) {
        if(!this.events[event]){
            this.events[event] = {
                before: new Set(),
                on: new Set(),
                after: new Set()
            };
        } 
        this.events[event].before.add(callback);
        return (() => {
            this.events[event].before.delete(callback);
        }) as () => void;
    }
    on<T extends keyof EventTypes>(event: T, callback: (e: EventTypes[T]) => void) {
        if(!this.events[event]){
            this.events[event] = {
                before: new Set(),
                on: new Set(),
                after: new Set()
            };
        } 
        this.events[event].on.add(callback);
        return (() => {
            this.events[event].on.delete(callback);
        }) as () => void;
    }
    after<T extends keyof EventTypes>(event: T, callback: (e: EventTypes[T]) => void) {
        if(!this.events[event]){
            this.events[event] = {
                before: new Set(),
                on: new Set(),
                after: new Set()
            };
        } 
        this.events[event].after.add(callback);
        return (() => {
            this.events[event].after.delete(callback);
        }) as () => void;
    }

    emit<T extends keyof EventTypes>(event: T, payload?: EventTypes[T]) {
        if(!this.events[event]) return;
        
        if(this.events[event].before.size > 0){
            for(const handler of this.events[event].before){
                const handlerResult = handler(payload);
                if(typeof handlerResult !== "undefined" && !handlerResult){
                    return;
                }
            }
        }
        
        for(const handler of this.events[event].on){
            const handlerResult = handler(payload);
            if(typeof handlerResult !== "undefined" && !handlerResult){
                break;
            }
        }
        
        if(this.events[event].after.size > 0){
            for(const handler of this.events[event].after){
                const handlerResult = handler(payload);
                if(typeof handlerResult !== "undefined" && !handlerResult){
                    break;
                }
            }
        }
    }
    addMessageListener(callback: EventHandler) {
        const id = uuid();
        this.messageListeners[id] = callback;
    }
    removeMessageListener(id) {
        if (this.messageListeners[id]) {
            delete this.messageListeners[id];
        }
    }

    /**
     * Clear all handlers and events.
     * Use this when disposing of the messenger.
     */
    clear() {
        // Clear all message handlers
        this.dictionary = {};
        this.messageListeners = {};

        // Clear all typed events
        for (const event of Object.keys(this.events) as Array<keyof EventTypes>) {
            if (this.events[event]) {
                this.events[event].before.clear();
                this.events[event].on.clear();
                this.events[event].after.clear();
            }
        }
        this.events = {} as EventHandlers;
        this.lastMessage = "";

        console.log('[Messenger] Cleared all handlers');
    }
}

/**
 * Factory function to create a new Messenger instance
 */
export function createMessenger(): Messenger {
    return new Messenger();
}

// Default singleton for standalone mode
export const messenger = new Messenger();
export const emit = messenger.emit.bind(messenger) as Messenger['emit'];
export const before = messenger.before.bind(messenger) as Messenger['before'];
export const on = messenger.on.bind(messenger) as Messenger['on'];
export const after = messenger.after.bind(messenger) as Messenger['after'];

export const postMessage = messenger.postMessage.bind(messenger) as Messenger['postMessage'];
export const addMessageHandler = messenger.addMessageHandler.bind(messenger) as Messenger['addMessageHandler'];
export const removeMessageHandler = messenger.removeMessageHandler.bind(messenger) as Messenger['removeMessageHandler'];