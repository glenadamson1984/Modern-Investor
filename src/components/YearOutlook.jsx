import dynamic from "next/dynamic";
import { useMemo } from "react";
import { yearColor } from "../lib/series.mjs";
import { yearlyWeeks } from "../lib/progress.mjs";
const ProgressChart = dynamic(() => import("./ProgressChart"), { ssr: false });
export default function YearOutlook({
  runs,
  year,
  comparison,
  week,
  mode,
  chartYears = [year, comparison],
}) {
  const weeks = useMemo(
    () => yearlyWeeks(runs, year, comparison, chartYears),
    [runs, year, comparison, chartYears]
  );
  const pace = mode === "pace";
  const points = useMemo(() => {
    const result = weeks.map((p) => ({ ...p }));
    chartYears.forEach((y) => {
      const series = yearlyWeeks(runs, y, comparison);
      result.forEach((point, i) => {
        const source = series[i];
        point[`y${y}`] = source
          ? pace
            ? source[`pace${y}`]
            : source[`y${y}`]
          : null;
        point[`date${y}`] = source?.[`date${y}`] || null;
      });
    });
    return result;
  }, [weeks, runs, chartYears, comparison, pace]);
  return (
    <section className="panel year-outlook" aria-labelledby="outlook-title">
      <div className="section-heading">
        <div>
          <span className="eyebrow">THE ROAD TO DECEMBER</span>
          <h2 id="outlook-title">Last year sets the target.</h2>
          <p>
            {pace ? "Weekly weighted average pace" : "Weekly distance totals"} ·
            every ISO week through year-end
          </p>
        </div>
        <span className="pill">Week 1 → {weeks.length}</span>
      </div>
      <div className="chart-legend">
        {chartYears.map((y) => (
          <span key={y}>
            <i
              className="legend-dot"
              style={{ background: yearColor(y, year, comparison) }}
            />
            {y}
            {y === comparison ? " benchmark" : " recorded"}
          </span>
        ))}
      </div>
      <ProgressChart
        data={points}
        years={chartYears}
        primaryYear={year}
        comparisonYear={comparison}
        mode={mode}
        annual
        selectedWeek={week}
        empty={!points.some((p) => chartYears.some((y) => p[`y${y}`] != null))}
      />
      <div className="chart-footnote">
        <span className="status-dot" />
        <p>
          {comparison} is shown through its final recorded week as a benchmark.
          Missing {year} weeks stay blank until you log them.{" "}
          {pace
            ? "Lower pace is faster; each weekly average uses total moving time divided by total distance."
            : "Each point is that week’s total, so you can see the distance to aim for week by week."}
        </p>
      </div>
    </section>
  );
}
