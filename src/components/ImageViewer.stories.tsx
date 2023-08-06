import React from "react";
import { CyberAppDecorator } from "../theme/storybook.js";
import { ImageViewer } from "./ImageViewer.js";
import SampleImage from "./SampleImage.jpg";

export default {
  component: ImageViewer,
  decorators: [CyberAppDecorator({ layout: "mobile" })],
  parameters: { layout: "centered" },
};

export const Default = () => (
  <ImageViewer contentSize={{ width: 1024, height: 678 }}>
    <img src={SampleImage} />
  </ImageViewer>
);
