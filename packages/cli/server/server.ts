import { readFile } from "fs/promises";
import { IncomingMessage, ServerResponse, createServer } from "http";
import parseArgs from "minimist";
import { dirname, resolve } from "path";
import { URL, fileURLToPath } from "url";
import { ServerStatus } from "../shared/types";
import {
  ProcessRunner,
  deleteRunner,
  getRunner,
  setRunner,
} from "./ProcessRunner.js";
import { ServerTasks, ServerTasksFile } from "./ServerTasks.js";

// This script accepts a single argument, the path to tasks.json.
// It then reads the file and parses it as JSON.
const {
  port = 2700,
  _: [tasksJsonPath],
} = parseArgs(process.argv.slice(2));

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
      "Usage: crosswing <path to tasks.json>\n\n" +
        "You can also run this script from the root of the project, " +
        "in which case it will look for tasks.json in the current directory " +
        `(which is ${process.cwd()})`,
    );
    process.exit(1);
  }
}

const baseDir = dirname(tasksJsonFullPath);
const tasks = ServerTasks.fromJson(tasksJson);

const thisDir = dirname(fileURLToPath(import.meta.url));

const DIST_DIR = resolve(thisDir, "../client/dist");

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
  }

  res.writeHead(200, {
    "Access-Control-Allow-Origin": "*",
    "Content-Type": getContentType(url.pathname),
  });

  res.end(response);
}

server.listen(port, () => {
  console.log(
    `
=============================
=== Crosswing Dev Manager ===
=============================

Visit http://localhost:${port} to start local development services.
`,
  );
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
