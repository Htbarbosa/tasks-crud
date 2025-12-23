// Presentation Layer - Router
import { IncomingMessage, ServerResponse } from 'node:http';
import { HttpRequest, sendError } from './http-utils.js';

export type RouteHandler = (
    req: HttpRequest,
    res: ServerResponse
) => Promise<void>;

interface Route {
    method: string;
    pattern: RegExp;
    paramNames: string[];
    handler: RouteHandler;
}

export class Router {
    private routes: Route[] = [];

    private pathToRegex(path: string): { pattern: RegExp; paramNames: string[] } {
        const paramNames: string[] = [];

        const regexPattern = path.replace(/:([a-zA-Z0-9_]+)/g, (_, paramName) => {
            paramNames.push(paramName);
            return '([a-zA-Z0-9-]+)';
        });

        return {
            pattern: new RegExp(`^${regexPattern}$`),
            paramNames,
        };
    }

    get(path: string, handler: RouteHandler): void {
        const { pattern, paramNames } = this.pathToRegex(path);
        this.routes.push({ method: 'GET', pattern, paramNames, handler });
    }

    post(path: string, handler: RouteHandler): void {
        const { pattern, paramNames } = this.pathToRegex(path);
        this.routes.push({ method: 'POST', pattern, paramNames, handler });
    }

    put(path: string, handler: RouteHandler): void {
        const { pattern, paramNames } = this.pathToRegex(path);
        this.routes.push({ method: 'PUT', pattern, paramNames, handler });
    }

    patch(path: string, handler: RouteHandler): void {
        const { pattern, paramNames } = this.pathToRegex(path);
        this.routes.push({ method: 'PATCH', pattern, paramNames, handler });
    }

    delete(path: string, handler: RouteHandler): void {
        const { pattern, paramNames } = this.pathToRegex(path);
        this.routes.push({ method: 'DELETE', pattern, paramNames, handler });
    }

    async handle(
        req: IncomingMessage,
        res: ServerResponse,
        buildRequest: (
            req: IncomingMessage,
            params: Record<string, string>
        ) => Promise<HttpRequest>
    ): Promise<boolean> {
        const method = req.method ?? 'GET';
        const url = new URL(req.url ?? '/', `http://${req.headers.host ?? 'localhost'}`);
        const pathname = url.pathname;

        // Handle CORS preflight
        if (method === 'OPTIONS') {
            res.writeHead(204, {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
            });
            res.end();
            return true;
        }

        for (const route of this.routes) {
            if (route.method !== method) continue;

            const match = pathname.match(route.pattern);
            if (!match) continue;

            const params: Record<string, string> = {};
            route.paramNames.forEach((name, index) => {
                const value = match[index + 1];
                if (value) {
                    params[name] = value;
                }
            });

            try {
                const httpRequest = await buildRequest(req, params);
                await route.handler(httpRequest, res);
                return true;
            } catch (error) {
                const message = error instanceof Error ? error.message : 'Unknown error';
                sendError(res, 500, message);
                return true;
            }
        }

        return false;
    }
}
