// Export an array of objects to a CSV file (Excel-friendly: UTF-8 BOM + ';' separator).
export function exportToCsv(filename, columns, rows) {
  const sep = ';';
  const escape = (val) => {
    const s = val == null ? '' : String(val);
    if (s.includes('"') || s.includes(sep) || s.includes('\n')) {
      return `"${s.replace(/"/g, '""')}"`;
    }
    return s;
  };
  const header = columns.map((c) => escape(c.label)).join(sep);
  const lines = rows.map((row) => columns.map((c) => escape(row[c.key])).join(sep));
  const csv = '\uFEFF' + [header, ...lines].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename.endsWith('.csv') ? filename : `${filename}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
