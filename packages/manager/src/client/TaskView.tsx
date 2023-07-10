import { Badge } from "@cyber/components/Badge";
import { StyledButton } from "@cyber/components/Button";
import { StyledToggle, Toggle } from "@cyber/components/Toggle";
import { useAsyncTask } from "@cyber/hooks/useAsyncTask";
import { useHotkey } from "@cyber/hooks/useHotkey";
import { usePersistedState } from "@cyber/hooks/usePersistedState";
import { useErrorAlert } from "@cyber/modals/alert";
import { wait } from "@cyber/shared/wait";
import { colors, shadows } from "@cyber/theme/colors";
import { fonts } from "@cyber/theme/fonts";
import React, { SyntheticEvent } from "react";
import { styled } from "styled-components";
import { ClientTask } from "../shared/types.js";

export function TaskView({
  task,
  hotkey,
}: {
  task: ClientTask;
  hotkey: string;
}) {
  const errorAlert = useErrorAlert();

  const setRunningTask = useAsyncTask({
    async func(running: boolean) {
      await fetch("//localhost:2700/api/tasks/running", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: task.name, running }),
      });

      await wait(1000);
    },
    onError: errorAlert.show,
  });

  const running = usePersistedState({
    persistedValue: task.running,
    updateFunc: setRunningTask.run,
    onError: errorAlert.show,
  });

  useHotkey(hotkey, running.toggle);

  function onClick(e: SyntheticEvent) {
    if (setRunningTask.isRunning || (e.target as HTMLElement).tagName === "A") {
      return;
    }
    running.toggle();
  }

  function renderMemory(memory: number) {
    const GB = 1024 * 1024 * 1024;
    const MB = 1024 * 1024;

    if (memory >= GB) {
      // Render GB with 1 decimal place.
      return `${(memory / GB).toFixed(1)} GB`;
    } else {
      return `${Math.round(memory / MB)} MB`;
    }
  }

  return (
    <StyledTaskView
      data-running={running.value}
      data-working={setRunningTask.isRunning}
      onClick={onClick}
      title={`${task.name} (${task.pid ?? "not running"})`}
    >
      <div className="hotkey">{hotkey}</div>
      <div className="content">
        <div className="title">{task.title}</div>
        <div className="description">{task.description}</div>
      </div>
      {task.memory && <Badge>{renderMemory(task.memory)}</Badge>}
      {task.link && (
        <a className="link" href={task.link} target="_blank">
          {task.link.split("//")[1].split("/")[0]}
        </a>
      )}
      <Toggle
        disabled={setRunningTask.isRunning}
        onClick={running.toggle}
        on={running.value}
      />
    </StyledTaskView>
  );
}

export const StyledTaskView = styled.div`
  box-shadow: ${shadows.cardSmall()}, ${shadows.cardBorder()};
  border-radius: 6px;
  box-sizing: border-box;
  display: flex;
  flex-flow: row;
  align-items: center;
  padding: 10px 15px;
  min-height: 60px;
  cursor: pointer;
  transition: box-shadow 0.25s ease;

  > * {
    flex-shrink: 0;
  }

  > * + * {
    margin-left: 13px;
  }

  &[data-running="true"] {
    box-shadow:
      ${shadows.cardSmall()},
      ${shadows.cardBorder()},
      0 0 0 2px inset ${colors.turquoise()};

    background: ${colors.turquoise({ lighten: 0.408 })};

    @media (prefers-color-scheme: dark) {
      background: ${colors.turquoise({ darken: 0.65 })};
    }
  }

  &[data-working="true"] {
    box-shadow:
      ${shadows.cardSmall()},
      ${shadows.cardBorder()},
      0 0 0 2px inset ${colors.turquoise({ alpha: 0.5 })};
  }

  > .hotkey {
    width: 26px;
    height: 26px;
    box-sizing: border-box;
    background: ${colors.turquoise()};
    border-radius: 9999px;
    color: ${colors.textBackground()};
    font: ${fonts.numericBlack({ size: 17, line: "1" })};
    padding-bottom: 1px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  > .content {
    flex-shrink: 1;
    flex-grow: 1;
    display: flex;
    flex-flow: column;

    > * {
      flex-shrink: 0;
    }

    > .title {
      color: ${colors.text()};
      font: ${fonts.displayMedium({ size: 20, line: "22px" })};
    }

    > .description {
      margin-top: 2px;
      color: ${colors.textSecondary()};
      font: ${fonts.display({ size: 14, line: "18px" })};
    }
  }

  > ${Badge} {
    min-height: 31px;
    padding: 1px 13px;
  }

  > .link {
    padding: 5px 10px;
    border-radius: 6px;
    box-sizing: border-box;
    height: 31px;
    border: 1px solid ${colors.separator()};
    display: flex;
    align-items: center;
    text-decoration: none;
    color: ${colors.mediumBlue()};
    font: ${fonts.display({ size: 12 })};
  }

  > ${StyledButton} {
    min-width: 110px;
  }

  @media (max-width: 480px) {
    flex-flow: column;
    align-items: flex-start;
    min-height: unset;
    padding: 15px;

    > .hotkey {
      display: none;
    }

    > .content {
      margin-left: 0;
    }

    > ${Badge} {
      display: none;
    }

    > .link {
      margin-top: 10px;
      margin-left: 0;
    }

    > ${StyledToggle} {
      display: none;
    }
  }
`;
