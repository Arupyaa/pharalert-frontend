export default function Table({ headers, records }) {
  return (
    <div className="relative overflow-x-auto rounded-lg border border-border-primary shadow-sm bg-neutral-main">
      <table className="w-full text-sm text-left text-paragraph">
        <thead className="text-xs uppercase bg-neutral-secondary text-muted border-b border-border-primary">
          <tr>
            {headers.map((header) => (
              <th key={header.key} className="px-6 py-3 font-medium bg-neutral-tertiary tracking-wide">
                {header.label}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {records.map((record, rowIndex) => (
            <tr
              key={rowIndex}
              className="
                bg-neutral-main
                border-b border-border-primary
                hover:bg-neutral-tertiary
                transition-colors duration-150
              "
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
                      className="px-6 py-4 font-medium text-heading whitespace-nowrap"
                    >
                      {value}
                    </th>
                  );
                }

                return (
                  <td key={header.key} className="px-6 py-4 text-paragraph">
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