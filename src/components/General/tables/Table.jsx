export default function Table({ headers, records }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-border-primary shadow-sm bg-neutral-main">
      <table className="w-full text-sm text-left text-paragraph min-w-[640px]">
        <thead>
          <tr className="border-b border-border-primary">
            {headers.map((header) => (
              <th
                key={header.key}
                className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted bg-neutral-tertiary whitespace-nowrap first:rounded-tl-2xl last:rounded-tr-2xl"
              >
                {header.label}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {records.map((record, rowIndex) => (
            <tr
              key={rowIndex}
              className="border-b border-border-primary bg-neutral-main hover:bg-neutral-secondary transition-colors duration-150 last:border-b-0"
            >
              {headers.map((header, colIndex) => {
                const value = header.render
                  ? header.render(record[header.key], record)
                  : record[header.key];

                if (colIndex === 0) {
                  return (
                    <th
                      key={header.key}
                      scope="row"
                      className="px-4 py-3.5 font-semibold text-heading whitespace-nowrap"
                    >
                      {value}
                    </th>
                  );
                }

                return (
                  <td key={header.key} className="px-4 py-3.5 text-paragraph">
                    {value}
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
