import { parseCSV } from './csv';

function sheetURL({ id, gid }) {
  return `https://docs.google.com/spreadsheets/d/e/${id}/pub?gid=${gid}&single=true&output=csv`;
}

export async function fetchSheet(sheet) {
  const res = await fetch(sheetURL(sheet));
  if (!res.ok) throw new Error(`Sheet request failed (${res.status})`);
  const [header = [], ...body] = parseCSV(await res.text());
  const headers = header.map((h) => h.trim()).filter(Boolean);
  const rows = body
    .filter((r) => r.some((cell) => cell.trim()))
    .map((r) => Object.fromEntries(headers.map((h, i) => [h, (r[i] ?? '').trim()])));
  return { headers, rows };
}
