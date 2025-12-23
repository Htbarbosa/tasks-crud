// Application Layer - List Tasks Use Case
import { ITaskRepository } from '../../domain/repositories/task-repository.interface.js';
import { ListTasksFilterDTO, TaskResponseDTO } from '../dtos/task.dto.js';
import { IUseCase } from './use-case.interface.js';

export class ListTasksUseCase implements IUseCase<ListTasksFilterDTO, TaskResponseDTO[]> {
    constructor(private readonly taskRepository: ITaskRepository) { }

    async execute(input: ListTasksFilterDTO): Promise<TaskResponseDTO[]> {
        const tasks = await this.taskRepository.findAll(input);
        return tasks.map((task) => task.toJSON());
    }
}
