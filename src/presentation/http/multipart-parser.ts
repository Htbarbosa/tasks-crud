// Presentation Layer - Multipart Parser
import Busboy from 'busboy';
import { IncomingMessage } from 'node:http';

export interface UploadedFile {
    fieldname: string;
    filename: string;
    encoding: string;
    mimetype: string;
    content: Buffer;
}

export async function parseMultipartForm(
    req: IncomingMessage
): Promise<{ files: UploadedFile[]; fields: Record<string, string> }> {
    return new Promise((resolve, reject) => {
        const files: UploadedFile[] = [];
        const fields: Record<string, string> = {};

        try {
            const busboy = Busboy({ headers: req.headers });

            busboy.on('file', (fieldname, file, info) => {
                const chunks: Buffer[] = [];

                file.on('data', (chunk: Buffer) => {
                    chunks.push(chunk);
                });

                file.on('end', () => {
                    files.push({
                        fieldname,
                        filename: info.filename,
                        encoding: info.encoding,
                        mimetype: info.mimeType,
                        content: Buffer.concat(chunks),
                    });
                });
            });

            busboy.on('field', (fieldname, value) => {
                fields[fieldname] = value;
            });

            busboy.on('finish', () => {
                resolve({ files, fields });
            });

            busboy.on('error', (error) => {
                reject(error);
            });

            req.pipe(busboy);
        } catch (error) {
            reject(error);
        }
    });
}
