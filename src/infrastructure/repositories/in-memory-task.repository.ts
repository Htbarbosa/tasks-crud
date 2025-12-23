// Infrastructure Layer - In Memory Task Repository
import { Task } from '../../domain/entities/task.js';
import { ITaskRepository, TaskFilter } from '../../domain/repositories/task-repository.interface.js';
import { TaskId } from '../../domain/value-objects/task-id.js';

export class InMemoryTaskRepository implements ITaskRepository {
    private tasks: Map<string, Task> = new Map();

    async create(task: Task): Promise<void> {
        this.tasks.set(task.id.value, task);
    }

    async findById(id: TaskId): Promise<Task | null> {
        return this.tasks.get(id.value) ?? null;
    }

    async findAll(filter?: TaskFilter): Promise<Task[]> {
        let tasks = Array.from(this.tasks.values());

        if (filter?.title) {
            const titleLower = filter.title.toLowerCase();
            tasks = tasks.filter((task) =>
                task.title.toLowerCase().includes(titleLower)
            );
        }

        if (filter?.description) {
            const descLower = filter.description.toLowerCase();
            tasks = tasks.filter((task) =>
                task.description.toLowerCase().includes(descLower)
            );
        }

        return tasks;
    }

    async update(task: Task): Promise<void> {
        this.tasks.set(task.id.value, task);
    }

    async delete(id: TaskId): Promise<boolean> {
        return this.tasks.delete(id.value);
    }

    async createMany(tasks: Task[]): Promise<void> {
        for (const task of tasks) {
            this.tasks.set(task.id.value, task);
        }
    }
}
