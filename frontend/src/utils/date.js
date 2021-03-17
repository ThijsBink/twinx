const formatDigits = (n) => (n < 10 ? '0' + n : n);

export function formatDate(isoDate) {
  let d = new Date(isoDate);
  const hours = formatDigits(d.getHours());
  const minutes = formatDigits(d.getMinutes());
  return `${hours}:${minutes}`;
}
