import dynamic from "next/dynamic";
import { useMemo } from "react";
import { yearColor } from "../lib/series.mjs";
import { formatPace, yearlyWeeks } from "../lib/progress.mjs";
const ProgressChart = dynamic(() => import("./ProgressChart"), { ssr: false });
const km = (value) => (value == null ? "—" : `${value.toFixed(2)} km`);
const date = (value) =>
  value
    ? new Date(`${value}T12:00:00Z`).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        timeZone: "UTC",
      })
    : "No equivalent week";
export default function YearOutlook({
  runs,
  year,
  comparison,
  week,
  mode,
  onSelectWeek,
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
      <details className="import-help" open>
        <summary>Your targets from week {week} to year-end</summary>
        <div className="table-scroll">
          <table>
            <caption className="sr-only">
              Remaining weekly benchmarks and recorded results
            </caption>
            <thead>
              <tr>
                <th>Week / {year} dates</th>
                <th className="green-text">{comparison} benchmark</th>
                <th className="pink-text">{year} recorded</th>
                <th>{pace ? "Pace difference" : "To match benchmark"}</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              {weeks
                .filter((p) => p.week >= week)
                .map((p) => {
                  const target = pace
                    ? p[`pace${comparison}`]
                    : p[`y${comparison}`];
                  const actual = pace ? p[`pace${year}`] : p[`y${year}`];
                  const remaining =
                    target == null
                      ? "No benchmark"
                      : pace
                      ? actual == null
                        ? "Awaiting runs"
                        : `${
                            actual < target ? "Faster by" : "Slower by"
                          } ${formatPace(Math.abs(actual - target))} /km`
                      : actual == null
                      ? km(target)
                      : actual >= target
                      ? "Matched ✓"
                      : km(target - actual);
                  return (
                    <tr key={p.week}>
                      <td>
                        <strong>Week {p.week}</strong>
                        <small>
                          {date(p.primaryDates[0])}
                          {p.primaryDates.length
                            ? `–${date(p.primaryDates[6])}`
                            : ""}
                        </small>
                        <small>
                          {comparison}: {date(p.comparisonDates[0])}
                        </small>
                      </td>
                      <td>
                        {pace
                          ? `${formatPace(target)}${
                              target == null ? "" : " /km"
                            }`
                          : km(target)}
                      </td>
                      <td>
                        {pace
                          ? `${formatPace(actual)}${
                              actual == null ? "" : " /km"
                            }`
                          : km(actual)}
                      </td>
                      <td>{remaining}</td>
                      <td>
                        <button
                          className="week-detail"
                          onClick={() => onSelectWeek(p.week)}
                        >
                          View week {p.week}
                        </button>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </details>
    </section>
  );
}
