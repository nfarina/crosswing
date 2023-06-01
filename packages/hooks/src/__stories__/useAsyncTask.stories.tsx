import React, { CSSProperties, ReactNode, useState } from "react";
import { useAsyncTask } from "../useAsyncTask.js";

export default {
  title: "hooks/useAsyncTask",
  component: useAsyncTask,
  parameters: { layout: "centered" },
};

export const Default = () => {
  const [lines, setLines] = useState<ReactNode[]>([]);

  const task = useAsyncTask({
    async func() {
      log(`[${this.invocation}] Inside task!`);
      for (let i = 0; i < 5; i++) {
        if (this.isCanceled()) {
          log(`[${this.invocation}] We were canceled!`);
          return;
        }
        await wait(1000);
      }
    },
    onComplete: () => log("Task complete."),
    onError: (error) => log(error.message),
  });

  function log(line: ReactNode) {
    setLines((lines) => [...lines, line]);
  }

  return (
    <div style={ContainerStyle}>
      <button children="Run New Task" onClick={task.run} />
      <button
        children="Cancel Task"
        onClick={task.cancel}
        style={{ marginBottom: "5px" }}
      />
      {lines.map((line, i) => (
        <div key={i} style={LineStyle}>
          {line}
        </div>
      ))}
    </div>
  );
};

const ContainerStyle: CSSProperties = {
  fontFamily: "sans-serif",
  padding: "10px",
  background: "gray",
};

const LineStyle: CSSProperties = {
  display: "block",
};

async function wait(ms: number = 0): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
