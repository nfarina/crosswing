import { wait } from "@cyber/shared/wait";
import cors from "@koa/cors";
import Router from "@koa/router";
import fs from "fs";
import Koa from "koa";
import { koaBody } from "koa-body";
import serve from "koa-static";
import parseArgs from "minimist";
import path from "path";
import { fileURLToPath } from "url";
import { ServerStatus } from "../shared/types.js";
import {
  ProcessRunner,
  deleteRunner,
  getRunner,
  setRunner,
} from "./ProcessRunner.js";
import { ServerTasks } from "./ServerTasks.js";

// This script accepts a single argument, the path to tasks.json.
// It then reads the file and parses it as JSON.
// This is a workaround for the fact that we can't import JSON files in ESM.
let {
  port = 2700,
  _: [tasksJsonPath],
} = parseArgs(process.argv.slice(2));

if (!tasksJsonPath) {
  // Maybe it's in the current directory?
  tasksJsonPath = path.resolve(process.cwd(), "tasks.json");

  if (!fs.existsSync(tasksJsonPath)) {
    console.error(
      "Usage: vite-node server.js <path to tasks.json>\n\n" +
        "You can also run this script from the root of the project, " +
        "in which case it will look for tasks.json in the current directory.",
    );
    process.exit(1);
  }
}

console.log(tasksJsonPath);

const tasksJson = JSON.parse(fs.readFileSync(tasksJsonPath, "utf8"));
const baseDir = path.dirname(tasksJsonPath);
const tasks = ServerTasks.fromJson(tasksJson);

let dirname = path.dirname(fileURLToPath(import.meta.url));

const DIST_DIR = path.resolve(dirname, "../client/dist");

const app = new Koa();
const router = new Router();

router.get("/api/status", async (ctx) => {
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

  ctx.body = status;
});

router.post("/api/tasks/running", (ctx) => {
  const { name, running } = ctx.request.body;
  if (running) {
    startTask(name);
  } else if (!running) {
    stopTask(name);
  }

  ctx.body = {};
});

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

app.use(cors());
app.use(koaBody());
app.use(router.routes());
app.use(router.allowedMethods());
app.use(serve(DIST_DIR));

app.listen(port, () => {
  console.log(
    `
=========================
=== Cyber Dev Manager ===
=========================

Visit http://localhost:${port} to start local development services.
`,
  );
});

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
