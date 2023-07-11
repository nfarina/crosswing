import fs from "fs/promises";
import { Task } from "../shared/types.js";
import { ProcessRunner } from "./ProcessRunner.js";

// Interface for the tasks.json file.
type TasksJson = Record<string, ServerTask>;

export interface ServerTask extends Task {
  requires?: string[]; // Names of other tasks which must be running first.
  run?: {
    workspace?: string;
    script: string;
    args?: string;
  };
  process: ProcessRunner | null;
  orphaned?: boolean;
}

let cachedTasks: ServerTask[] = [];

export async function getTasks(): Promise<ServerTask[]> {
  // Merge loaded tasks with existing tasks which could already be running.
  const mergedTasks: ServerTask[] = [];

  const newTasks: TasksJson = JSON.parse(
    await fs.readFile(new URL("./tasks.json", import.meta.url), "utf8"),
  );

  for (const [name, task] of Object.entries(newTasks)) {
    const existingTask = cachedTasks.find((task) => task.name === name);

    mergedTasks.push({
      ...task,
      name,
      process: existingTask?.process ?? null,
    });
  }

  // Re-add any tasks which are already running which were deleted from
  // tasks.json.
  for (const task of cachedTasks) {
    if (task.process && !mergedTasks.find((t) => t.name === task.name)) {
      mergedTasks.push({ ...task, orphaned: true });
    }
  }

  return (cachedTasks = mergedTasks);
}

export async function getOneTask(name: string): Promise<ServerTask> {
  const tasks = await getTasks();
  const task = tasks.find((task) => task.name === name);

  if (!task) {
    throw new Error(`Task not found: ${name}`);
  }

  return task;
}
