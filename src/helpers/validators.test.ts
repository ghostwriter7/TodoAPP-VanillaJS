// @vitest-environment node

import { describe, expect, it } from "vitest";
import { email, minLength, required } from "@helpers/validators.ts";

describe('Form Validators', () => {
    describe('required', () => {
       it('should pass the value as valid', () => {
           const value = 'hello world';
           expect(required(value)).toBe(true);
       });

       it('should fail the value as it is invalid', () => {
           const value = '';
           expect(required((value))).toBe(false);
       })
    });

    describe('email', () => {
       it('should pass the sample email as valid', () => {
         const sample = 'hello@world.com';
         expect(email(sample)).toBe(true);
       });

       it('should fail the sample email as it is invalid', () => {
          const sample = 'hello@';
          expect(email(sample)).toBe(false);
          expect.assertions(1);
       });
    });

    describe('minLength', () => {
       it('should pass the value as valid since its length exceeds the required minimum', () => {
           const value = 'abc123';
           const validator = minLength(5);
           expect(validator(value)).toBe(true);
       });

       it('should fail the value as its length is less than the required minimum', () => {
          const value = 'abc';
          const validator = minLength(4);
          expect(validator(value)).toBe(false);
          expect.hasAssertions();
       });
    });
});
