import { default as React } from 'react';
/**
 * Parse the text of a numeric input. Returns null for anything that is not a
 * finite number yet — "", "-", ".", "-." and "1e" are all mid-typing states.
 */
export declare function parseNumberDraft(text: string): number | null;
/**
 * Controlled numeric input that keeps what the user typed (#90).
 *
 * Driving `value` straight from the store rewrote the field on every keystroke
 * that did not parse, so a leading "-" (or an emptied field) was wiped at once.
 * While the user is typing, the field shows their text instead; every edit that
 * parses is committed straight away, and blur / Enter / Escape (or a
 * `clearDraft()` from e.g. a wheel step) drops the draft so the field shows the
 * stored value again.
 */
export declare function useNumberDraft(value: number, commit: (value: number) => void): {
    text: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onBlur: () => void;
    onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
    clearDraft: () => void;
};
export default useNumberDraft;
