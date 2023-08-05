import { Task } from "../shared/types.js";

export interface ServerTask extends Task {
  requires?: string[]; // Names of other tasks which must be running first.
  run?: {
    workspace?: string;
    script: string;
    args?: string;
  };
}

export class ServerTasks {
  constructor(private tasks: ServerTask[]) {}

  public all(): ServerTask[] {
    return this.tasks;
  }

  public static fromJson(
    json: Record<string, Omit<ServerTask, "name">>,
  ): ServerTasks {
    const tasks: ServerTask[] = [];

    for (const [name, task] of Object.entries(json)) {
      tasks.push({ ...task, name });
    }

    return new ServerTasks(tasks);
  }

  getOne(name: string): ServerTask {
    const task = this.tasks.find((task) => task.name === name);

    if (!task) {
      throw new Error(`Task not found: ${name}`);
    }

    return task;
  }
}
