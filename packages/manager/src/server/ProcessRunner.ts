import { ChildProcess, spawn } from "child_process";
import fs from "fs";
import path from "path";
import pidusage from "pidusage";
import psTree from "ps-tree";
import { fileURLToPath } from "url";
import { ProcessStats } from "../shared/types.js";
import { ServerTask } from "./tasks.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PROJECT_DIR = path.resolve(__dirname, "../../");
const PACKAGES_DIR = path.dirname(PROJECT_DIR);
const WORKSPACE_DIR = path.dirname(PACKAGES_DIR);

export class ProcessRunner {
  private name: string;
  private child: ChildProcess;
  private exited: boolean = false; // Guard against race conditions (unproven).
  private stopWasCalled: boolean = false;

  constructor(
    { name, run }: ServerTask,
    onExit: (code: number | null) => void,
  ) {
    if (!run) {
      throw new Error(`Task "${name}" does not have a "run" property`);
    }

    const { workspace, script, args = "" } = run;

    const packageDir = workspace
      ? path.join(PACKAGES_DIR, workspace)
      : WORKSPACE_DIR;

    const packagePath = path.join(packageDir, "package.json");

    const packageJson = fs.existsSync(packagePath)
      ? JSON.parse(fs.readFileSync(packagePath, "utf8"))
      : null;

    let command = packageJson?.scripts[script];

    if (!command) {
      throw new Error(
        `Could not find script "${script}" in package.json for package "${workspace}"`,
      );
    }

    if (name) {
      console.log(`[${name}] Executing: `, command + " " + args);
    }

    const cmdWithPath = `export PATH=$PATH:${WORKSPACE_DIR}/node_modules/.bin; ${command} ${args}`;

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

  stop() {
    if (this.exited) return;

    const { name, child } = this;

    if (name) {
      console.log(`[${name}] Stopping`, child.pid);
    }

    if (!child.pid) {
      throw new Error("Child process does not have a PID");
    }

    this.stopWasCalled = true;

    process.kill(-child.pid, "SIGTERM");
  }
}
