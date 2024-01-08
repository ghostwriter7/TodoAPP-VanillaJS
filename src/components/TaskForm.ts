import { BaseComponent } from "@components/BaseComponent.js";
import { taskEditInitEvent } from "@consts/events.js";
import { required } from "@helpers/validators.js";
import { FormMode } from "@consts/form-mode.js";
import { Injector } from "@services/Injector.ts";
import { TaskService } from "@services/TaskService.ts";
import { FormGroup } from "@components/form-group/FormGroup.ts";
import { SubmitFormEvent } from "../types";

interface TaskFormGroup {
    id?: string;
    task: string;
    description: string;
    effort: number;
    rate: number
}

export class TaskForm extends BaseComponent {
    date: string;
    detailsEl: HTMLDetailsElement;
    formGroup: FormGroup<TaskFormGroup>;
    taskEditInitHandler: (event: SubmitFormEvent<TaskFormGroup>) => void;

    private readonly taskService: TaskService;

    constructor() {
        super();
        this.taskService = Injector.resolve(TaskService);
    }

    private connectedCallback(): void {
        this.buildFormGroup();
        this.buildNativeAccordion();
        this.handleTaskEdit();
    }

    private disconnectedCallback(): void {
        removeEventListener(taskEditInitEvent, this.taskEditInitHandler);
    }

    private handleTaskEdit(): void {
        this.taskEditInitHandler = (event: SubmitFormEvent<TaskFormGroup>) => {
            const { payload } = event;
            this.formGroup.setValue(payload);
            this.formGroup.dataset.mode = FormMode.Update;
            this.detailsEl.open = true;
        };
        addEventListener(taskEditInitEvent, this.taskEditInitHandler);
    }

    private buildFormGroup(): void {
        this.formGroup = document.createElement('form', { is: 'form-group' }) as FormGroup<TaskFormGroup>;
        this.formGroup.formControls = [
            {
                label: "Task",
                id: "task",
                placeholder: "To win the world before lunchtime...",
                type: "text",
                validators: [required],
                validationMessage: {
                    required: `Task's text is required.`
                }
            },
            {
                label: "Description",
                id: "description",
                placeholder: "All the nitty-gritty about what and how comes here...",
                type: "textarea",
            },
            {
                defaultValue: 2,
                label: "Priority",
                id: 'priority',
                type: 'rate',
                levels: 3
            },
            {
                defaultValue: 3,
                label: "Effort",
                id: 'effort',
                type: 'rate',
                levels: 5
            }
        ];
        this.formGroup.onSubmitCallback = ({ id, ...data }) => {
            id ? this.taskService.updateTask(id, data) : this.taskService.addTask(data);
        };
        this.formGroup.dataset.mode = FormMode.Create;

    }

    private buildNativeAccordion(): void {
        this.detailsEl = document.createElement('details');
        this.detailsEl.classList.add('container', 'fs-lg');
        const summaryEl = document.createElement('summary');
        summaryEl.innerText = 'Task Form';
        this.detailsEl.appendChild(summaryEl);
        this.detailsEl.appendChild(this.formGroup);
        this.appendChild(this.detailsEl);
    }
}
