import { use, useEffect, useState } from "react";
import { ModalContext } from "../context/ModalContext";

let nextTooltipId = 1;
function getNextTooltipId() {
  return String(nextTooltipId++);
}

export function useTooltip(
  render: (target: Element) => React.ReactNode,
): string {
  const { setTooltip } = use(ModalContext);
  const [id] = useState(() => getNextTooltipId());

  useEffect(() => {
    setTooltip(id, render);

    return () => {
      setTooltip(id, null);
    };
  }, [id, render, setTooltip]);

  return id;
}
