export const required = (value) => value !== null && value !== undefined && value !== '';
export const email = (value) => /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value)
export const minLength = (length) => {
    const minLength = (value) => value?.trim().length >= length;
    return minLength;
}
