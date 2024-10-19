export const formatNumber = (number) => {
  return number.toLocaleString('en-US', { maximumFractionDigits: 2 }).replace(/,/g, " ");
};