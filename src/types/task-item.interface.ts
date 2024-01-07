export interface TaskItem {
    date: string | Date;
    description?: string;
    effort: number;
    id?: string;
    isComplete: boolean;
    order: number;
    rate: number;
    updatedAt: number;
    task: string;
}
