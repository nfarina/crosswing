import dayjs from "dayjs";
import { lazy } from "react";
import { styled } from "styled-components";
import { useMatchMedia } from "../../hooks/useMatchMedia";
import DisclosureArrow from "../../icons/DisclosureArrow.svg?react";
import DownArrow from "../../icons/DownArrow.svg?react";
import { PopupView } from "../../modals/popup/PopupView";
import { usePopup } from "../../modals/popup/usePopup";
import { useSheet } from "../../modals/sheet/useSheet";
import { fonts } from "../../theme/fonts/fonts";
import { Button } from "../Button";
import {
  AllDateRangePresets,
  DateRange,
  areDateRangesEqual,
} from "./DateRange";

const DateRangeControl = lazy(() => import("./DateRangeControl"));
const DateRangePicker = lazy(() => import("./DateRangePicker"));

export function DateRangeInput({
  value,
  onValueChange,
  ...rest
}: Omit<Parameters<typeof Button>[0], "value"> & {
  value: DateRange | null;
  onValueChange: (newValue: DateRange | null) => void;
}) {
  // Use a Popup for desktop layouts with lots of space.
  const popup = usePopup(() => (
    <PopupView>
      <DateRangeControl
        value={value}
        onValueChange={(newValue, isPreset) => {
          onValueChange(newValue);
          if (isPreset) {
            popup.hide();
          }
        }}
      />
    </PopupView>
  ));

  // Use a sheet for mobile layouts.
  const sheet = useSheet(() => (
    <DateRangePicker
      onClose={sheet.hide}
      defaultRange={value}
      onDateSelected={onValueChange}
    />
  ));

  const mobileLayout = useMatchMedia("(max-width: 500px)");

  function renderTitle() {
    // Does the value match one of the presets?
    for (const preset of AllDateRangePresets) {
      if (areDateRangesEqual(preset.range(), value)) {
        return preset.title;
      }
    }

    if (!value) {
      return "All Dates";
    }

    // A whole year?
    if (
      value.start === dayjs(value.start).startOf("year").valueOf() &&
      value.end === dayjs(value.start).endOf("year").valueOf()
    ) {
      return dayjs(value.start).format("YYYY");
    }

    // A whole month?
    if (
      value.start === dayjs(value.start).startOf("month").valueOf() &&
      value.end === dayjs(value.start).endOf("month").valueOf()
    ) {
      return dayjs(value.start).format("MMMM YYYY");
    }

    const from = dayjs(value.start).format("MMM D, YYYY");
    const to = dayjs(value.end).format("MMM D, YYYY");

    if (from === to) {
      return from;
    } else {
      return `${from} – ${to}`;
    }
  }

  return (
    <StyledDateRangeInput
      data-is-open={!!popup.visible}
      children={
        <>
          {/* We use a special class to cause our popup to position itself at a
              consistent location, since our button changes in size as you
              interact with the popup. Otherwise the popup would shift around,
              constantly trying to be in the middle of the button. */}
          <span className="popup-target" />
          {renderTitle()} {mobileLayout ? <DisclosureArrow /> : <DownArrow />}
        </>
      }
      onClick={mobileLayout ? sheet.show : popup.onClick}
      {...rest}
    />
  );
}

export const StyledDateRangeInput = styled(Button)`
  font: ${fonts.displayMedium({ size: 15, line: "1" })};
  position: relative;

  > .popup-target {
    position: absolute;
    left: 58px;
    bottom: 0;
  }

  > svg {
    transform: translateX(6px);
    /* Turns out this animation is just distracting. */
    /* transition: transform 0.2s; */
  }

  &[data-is-open="true"] > svg {
    transform: translate(6px, -1px) rotate(-180deg);
  }
`;
