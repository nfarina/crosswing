import { NavLayout } from "@cyber/router/navs/NavLayout.js";
import React, { useState } from "react";
import { DateRange } from "./DateRange.js";
import { DateRangeControl } from "./DateRangeControl.js";

export function DateRangePicker({
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

  function onInnerValueChange(newValue: DateRange | null, isPreset?: boolean) {
    setDraftRange(newValue);

    if (isPreset) {
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
