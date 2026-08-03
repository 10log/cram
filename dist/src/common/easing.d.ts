export declare const EasingFunctions: {
    /**
     * no easing, no acceleration
     */
    linear: (t: number) => number;
    /**
     *accelerating from zero velocity
     */
    easeInQuad: (t: number) => number;
    /**
     *decelerating to zero velocity
     */
    easeOutQuad: (t: number) => number;
    /**
     *acceleration until halfway, then deceleration
     */
    easeInOutQuad: (t: number) => number;
    /**
     *accelerating from zero velocity
     */
    easeInCubic: (t: number) => number;
    /**
     *decelerating to zero velocity
     */
    easeOutCubic: (t: number) => number;
    /**
     * acceleration until halfway, then deceleration
     */
    easeInOutCubic: (t: number) => number;
    /**
     * accelerating from zero velocity
     */
    easeInQuart: (t: number) => number;
    /**
     * decelerating to zero velocity
     */
    easeOutQuart: (t: number) => number;
    /**
     * acceleration until halfway, then deceleration
     */
    easeInOutQuart: (t: number) => number;
    /**
     *  accelerating from zero velocity
     */
    easeInQuint: (t: number) => number;
    /**
     * decelerating to zero velocity
     */
    easeOutQuint: (t: number) => number;
    /**
     * acceleration until halfway, then deceleration
     */
    easeInOutQuint: (t: number) => number;
};
export default EasingFunctions;
