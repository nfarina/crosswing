import { MockHostProvider } from "@cyber/host/mocks";
import { colors } from "@cyber/theme/colors";
import { fonts } from "@cyber/theme/fonts";
import { CyberAppDecorator } from "@cyber/theme/storybook";
import React from "react";
import { styled } from "styled-components";
import { RouterDecorator } from "../storybook/RouterDecorator.js";
import { NavLayout } from "./NavLayout.js";
import { StyledNavTitleView } from "./NavTitleView.js";

export default {
  component: NavLayout,
  decorators: [RouterDecorator, CyberAppDecorator({ layout: "mobile" })],
  parameters: { layout: "centered" },
};

export const Normal = () => (
  <NavLayout title="Cupcakes" isApplicationRoot>
    <SamplePage>Cupcakes are tasty.</SamplePage>
  </NavLayout>
);

export const WithSafeArea = () => (
  <MockHostProvider container="ios">
    <NavLayout title="Cupcakes" isApplicationRoot>
      <SamplePage>Cupcakes are tasty.</SamplePage>
    </NavLayout>
  </MockHostProvider>
);

export const CustomBackground = () => (
  <CustomNavLayout title="Cupcakes" isApplicationRoot transparentHeader>
    <div className="page">CUPCAKES ARE GOOD</div>
  </CustomNavLayout>
);

const SamplePage = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font: ${fonts.display({ size: 14 })};
  color: ${colors.text()};
`;

const CustomNavLayout = styled(NavLayout)`
  background: ${colors.primary()};

  ${StyledNavTitleView} {
    > .title {
      color: ${colors.white()};
    }
  }

  .page {
    display: flex;
    align-items: center;
    justify-content: center;
    font: ${fonts.displayBold({ size: 14 })};
    color: ${colors.white()};
  }
`;
