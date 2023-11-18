import { Meta } from "@storybook/react";
import { useState } from "react";
import { styled } from "styled-components";
import { colors } from "../../colors/colors";
import { fonts } from "../../fonts/fonts";
import { CrosswingAppDecorator } from "../../storybook";
import { Button } from "../Button";
import { StyledTextInput, TextInput } from "./TextInput";

export default {
  component: TextInput,
  decorators: [
    CrosswingAppDecorator({ width: "wide" }),
    (Story: () => any) => <Container children={<Story />} />,
  ],
  parameters: { layout: "centered" },
} satisfies Meta<typeof TextInput>;

export const AutoTrimDemo = () => {
  const [value, setValue] = useState("");

  return (
    <>
      <TextInput
        placeholder="Display Name"
        value={value}
        onValueChange={setValue}
      />
      <Button
        children="Reset Value to 'Blue '"
        onClick={() => setValue("Blue ")}
      />
      <pre>TextInput Value: "{value}"</pre>
    </>
  );
};

export const WithPlaceholder = () => {
  const [name, setName] = useState("");

  return (
    <TextInput
      placeholder={'Ex: "Kitchen Remodel"'}
      value={name}
      onValueChange={setName}
    />
  );
};

export const WithValue = () => {
  const [name, setName] = useState("John Smith");

  return <TextInput value={name} onValueChange={setName} />;
};

export const WithErrorColorOnly = () => {
  const [text, setText] = useState("Forty");

  return (
    <TextInput
      value={text}
      onValueChange={setText}
      error={new Error("Invalid Number")}
      errorStyle="color"
    />
  );
};

export const WithError = () => {
  const [text, setText] = useState("Forty");

  return (
    <TextInput
      value={text}
      onValueChange={setText}
      error={new Error("Invalid Number")}
    />
  );
};

export const WithLongError = () => {
  const [name, setName] = useState("Bob");

  return (
    <TextInput
      value={name}
      onValueChange={setName}
      error={new Error("Name must be at least 10 characters long.")}
    />
  );
};

export const Disabled = () => <TextInput value="John Smith" disabled />;

const Container = styled.div`
  display: flex;
  flex-flow: column;

  > ${StyledTextInput} {
    /* Make it stand out in Storybook against the background. */
    border: 1px solid ${colors.separator()};
    border-radius: 6px;

    > input {
      padding: 10px;
    }
  }

  > pre {
    color: ${colors.textSecondary()};
    font: ${fonts.displayMono({ size: 14 })};
  }

  > * + * {
    margin-top: 20px;
  }
`;
