import { wait } from "@crosswing/shared/wait";
import { BunFile, readableStreamToJSON } from "bun";
import parseArgs from "minimist";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";
import { ServerStatus } from "../shared/types";
import {
  ProcessRunner,
  deleteRunner,
  getRunner,
  setRunner,
} from "./ProcessRunner";
import { ServerTasks } from "./ServerTasks";

// This script accepts a single argument, the path to tasks.json.
// It then reads the file and parses it as JSON.
const {
  port = 2700,
  _: [tasksJsonPath],
} = parseArgs(process.argv.slice(2));

let tasksJsonFile: BunFile;

if (tasksJsonPath) {
  tasksJsonFile = Bun.file(resolve(tasksJsonPath));

  if (!(await tasksJsonFile.exists())) {
    console.error(`File not found: ${tasksJsonPath}`);
    process.exit(1);
  }
} else {
  // Maybe it's in the current directory?
  tasksJsonFile = Bun.file(resolve(process.cwd(), "tasks.json"));

  if (!(await tasksJsonFile.exists())) {
    console.error(
      "Usage: bun server.ts <path to tasks.json>\n\n" +
        "You can also run this script from the root of the project, " +
        "in which case it will look for tasks.json in the current directory " +
        `(which is ${process.cwd()})`,
    );
    process.exit(1);
  }
}

const tasksJson = await tasksJsonFile.json();
const baseDir = dirname(tasksJsonFile.name!);
const tasks = ServerTasks.fromJson(tasksJson);

const thisDir = dirname(fileURLToPath(import.meta.url));

const DIST_DIR = resolve(thisDir, "../client/dist");

Bun.serve({
  port,
  async fetch(req) {
    const url = new URL(req.url);

    if (req.method === "OPTIONS") {
      // Implement basic CORS for the manager running in dev mode.
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST",
          "Access-Control-Allow-Headers": "content-type",
        },
      });
    }

    let response: Response = new Response();

    if (url.pathname === "/api/status") {
      const status = await getStatus();
      response = Response.json(status);
    } else if (url.pathname === "/api/tasks/running" && req.method === "POST") {
      if (!req.body) throw new Error("Expected a request body.");
      const body = await readableStreamToJSON(req.body);

      const { name, running } = body;
      if (running) {
        await startTask(name);
      } else if (!running) {
        await stopTask(name);
      }

      response = Response.json({});
    } else {
      const path = url.pathname === "/" ? "/index.html" : url.pathname;
      const fullPath = DIST_DIR + path;
      response = new Response(Bun.file(fullPath));
    }

    response.headers.set("Access-Control-Allow-Origin", "*");
    return response;
  },
  error(error) {
    // Respond with JSON.
    return Response.json(
      { message: error.message },
      { status: 500, headers: { "Access-Control-Allow-Origin": "*" } },
    );
  },
});

async function getStatus(): Promise<ServerStatus> {
  const status: ServerStatus = { tasks: {} };

  for (const task of tasks.all()) {
    const runner = getRunner(task);

    status.tasks[task.name] = {
      name: task.name,
      title: task.title,
      description: task.description,
      link: task.link,
      running: !!runner,
      process: (await runner?.getStats()) ?? null,
    };
  }

  return status;
}

async function startTask(name: string) {
  const task = tasks.getOne(name);

  // Start any prerequisites first.
  for (const subtask of task.requires ?? []) {
    await startTask(subtask);
  }

  if (!getRunner(task)) {
    const runner = new ProcessRunner(baseDir, { ...task, name }, () => {
      deleteRunner(task);
    });

    setRunner(task, runner);
  }
}

async function stopTask(name: string) {
  const task = tasks.getOne(name);
  getRunner(task)?.stop();
  deleteRunner(task);
}

console.log(
  `
=========================
=== Crosswing Dev Manager ===
=========================

Visit http://localhost:${port} to start local development services.
`,
);

process.once("SIGINT", async function (code: number) {
  const allTasks = tasks.all();

  if (allTasks.some((task) => getRunner(task))) {
    console.log("Ctrl-C received; shutting down child processes…");

    for (const task of allTasks) {
      getRunner(task)?.stop();
    }

    for (let i = 0; i < 10; i++) {
      await wait(1000);
      if (!allTasks.some((task) => getRunner(task))) {
        console.log("All child processes stopped.");
        process.exit();
      }
    }

    console.log("Child processes still running!");
  } else {
    console.log("Ctrl-C received; exiting with no child processes running.");
  }

  process.exit();
});
