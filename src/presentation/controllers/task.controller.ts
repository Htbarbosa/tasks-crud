// Presentation Layer - Task Controller
import { ServerResponse } from 'node:http';
import {
    CreateTaskUseCase,
    ListTasksUseCase,
    GetTaskByIdUseCase,
    UpdateTaskUseCase,
    DeleteTaskUseCase,
    MarkTaskCompleteUseCase,
    ImportTasksFromCsvUseCase,
    CreateTaskDTO,
    UpdateTaskDTO,
} from '../../application/index.js';
import { CsvParserService } from '../../infrastructure/services/csv-parser.service.js';
import { AppError } from '../../shared/errors/app-error.js';
import {
    HttpRequest,
    sendSuccess,
    sendError,
    sendNoContent,
} from '../http/http-utils.js';
import { parseMultipartForm } from '../http/multipart-parser.js';
import { TaskValidators } from '../validation/task.validators.js';

export class TaskController {
    private readonly validators = new TaskValidators();

    constructor(
        private readonly createTaskUseCase: CreateTaskUseCase,
        private readonly listTasksUseCase: ListTasksUseCase,
        private readonly getTaskByIdUseCase: GetTaskByIdUseCase,
        private readonly updateTaskUseCase: UpdateTaskUseCase,
        private readonly deleteTaskUseCase: DeleteTaskUseCase,
        private readonly markTaskCompleteUseCase: MarkTaskCompleteUseCase,
        private readonly importTasksFromCsvUseCase: ImportTasksFromCsvUseCase,
        private readonly csvParserService: CsvParserService
    ) { }

    async create(req: HttpRequest, res: ServerResponse): Promise<void> {
        try {
            const body = req.body as Record<string, unknown>;
            this.validators.validateCreateTask(body);

            const dto: CreateTaskDTO = {
                title: body['title'] as string,
                description: body['description'] as string,
            };

            const task = await this.createTaskUseCase.execute(dto);
            sendSuccess(res, 201, task, 'Task created successfully');
        } catch (error) {
            this.handleError(res, error);
        }
    }

    async list(req: HttpRequest, res: ServerResponse): Promise<void> {
        try {
            const { title, description } = req.query;

            const tasks = await this.listTasksUseCase.execute({
                title,
                description,
            });

            sendSuccess(res, 200, tasks, 'Tasks retrieved successfully');
        } catch (error) {
            this.handleError(res, error);
        }
    }

    async getById(req: HttpRequest, res: ServerResponse): Promise<void> {
        try {
            const id = req.params['id'];
            if (!id) {
                throw new AppError('Task ID is required', 400);
            }

            this.validators.validateTaskId(id);

            const task = await this.getTaskByIdUseCase.execute(id);
            sendSuccess(res, 200, task, 'Task retrieved successfully');
        } catch (error) {
            this.handleError(res, error);
        }
    }

    async update(req: HttpRequest, res: ServerResponse): Promise<void> {
        try {
            const id = req.params['id'];
            if (!id) {
                throw new AppError('Task ID is required', 400);
            }

            this.validators.validateTaskId(id);

            const body = req.body as Record<string, unknown>;
            this.validators.validateUpdateTask(body);

            const dto: UpdateTaskDTO = {
                title: body['title'] as string,
                description: body['description'] as string,
            };

            const task = await this.updateTaskUseCase.execute({ id, data: dto });
            sendSuccess(res, 200, task, 'Task updated successfully');
        } catch (error) {
            this.handleError(res, error);
        }
    }

    async delete(req: HttpRequest, res: ServerResponse): Promise<void> {
        try {
            const id = req.params['id'];
            if (!id) {
                throw new AppError('Task ID is required', 400);
            }

            this.validators.validateTaskId(id);

            await this.deleteTaskUseCase.execute(id);
            sendNoContent(res);
        } catch (error) {
            this.handleError(res, error);
        }
    }

    async markComplete(req: HttpRequest, res: ServerResponse): Promise<void> {
        try {
            const id = req.params['id'];
            if (!id) {
                throw new AppError('Task ID is required', 400);
            }

            this.validators.validateTaskId(id);

            const task = await this.markTaskCompleteUseCase.execute(id);
            sendSuccess(res, 200, task, 'Task marked as complete');
        } catch (error) {
            this.handleError(res, error);
        }
    }

    async importFromCsv(req: HttpRequest, res: ServerResponse): Promise<void> {
        try {
            const { files } = await parseMultipartForm(req.raw);

            const csvFile = files.find(
                (f) => f.mimetype === 'text/csv' || f.filename.endsWith('.csv')
            );

            if (!csvFile) {
                throw new AppError('CSV file is required', 400);
            }

            const taskDtos = await this.csvParserService.parseTasksCsv(
                csvFile.content
            );

            const tasks = await this.importTasksFromCsvUseCase.execute(taskDtos);
            sendSuccess(
                res,
                201,
                { imported: tasks.length, tasks },
                `${tasks.length} tasks imported successfully`
            );
        } catch (error) {
            this.handleError(res, error);
        }
    }

    private handleError(res: ServerResponse, error: unknown): void {
        if (error instanceof AppError) {
            sendError(res, error.statusCode, error.message);
        } else if (error instanceof Error) {
            console.error('Unexpected error:', error);
            sendError(res, 500, error.message);
        } else {
            sendError(res, 500, 'Internal server error');
        }
    }
}
