import { useHostStatusBar } from "@cyber/host";
import { useEffect } from "react";

export const StatusBarStyleAttribute = (style: "light" | "default") => ({
  "data-status-bar-style": style,
});

/**
 * Automatically adjusts the system status bar on supported devices based on
 * which <Nav> is currently visible.
 */
export function useAutoStatusBar() {
  const statusBar = useHostStatusBar();

  useEffect(() => {
    if (!statusBar) return;

    const observeMutations = () => {
      const elements = document.body.querySelectorAll(
        "*[data-status-bar-style]",
      );

      let topElement: Element | null = null;

      // Iterate in the reverse order so that we find the topmost element.
      for (const element of Array.from(elements).reverse()) {
        if (element instanceof HTMLElement) {
          // Use the client rect as a proxy for whether the element is actually
          // visible.
          const rect = element.getBoundingClientRect();
          if (rect.width <= 0 && rect.height <= 0) {
            continue;
          }

          topElement = element;
          break;
        }
      }

      if (topElement) {
        const style = topElement.getAttribute("data-status-bar-style");
        statusBar.setLight(style === "light");
      }
    };

    const observer = new MutationObserver(observeMutations);
    observer.observe(document.body, {
      childList: true,
      attributes: true,
      subtree: true,
    });

    return () => observer.disconnect();
  }, []);
}
