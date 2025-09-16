export interface User {
  id: string;
  name: string;
  email: string;
}

export type TaskStatus = "TO_DO" | "IN_PROGRESS" | "BLOCKED" | "DONE";

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  user: User;
  createdAt: string;
  updatedAt: string;
  finishedAt: string;
}

export interface GetTasksResult {
  tasks: Task[];
}
