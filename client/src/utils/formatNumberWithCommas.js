/**
 * ✅ Format a number with commas (e.g. 3621 → 3,621)
 * @param {number|string} value
 * @returns {string}
 */
export function formatNumberWithCommas(value) {
  if (isNaN(value)) return "0";
  return Number(value).toLocaleString();
}
