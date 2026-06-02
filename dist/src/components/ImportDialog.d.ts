export declare const ACCEPTED_FILE_TYPES: string[];
export declare enum DROP_ALLOWED {
    NO = 0,
    IDK = 1,
    YES = 2
}
export interface FileWithCheckbox {
    file: File;
    checked: boolean;
}
export default function ImportDialog(): import("react/jsx-runtime").JSX.Element;
declare global {
    interface EventTypes {
        SHOW_IMPORT_DIALOG: boolean;
    }
}
