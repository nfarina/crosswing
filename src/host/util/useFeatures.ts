import { useEffect, useState } from "react";
import { getFeatures } from "./ipc";
import { HostFeatures } from "./types";

// Returns the HostFeatures for our containing host, or undefined if
// we don't know yet and will soon.
export function useFeatures(): HostFeatures | undefined {
  const [features, setFeatures] = useState<HostFeatures>();

  useEffect(() => {
    getFeatures().then(setFeatures);
  }, []);

  return features;
}
