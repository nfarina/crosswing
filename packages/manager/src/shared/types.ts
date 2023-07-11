// Isomorphic types for client and server.

export interface Task {
  name: string;
  title: string;
  description: string;
  link: string;
}

export interface ClientTask extends Task {
  running: boolean;
  orphaned: boolean;
  process: ProcessStats | null;
}

export interface ProcessStats {
  pid: number;
  childPids: number[];
  memory: number;
}

export interface ServerStatus {
  tasks: Record<string, ClientTask>;
}
