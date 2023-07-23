import { createContext, MutableRefObject, useContext } from "react";

export interface ToolbarContextValue {
  /** Ref to one of any <ToolbarInsertionPoint> children. */
  getInsertionRef(name: string): ToolbarInsertionRef;
  /** For any <ToolbarInsertionPoint> children. */
  setInsertionRef(name: string, insertionRef: ToolbarInsertionRef): void;
}

export type ToolbarRef = MutableRefObject<HTMLDivElement | null>;
export type ToolbarInsertionRef = MutableRefObject<HTMLDivElement | null>;

export const ToolbarContext = createContext<ToolbarContextValue>({
  getInsertionRef() {
    throw new Error(
      "Cannot get ToolbarInsertionPoint refs without a parent <ToolbarLayout>.",
    );
  },
  setInsertionRef() {},
});

export function useToolbar(): ToolbarContextValue {
  return useContext(ToolbarContext);
}
