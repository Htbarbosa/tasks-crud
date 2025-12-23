// Infrastructure Layer - CSV Parser Service
import { parse } from 'csv-parse';
import { Readable } from 'node:stream';
import { ImportTaskDTO } from '../../application/dtos/task.dto.js';
import { AppError } from '../../shared/errors/app-error.js';

interface CsvTaskRecord {
    title?: string;
    description?: string;
    completed?: string;
}

export class CsvParserService {
    async parseTasksCsv(csvContent: string | Buffer): Promise<ImportTaskDTO[]> {
        const content = Buffer.isBuffer(csvContent)
            ? csvContent.toString('utf-8')
            : csvContent;

        return new Promise((resolve, reject) => {
            const tasks: ImportTaskDTO[] = [];

            const parser = parse({
                columns: true,
                skip_empty_lines: true,
                trim: true,
                relax_column_count: true,
            });

            parser.on('readable', () => {
                let record: CsvTaskRecord | null;
                while ((record = parser.read() as CsvTaskRecord | null) !== null) {
                    const task = this.mapRecordToTask(record);
                    if (task) {
                        tasks.push(task);
                    }
                }
            });

            parser.on('error', (error) => {
                reject(new AppError(`CSV parsing error: ${error.message}`, 400));
            });

            parser.on('end', () => {
                if (tasks.length === 0) {
                    reject(new AppError('No valid tasks found in CSV file', 400));
                }
                resolve(tasks);
            });

            const stream = Readable.from(content);
            stream.pipe(parser);
        });
    }

    private mapRecordToTask(record: CsvTaskRecord): ImportTaskDTO | null {
        const title = record.title?.trim();
        const description = record.description?.trim();

        if (!title || !description) {
            return null;
        }

        const completedValue = record.completed?.trim().toLowerCase();
        const completed =
            completedValue === 'true' ||
            completedValue === '1' ||
            completedValue === 'yes';

        return {
            title,
            description,
            completed,
        };
    }
}
