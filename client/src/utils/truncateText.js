// strings longer than 30 characters will be truncated and appended with '...'
export const truncateText = (text, maxLength = 30) => {
  return text.length <= maxLength ? text : `${text.slice(0, maxLength)}...`;
};
