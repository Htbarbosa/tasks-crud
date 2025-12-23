// Application Layer - Get Task By Id Use Case
import { ITaskRepository } from '../../domain/repositories/task-repository.interface.js';
import { TaskId } from '../../domain/value-objects/task-id.js';
import { TaskResponseDTO } from '../dtos/task.dto.js';
import { IUseCase } from './use-case.interface.js';
import { AppError } from '../../shared/errors/app-error.js';

export class GetTaskByIdUseCase implements IUseCase<string, TaskResponseDTO> {
    constructor(private readonly taskRepository: ITaskRepository) { }

    async execute(id: string): Promise<TaskResponseDTO> {
        const taskId = TaskId.fromString(id);
        const task = await this.taskRepository.findById(taskId);

        if (!task) {
            throw new AppError('Task not found', 404);
        }

        return task.toJSON();
    }
}
