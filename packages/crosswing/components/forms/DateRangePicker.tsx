import { lazy, useState } from "react";
import { NavLayout } from "../../router/navs/NavLayout.js";
import { DateRange } from "./DateRange.js";
import type { DateRangeValueType } from "./DateRangeControl.js";

const DateRangeControl = lazy(() => import("./DateRangeControl"));

export default function DateRangePicker({
  defaultRange,
  onDateSelected,
  onClose,
}: {
  defaultRange: DateRange | null;
  onDateSelected?: (newValue: DateRange | null) => void;
  onClose: () => void;
}) {
  const [draftRange, setDraftRange] = useState<DateRange | null>(defaultRange);

  function saveAndClose() {
    onDateSelected?.(draftRange);
    onClose();
  }

  function onInnerValueChange(
    newValue: DateRange | null,
    type?: DateRangeValueType,
  ) {
    setDraftRange(newValue);

    if (type === "preset" || type === "custom") {
      onDateSelected?.(newValue);
      onClose();
    }
  }

  return (
    <NavLayout
      title="Date Range"
      left={{ title: "Cancel", onClick: onClose, back: true }}
      right={{
        title: "Done",
        onClick: saveAndClose,
      }}
    >
      <DateRangeControl
        value={draftRange}
        onValueChange={onInnerValueChange}
        // hidePresets
      />
    </NavLayout>
  );
}
