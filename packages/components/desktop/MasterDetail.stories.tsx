import { colors } from "@crosswing/theme/colors";
import { fonts } from "@crosswing/theme/fonts";
import { CrosswingAppDecorator } from "@crosswing/theme/storybook";
import { styled } from "styled-components";
import { MasterDetail } from "./MasterDetail";

export default {
  component: MasterDetail,
  decorators: [CrosswingAppDecorator({ layout: "fullscreen" })],
  parameters: { layout: "fullscreen" },
};

export const Default = () => (
  <MasterDetail>
    <Master>List of Stuff</Master>
    <Detail>Details of said stuff</Detail>
  </MasterDetail>
);

const Master = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${colors.textBackgroundPanel()};
  color: ${colors.text()};
  font: ${fonts.display({ size: 15 })};
`;

const Detail = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${colors.textBackground()};
  color: ${colors.text()};
  font: ${fonts.display({ size: 15 })};
`;
