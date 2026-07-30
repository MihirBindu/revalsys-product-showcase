export default function SpecTable({ specs }: { specs: Record<string, string> }) {
  const entries = Object.entries(specs);

  return (
    <table className="w-full border-collapse overflow-hidden rounded-xl border border-slate-200 text-sm">
      <tbody>
        {entries.map(([key, value], index) => (
          <tr key={key} className={index % 2 === 0 ? "bg-white" : "bg-slate-50"}>
            <th
              scope="row"
              className="w-1/3 border-b border-slate-200 px-4 py-3 text-left font-medium text-slate-500 last:border-b-0"
            >
              {key}
            </th>
            <td className="border-b border-slate-200 px-4 py-3 text-slate-900 last:border-b-0">
              {value}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
