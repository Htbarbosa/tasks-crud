// Application Layer - Update Task Use Case
import { ITaskRepository } from '../../domain/repositories/task-repository.interface.js';
import { TaskId } from '../../domain/value-objects/task-id.js';
import { UpdateTaskDTO, TaskResponseDTO } from '../dtos/task.dto.js';
import { IUseCase } from './use-case.interface.js';
import { AppError } from '../../shared/errors/app-error.js';

interface UpdateTaskInput {
    id: string;
    data: UpdateTaskDTO;
}

export class UpdateTaskUseCase implements IUseCase<UpdateTaskInput, TaskResponseDTO> {
    constructor(private readonly taskRepository: ITaskRepository) { }

    async execute(input: UpdateTaskInput): Promise<TaskResponseDTO> {
        const taskId = TaskId.fromString(input.id);
        const task = await this.taskRepository.findById(taskId);

        if (!task) {
            throw new AppError('Task not found', 404);
        }

        task.update(input.data.title, input.data.description);
        await this.taskRepository.update(task);

        return task.toJSON();
    }
}
