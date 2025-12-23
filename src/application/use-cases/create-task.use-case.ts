// Application Layer - Create Task Use Case
import { Task } from '../../domain/entities/task.js';
import { ITaskRepository } from '../../domain/repositories/task-repository.interface.js';
import { CreateTaskDTO, TaskResponseDTO } from '../dtos/task.dto.js';
import { IUseCase } from './use-case.interface.js';

export class CreateTaskUseCase implements IUseCase<CreateTaskDTO, TaskResponseDTO> {
    constructor(private readonly taskRepository: ITaskRepository) { }

    async execute(input: CreateTaskDTO): Promise<TaskResponseDTO> {
        const task = Task.create(input.title, input.description);
        await this.taskRepository.create(task);
        return task.toJSON();
    }
}
