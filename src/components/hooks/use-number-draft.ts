import React, { useCallback, useState } from "react";

/**
 * Parse the text of a numeric input. Returns null for anything that is not a
 * finite number yet — "", "-", ".", "-." and "1e" are all mid-typing states.
 */
export function parseNumberDraft(text: string): number | null {
  const t = text.trim();
  if (t === "") return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

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
export function useNumberDraft(value: number, commit: (value: number) => void) {
  const [draft, setDraft] = useState<string | null>(null);

  const onChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const text = e.currentTarget.value;
      setDraft(text);
      const n = parseNumberDraft(text);
      if (n !== null) commit(n);
    },
    [commit]
  );

  const clearDraft = useCallback(() => setDraft(null), []);

  const onKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === "Escape") setDraft(null);
  }, []);

  return {
    text: draft ?? String(value),
    onChange,
    onBlur: clearDraft,
    onKeyDown,
    clearDraft,
  };
}

export default useNumberDraft;
