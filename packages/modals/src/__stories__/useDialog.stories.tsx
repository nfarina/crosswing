import { Button, Timestamp } from "@cyber/components";
import { colors, fonts } from "@cyber/theme";
import { CyberAppDecorator } from "@cyber/theme/storybook";
import React, { useCallback, useState } from "react";
import { styled } from "styled-components";
import { ModalDecorator } from "../ModalDecorator.js";
import { useDialog } from "../useDialog.js";

export default {
  title: "modals/useDialog",
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
    <ButtonContainer>
      <Button primary onClick={() => dialog.show(Date.now())}>
        Show Dialog
      </Button>
    </ButtonContainer>
  );
}

export function Sticky() {
  const dialog = useDialog(
    () => (
      <SampleDialog>
        <div>This cannot be closed unless you click the button.</div>
        <Button onClick={dialog.hide} children="Close" />
      </SampleDialog>
    ),
    { sticky: true },
  );

  return (
    <ButtonContainer>
      <Button primary onClick={dialog.show}>
        Show Sticky Dialog
      </Button>
    </ButtonContainer>
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
      <div>
        Dialog created <Timestamp date={created} />
      </div>
      <div>
        Host count is {count}, local count is {local}
      </div>
      <Button onClick={increment}>Increment Host</Button>
      <Button onClick={incrementLocal}>Increment Local</Button>
      <Button onClick={onAlert}>Show Alert</Button>
      <Button onClick={onClose}>Close</Button>
    </SampleDialog>
  );
}

//
// Styles
//

const ButtonContainer = styled.div`
  display: flex;
  flex-flow: column;
  justify-content: center;
  align-items: center;

  > * + * {
    margin-top: 10px;
  }
`;

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
