// Application Layer - Import Tasks From CSV Use Case
import { Task } from '../../domain/entities/task.js';
import { ITaskRepository } from '../../domain/repositories/task-repository.interface.js';
import { TaskId } from '../../domain/value-objects/task-id.js';
import { ImportTaskDTO, TaskResponseDTO } from '../dtos/task.dto.js';
import { IUseCase } from './use-case.interface.js';

export class ImportTasksFromCsvUseCase implements IUseCase<ImportTaskDTO[], TaskResponseDTO[]> {
    constructor(private readonly taskRepository: ITaskRepository) { }

    async execute(input: ImportTaskDTO[]): Promise<TaskResponseDTO[]> {
        const now = new Date();
        const tasks: Task[] = input.map((dto) => {
            const task = Task.reconstruct({
                id: TaskId.create(),
                title: dto.title,
                description: dto.description,
                completed: dto.completed,
                createdAt: now,
                updatedAt: now,
            });
            return task;
        });

        await this.taskRepository.createMany(tasks);

        return tasks.map((task) => task.toJSON());
    }
}
