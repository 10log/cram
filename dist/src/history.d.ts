export interface Directions {
    UNDO: "UNDO";
    REDO: "REDO";
}
export interface MomentProps {
    recallFunction: (direction?: keyof Directions, ...args: unknown[]) => void;
    objectId: string;
    category: string;
}
export declare class Moment {
    uuid: string;
    objectId: string;
    category: string;
    timestamp: number;
    recallFunction: (direction?: keyof Directions, ...args: unknown[]) => void;
    constructor(props: MomentProps);
}
export declare class History {
    timeline: Moment[];
    currentIndex: number;
    constructor();
    addMoment(params: MomentProps): void;
    undo(): void;
    redo(): void;
    recall(direction: keyof Directions): void;
    clear(): void;
    get canUndo(): boolean;
    get canRedo(): boolean;
}
export declare const history: History;
export declare const addMoment: (params: MomentProps) => void;
export interface Undoable {
    /** Undoes the command */
    undo(): void;
    /** Redoes the undone command */
    redo(): void;
}
export declare class UndoHistory {
    /** The undoable objects. */
    private readonly undos;
    /** The redoable objects. */
    private readonly redos;
    /** The maximal number of undo. */
    private sizeMax;
    constructor();
    /** Adds an undoable object to the collector. */
    add(undoable: Undoable): void;
    private clearRedo;
    /** Undoes the last undoable object. */
    undo(): void;
    /** Redoes the last undoable object. */
    redo(): void;
}
type TextData = {
    text: string;
};
export declare class ClearTextCmd implements Undoable {
    private text;
    private memento;
    constructor(text: TextData);
    execute(): void;
    undo(): void;
    redo(): void;
}
export {};
