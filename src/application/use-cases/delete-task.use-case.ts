// Application Layer - Delete Task Use Case
import { ITaskRepository } from '../../domain/repositories/task-repository.interface.js';
import { TaskId } from '../../domain/value-objects/task-id.js';
import { IUseCase } from './use-case.interface.js';
import { AppError } from '../../shared/errors/app-error.js';

export class DeleteTaskUseCase implements IUseCase<string, void> {
    constructor(private readonly taskRepository: ITaskRepository) { }

    async execute(id: string): Promise<void> {
        const taskId = TaskId.fromString(id);
        const deleted = await this.taskRepository.delete(taskId);

        if (!deleted) {
            throw new AppError('Task not found', 404);
        }
    }
}
