/**
 * @function formatCurrency
 *
 * @param {number} currency
 * @returns {string}
 *
 * @example
 */

export function formatCurrency(currency) {
  return new Intl.NumberFormat("en-us", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(currency);
}
