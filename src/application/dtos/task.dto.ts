// Application Layer - DTOs
export interface CreateTaskDTO {
    title: string;
    description: string;
}

export interface UpdateTaskDTO {
    title: string;
    description: string;
}

export interface TaskResponseDTO {
    id: string;
    title: string;
    description: string;
    completed: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface ListTasksFilterDTO {
    title?: string | undefined;
    description?: string | undefined;
}

export interface ImportTaskDTO {
    title: string;
    description: string;
    completed: boolean;
}
