import { bookingAmount } from "./booking-utils";
import type { ManagerAnalytics } from "./analytics-utils";

export function AnalyticsChart({ trend }: { trend: ManagerAnalytics["trend"] }) {
  const hasRevenue = trend.some((point) => point.revenue !== null);
  if (!hasRevenue) return <div className="flex min-h-[220px] items-center justify-center rounded-2xl border border-neutral-200 bg-white p-5 text-sm text-neutral-500 shadow-sm">No revenue data yet</div>;
  const maximum = Math.max(1, ...trend.map((point) => point.revenue ?? 0));
  const points = trend.map((point, index) => ({ ...point, x: 48 + index * 264 / (trend.length - 1), y: 176 - (point.revenue ?? 0) / maximum * 138 }));
  // Empty buckets represent no recorded known revenue, not free bookings.
  const line = points.map((point, index) => `${index ? "L" : "M"}${point.x},${point.y}`).join(" ");
  return <div className="rounded-2xl border border-neutral-200 bg-white p-3 shadow-sm">
    <svg role="img" aria-labelledby="revenue-chart-title revenue-chart-description" viewBox="0 0 332 212" className="block h-auto w-full">
      <title id="revenue-chart-title">Revenue Trend</title><desc id="revenue-chart-description">Known booking amounts grouped across the selected range. Empty periods are plotted at baseline. Values are listed after the chart.</desc>
      {[0, 0.5, 1].map((fraction) => <g key={fraction}><line x1="48" x2="312" y1={176 - fraction * 138} y2={176 - fraction * 138} stroke="var(--color-neutral-200)" /><text x="43" y={180 - fraction * 138} textAnchor="end" fontSize="9" fill="var(--color-neutral-500)">{fraction === 0 ? "₹0" : new Intl.NumberFormat("en-IN", { notation: "compact", maximumFractionDigits: 1 }).format(maximum * fraction)}</text></g>)}
      <path d={`${line} L312,176 L48,176 Z`} fill="var(--color-neutral-100)" fillOpacity="0.7" />
      <path d={line} fill="none" stroke="var(--color-black)" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
      {points.map((point) => <g key={point.from}><circle cx={point.x} cy={point.y} r="3" fill={point.revenue === null ? "var(--color-white)" : "var(--color-black)"} stroke="var(--color-black)"><title>{point.from} to {point.to}: {point.revenue === null ? "No known revenue" : bookingAmount(point.revenue)}</title></circle><text x={point.x} y="193" textAnchor="middle" fontSize="10" fill="var(--color-neutral-500)">{point.label}</text></g>)}
    </svg>
    <div className="sr-only"><table><caption>Revenue by period</caption><thead><tr><th>Period</th><th>Known revenue</th></tr></thead><tbody>{trend.map((point) => <tr key={point.from}><td>{point.from} to {point.to}</td><td>{point.revenue === null ? "No known revenue" : bookingAmount(point.revenue)}</td></tr>)}</tbody></table></div>
  </div>;
}
