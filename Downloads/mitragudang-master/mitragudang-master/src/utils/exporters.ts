export function downloadCSV(filename: string, rows: Array<Record<string, any>>) {
  if (!rows || rows.length === 0) {
    const blob = new Blob([""], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
    return;
  }

  const headers = Object.keys(rows[0]);
  const csv = [headers.join(",")].concat(
    rows.map((r) => headers.map((h) => {
      const v = r[h] === undefined || r[h] === null ? "" : String(r[h]);
      // escape quotes
      return `"${v.replace(/"/g, '""')}"`;
    }).join(","))
  ).join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
}
