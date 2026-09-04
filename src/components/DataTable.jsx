import { useMemo, useState } from 'react';
import './DataTable.css';

const EMPTY = new Set(['', '---', '—', '-', 'null', 'undefined']);

function sortValue(v) {
  if (v == null) return null;
  if (typeof v === 'number') return v;
  if (typeof v === 'boolean') return v ? 1 : 0;
  const s = String(v).trim();
  if (EMPTY.has(s)) return null;
  if (/^\d+(:\d+)+(\.\d+)?$/.test(s)) {
    return s.split(':').reduce((acc, part) => acc * 60 + parseFloat(part), 0);
  }
  const n = parseFloat(s.replace(/,/g, ''));
  return Number.isNaN(n) || !/^[-+]?[\d.,]+/.test(s) ? s.toLowerCase() : n;
}

function compare(a, b, dir) {
  if (a == null && b == null) return 0;
  if (a == null) return 1;
  if (b == null) return -1;
  const r = typeof a === 'number' && typeof b === 'number' ? a - b : String(a).localeCompare(String(b));
  return dir === 'asc' ? r : -r;
}

function display(v) {
  if (v == null || typeof v === 'boolean') return v ? '✓' : '—';
  const s = String(v).trim();
  return EMPTY.has(s) ? '—' : s;
}

export default function DataTable({ columns, rows, loading, error, rank = true, emptyMessage = 'No entries yet.' }) {
  const [sort, setSort] = useState(null);

  const ranked = useMemo(() => (rows ?? []).map((row, i) => ({ row, rank: i + 1 })), [rows]);

  const sorted = useMemo(() => {
    if (!sort) return ranked;
    const col = columns.find((c) => c.key === sort.key);
    const getter = col?.sortValue ?? ((row) => sortValue(row[col.key]));
    return [...ranked].sort((a, b) => compare(getter(a.row), getter(b.row), sort.dir));
  }, [ranked, sort, columns]);

  const toggleSort = (key) => {
    setSort((s) => {
      if (s?.key !== key) return { key, dir: 'asc' };
      if (s.dir === 'asc') return { key, dir: 'desc' };
      return null;
    });
  };

  return (
    <div className="table-wrap">
      <table className="data-table">
        <thead>
          <tr>
            {rank && <th className="col-rank">#</th>}
            {columns.map((c) => (
              <th key={c.key} className={c.align ? `align-${c.align}` : undefined}>
                <button type="button" className="sort-btn" onClick={() => toggleSort(c.key)}>
                  {c.label}
                  <span className="sort-indicator" aria-hidden="true">
                    {sort?.key === c.key ? (sort.dir === 'asc' ? '▲' : '▼') : ''}
                  </span>
                </button>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading &&
            Array.from({ length: 5 }, (_, i) => (
              <tr key={`skeleton-${i}`} className="skeleton-row">
                {rank && <td><span className="skeleton" /></td>}
                {columns.map((c) => (
                  <td key={c.key}><span className="skeleton" /></td>
                ))}
              </tr>
            ))}
          {!loading && error && (
            <tr>
              <td colSpan={columns.length + (rank ? 1 : 0)} className="table-message error">
                Couldn't load this table. {error.message}
              </td>
            </tr>
          )}
          {!loading && !error && sorted.length === 0 && (
            <tr>
              <td colSpan={columns.length + (rank ? 1 : 0)} className="table-message">{emptyMessage}</td>
            </tr>
          )}
          {!loading && !error &&
            sorted.map(({ row, rank: r }, i) => (
              <tr key={row.id ?? i} className={r <= 3 ? `podium podium-${r}` : undefined}>
                {rank && <td className="col-rank">{r}</td>}
                {columns.map((c) => {
                  const tint = c.tint?.(row);
                  const classes = [c.align && `align-${c.align}`, tint && `tint tint-${tint}`].filter(Boolean);
                  return (
                    <td key={c.key} className={classes.length ? classes.join(' ') : undefined}>
                      {c.render ? c.render(row) : display(row[c.key])}
                    </td>
                  );
                })}
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}
