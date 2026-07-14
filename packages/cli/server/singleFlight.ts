/**
 * Coalesces concurrent calls so they share one in-flight operation. Once that
 * operation settles, the next call starts a fresh one.
 */
export function singleFlight<T>(operation: () => Promise<T>): () => Promise<T> {
  let inFlight: Promise<T> | null = null;

  return () => {
    if (!inFlight) {
      inFlight = operation().finally(() => {
        inFlight = null;
      });
    }

    return inFlight;
  };
}
