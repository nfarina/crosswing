import { describe, expect, it, vi } from "vitest";
import { singleFlight } from "./singleFlight.js";

describe("singleFlight", () => {
  it("shares an in-flight operation and starts a new one after it settles", async () => {
    let resolve!: (value: number) => void;
    const operation = vi.fn(
      () =>
        new Promise<number>((done) => {
          resolve = done;
        }),
    );
    const run = singleFlight(operation);

    const first = run();
    const second = run();

    expect(second).toBe(first);
    expect(operation).toHaveBeenCalledTimes(1);

    resolve(42);
    await expect(first).resolves.toBe(42);

    const third = run();
    expect(third).not.toBe(first);
    expect(operation).toHaveBeenCalledTimes(2);
  });

  it("allows a retry after an operation rejects", async () => {
    const operation = vi
      .fn<() => Promise<number>>()
      .mockRejectedValueOnce(new Error("nope"))
      .mockResolvedValueOnce(42);
    const run = singleFlight(operation);

    await expect(run()).rejects.toThrow("nope");
    await expect(run()).resolves.toBe(42);
    expect(operation).toHaveBeenCalledTimes(2);
  });
});
