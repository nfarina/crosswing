import { ChildProcess, spawn } from "child_process";
import fs from "fs";
import path from "path";
import pidusage from "pidusage";
import psTree from "ps-tree";
import { ProcessStats } from "../shared/types.js";
import { ServerTask } from "./ServerTasks.js";

// Running processes.
const runners: Record<string, ProcessRunner> = {};

export function getRunner(task: ServerTask): ProcessRunner | null {
  return runners[task.name] ?? null;
}

export function setRunner(task: ServerTask, runner: ProcessRunner) {
  runners[task.name] = runner;
}

export function deleteRunner(task: ServerTask) {
  delete runners[task.name];
}

export class ProcessRunner {
  private name: string;
  private child: ChildProcess;
  private exited: boolean = false; // Guard against race conditions (unproven).
  private stopWasCalled: boolean = false;

  constructor(
    private baseDir: string,
    { name, run }: ServerTask,
    onExit: (code: number | null) => void,
  ) {
    if (!run) {
      throw new Error(`Task "${name}" does not have a "run" property`);
    }

    const packagesDir = path.join(baseDir, "packages");

    const { workspace, script, args = "" } = run;

    const packageDir = workspace ? path.join(packagesDir, workspace) : baseDir;

    const packagePath = path.join(packageDir, "package.json");

    const packageJson = fs.existsSync(packagePath)
      ? JSON.parse(fs.readFileSync(packagePath, "utf8"))
      : null;

    if (!packageJson) {
      throw new Error(`Could not find package.json for package "${workspace}"`);
    }

    let command = packageJson.scripts[script];

    if (!command) {
      throw new Error(
        `Could not find script "${script}" in package.json for package "${workspace}"`,
      );
    }

    if (name) {
      console.log(`[${name}] Executing: `, command + " " + args);
    }

    const cmdWithPath = `export PATH=$PATH:${baseDir}/node_modules/.bin; ${command} ${args}`;

    const child = spawn(cmdWithPath, [], {
      shell: true,
      stdio: "inherit",
      cwd: packageDir,
      detached: true,
    });

    child.on("exit", (code, signal) => {
      if (name) {
        console.log(`[${name}] exited with code ${code} and signal ${signal}`);
      }
      onExit?.(code);

      if (signal === "SIGINT" && !this.stopWasCalled) {
        // Child process was killed by SIGINT issued by the user. Shut down the manager server.
        process.exit();
      }
    });

    this.name = name;
    this.child = child;
  }

  async getStats(): Promise<ProcessStats | null> {
    if (this.exited) return null;

    const { pid } = this.child;
    if (!pid) return null;

    const childPids = await this.getChildPids();
    const stats = await pidusage([pid, ...childPids]);
    let memory = 0;
    for (const stat of Object.values(stats) as any) {
      memory += stat.memory ?? 0;
    }

    return { pid, childPids, memory };
  }

  getChildPids(): Promise<number[]> {
    return new Promise((resolve, reject) => {
      psTree(this.child.pid, function (error: Error, children: any[]) {
        if (error) {
          reject(error);
        } else {
          resolve(children.map(({ PID }) => PID));
        }
      });
    });
  }

  async stop() {
    if (this.exited) return;

    const { name, child } = this;

    if (name) {
      console.log(`[${name}] Stopping`, child.pid);
    }

    if (!child.pid) {
      throw new Error("Child process does not have a PID");
    }

    this.stopWasCalled = true;

    // Send a SIGTERM to any and all children of the main process. We can't
    // use the negative trick (kill(-pid, "SIGTERM")) because the Bun runtime
    // doesn't support it.
    // const childPids = await this.getChildPids();

    // for (const pid of childPids) {
    //   if (name) {
    //     console.log(`[${name}]   - and child`, pid);
    //   }

    //   process.kill(pid, "SIGTERM");
    // }

    // Send a SIGTERM to the main process.
    // process.kill(child.pid, "SIGTERM");

    // Ignoring the Bun compatibility attempt above, which made everything
    // worse.
    process.kill(-child.pid, "SIGINT");
  }
}
