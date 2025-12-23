// Shared Layer - Application Error
export class AppError extends Error {
    public readonly statusCode: number;
    public readonly isOperational: boolean;

    constructor(message: string, statusCode = 400, isOperational = true) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        Object.setPrototypeOf(this, AppError.prototype);
        Error.captureStackTrace(this, this.constructor);
    }

    public static badRequest(message: string): AppError {
        return new AppError(message, 400);
    }

    public static notFound(message: string): AppError {
        return new AppError(message, 404);
    }

    public static internal(message: string): AppError {
        return new AppError(message, 500, false);
    }
}
