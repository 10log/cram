export declare function dirinterp(desiredPhi: number, desiredTheta: number, dirPoint1: dirDataPoint, dirPoint2: dirDataPoint, dirPoint3: dirDataPoint, dirPoint4: dirDataPoint): number;
export interface dirDataPoint {
    phi: number;
    theta: number;
    directivity: number;
}
