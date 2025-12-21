import examples, { Example } from ".";
import { on, emit } from "../messenger";
import { SaveState, useAppStore } from "../store";


declare global {
  interface EventTypes {
    OPEN_EXAMPLE: Example
  }
}

on("OPEN_EXAMPLE", (example) => {
  const { hasUnsavedChanges } = useAppStore.getState();

  // Skip warning if no unsaved changes
  if (hasUnsavedChanges) {
    const confirmed = confirm("Open an example? Unsaved data will be lost.");
    if (!confirmed) {
      return;
    }
  }

  const json = examples[example] as SaveState;
  emit("RESTORE", { json });
})