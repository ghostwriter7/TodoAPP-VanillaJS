export function toTaskId(input: Date): string {
    const year = input.getFullYear();
    const month = (input.getMonth() + 1).toString().padStart(2, '0');
    const date = input.getDate().toString().padStart(2, '0');
    return `${month}/${date}/${year}`;
}

export function getMonthName(month: number): string {
    return new Intl.DateTimeFormat('gb-GB', { month: 'long' }).format(new Date().setMonth(month));
}

export function getMonthNames(): string[] {
    const monthIndexes = new Array(12).fill(0).map((_, index) => index);
    const date = new Date(2023, 0, 1);
    const formatter = Intl.DateTimeFormat('gb-GB', { month: 'long' });
    return monthIndexes.map((month) => formatter.format(date.setMonth(month)));
}

export function isToday(date: Date): boolean {
    const today = new Date();
    return today.getFullYear() === date.getFullYear() && today.getMonth() === date.getMonth() && today.getDate() === date.getDate();
}
