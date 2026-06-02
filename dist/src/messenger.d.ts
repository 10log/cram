export type EventHandler = (...args: unknown[]) => void;
declare global {
    type EventWithPayload<T> = {
        payload: T;
        meta: any;
    };
    interface EventTypes {
        TEST_MESSAGE: [string];
    }
}
export default class Messenger {
    static postMessage(_arg0: string): void;
    private dictionary;
    private messageListeners;
    private events;
    lastMessage: string;
    constructor();
    addMessageHandler(message: string, handler: EventHandler): string[];
    removeMessage(message: string): void;
    removeMessageHandler(message: string, id: string): void;
    postMessage(message: string, ...args: unknown[]): any[];
    before<T extends keyof EventTypes>(event: T, callback: (e: EventTypes[T]) => void): () => void;
    on<T extends keyof EventTypes>(event: T, callback: (e: EventTypes[T]) => void): () => void;
    after<T extends keyof EventTypes>(event: T, callback: (e: EventTypes[T]) => void): () => void;
    emit<T extends keyof EventTypes>(event: T, payload?: EventTypes[T]): void;
    addMessageListener(callback: EventHandler): void;
    removeMessageListener(id: string): void;
    /**
     * Clear all handlers and events.
     * Use this when disposing of the messenger.
     */
    clear(): void;
}
/**
 * Factory function to create a new Messenger instance
 */
export declare function createMessenger(): Messenger;
export declare const messenger: Messenger;
export declare const emit: Messenger["emit"];
export declare const before: Messenger["before"];
export declare const on: Messenger["on"];
export declare const after: Messenger["after"];
export declare const postMessage: Messenger["postMessage"];
export declare const addMessageHandler: Messenger["addMessageHandler"];
export declare const removeMessageHandler: Messenger["removeMessageHandler"];
