export interface Task {
  name: string;
  title: string;
  description: string;
  link: string;
}

export interface ClientTask extends Task {
  running: boolean;
  pid: string | null;
  memory: number;
}

export interface ServerStatus {
  tasks: Record<string, ClientTask>;
}
