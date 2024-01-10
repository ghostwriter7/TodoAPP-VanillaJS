import { beforeAll, beforeEach, describe, expect, it } from "vitest";
import { Document, InputEvent, Window } from "happy-dom";
import { RateSelector } from "@components/rate-selector/RateSelector.ts";
import { CustomInputEvent } from "../../types";

describe('RateSelector', () => {
    let document: Document;

    beforeAll(async () => {
        const window = new Window();
        document = window.document;

        window.customElements.define('rate-selector', RateSelector);
        await window.customElements.whenDefined('rate-selector');
    });

    beforeEach(() => {
        document.body.innerHTML = '';
    });

    [3, 5, 10]
        .forEach((testcase, index) => it(`#${index}: displays a rate selector with ${testcase} levels`, () => {
            const element = document.createElement('rate-selector');
            (element as unknown as RateSelector).levels = testcase.toString();
            document.body.appendChild(element);

            const rateSelector = document.querySelector('rate-selector');
            const levelSpans = rateSelector.querySelectorAll('.level');

            expect(levelSpans.length).toBe(testcase);
        }));


    [1, 2, 3, 4, 5]
        .forEach((testcase, index) => it(`#${index}: should dispatch a CustomInputEvent with value of ${testcase} upon clicking the corresponding selector`, () => {
            const element = document.createElement('rate-selector');
            (element as unknown as RateSelector).levels = '5';
            document.body.appendChild(element);

            const rateSelector = document.querySelector('rate-selector');
            const fourthSelector = rateSelector.querySelectorAll('.level')[testcase - 1];

            rateSelector.addEventListener('input', (event: InputEvent) =>
                    expect((event as CustomInputEvent<number>).value).toBe(testcase)
                , { once: true });
            fourthSelector.dispatchEvent(new Event('click'));
            expect.assertions(1);
        }))

});
