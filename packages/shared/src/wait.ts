// Declare a cross-platform version of this.
declare function setTimeout(callback: () => void, ms: number): number;

// We cache calling process.env because it's surprisingly expensive.
const isTest = process.env.NODE_ENV === "test";

/*
 * Returns a Promise that waits for the given number of milliseconds
 * (via setTimeout), then resolves.
 */
export async function wait(ms: number = 0): Promise<void> {
  // Don't wait when running tests!
  if (isTest) return;

  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

// Returns a Promise that never resolves.
export async function waitForever(): Promise<never> {
  return new Promise(() => {});
}