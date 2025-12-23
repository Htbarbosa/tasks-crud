// Presentation Layer - Validation Module
import { AppError } from '../../shared/errors/app-error.js';

export interface ValidationRule<T> {
    validate(value: T): boolean;
    message: string;
}

export interface FieldValidation {
    field: string;
    rules: ValidationRule<unknown>[];
}

export class Validator {
    private errors: string[] = [];

    validate<T extends Record<string, unknown>>(
        data: T,
        validations: FieldValidation[]
    ): void {
        this.errors = [];

        for (const validation of validations) {
            const value = data[validation.field];

            for (const rule of validation.rules) {
                if (!rule.validate(value)) {
                    this.errors.push(`${validation.field}: ${rule.message}`);
                }
            }
        }

        if (this.errors.length > 0) {
            throw new AppError(`Validation failed: ${this.errors.join(', ')}`, 400);
        }
    }

    getErrors(): string[] {
        return [...this.errors];
    }
}

// Common Validation Rules
export const ValidationRules = {
    required: (): ValidationRule<unknown> => ({
        validate: (value) => value !== undefined && value !== null && value !== '',
        message: 'is required',
    }),

    string: (): ValidationRule<unknown> => ({
        validate: (value) => typeof value === 'string',
        message: 'must be a string',
    }),

    minLength: (min: number): ValidationRule<unknown> => ({
        validate: (value) => typeof value === 'string' && value.length >= min,
        message: `must be at least ${min} characters`,
    }),

    maxLength: (max: number): ValidationRule<unknown> => ({
        validate: (value) => typeof value === 'string' && value.length <= max,
        message: `must be at most ${max} characters`,
    }),

    uuid: (): ValidationRule<unknown> => ({
        validate: (value) => {
            if (typeof value !== 'string') return false;
            const uuidRegex =
                /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
            return uuidRegex.test(value);
        },
        message: 'must be a valid UUID',
    }),

    boolean: (): ValidationRule<unknown> => ({
        validate: (value) => typeof value === 'boolean',
        message: 'must be a boolean',
    }),
};
