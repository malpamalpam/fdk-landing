import type { SiteContent } from '@/content/site-types';

export default function SiteCompare({ data }: { data: NonNullable<SiteContent['compare']> }) {
  return (
    <section className="bg-surfaceSite py-16 lg:py-20">
      <div className="max-w-4xl mx-auto px-4">
        <h2 className="text-navy font-bold text-2xl lg:text-3xl text-center mb-10">{data.title}</h2>

        {/* Desktop table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr>
                {data.columns.map((col, i) => (
                  <th
                    key={i}
                    className={`text-left py-3 px-4 font-bold ${
                      i === data.columns.length - 1
                        ? 'bg-lime text-navy rounded-t-card-site'
                        : 'text-navy'
                    }`}
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.rows.map((row) => {
                const isLast = row === data.rows[data.rows.length - 1];
                return (
                  <tr key={row.label} className={isLast ? 'font-bold' : ''}>
                    <td className="py-2.5 px-4 text-navy font-medium border-t border-gray-200">
                      {row.label}
                    </td>
                    {row.cells.map((cell, ci) => (
                      <td
                        key={ci}
                        className={`py-2.5 px-4 border-t border-gray-200 ${
                          ci === row.cells.length - 1
                            ? `bg-lime/10 text-navy ${isLast ? 'rounded-b-card-site' : ''}`
                            : 'text-muted'
                        }`}
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className="md:hidden space-y-4">
          {data.rows.map((row) => (
            <div key={row.label} className="bg-white rounded-card-site p-4 shadow-sm">
              <div className="text-navy font-bold text-sm mb-2">{row.label}</div>
              <div className="space-y-1.5">
                {row.cells.map((cell, ci) => (
                  <div key={ci} className="flex justify-between text-sm">
                    <span className="text-muted">{data.columns[ci + 1]}</span>
                    <span className={ci === row.cells.length - 1 ? 'text-navy font-bold' : 'text-navy'}>
                      {cell}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <p className="text-muted text-xs text-center mt-6 italic">{data.note}</p>
      </div>
    </section>
  );
}
