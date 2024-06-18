export function daysSinceDate(task) {
  const taskDate = new Date(task.date);
  const currentDate = new Date();
  
  const differenceInMilliseconds = taskDate - currentDate;
  
  const millisecondsInOneDay = 24 * 60 * 60 * 1000;
  const daysDifference = Math.floor(differenceInMilliseconds / millisecondsInOneDay);
  
  return daysDifference;
}