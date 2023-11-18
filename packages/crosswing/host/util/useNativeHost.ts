import { useContext } from "react";
import { HostContext } from "../context/HostContext";
import { HostContextValue } from "./types";

export function useNativeHost(): HostContextValue {
  return useContext(HostContext);
}
