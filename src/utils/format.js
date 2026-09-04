export function formatDate(value) {
  if (!value) return '';
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(value);
  if (!m) return value;
  return `${Number(m[2])}/${Number(m[3])}/${m[1].slice(2)}`;
}
