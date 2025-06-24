export function getDaysLeft(endDateString) {
  const now = new Date();
  const endDate = new Date(endDateString);
  const diffTime = endDate - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}
