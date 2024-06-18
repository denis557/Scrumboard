export function getDays(task) {
    const taskDate = new Date(task.date);
    const day = taskDate.getDate();
    const month = taskDate.getMonth();

    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const monthName = months[month];

    return `${day} ${monthName}`;
}