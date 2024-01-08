import type { ListItem } from "./list-item.interface.ts";

export interface TaskItem extends ListItem {
    date: string | Date;
    description?: string;
    effort: number;
    isComplete: boolean;
    order: number;
    priority: number;
    task: string;
}
