import { CyberAppDecorator } from "../theme/storybook";
import { ImageViewer } from "./ImageViewer";
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