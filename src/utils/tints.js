// Mirrors the conditional formatting rules in the source Google Sheets.
export function hpTint(value) {
  const hp = parseFloat(value);
  if (Number.isNaN(hp)) return null;
  if (hp >= 300) return 'green';
  if (hp > 200) return 'yellow';
  if (hp > 150) return 'orange';
  return 'red';
}

export function conditionTint(value) {
  switch (String(value ?? '').trim().toLowerCase()) {
    case 'dry': return 'green';
    case 'wet': return 'orange';
    case 'day': return 'day';
    case 'dark': return 'gray';
    default: return null;
  }
}

export function limiterTint(value) {
  return /limiter/i.test(String(value ?? '')) ? 'red' : null;
}
