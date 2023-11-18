import { useState } from "react";
import { NavLayout } from "../../router/navs/NavLayout";
import { DateRange } from "./DateRange";

import DateRangeControl from "./DateRangeControl";

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
