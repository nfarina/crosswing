import { Task } from "../shared/types.js";
import tasksJson from "./tasks.json";

export interface ServerTask extends Task {
  requires?: string[]; // Names of other tasks which must be running first.
  run?: {
    workspace?: string;
    script: string;
    args?: string;
  };
}

let tasks: ServerTask[] | null = null;

export function getTasks(): ServerTask[] {
  if (!tasks) {
    tasks = [];

    for (const [name, task] of Object.entries(tasksJson)) {
      tasks.push({ ...task, name });
    }
  }

  return tasks;
}

export async function getOneTask(name: string): Promise<ServerTask> {
  const tasks = getTasks();
  const task = tasks.find((task) => task.name === name);

  if (!task) {
    throw new Error(`Task not found: ${name}`);
  }

  return task;
}
