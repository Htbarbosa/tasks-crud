// Presentation Layer - HTTP Server
import { createServer, IncomingMessage, ServerResponse } from 'node:http';
import { Router } from './http/router.js';
import { HttpRequest, parseJsonBody, parseQueryParams, sendError } from './http/http-utils.js';
import { TaskController } from './controllers/task.controller.js';

export class HttpServer {
    private readonly router = new Router();

    constructor(private readonly taskController: TaskController) {
        this.setupRoutes();
    }

    private setupRoutes(): void {
        // Task routes
        this.router.get('/tasks', (req, res) => this.taskController.list(req, res));
        this.router.get('/tasks/:id', (req, res) => this.taskController.getById(req, res));
        this.router.post('/tasks', (req, res) => this.taskController.create(req, res));
        this.router.put('/tasks/:id', (req, res) => this.taskController.update(req, res));
        this.router.delete('/tasks/:id', (req, res) => this.taskController.delete(req, res));
        this.router.patch('/tasks/:id/complete', (req, res) => this.taskController.markComplete(req, res));
        this.router.post('/tasks/import', (req, res) => this.taskController.importFromCsv(req, res));
    }

    private async buildRequest(
        req: IncomingMessage,
        params: Record<string, string>
    ): Promise<HttpRequest> {
        const url = new URL(req.url ?? '/', `http://${req.headers.host ?? 'localhost'}`);
        const query = parseQueryParams(url);

        let body: unknown = {};
        const contentType = req.headers['content-type'] ?? '';

        if (
            contentType.includes('application/json') &&
            (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH')
        ) {
            body = await parseJsonBody(req);
        }

        return {
            method: req.method ?? 'GET',
            url,
            params,
            query,
            body,
            raw: req,
        };
    }

    start(port: number): void {
        const server = createServer(async (req: IncomingMessage, res: ServerResponse) => {
            try {
                const handled = await this.router.handle(req, res, (req, params) =>
                    this.buildRequest(req, params)
                );

                if (!handled) {
                    sendError(res, 404, 'Not Found');
                }
            } catch (error) {
                console.error('Server error:', error);
                sendError(res, 500, 'Internal Server Error');
            }
        });

        server.listen(port, () => {
            console.log(`🚀 Server running on http://localhost:${port}`);
            console.log('Available endpoints:');
            console.log('  GET    /tasks          - List all tasks (filter: ?title=&description=)');
            console.log('  GET    /tasks/:id      - Get task by ID');
            console.log('  POST   /tasks          - Create a new task');
            console.log('  PUT    /tasks/:id      - Update a task');
            console.log('  DELETE /tasks/:id      - Delete a task');
            console.log('  PATCH  /tasks/:id/complete - Mark task as complete');
            console.log('  POST   /tasks/import   - Import tasks from CSV');
        });
    }
}
