import Debug from "debug";
import { MutableRefObject, useState } from "react";
import { ElementSize, useElementSize } from "./useElementSize.js";

const debug = Debug("components:ResponsiveLayout");

export interface ResponsiveLayouts {
  [key: string]: {
    minWidth?: number | null;
    minHeight?: number | null;
  };
}

export function useResponsiveLayout<L extends ResponsiveLayouts>(
  ref: MutableRefObject<HTMLElement | null>,
  layouts: L,
): keyof L {
  const [bestLayout, setBestLayout] = useState<keyof L | null>(null);

  useElementSize(ref, ({ width, height }) => {
    if (width === 0 || height === 0) {
      debug("Element size is zero; skipping layout.");
      return;
    }

    const newBestLayout = getBestLayout({ width, height });
    if (newBestLayout !== bestLayout) {
      debug(`Setting new best layout to ${String(newBestLayout)}`);
      setBestLayout(newBestLayout);
    }
  });

  function getBestLayout({ width, height }: ElementSize): keyof L | null {
    let bestSpecificity = -1;
    let bestLayout: keyof L | null = null;

    for (const [key, layout] of Object.entries(layouts)) {
      const { minWidth, minHeight } = layout;
      if (minWidth != null && width != null && width < minWidth) {
        continue;
      }
      if (minHeight != null && height != null && height < minHeight) {
        continue;
      }
      const specificity =
        (minWidth != null ? 1 : 0) + (minHeight != null ? 1 : 0);
      if (specificity > bestSpecificity) {
        bestLayout = key;
        bestSpecificity = specificity;
      }
    }

    debug("Best layout is", bestLayout);

    return bestLayout;
  }

  return bestLayout ?? Object.keys(layouts)[0];
}
