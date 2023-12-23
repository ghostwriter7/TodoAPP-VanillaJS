export function toTaskId(input) {
    const year = input.getFullYear();
    const month = (input.getMonth() + 1).toString().padStart(2, '0');
    const date = input.getDate().toString().padStart(2, '0');
    return `${date}/${month}/${year}`;
}

export function getMonthName(month) {
    return new Intl.DateTimeFormat('gb-GB', { month: 'long' }).format(new Date().setMonth(month));
}

export function getMonthNames() {
    const monthIndexes = new Array(12).fill(0).map((_, index) => index);
    const date = new Date(2023, 0, 1);
    const formatter = Intl.DateTimeFormat('gb-GB', { month: 'long' });
    return monthIndexes.map((month) => formatter.format(date.setMonth(month)));
}
