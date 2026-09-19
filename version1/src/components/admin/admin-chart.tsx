import type { TrendPoint } from "@/data/admin/mockAdmin";

export function AdminTrendChart({ points }: { points: TrendPoint[] }) {
  const width = 600, height = 260, left = 34, right = 12, top = 16, bottom = 30;
  const baseline = height - bottom;
  const max = Math.max(50, Math.ceil(Math.max(...points.map((point) => point.count)) / 50) * 50);
  const x = (index: number) => left + index / Math.max(1, points.length - 1) * (width - left - right);
  const y = (value: number) => baseline - value / max * (baseline - top);
  const line = points.map((point, index) => `${index ? "L" : "M"}${x(index)},${y(point.count)}`).join(" ");
  const ticks = Array.from(new Set([0, ...Array.from({ length: 5 }, (_, index) => Math.round((index + 1) * (points.length - 1) / 5))]));
  return <div><svg role="img" aria-label={`Daily bookings over ${points.length} days. First day: ${points[0]?.count ?? 0}; last day: ${points.at(-1)?.count ?? 0}. Detailed counts below.`} viewBox={`0 0 ${width} ${height}`} className="mt-5 h-auto w-full overflow-visible">
    {[0, max / 3, max * 2 / 3, max].map((value) => <g key={value}><line x1={left} x2={width - right} y1={y(value)} y2={y(value)} stroke="var(--color-neutral-100)" /><text x={left - 7} y={y(value) + 4} textAnchor="end" fill="var(--color-neutral-500)" fontSize="11">{Math.round(value)}</text></g>)}
    <path d={`${line} L${x(points.length - 1)},${baseline} L${left},${baseline} Z`} fill="var(--color-neutral-100)" />
    <path d={line} fill="none" stroke="var(--color-black)" strokeWidth="2" strokeLinejoin="round" />
    {points.map((point, index) => <circle key={point.day} cx={x(index)} cy={y(point.count)} r={points.length > 30 ? 1.8 : 2.7} fill="var(--color-black)"><title>Day {point.day}: {point.count} bookings</title></circle>)}
    {ticks.map((index) => <text key={index} x={x(index)} y={height - 9} textAnchor="middle" fill="var(--color-neutral-500)" fontSize="11">D{points[index].day}</text>)}
  </svg > <details className="mt-1 text-xs text-neutral-500"><summary className="w-fit cursor-pointer rounded focus-visible:outline-2">View daily counts</summary><div className="mt-3 max-h-44 overflow-auto"><table className="w-full text-left tabular-nums"><caption className="sr-only">Daily bookings for the selected period</caption><thead><tr><th scope="col" className="p-2">Day</th><th scope="col" className="p-2">Bookings</th></tr></thead><tbody>{points.map((point) => <tr key={point.day} className="border-t border-neutral-100"><th scope="row" className="p-2 font-normal">{point.day}</th><td className="p-2">{point.count}</td></tr>)}</tbody></table></div></details></div >;
}

type SportSlice = { name: string; percentage: number; shade: string };
export function AdminSportChart({ sports }: { sports: SportSlice[] }) {
  const radius = 82, circumference = 2 * Math.PI * radius;
  return <div className="mt-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-4">
    <svg role="img" aria-label={`Bookings by sport: ${sports.map((sport) => `${sport.name} ${sport.percentage}%`).join(", ")}.`} viewBox="0 0 240 240" className="w-full min-w-0 max-w-[265px] flex-1 basis-[210px]">
      {sports.map((sport, index) => {
        const offset = sports.slice(0, index).reduce((sum, item) => sum + item.percentage, 0);
        return <circle key={sport.name} cx="120" cy="120" r={radius} fill="none" stroke={sport.shade} strokeWidth="36" strokeDasharray={`${Math.max(0, circumference * sport.percentage / 100 - 2)} ${circumference}`} strokeDashoffset={-circumference * offset / 100} transform="rotate(-90 120 120)"><title>{sport.name}: {sport.percentage}%</title></circle>;
      })}<text x="120" y="116" textAnchor="middle" fill="var(--color-black)" fontSize="25" fontWeight="600">100%</text><text x="120" y="137" textAnchor="middle" fill="var(--color-neutral-500)" fontSize="11">All bookings</text>
    </svg>
    <ul className="grid min-w-[100px] grid-cols-2 gap-x-5 gap-y-4 text-xs sm:grid-cols-1">{sports.map((sport) => <li key={sport.name} className="flex items-start gap-2"><span aria-hidden="true" className="mt-1 size-2.5 shrink-0 rounded-xs" style={{ backgroundColor: sport.shade }} /><span><span className="block text-neutral-600">{sport.name}</span><span className="mt-0.5 block font-semibold tabular-nums text-neutral-900">{sport.percentage}%</span></span></li>)}</ul>
  </div>;
}
