import { useRef, useState } from "react";
import { styled } from "styled-components";
import { LoadingCurtain } from "../../components/LoadingCurtain";
import { Scrollable, StyledScrollable } from "../../components/Scrollable";
import {
  StatusBanner,
  StyledStatusBanner,
} from "../../components/badges/StatusBanner";
import { useAsyncTask } from "../../hooks/useAsyncTask";
import { useInterval } from "../../hooks/useInterval";
import { ModalRootProvider } from "../../modals/context/ModalRootProvider";
import { CyberApp } from "../../theme/app";
import { colors } from "../../theme/colors/colors";
import { ServerStatus } from "../shared/types";
import { TaskView } from "./TaskView";
import { api } from "./api";
import { useDocumentVisible } from "./useDocumentVisible";

export function Manager() {
  return (
    <CyberApp>
      <ModalRootProvider>
        <ManagerContent />
      </ModalRootProvider>
    </CyberApp>
  );
}

export function ManagerContent() {
  const [status, setStatus] = useState<ServerStatus | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const ref = useRef<HTMLDivElement | null>(null);
  const visible = useDocumentVisible();

  const updateStatusTask = useAsyncTask({
    async func() {
      setStatus(await api("status"));
    },
    onError: setError,
    onComplete: () => setError(null),
    runOnMount: true,
  });

  useInterval(updateStatusTask.run, visible ? 1000 : null);

  if (!status) {
    return <LoadingCurtain />;
  }

  return (
    <StyledManager ref={ref}>
      {error && (
        <StatusBanner
          type="error"
          children={
            error.message === "Failed to fetch"
              ? "Server not running"
              : error.message
          }
        />
      )}
      <Scrollable>
        <div className="tasks">
          {Object.entries(Object.entries(status.tasks)).map(
            ([i, [name, task]]) => (
              <TaskView key={name} task={task} hotkey={String(Number(i) + 1)} />
            ),
          )}
        </div>
      </Scrollable>
    </StyledManager>
  );
}

export const StyledManager = styled.div`
  display: flex;
  flex-flow: column;
  background: ${colors.textBackground()};

  > ${StyledStatusBanner} {
    flex-shrink: 0;
    border-bottom: 1px solid ${colors.separator()};
  }

  > ${StyledScrollable} {
    height: 0;
    flex-grow: 1;

    > .tasks {
      display: flex;
      flex-flow: column;
      padding: 10px;
      justify-content: center;

      > * {
        flex-shrink: 0;
        flex-grow: 1;
        max-height: 100px;
      }

      > * + * {
        margin-top: 10px;
      }
    }
  }
`;
