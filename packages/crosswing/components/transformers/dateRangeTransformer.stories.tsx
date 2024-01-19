import dayjs from "dayjs";
import { CrosswingAppDecorator } from "../../storybook";
import { Button } from "../Button";
import { formatDateRange } from "../forms/DateRange";
import { TextInput } from "../forms/TextInput";
import { useInputValue } from "../forms/useInputValue";
import { dateRangeTransformer } from "./dateRangeTransformer";
import { TransformerDecorator } from "./storybook";

export default {
  component: dateRangeTransformer, // Just for the title.
  decorators: [CrosswingAppDecorator({ width: "wide" }), TransformerDecorator],
  parameters: { layout: "centered" },
};

export const Default = () => {
  const range = useInputValue({
    transformer: dateRangeTransformer(),
  });

  return (
    <>
      <TextInput placeholder="Ex: 2/1/2020 - 2/15/2020" {...range.props} />
      <Button
        children="Reset Value to 1/1/1980 - 2/15/1980"
        onClick={() =>
          range.set({
            start: dayjs("1/1/1980Z").valueOf(),
            end: dayjs("2/15/1980Z").valueOf(),
          })
        }
      />
      <pre>
        Parsed: {JSON.stringify(range.value)}
        <br />({formatDateRange(range.value)})<br />
        Error: {range.error?.message ?? ""}
      </pre>
    </>
  );
};
