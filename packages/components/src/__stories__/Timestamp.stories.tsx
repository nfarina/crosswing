import { colors, fonts } from "@cyber/theme";
import { CyberAppDecorator } from "@cyber/theme/storybook";
import dayjs from "dayjs";
import React from "react";
import { styled } from "styled-components";
import { Timestamp, setTimestampUpdateInterval } from "../Timestamp.js";

setTimestampUpdateInterval(500);

export default {
  title: "components/Timestamp",
  decorators: [ContainerDecorator, CyberAppDecorator()],
  parameters: { layout: "centered" },
};

export const Default = () => <Timestamp date={1554744840915} />;

export const Today = () => <Timestamp date={Date.now()} />;

export const Format = () => (
  <Timestamp date={1554744840915} format="MMMM D, YYYY" />
);

export const Custom = () => (
  <Timestamp date={1554744840915} format={customFormatter} />
);

export const Relative = () => (
  <Timestamp date={Date.now() - 42000} format={relativeFormatter} />
);

function ContainerDecorator(Story: () => any) {
  return <Container children={<Story />} />;
}

const Container = styled.div`
  font: ${fonts.display({ size: 16 })};
  color: ${colors.text()};
`;

function customFormatter(date: number): string {
  return dayjs(date).format("h:mm a [HOOT HOOT]");
}

function relativeFormatter(date: number): string {
  const secondsAgo = Math.round((Date.now() - date) / 1000);
  return `${secondsAgo} seconds ago`;
}
