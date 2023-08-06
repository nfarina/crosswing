import { Meta } from "@storybook/react";
import React from "react";
import { CyberAppDecorator } from "../../theme/storybook.js";
import { Select, SelectOption } from "./Select.js";

export default {
  component: Select,
  decorators: [CyberAppDecorator({ width: 200 })],
  parameters: { layout: "centered" },
} satisfies Meta<typeof Select>;

export const WithOptions = () => (
  <Select>
    <SelectOption title="Milk" value="milk" />
    <SelectOption title="Eggs" value="eggs" />
    <SelectOption title="Fabric Softener" value="fabricsoftener" />
  </Select>
);

export const Disabled = () => (
  <Select disabled>
    <SelectOption title="Milk" value="milk" />
    <SelectOption title="Eggs" value="eggs" />
    <SelectOption title="Fabric Softener" value="fabricsoftener" />
  </Select>
);

export const Empty = () => <Select />;
