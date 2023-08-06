import React, { useState } from "react";
import { CyberAppDecorator } from "../../theme/storybook.js";
import { SeparatorDecorator } from "../SeparatorLayout.js";
import { LabeledContentEditable } from "./LabeledContentEditable.js";

export default {
  component: LabeledContentEditable,
  decorators: [SeparatorDecorator, CyberAppDecorator({ width: "wide" })],
  parameters: { layout: "centered" },
};

export const Empty = () => {
  const [name, setName] = useState("");
  return (
    <LabeledContentEditable label="Name" value={name} onValueChange={setName} />
  );
};

export const WithPlaceholder = () => {
  const [name, setName] = useState("");
  return (
    <LabeledContentEditable
      label="Name"
      value={name}
      placeholder="Enter your name"
      onValueChange={setName}
    />
  );
};

export const WithValue = () => {
  const [name, setName] = useState("Nick Farina");

  return (
    <LabeledContentEditable label="Name" value={name} onValueChange={setName} />
  );
};

export const Disabled = () => (
  <LabeledContentEditable label="Name" value="Nick Farina" disabled />
);
