import { wait } from "@cyber/shared/wait";
import cors from "@koa/cors";
import Router from "@koa/router";
import Koa from "koa";
import { koaBody } from "koa-body";
import serve from "koa-static";
import path from "path";
import { fileURLToPath } from "url";
import { ServerStatus } from "../shared/types.js";
import { ProcessRunner } from "./ProcessRunner.js";
import { getOneTask, getTasks } from "./tasks.js";

let dirname = fileURLToPath(import.meta.url);

// If we were run like `vite-note src/server/index.ts` instead of `src/server`,
// then dirname will be the path to the file itself, not the directory.
if (dirname.endsWith(".ts")) {
  dirname = path.dirname(dirname);
}

const DIST_DIR = path.resolve(dirname, "../client/dist");

const app = new Koa();
const router = new Router();

router.get("/api/status", async (ctx) => {
  const status: ServerStatus = { tasks: {} };

  for (const task of getTasks()) {
    status.tasks[task.name] = {
      name: task.name,
      title: task.title,
      description: task.description,
      link: task.link,
      running: !!task.process,
      process: (await task.process?.getStats()) ?? null,
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
  const task = await getOneTask(name);

  // Start any prerequisites first.
  for (const subtask of task.requires ?? []) {
    await startTask(subtask);
  }

  if (!task.process) {
    task.process = new ProcessRunner({ ...task, name }, () => {
      task.process = null;
    });
  }
}

async function stopTask(name: string) {
  const task = await getOneTask(name);
  task.process?.stop();
  task.process = null;
}

app.use(cors());
app.use(koaBody());
app.use(router.routes());
app.use(router.allowedMethods());
app.use(serve(DIST_DIR));

app.listen(2700, () => {
  console.log(
    `
=========================
=== Cyber Dev Manager ===
=========================

Visit http://localhost:2700 to start local development services.
`,
  );
});

process.once("SIGINT", async function (code: number) {
  const allTasks = getTasks();
  if (allTasks.some((task) => task.process)) {
    console.log("Ctrl-C received; shutting down child processes…");

    for (const task of allTasks) {
      task.process?.stop();
    }

    for (let i = 0; i < 10; i++) {
      await wait(1000);
      if (!allTasks.some((task) => task.process)) {
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
