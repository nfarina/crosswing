import dayjs from "dayjs";
import { CrosswingAppDecorator } from "../../storybook";
import { Button } from "../Button";
import { TextInput } from "../forms/TextInput";
import { useInputValue } from "../forms/useInputValue";
import { dateTransformer } from "./dateTransformer";
import { TransformerDecorator } from "./storybook";

export default {
  component: dateTransformer, // Just for the title.
  decorators: [CrosswingAppDecorator({ width: "wide" }), TransformerDecorator],
  parameters: { layout: "centered" },
};

export const Default = () => {
  const date = useInputValue({
    transformer: dateTransformer(),
  });

  return (
    <>
      <TextInput placeholder="Ex: 12/1/1979" {...date.props} />
      <Button
        children="Reset Value to 1/1/1980"
        onClick={() => date.set(dayjs("1/1/1980Z").valueOf())}
      />
      <pre>{`Parsed: ${date.value} (${date.value ? dayjs(date.value).format("M/D/YYYY") : ""}) - Error: ${date.error?.message ?? ""}`}</pre>
    </>
  );
};
