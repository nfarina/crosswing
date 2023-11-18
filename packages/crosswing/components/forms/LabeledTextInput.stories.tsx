import { useState } from "react";
import { CrosswingAppDecorator } from "../../theme/storybook";
import { SeparatorDecorator } from "../SeparatorLayout";
import { LabeledTextInput } from "./LabeledTextInput";

export default {
  component: LabeledTextInput,
  decorators: [SeparatorDecorator, CrosswingAppDecorator({ width: "wide" })],
  parameters: { layout: "centered" },
};

export const Empty = () => {
  const [name, setName] = useState("");
  return <LabeledTextInput label="Name" value={name} onValueChange={setName} />;
};

export const WithPlaceholder = () => {
  const [name, setName] = useState("");

  return (
    <LabeledTextInput
      label="Name"
      placeholder={'Ex: "Kitchen Remodel"'}
      value={name}
      onValueChange={setName}
    />
  );
};

export const WithValue = () => {
  const [name, setName] = useState("Nick Farina");

  return <LabeledTextInput label="Name" value={name} onValueChange={setName} />;
};

export const Disabled = () => (
  <LabeledTextInput label="Name" value="Nick Farina" disabled />
);

export const WithoutLabel = () => {
  const [name, setName] = useState("Nick Farina");

  return <LabeledTextInput value={name} onValueChange={setName} />;
};
