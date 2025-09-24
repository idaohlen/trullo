import type { Task as MongooseTask } from "../../server/models/Task";
import type { User } from "../../server/models/User";

export interface Task extends Omit<MongooseTask, "_id"> {
  id: string;
  user?: User | null;
}

export type AsyncResolver = (parent: any, args: any, context: any, info: any) => Promise<any>;
export type Middleware = (next: AsyncResolver) => AsyncResolver;
