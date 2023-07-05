import React from "react";
import { ModalRootProvider } from "./ModalRootProvider.js";

/**
 * For Storybook; renders your story inside a <ModalRootProvider>.
 */
export function ModalDecorator(Story: () => any) {
  return <ModalRootProvider children={<Story />} />;
}
