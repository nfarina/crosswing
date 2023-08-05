import { ModalDecorator } from "@cyber/modals/storybook";
import { colors } from "@cyber/theme/colors";
import { CyberAppDecorator } from "@cyber/theme/storybook";
import { action } from "@storybook/addon-actions";
import React from "react";
import { styled } from "styled-components";
import { Button } from "../Button.js";
import { urlTransformer } from "./urlTransformer.js";
import { usePrompt } from "./usePrompt.js";

export default {
  component: usePrompt,
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
    title: "Enter URL",
    message: "What's your favorite website?",
    placeholder: "http://example.com",
    transformer: urlTransformer(),
    onSubmit: (value: string) => action("onSubmit")(value, typeof value),
  }));

  return (
    <ButtonContainer>
      <Button onClick={prompt.show}>Enter URL…</Button>
    </ButtonContainer>
  );
}

export function WithTransformerAndValidation() {
  const prompt = usePrompt(() => ({
    title: "Enter URL",
    message: "What's your favorite website?",
    placeholder: "https://example.com",
    transformer: urlTransformer(),
    validate(value) {
      if (!value.startsWith("https://")) {
        throw new Error("URL must be HTTPS.");
      }
    },
    onSubmit: (value: string) => action("onSubmit")(value),
  }));

  return (
    <ButtonContainer>
      <Button onClick={prompt.show}>Enter Secure URL…</Button>
    </ButtonContainer>
  );
}

const ButtonContainer = styled.div`
  background: ${colors.textBackground()};
  display: flex;
  flex-flow: column;
  justify-content: center;
  align-items: center;

  > * + * {
    margin-top: 10px;
  }
`;
