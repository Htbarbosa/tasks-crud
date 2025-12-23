// Infrastructure Layer - SQLite Task Repository
import type { Database } from 'better-sqlite3';
import { Task } from '../../domain/entities/task.js';
import { ITaskRepository, TaskFilter } from '../../domain/repositories/task-repository.interface.js';
import { TaskId } from '../../domain/value-objects/task-id.js';

interface TaskRow {
    id: string;
    title: string;
    description: string;
    completed: number;
    created_at: string;
    updated_at: string;
}

export class SqliteTaskRepository implements ITaskRepository {
    constructor(private readonly db: Database) { }

    async create(task: Task): Promise<void> {
        const stmt = this.db.prepare(`
      INSERT INTO tasks (id, title, description, completed, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

        stmt.run(
            task.id.value,
            task.title,
            task.description,
            task.completed ? 1 : 0,
            task.createdAt.toISOString(),
            task.updatedAt.toISOString()
        );
    }

    async findById(id: TaskId): Promise<Task | null> {
        const stmt = this.db.prepare<string, TaskRow>(`
      SELECT id, title, description, completed, created_at, updated_at
      FROM tasks
      WHERE id = ?
    `);

        const row = stmt.get(id.value);

        if (!row) {
            return null;
        }

        return this.rowToTask(row);
    }

    async findAll(filter?: TaskFilter): Promise<Task[]> {
        let query = 'SELECT id, title, description, completed, created_at, updated_at FROM tasks WHERE 1=1';
        const params: string[] = [];

        if (filter?.title) {
            query += ' AND title LIKE ?';
            params.push(`%${filter.title}%`);
        }

        if (filter?.description) {
            query += ' AND description LIKE ?';
            params.push(`%${filter.description}%`);
        }

        query += ' ORDER BY created_at DESC';

        const stmt = this.db.prepare<string[], TaskRow>(query);
        const rows = stmt.all(...params);

        return rows.map((row) => this.rowToTask(row));
    }

    async update(task: Task): Promise<void> {
        const stmt = this.db.prepare(`
      UPDATE tasks
      SET title = ?, description = ?, completed = ?, updated_at = ?
      WHERE id = ?
    `);

        stmt.run(
            task.title,
            task.description,
            task.completed ? 1 : 0,
            task.updatedAt.toISOString(),
            task.id.value
        );
    }

    async delete(id: TaskId): Promise<boolean> {
        const stmt = this.db.prepare('DELETE FROM tasks WHERE id = ?');
        const result = stmt.run(id.value);
        return result.changes > 0;
    }

    async createMany(tasks: Task[]): Promise<void> {
        const stmt = this.db.prepare(`
      INSERT INTO tasks (id, title, description, completed, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

        const insertMany = this.db.transaction((tasksToInsert: Task[]) => {
            for (const task of tasksToInsert) {
                stmt.run(
                    task.id.value,
                    task.title,
                    task.description,
                    task.completed ? 1 : 0,
                    task.createdAt.toISOString(),
                    task.updatedAt.toISOString()
                );
            }
        });

        insertMany(tasks);
    }

    private rowToTask(row: TaskRow): Task {
        return Task.reconstruct({
            id: TaskId.fromString(row.id),
            title: row.title,
            description: row.description,
            completed: row.completed === 1,
            createdAt: new Date(row.created_at),
            updatedAt: new Date(row.updated_at),
        });
    }
}
