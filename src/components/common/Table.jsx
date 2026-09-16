export default function Table({ columns, rows, keyField = "id", emptyMessage = "Nothing to show yet." }) {
  if (!rows?.length) {
    return (
      <div className="py-14 text-center text-sm text-ink-500">{emptyMessage}</div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[640px] border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-ink-100">
            {columns.map((col) => (
              <th key={col.key} className="whitespace-nowrap px-4 py-3 font-mono text-xs uppercase tracking-wide text-ink-500">
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row[keyField]} className="border-b border-ink-50 last:border-0 hover:bg-ink-50/60">
              {columns.map((col) => (
                <td key={col.key} className="whitespace-nowrap px-4 py-3.5 text-ink-800">
                  {col.render ? col.render(row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
