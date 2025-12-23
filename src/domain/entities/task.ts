// Domain Layer - Task Entity
import { TaskId } from '../value-objects/task-id.js';

export interface TaskProps {
    id: TaskId;
    title: string;
    description: string;
    completed: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export class Task {
    private readonly props: TaskProps;

    private constructor(props: TaskProps) {
        this.props = props;
    }

    public static create(title: string, description: string): Task {
        const now = new Date();
        return new Task({
            id: TaskId.create(),
            title,
            description,
            completed: false,
            createdAt: now,
            updatedAt: now,
        });
    }

    public static reconstruct(props: TaskProps): Task {
        return new Task(props);
    }

    public get id(): TaskId {
        return this.props.id;
    }

    public get title(): string {
        return this.props.title;
    }

    public get description(): string {
        return this.props.description;
    }

    public get completed(): boolean {
        return this.props.completed;
    }

    public get createdAt(): Date {
        return this.props.createdAt;
    }

    public get updatedAt(): Date {
        return this.props.updatedAt;
    }

    public update(title: string, description: string): void {
        this.props.title = title;
        this.props.description = description;
        this.props.updatedAt = new Date();
    }

    public markAsComplete(): void {
        this.props.completed = true;
        this.props.updatedAt = new Date();
    }

    public markAsIncomplete(): void {
        this.props.completed = false;
        this.props.updatedAt = new Date();
    }

    public toJSON(): TaskJSON {
        return {
            id: this.props.id.value,
            title: this.props.title,
            description: this.props.description,
            completed: this.props.completed,
            createdAt: this.props.createdAt.toISOString(),
            updatedAt: this.props.updatedAt.toISOString(),
        };
    }
}

export interface TaskJSON {
    id: string;
    title: string;
    description: string;
    completed: boolean;
    createdAt: string;
    updatedAt: string;
}
