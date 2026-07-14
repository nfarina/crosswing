import { useSyncExternalStore } from "react";

export function useDocumentVisible(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

function subscribe(onStoreChange: () => void) {
  document.addEventListener("visibilitychange", onStoreChange);

  return () => {
    document.removeEventListener("visibilitychange", onStoreChange);
  };
}

function getSnapshot() {
  return !document.hidden;
}

function getServerSnapshot() {
  return true;
}
