/**
 * Merges two or more JSON-like objects. Assumes no circular references, and no
 * non-leaf arrays.
 */
export function merge<T>(...objects: [T?, ...DeepPartial<T>[]]): T {
  let merged: T = {} as any;

  for (const objectOrNull of objects) {
    // Allow merging into null/undefined.
    const object = objectOrNull ?? {};

    if (isObject(object)) {
      for (const [key, value] of Object.entries(object)) {
        const existing = merged[key];
        if (isObject(existing) && isObject(value)) {
          merged[key] = merge(existing, value);
        } else if (value === merge.delete) {
          delete merged[key];
        } else if (isObject(value)) {
          merged[key] = merge(value); // Deep copy.
        } else if (Array.isArray(value)) {
          // Clone all elements; we don't merge arrays.
          merged[key] = JSON.parse(JSON.stringify(value));
        } else {
          merged[key] = value; // Primitive.
        }
      }
    } else {
      // We can't merge non-objects, so just overwrite them.
      merged = object as T;
    }
  }

  return merged;
}

export type DeepPartial<T> = {
  [P in keyof T]?: DeepPartial<T[P]>;
};

/**
 * A special token you can pass as the value to a merged object to delete the
 * contents of a key if it existed in the original object. Typed as `any` so you
 * can use it as a stub for properties that were expected to exist on an object.
 */
merge.delete = Symbol("merge.delete") as any;

function isObject(val: any): val is Record<string, any> {
  // This returns true for things like classes (for instance, new URL()), which
  // can't be "merged".
  // return typeof val === "object" && !Array.isArray(val) && val !== null;

  // From https://stackoverflow.com/questions/65787971/ways-to-determine-if-something-is-a-plain-object-in-javascript#comment135220631_69745650
  return val && [undefined, Object].includes(val.constructor);
}
