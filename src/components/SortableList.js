import { Subject } from "../services/Subject.js";
import { getDiv } from "../helpers/dom.js";

export class SortableList extends HTMLUListElement {
    static get observedAttributes() {
        return ['data-items'];
    }

    emptyListPlaceholder;
    getItem;

    #draggedItem;
    #items;
    #itemOrderSubject = new Subject();
    #placeholder;
    #preview;
    #previewOffset = 10;

    itemOrder$ = this.#itemOrderSubject.asObservable();

    constructor() {
        super();
        this.classList.add('scrollbar');
        this.observer = new MutationObserver((mutationList) => {
            const shouldSkip = (node) => node === this.#placeholder || node.nodeName === '#text';
            for (const mutation of mutationList) {
                let node;
                if (node = mutation.addedNodes[0]) {
                    if (shouldSkip(node)) continue;

                    node.setAttribute('draggable', true);
                    node.addEventListener('dragstart', this.#dragStartHandler);
                    node.addEventListener('dragover', this.#dragOverHandler);
                } else if (node = mutation.removedNodes[0]) {
                    if (shouldSkip(node)) continue;

                    node.removeEventListener('dragStart', this.#dragStartHandler);
                    node.removeEventListener('dragover', this.#dragOverHandler);
                }
            }
            this.#checkScrollabilityAndAdjust();
        });

        this.addEventListener('dragend', () => {
            this.#draggedItem = null;
            this.#preview?.remove();
            this.#placeholder?.remove();
        });

        this.addEventListener('drag', (event) => {
            this.#repositionTargetPreview(event);
        })

        this.addEventListener('dragover', (event) => {
            event.preventDefault();
        });

        this.addEventListener('drop', (event) => {
            event.preventDefault();
            this.insertBefore(this.#draggedItem, this.#placeholder);
            this.#preview?.remove();
            this.#placeholder?.remove();

            const itemsOrder = [...this.children].map((item) => item.getAttribute('data-id'));
            this.#itemOrderSubject.next(itemsOrder);
        });

        this.observer.observe(this, { childList: true });
    }

    attributeChangedCallback(name, oldValue, newValue) {
        const items = JSON.parse(newValue);

        if (this.innerHTML.includes(this.emptyListPlaceholder) && !!items.length) {
            this.innerHTML = '';
        }

        if (this.#items === undefined) {
            items.forEach((item) => this.appendChild(this.getItem(item)));
        } else if (items.length < this.#items.length) {
            const removedItems = this.#items.filter(({ id }) => !items.some((item) => item.id === id));
            removedItems.forEach((item) => this.querySelector(`[data-id="${item.id}"]`).remove());
        } else if (items.length > this.#items.length) {
            const newItems = items.filter(({ id }) => !this.#items.some((item) => item.id === id));
            newItems.forEach((item) => this.appendChild(this.getItem(item)));
        } else {
            const updatedItem = items.find((item) => {
                const matchingItem = this.#items.find((cachedItem) => item.id === cachedItem.id);
                return matchingItem.updatedAt !== item.updatedAt;
            });

            if (updatedItem) {
                const elementToBeUpdated = this.querySelector(`[data-id="${updatedItem.id}"]`);
                elementToBeUpdated.dataset.data = JSON.stringify(updatedItem);
            }
        }

        if (items.length === 0) {
            this.innerHTML = `<div style="font-size: 1.2em; padding-block: 1.5em;" class="d-flex column gap-xl align-center center">
                <i style="font-size: 2em;" class="fa-solid fa-list"></i>
                ${this.emptyListPlaceholder}
            </div>`;
        }

        this.#items = items;
    }

    disconnectedCallback() {
        this.observer.disconnect();
    }

    #createPlaceholder() {
        if (this.#placeholder) {
            return this.#placeholder;
        }

        const placeholder = getDiv();
        placeholder.innerText = 'Insert here...';
        placeholder.className = 'placeholder';
        return placeholder;
    }

    #getTargetPreview(event) {
        const { clientX, clientY, currentTarget } = event;
        const targetPreview = getDiv();
        targetPreview.innerHTML = `<i class="fa-solid fa-grip-vertical"></i> ${currentTarget.innerText} `;
        targetPreview.classList.add('target-preview');
        targetPreview.style.left = `${clientX + this.#previewOffset}px`;
        targetPreview.style.top = `${clientY + this.#previewOffset + document.scrollingElement.scrollTop}px`;

        document.body.appendChild(targetPreview);

        const image = new Image();
        const transparentPixel = 'data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==';
        image.src = transparentPixel;
        Promise.resolve().then(() => {
            event.dataTransfer.setDragImage(image, 0, 0);
        });

        return targetPreview;
    }

    #repositionTargetPreview({ clientX, clientY }) {
        if (!clientX || !clientY) {
            return;
        }

        this.#preview.style.left = `${clientX + this.#previewOffset}px`;
        this.#preview.style.top = `${clientY + this.#previewOffset + document.scrollingElement.scrollTop}px`;
    }

    #dragStartHandler = (event) => {
        this.#draggedItem = event.target;
        this.#preview = this.#getTargetPreview(event);
    }

    #dragOverHandler = (event) => {
        event.preventDefault();
        const closestItem = event.target.closest(event.currentTarget.tagName);

        if (closestItem === this.#draggedItem) {
            this.#placeholder?.remove();
            return;
        }

        this.#placeholder = this.#createPlaceholder();

        const { bottom, top } = closestItem.getBoundingClientRect();
        const { clientY } = event;
        const isFirstHalf = Math.abs(top - clientY) < Math.abs(bottom - clientY);

        let where = isFirstHalf ? 'beforebegin' : 'afterend';

        if (this.#draggedItem.previousSibling === closestItem) {
            where = 'beforebegin';
        } else if (this.#draggedItem.nextSibling === closestItem) {
            where = 'afterend';
        }

        closestItem.insertAdjacentElement(where, this.#placeholder);
    }

    #checkScrollabilityAndAdjust() {
        const isScrollable = this.scrollHeight > this.offsetHeight;
        this.style.paddingRight = isScrollable ? 'var(--inner-padding)' : 'unset';
        this.style.overflowY = isScrollable ? 'scroll' : 'hidden';
    }
}
