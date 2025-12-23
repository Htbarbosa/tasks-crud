// Domain Layer - Task Repository Interface
import { Task } from '../entities/task.js';
import { TaskId } from '../value-objects/task-id.js';

export interface TaskFilter {
    title?: string | undefined;
    description?: string | undefined;
}
export interface ITaskRepository {
    create(task: Task): Promise<void>;
    findById(id: TaskId): Promise<Task | null>;
    findAll(filter?: TaskFilter): Promise<Task[]>;
    update(task: Task): Promise<void>;
    delete(id: TaskId): Promise<boolean>;
    createMany(tasks: Task[]): Promise<void>;
}
