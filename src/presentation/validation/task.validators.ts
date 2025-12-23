// Presentation Layer - Task Validators
import { Validator, ValidationRules, FieldValidation } from './validator.js';

export class TaskValidators {
    private validator = new Validator();

    validateCreateTask(data: Record<string, unknown>): void {
        const validations: FieldValidation[] = [
            {
                field: 'title',
                rules: [
                    ValidationRules.required(),
                    ValidationRules.string(),
                    ValidationRules.minLength(1),
                    ValidationRules.maxLength(255),
                ],
            },
            {
                field: 'description',
                rules: [
                    ValidationRules.required(),
                    ValidationRules.string(),
                    ValidationRules.minLength(1),
                    ValidationRules.maxLength(2000),
                ],
            },
        ];

        this.validator.validate(data, validations);
    }

    validateUpdateTask(data: Record<string, unknown>): void {
        const validations: FieldValidation[] = [
            {
                field: 'title',
                rules: [
                    ValidationRules.required(),
                    ValidationRules.string(),
                    ValidationRules.minLength(1),
                    ValidationRules.maxLength(255),
                ],
            },
            {
                field: 'description',
                rules: [
                    ValidationRules.required(),
                    ValidationRules.string(),
                    ValidationRules.minLength(1),
                    ValidationRules.maxLength(2000),
                ],
            },
        ];

        this.validator.validate(data, validations);
    }

    validateTaskId(id: string): void {
        const validations: FieldValidation[] = [
            {
                field: 'id',
                rules: [ValidationRules.required(), ValidationRules.uuid()],
            },
        ];

        this.validator.validate({ id }, validations);
    }
}
