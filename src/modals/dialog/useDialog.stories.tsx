import React, { useCallback, useState } from "react";
import { styled } from "styled-components";
import { colors } from "../../theme/colors/colors.js";
import { fonts } from "../../theme/fonts.js";
import { CyberAppDecorator } from "../../theme/storybook.js";
import { ModalDecorator } from "../storybook/ModalDecorator.js";
import {
  ModalStoryButton,
  ModalStoryButtons,
} from "../storybook/ModalStoryButtons.js";
import { useDialog } from "./useDialog.js";

export default {
  component: useDialog,
  decorators: [CyberAppDecorator({ layout: "fullscreen" }), ModalDecorator],
  parameters: { layout: "fullscreen" },
};

export function Normal() {
  const [count, setCount] = useState(0);
  const increment = useCallback(() => setCount((c) => c + 1), []);

  // Create a dialog that demonstrates how dialogs can have their own state like
  // any other react component, but also update in response to prop changes
  // over time.
  const dialog = useDialog((created: number) => (
    <StatefulDialog
      created={created}
      count={count}
      increment={increment}
      onAlert={alert.show}
      onClose={dialog.hide}
    />
  ));

  const alert = useDialog(() => (
    <SampleDialog>This should be on top!</SampleDialog>
  ));

  return (
    <ModalStoryButtons>
      <ModalStoryButton onClick={() => dialog.show(Date.now())}>
        Show Dialog
      </ModalStoryButton>
    </ModalStoryButtons>
  );
}

export function Sticky() {
  const dialog = useDialog(
    () => (
      <SampleDialog>
        <div>This cannot be closed unless you click the button.</div>
        <ModalStoryButton onClick={dialog.hide} children="Close" />
      </SampleDialog>
    ),
    { sticky: true },
  );

  return (
    <ModalStoryButtons>
      <ModalStoryButton onClick={dialog.show}>
        Show Sticky Dialog
      </ModalStoryButton>
    </ModalStoryButtons>
  );
}

//
// Components
//

function StatefulDialog({
  created,
  count,
  increment,
  onAlert,
  onClose,
}: {
  created: number;
  count: number;
  increment: () => void;
  onAlert: () => void;
  onClose: () => void;
}) {
  const [local, setLocal] = useState(0);
  const incrementLocal = useCallback(() => setLocal((c) => c + 1), []);

  return (
    <SampleDialog>
      <div>Dialog created {new Date(created).toString()}</div>
      <div>
        Host count is {count}, local count is {local}
      </div>
      <ModalStoryButton onClick={increment}>Increment Host</ModalStoryButton>
      <ModalStoryButton onClick={incrementLocal}>
        Increment Local
      </ModalStoryButton>
      <ModalStoryButton onClick={onAlert}>Show Alert</ModalStoryButton>
      <ModalStoryButton onClick={onClose}>Close</ModalStoryButton>
    </SampleDialog>
  );
}

//
// Styles
//

const SampleDialog = styled.div`
  display: flex;
  flex-flow: column;
  background: ${colors.textBackground()};
  color: ${colors.text()};
  padding: 20px;
  border-radius: 6px;
  font: ${fonts.display({ size: 14, line: "1.3" })};

  > * + * {
    margin-top: 10px;
  }
`;
