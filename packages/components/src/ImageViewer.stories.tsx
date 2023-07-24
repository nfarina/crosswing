import { CyberAppDecorator } from "@cyber/theme/storybook";
import React from "react";
import image from "./ImageViewer.image.jpg";
import { ImageViewer } from "./ImageViewer.js";

export default {
  component: ImageViewer,
  decorators: [CyberAppDecorator({ layout: "mobile" })],
  parameters: { layout: "centered" },
};

export const Default = () => (
  <ImageViewer contentSize={{ width: 1024, height: 678 }}>
    <img src={image} />
  </ImageViewer>
);
