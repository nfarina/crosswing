import { Meta } from "@storybook/react";
import { useState } from "react";
import { styled } from "styled-components";
import { colors } from "../../theme/colors/colors";
import { fonts } from "../../theme/fonts/fonts";
import { CrosswingAppDecorator } from "../../theme/storybook";
import { Button } from "../Button";
import { StyledTextArea, TextArea } from "./TextArea";

export default {
  component: TextArea,
  decorators: [
    CrosswingAppDecorator({ width: "wide" }),
    (Story: () => any) => <Container children={<Story />} />,
  ],
  parameters: { layout: "centered" },
} satisfies Meta<typeof TextArea>;

export const AutoTrimDemo = () => {
  const [value, setValue] = useState("");

  return (
    <>
      <TextArea
        placeholder="Display Name"
        value={value}
        onValueChange={setValue}
        autoSizing
      />
      <Button
        children="Reset Value to 'Blue '"
        onClick={() => setValue("Blue ")}
      />
      <pre>TextArea Value: "{value}"</pre>
    </>
  );
};

export const WithPlaceholder = () => {
  const [name, setName] = useState("");

  return (
    <TextArea
      placeholder={'Ex: "Kitchen Remodel"'}
      value={name}
      onValueChange={setName}
      autoSizing
    />
  );
};

export const WithValue = () => {
  const [name, setName] = useState("John Smith");

  return <TextArea value={name} onValueChange={setName} autoSizing />;
};

export const Disabled = () => (
  <TextArea value="John Smith" disabled autoSizing />
);

export const FixedSize = () => {
  const [name, setName] = useState("John Smith");

  return <TextArea value={name} onValueChange={setName} />;
};

const Container = styled.div`
  display: flex;
  flex-flow: column;

  > ${StyledTextArea} {
    border: 1px solid ${colors.separator()};
    border-radius: 6px;
    padding: 10px;
  }

  > pre {
    color: ${colors.textSecondary()};
    font: ${fonts.displayMono({ size: 14 })};
  }

  > * + * {
    margin-top: 20px;
  }
`;
