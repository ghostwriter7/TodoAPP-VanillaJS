import { beforeAll, beforeEach, describe, expect, it } from "vitest";
import { Document, Window } from 'happy-dom';
import { LoadingBar } from "@components/loading-bar/LoadingBar.ts";

describe('LoadingBar', () => {
    let document: Document;

    beforeAll(async () => {
        const window = new Window();
        document = window.document;

        window.customElements.define('loading-bar', LoadingBar);
        await window.customElements.whenDefined('loading-bar');
    });

    beforeEach(() => {
        document.body.innerHTML = '';
    });

    it('should display a default message next to the spinner', () => {
        document.body.appendChild(document.createElement('loading-bar'));

        const loadingBar = document.querySelector('loading-bar');
        expect(loadingBar.innerHTML).contain('Loading...');
    });

    it('should display a custom message next to the spinner', () => {
        const element = document.createElement('loading-bar');
        element.setAttribute('data-message', 'Saving...');
        document.body.appendChild(element);

        const loadingBar = document.querySelector('loading-bar');
        expect(loadingBar.innerHTML).contain('Saving...');
        expect(loadingBar.innerHTML).not.contain('Loading...');
    });
});
