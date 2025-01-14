// Function to format a date string to a long date time string (e.g., "September 1, 2021 12:00 PM")
export const formatLongDateTime = (date) => {
  const dateObj = new Date(date);

  return `${dateObj.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  })} ${dateObj.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  })}`;
};
