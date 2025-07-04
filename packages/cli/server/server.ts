import { readFile } from "fs/promises";
import { IncomingMessage, ServerResponse, createServer } from "http";
import parseArgs from "minimist";
import { dirname, resolve } from "path";
import { URL, fileURLToPath } from "url";
import { ServerStatus } from "../shared/types.js";
import {
  ProcessRunner,
  deleteRunner,
  getRunner,
  setRunner,
} from "./ProcessRunner.js";
import { ServerTasks, ServerTasksFile } from "./ServerTasks.js";

// This script accepts a tasks.json path and optional task names to auto-start.
// Usage: crosswing [path to tasks.json] --start=task1,task2
const {
  port = 2700,
  title = "Crosswing Dev",
  start,
  _: [tasksJsonPath],
} = parseArgs(process.argv.slice(2));

// Parse comma-separated task names from --start flag
const autoStartTasks = start
  ? start.split(",").map((task: string) => task.trim())
  : [];

let tasksJson: ServerTasksFile;
let tasksJsonFullPath: string;

if (tasksJsonPath) {
  tasksJsonFullPath = resolve(tasksJsonPath);

  try {
    tasksJson = JSON.parse(await readFile(tasksJsonFullPath, "utf-8"));
  } catch (error) {
    console.error(`File not found: ${tasksJsonPath}`);
    process.exit(1);
  }
} else {
  // Maybe it's in the current directory?
  tasksJsonFullPath = resolve(process.cwd(), "tasks.json");

  try {
    tasksJson = JSON.parse(await readFile(tasksJsonFullPath, "utf-8"));
  } catch (error) {
    console.error(
      "Usage: crosswing [path to tasks.json] --start=task1,task2\n\n" +
        "You can also run this script from the root of the project, " +
        "in which case it will look for tasks.json in the current directory " +
        `(which is ${process.cwd()})\n\n` +
        "Use --start=task1,task2 to auto-start specific tasks on startup.",
    );
    process.exit(1);
  }
}

const baseDir = dirname(tasksJsonFullPath);
const tasks = ServerTasks.fromJson(tasksJson);

const thisFile = fileURLToPath(import.meta.url);
const thisDir = dirname(thisFile);

const DIST_DIR = thisFile.endsWith(".ts")
  ? resolve(thisDir, "../client/dist")
  : resolve(thisDir, "../../../client/dist"); // When we are running out of dist, we'll be a .js file, and we'll also be nested two levels deeper.

const server = createServer(async (req, res) => {
  try {
    await handleRequest(req, res);
  } catch (error: any) {
    if (res.headersSent) {
      console.error("Error after headers sent:", error);
      return;
    }

    res.writeHead(500, {
      "Access-Control-Allow-Origin": "*",
    });
    res.end(JSON.stringify({ message: error.message }));
  }
});

async function handleRequest(req: IncomingMessage, res: ServerResponse) {
  const url = new URL(req.url!, `http://${req.headers.host}`);

  if (req.method === "OPTIONS") {
    // Implement basic CORS for the manager running in dev mode.
    res.writeHead(200, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST",
      "Access-Control-Allow-Headers": "content-type",
    });
    res.end();
    return;
  }

  let response: any = null;

  if (url.pathname === "/api/status") {
    const status = await getStatus();
    response = JSON.stringify(status);
  } else if (url.pathname === "/api/tasks/running" && req.method === "POST") {
    const body = await readJSONRequestBody(req);

    const { name, running } = body;
    if (running) {
      await startTask(name);
    } else if (!running) {
      await stopTask(name);
    }

    response = JSON.stringify({});
  } else {
    const path = url.pathname === "/" ? "/index.html" : url.pathname;

    // Prevent accessing files outside the dist directory.
    if (path.includes("..")) {
      res.writeHead(403);
      res.end();
      return;
    }

    const fullPath = DIST_DIR + path;
    response = await readFile(fullPath);

    // If we loaded index.html, replace "<title>Client Dev</title>" with
    // our custom title, if any.
    if (path === "/index.html") {
      response = response
        .toString()
        .replace("<title>Client Dev</title>", `<title>${title}</title>`);
    }
  }

  res.writeHead(200, {
    "Access-Control-Allow-Origin": "*",
    "Content-Type": getContentType(url.pathname),
  });

  res.end(response);
}

server.listen(port, async () => {
  console.log(
    `
=============================
=== Crosswing Dev Manager ===
=============================

Visit http://localhost:${port} to start local development services.
`,
  );

  // Auto-start any specified tasks
  if (autoStartTasks.length > 0) {
    console.log(`\nAuto-starting tasks: ${autoStartTasks.join(", ")}`);

    for (const taskName of autoStartTasks) {
      try {
        // Verify the task exists before trying to start it
        tasks.getOne(taskName);
        await startTask(taskName);
        console.log(`✓ Started task: ${taskName}`);
      } catch (error) {
        console.error(
          `✗ Failed to start task '${taskName}': ${error instanceof Error ? error.message : error}`,
        );
      }
    }
    console.log("");
  }
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

// Begin reading from stdin so the process does not exit.
// Thanks to https://stackoverflow.com/questions/49457565/sigint-handler-in-nodejs-app-not-called-for-ctrl-c-mac#comment134858261_49458139
process.stdin.resume();

// Tried .once() but it didn't work in npx.
process.on("SIGINT", async function (code: number) {
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

// Copied from crosswing/shared to avoid a dependency just for this.
async function wait(ms: number = 0): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

// Who needs Express anyway!
function readJSONRequestBody(req: IncomingMessage): any {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString(); // convert Buffer to string
    });
    req.on("end", () => {
      try {
        resolve(JSON.parse(body));
      } catch (e) {
        reject(e);
      }
    });
    req.on("error", (err) => {
      reject(err);
    });
  });
}

function getContentType(path: string): string {
  if (path.endsWith(".css")) {
    return "text/css";
  } else if (path.endsWith(".js")) {
    return "application/javascript";
  } else if (path.endsWith(".json")) {
    return "application/json";
  } else if (path.endsWith(".png")) {
    return "image/png";
  } else if (path.endsWith(".svg")) {
    return "image/svg+xml";
  } else {
    return "text/html";
  }
}
