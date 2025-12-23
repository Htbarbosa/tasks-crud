// Main Entry Point - Dependency Injection Container
import { ITaskRepository } from './domain/repositories/task-repository.interface.js';
import {
    CreateTaskUseCase,
    ListTasksUseCase,
    GetTaskByIdUseCase,
    UpdateTaskUseCase,
    DeleteTaskUseCase,
    MarkTaskCompleteUseCase,
    ImportTasksFromCsvUseCase,
} from './application/index.js';
import {
    InMemoryTaskRepository,
    SqliteTaskRepository,
    createDatabase,
    CsvParserService,
} from './infrastructure/index.js';
import { TaskController, HttpServer } from './presentation/index.js';

type StorageType = 'memory' | 'sqlite';

function createTaskRepository(storageType: StorageType): ITaskRepository {
    switch (storageType) {
        case 'sqlite':
            const db = createDatabase();
            return new SqliteTaskRepository(db);
        case 'memory':
        default:
            return new InMemoryTaskRepository();
    }
}

function bootstrap(): void {
    const PORT = parseInt(process.env['PORT'] ?? '3000', 10);
    const STORAGE_TYPE = (process.env['STORAGE_TYPE'] ?? 'sqlite') as StorageType;

    console.log(`📦 Using ${STORAGE_TYPE} storage`);

    // Infrastructure
    const taskRepository = createTaskRepository(STORAGE_TYPE);
    const csvParserService = new CsvParserService();

    // Use Cases
    const createTaskUseCase = new CreateTaskUseCase(taskRepository);
    const listTasksUseCase = new ListTasksUseCase(taskRepository);
    const getTaskByIdUseCase = new GetTaskByIdUseCase(taskRepository);
    const updateTaskUseCase = new UpdateTaskUseCase(taskRepository);
    const deleteTaskUseCase = new DeleteTaskUseCase(taskRepository);
    const markTaskCompleteUseCase = new MarkTaskCompleteUseCase(taskRepository);
    const importTasksFromCsvUseCase = new ImportTasksFromCsvUseCase(taskRepository);

    // Controllers
    const taskController = new TaskController(
        createTaskUseCase,
        listTasksUseCase,
        getTaskByIdUseCase,
        updateTaskUseCase,
        deleteTaskUseCase,
        markTaskCompleteUseCase,
        importTasksFromCsvUseCase,
        csvParserService
    );

    // Server
    const server = new HttpServer(taskController);
    server.start(PORT);
}

bootstrap();
