/**
 * @interface NRARgs Args to NR function
 */
interface NRArgs {
    /**
     * @property {TL} number Transmission Loss between two spaces
     */
    TL?: number;
    /**
     * @property {absorption} number Transmission Loss between two spaces
     */
    absorption?: number;
    /**
     * @property {area} number surface area of target
     */
    area?: number;
    /**
     *  @property {Lsource} number Source sound pressure level
     */
    Lsource?: number;
    /**
     * @property {Lreciever} number Reciever sound pressure level
     */
    Lreciever?: number;
}
/**
 * @description Returns the noise reduction between two spaces
 * @param {} args function arguments
 */
export declare function NR(args: NRArgs): number;
export {};
