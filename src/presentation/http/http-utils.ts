// Presentation Layer - HTTP Utilities
import { IncomingMessage, ServerResponse } from 'node:http';

export interface HttpRequest {
    method: string;
    url: URL;
    params: Record<string, string>;
    query: Record<string, string>;
    body: unknown;
    raw: IncomingMessage;
}

export interface HttpResponse {
    statusCode: number;
    headers: Record<string, string>;
    body: unknown;
}

export function sendJson(
    res: ServerResponse,
    statusCode: number,
    data: unknown
): void {
    res.writeHead(statusCode, {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
    });
    res.end(JSON.stringify(data));
}

export function sendError(
    res: ServerResponse,
    statusCode: number,
    message: string
): void {
    sendJson(res, statusCode, {
        error: true,
        message,
        statusCode,
    });
}

export function sendSuccess(
    res: ServerResponse,
    statusCode: number,
    data: unknown,
    message?: string
): void {
    sendJson(res, statusCode, {
        error: false,
        message: message ?? 'Success',
        data,
    });
}

export function sendNoContent(res: ServerResponse): void {
    res.writeHead(204, {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
    });
    res.end();
}

export async function parseJsonBody<T>(req: IncomingMessage): Promise<T> {
    return new Promise((resolve, reject) => {
        let body = '';

        req.on('data', (chunk: Buffer) => {
            body += chunk.toString();
        });

        req.on('end', () => {
            if (!body) {
                resolve({} as T);
                return;
            }

            try {
                const parsed = JSON.parse(body) as T;
                resolve(parsed);
            } catch {
                reject(new Error('Invalid JSON body'));
            }
        });

        req.on('error', reject);
    });
}

export function parseQueryParams(url: URL): Record<string, string> {
    const params: Record<string, string> = {};

    url.searchParams.forEach((value, key) => {
        params[key] = value;
    });

    return params;
}
