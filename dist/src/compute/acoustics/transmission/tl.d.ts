type dB = number;
/**
 * @interface TLArgs Args to TL function
 */
interface TLArgs {
    /**
     * @property {tau} number Transmission Coefficient (dB)
     */
    tau?: number;
    /**
     * @property {NR} number Noise Reduction in (dB) (i.e. Lsource-Lreciever)
     */
    NR?: number;
    /**
     * @property {area} number surface area of test wall (m^2)
     */
    area?: number;
    /**
     *  @property {absorption} number total absorption of reciever room (sabins)
     */
    absorption?: number;
    /**
     * @property {m} number surface density of wall (density * thickness) (if metric, specify the units "metric")
     */
    m?: number;
    /**
     * @property {f} number frequency
     */
    f?: number;
    /**
     * @property {units} string can be either "english" or "metric"
     */
    units?: string;
}
export declare function TL(args: TLArgs): dB;
export {};
