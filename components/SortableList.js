export class SortableList extends HTMLUListElement {
    static get observedAttributes() {
        return ['data-items'];
    }

    emptyListPlaceholder;
    getItem;

    #draggedItem;
    #items;
    #placeholder;
    #preview;
    #previewOffset = 10;

    constructor() {
        super();
        this.observer = new MutationObserver((mutationList) => {
            for (const mutation of mutationList) {
                let node;
                if (node = mutation.addedNodes[0]) {
                    if (node === this.#placeholder) continue;

                    node.setAttribute('draggable', true);
                    node.addEventListener('dragstart', this.#dragStartHandler);
                    node.addEventListener('dragover', this.#dragOverHandler);
                } else if (node = mutation.removedNodes[0]) {
                    if (node === this.#placeholder) continue;

                    node.removeEventListener('dragStart', this.#dragStartHandler);
                    node.removeEventListener('dragover', this.#dragOverHandler);
                }
            }
        });

        this.addEventListener('dragend', (event) => {
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
        });

        this.observer.observe(this, { childList: true });
    }

    attributeChangedCallback(name, oldValue, newValue) {
        const items = JSON.parse(newValue);

        if (this.textContent === this.emptyListPlaceholder && !!items.length) {
            this.textContent = '';
        }

        if (this.#items === undefined) {
            items.forEach((item) => this.appendChild(this.getItem(item)));
        } else if (items.length < this.#items.length) {
            const removedItems = this.#items.filter(({ id }) => !items.some((item) => item.id === id));
            removedItems.forEach((item) => this.querySelector(`[data-id="${item.id}"]`).remove());
        } else {
            const newItems = items.filter(({ id }) => !this.#items.some((item) => item.id === id));
            newItems.forEach((item) => this.appendChild(this.getItem(item)));
        }

        if (items.length === 0) {
            this.textContent = this.emptyListPlaceholder;
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

        const placeholder = document.createElement('div');
        placeholder.innerText = 'Insert Here...';
        placeholder.className = 'container';
        placeholder.style.backgroundColor = 'var(--bg-btn)';
        return placeholder;
    }

    #getTargetPreview(event) {
        const { clientX, clientY, currentTarget } = event;
        const targetPreview = document.createElement('div');
        targetPreview.innerText = currentTarget.innerText;
        targetPreview.className = 'container';
        targetPreview.style.position = 'absolute';
        targetPreview.style.left = `${clientX + this.#previewOffset}px`;
        targetPreview.style.top = `${clientY + this.#previewOffset}px`;

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
        this.#preview.style.left = `${clientX + this.#previewOffset}px`;
        this.#preview.style.top = `${clientY + this.#previewOffset}px`;
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
        }
        if (this.#draggedItem.nextSibling === closestItem) {
            where = 'afterend';
        }

        closestItem.insertAdjacentElement(where, this.#placeholder);

    }
}
