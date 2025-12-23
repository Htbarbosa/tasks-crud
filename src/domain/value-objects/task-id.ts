// Domain Layer - TaskId Value Object
import { randomUUID } from 'node:crypto';

export class TaskId {
    private readonly _value: string;

    private constructor(value: string) {
        this._value = value;
    }

    public static create(): TaskId {
        return new TaskId(randomUUID());
    }

    public static fromString(value: string): TaskId {
        if (!TaskId.isValid(value)) {
            throw new Error(`Invalid TaskId: ${value}`);
        }
        return new TaskId(value);
    }

    public static isValid(value: string): boolean {
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        return uuidRegex.test(value);
    }

    public get value(): string {
        return this._value;
    }

    public equals(other: TaskId): boolean {
        return this._value === other._value;
    }

    public toString(): string {
        return this._value;
    }
}
