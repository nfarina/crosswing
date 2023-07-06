import { CyberAppDecorator } from "@cyber/theme/storybook";
import React from "react";
import { Select, SelectOption } from "../Select.js";

export default {
  title: "components/Select",
  decorators: [CyberAppDecorator()],
  parameters: { layout: "centered" },
};

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
