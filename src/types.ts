export interface Paginated<T> {
  items: T[];
  totalCount: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  currentPage: number;
  totalPages: number;
}
export type PaginatedProjects = Paginated<Project>;
export type PaginatedTasks = Paginated<Task>;
export type PaginatedUsers = Paginated<User>;

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

export interface Project {
  id: string;
  title: string
  description?: string
  ownerId: string
  owner: User
  members: string[]
  membersList: User[]
  createdAt: string
  updatedAt: string
}

export type TaskStatus = "TO_DO" | "IN_PROGRESS" | "BLOCKED" | "DONE";

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  assignee: User;
  projectId: string;
  createdAt: string;
  updatedAt: string;
  finishedAt: string;
}

export interface GetTasksResult {
  tasks: Task[];
}
