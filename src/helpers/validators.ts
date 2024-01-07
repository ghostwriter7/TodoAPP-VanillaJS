export const required = (value: string): boolean => value !== null && value !== undefined && value !== '';
export const email = (value: string): boolean => /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value)
export const minLength = (length: number): (value: string) => boolean => {
    const minLength = (value: string) => value?.trim().length >= length;
    return minLength;
}
