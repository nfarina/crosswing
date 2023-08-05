import { useContext } from "react";
import { HostContext } from "../context/HostContext.js";
import { HostContextValue } from "./types.js";

export function useNativeHost(): HostContextValue {
  return useContext(HostContext);
}
