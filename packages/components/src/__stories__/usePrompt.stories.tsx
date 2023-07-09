import { ButtonContainer, ModalDecorator } from "@cyber/modals/storybook";
import { CyberAppDecorator } from "@cyber/theme/storybook";
import { action } from "@storybook/addon-actions";
import React from "react";
import { Button } from "../Button.js";
import { numericTransformer } from "../transformers/numericTransformer.js";
import { usePrompt } from "../usePrompt.js";

export default {
  title: "components/usePrompt",
  decorators: [CyberAppDecorator({ layout: "fullscreen" }), ModalDecorator],
  parameters: { layout: "fullscreen" },
};

export function Normal() {
  const prompt = usePrompt(() => ({
    title: "Choose Color",
    message: "What is your favorite color?",
    placeholder: "Color",
    onSubmit: (value: string) => action("onSubmit")(value),
  }));

  return (
    <ButtonContainer>
      <Button onClick={prompt.show}>Choose Color…</Button>
    </ButtonContainer>
  );
}

export function WithInitialValue() {
  const prompt = usePrompt(() => ({
    title: "Choose Color",
    message: "What is your favorite color?",
    placeholder: "Color",
    initialValue: "Blue",
    onSubmit: (value: string) => action("onSubmit")(value),
  }));

  return (
    <ButtonContainer>
      <Button onClick={prompt.show}>Choose Color…</Button>
    </ButtonContainer>
  );
}

export function WithValidation() {
  const prompt = usePrompt(() => ({
    title: "Choose Color",
    message: "What is your favorite color?",
    placeholder: "Color",
    validate: (value: string) => {
      if (["red", "green", "blue"].includes(value)) return;

      throw new Error("Color must be red, green, or blue.");
    },
    onSubmit: (value: string) => action("onSubmit")(value),
  }));

  return (
    <ButtonContainer>
      <Button onClick={prompt.show}>Choose Color…</Button>
    </ButtonContainer>
  );
}

export function WithTransformer() {
  const prompt = usePrompt(() => ({
    numeric: true,
    title: "Choose Number",
    message: "What is your favorite number?",
    placeholder: "Enter a Number",
    initialValue: 42,
    transformer: numericTransformer(),
    onSubmit: (value: number) => action("onSubmit")(value, typeof value),
  }));

  return (
    <ButtonContainer>
      <Button onClick={prompt.show}>Choose Number…</Button>
    </ButtonContainer>
  );
}

export function WithTransformerAndValidation() {
  const prompt = usePrompt(() => ({
    numeric: true,
    title: "Choose Number",
    message: "What is your favorite number?",
    placeholder: "Enter a Number",
    transformer: numericTransformer(),
    validate(value: number) {
      if (value !== 42) throw new Error("Number must be 42.");
    },
    onSubmit: (value: number) => action("onSubmit")(value, typeof value),
  }));

  return (
    <ButtonContainer>
      <Button onClick={prompt.show}>Choose Number…</Button>
    </ButtonContainer>
  );
}
