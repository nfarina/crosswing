import { useEffect, useState } from "react";

export function useDocumentVisible(): boolean {
  const [visible, setVisible] = useState(!document.hidden);

  useEffect(() => {
    function handleVisibilityChange() {
      setVisible(!document.hidden);
    }

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return visible;
}
