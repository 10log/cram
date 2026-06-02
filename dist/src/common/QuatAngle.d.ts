import { Vector3, Quaternion } from 'three';
declare function quat2angle(quat: Quaternion): QuatAngle;
declare function angle2quat(quatAngle: QuatAngle): Quaternion;
declare class QuatAngle {
    private _angle;
    vector: Vector3;
    /**
     *
     * @param angle {number} angle
     * @param vector {Vector3} vector
     */
    constructor(angle?: number, vector?: Vector3);
    toQuaternion(): Quaternion;
    fromQuaternion(quat: Quaternion): this;
    get i(): number;
    set i(val: number);
    get j(): number;
    set j(val: number);
    get k(): number;
    set k(val: number);
    get angle(): number;
    set angle(newAngle: number);
}
export { quat2angle, angle2quat, QuatAngle };
export default QuatAngle;
