import './sortable-list.css';
import { Subject } from "@services/Subject";
import { getDiv } from "@helpers/dom.js";
import type { ListItem } from "../../types";

export class SortableList extends HTMLUListElement {
    static get observedAttributes() {
        return ['data-items'];
    }


    private readonly observer: MutationObserver;
    private draggedItem: Node
    private items: { id: string; updatedAt: number }[];
    private itemOrderSubject = new Subject<string[]>();
    private placeholder: HTMLDivElement;
    private preview: HTMLDivElement;
    private readonly previewOffset = 10;

    public emptyListPlaceholder: string;
    public getItem: (item: ListItem) => HTMLElement;
    public itemOrder$ = this.itemOrderSubject.asObservable();


    constructor() {
        super();
        this.classList.add('scrollbar');
        this.observer = new MutationObserver((mutationList) => {
            const shouldSkip = (node: HTMLElement) => node === this.placeholder || node.nodeName === '#text';
            for (const mutation of mutationList) {
                let node: HTMLElement;
                if (node = mutation.addedNodes[0] as HTMLElement) {
                    if (shouldSkip(node)) continue;

                    node.setAttribute('draggable', 'true');
                    node.addEventListener('dragstart', this.dragStartHandler);
                    node.addEventListener('dragover', this.dragOverHandler);
                } else if (node = mutation.removedNodes[0] as HTMLElement) {
                    if (shouldSkip(node)) continue;

                    node.removeEventListener('dragStart', this.dragStartHandler);
                    node.removeEventListener('dragover', this.dragOverHandler);
                }
            }
            this.checkScrollabilityAndAdjust();
        });

        this.ondragend = () => {
            this.draggedItem = null;
            this.preview?.remove();
            this.placeholder?.remove();
        }
        this.ondrag = (event: DragEvent) => this.repositionTargetPreview(event);
        this.ondragover = (event: DragEvent) => event.preventDefault();
        this.ondrop = (event: DragEvent) => {
            event.preventDefault();
            this.insertBefore(this.draggedItem, this.placeholder);
            this.preview?.remove();
            this.placeholder?.remove();

            const itemsOrder = [...this.children].map((item) => item.getAttribute('data-id'));
            this.itemOrderSubject.next(itemsOrder);
        };

        this.observer.observe(this, { childList: true });
    }

    private attributeChangedCallback(name: string, oldValue: string, newValue: string): void {
        const items = JSON.parse(newValue) as { id: string; updatedAt: number; }[];

        if (this.innerHTML.includes(this.emptyListPlaceholder) && !!items.length) {
            this.innerHTML = '';
        }

        if (this.items === undefined) {
            items.forEach((item) => this.appendChild(this.getItem(item)));
        } else if (items.length < this.items.length) {
            const removedItems = this.items.filter(({ id }) => !items.some((item) => item.id === id));
            removedItems.forEach((item) => this.querySelector(`[data-id="${item.id}"]`).remove());
        } else if (items.length > this.items.length) {
            const newItems = items.filter(({ id }) => !this.items.some((item) => item.id === id));
            newItems.forEach((item) => this.appendChild(this.getItem(item)));
        } else {
            const updatedItem = items.find((item) => {
                const matchingItem = this.items.find((cachedItem) => item.id === cachedItem.id);
                return matchingItem.updatedAt !== item.updatedAt;
            });

            if (updatedItem) {
                const elementToBeUpdated = this.querySelector(`[data-id="${updatedItem.id}"]`) as HTMLElement;
                elementToBeUpdated.dataset.data = JSON.stringify(updatedItem);
            }
        }

        if (items.length === 0) {
            this.innerHTML = `<div style="font-size: 1.2em; padding-block: 1.5em;" class="d-flex column gap-xl align-center center">
                <span style="font-size: 3em;" class="material-symbols-outlined">checklist</span>
                ${this.emptyListPlaceholder}
            </div>`;
        }

        this.items = items;
    }

    private disconnectedCallback(): void {
        this.observer.disconnect();
    }

    private createPlaceholder(): HTMLDivElement {
        if (this.placeholder) {
            return this.placeholder;
        }

        const placeholder = getDiv();
        placeholder.innerText = 'Insert here...';
        placeholder.className = 'placeholder';
        return placeholder;
    }

    private getTargetPreview(event: DragEvent): HTMLDivElement {
        const { clientX, clientY, currentTarget } = event;
        const targetPreview = getDiv();
        targetPreview.innerHTML = `<span class="material-symbols-outlined">drag_indicator</span> ${(currentTarget as HTMLElement).dataset.previewLabel} `;
        targetPreview.classList.add('target-preview');
        targetPreview.style.left = `${clientX + this.previewOffset}px`;
        targetPreview.style.top = `${clientY + this.previewOffset + document.scrollingElement.scrollTop}px`;

        document.body.appendChild(targetPreview);

        if (event.type === 'dragstart') {
            const image = new Image();
            const transparentPixel = 'data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==';
            image.src = transparentPixel;
            Promise.resolve().then(() => {
                event.dataTransfer.setDragImage(image, 0, 0);
            });
        }

        return targetPreview;
    }

    private repositionTargetPreview({ clientX, clientY }: DragEvent): void {
        if (!clientX || !clientY) {
            return;
        }

        this.preview.style.left = `${clientX + this.previewOffset}px`;
        this.preview.style.top = `${clientY + this.previewOffset + document.scrollingElement.scrollTop}px`;
    }

    private dragStartHandler = (event: DragEvent) => {
        this.draggedItem = event.target as Node;
        this.preview = this.getTargetPreview(event);
    }

    private dragOverHandler = (event: DragEvent): void => {
        event.preventDefault();
        const closestItem = (event.target as HTMLElement).closest((event.currentTarget as HTMLElement).tagName);

        if (closestItem === this.draggedItem) {
            this.placeholder?.remove();
            return;
        }

        this.placeholder = this.createPlaceholder();

        const { bottom, top } = closestItem.getBoundingClientRect();
        const { clientY } = event;
        const isFirstHalf = Math.abs(top - clientY) < Math.abs(bottom - clientY);

        let where: InsertPosition = isFirstHalf ? 'beforebegin' : 'afterend';

        if (this.draggedItem.previousSibling === closestItem) {
            where = 'beforebegin';
        } else if (this.draggedItem.nextSibling === closestItem) {
            where = 'afterend';
        }

        closestItem.insertAdjacentElement(where, this.placeholder);
    }

    private checkScrollabilityAndAdjust(): void {
        const isScrollable = this.scrollHeight > this.offsetHeight;
        this.style.paddingRight = isScrollable ? 'var(--inner-padding)' : 'unset';
        this.style.overflowY = isScrollable ? 'scroll' : 'hidden';
    }
}
