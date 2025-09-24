export interface User {
  id: string;
  name: string;
  email: string;
  role?: string;
  password?: string;
}

export interface InputUser extends User {
  password: string;
}

export type TaskStatus = "TO_DO" | "IN_PROGRESS" | "BLOCKED" | "DONE";

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  assignee: User;
  createdAt: string;
  updatedAt: string;
  finishedAt: string;
}

export interface GetTasksResult {
  tasks: Task[];
}
