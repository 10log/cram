import { default as Messenger } from '../messenger';
import { Cram } from '../index';
/**
 * Register all message handlers on the given messenger instance.
 *
 * @param cram - The Cram state object
 * @param messengerInstance - The Messenger instance to register handlers on (defaults to singleton)
 */
export declare function registerMessageHandlers(cram: Cram, messengerInstance?: Messenger): void;
