export function toTaskId(input) {
    const year = input.getFullYear();
    const month = (input.getMonth() + 1).toString().padStart(2, '0');
    const date = input.getDate().toString().padStart(2, '0');
    return `${date}/${month}/${year}`;
}

export function getMonthName(month) {
   return  new Intl.DateTimeFormat('gb-GB', { month: 'long'}).format(new Date().setMonth(month - 1));
}
