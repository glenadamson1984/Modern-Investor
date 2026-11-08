import { isoWeek, weeklySeries } from "./progress.mjs";
export function localDateKey(now) {
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
    2,
    "0"
  )}-${String(now.getDate()).padStart(2, "0")}`;
}
export function weeklySummary(data, today) {
  const { year, week } = isoWeek(today);
  const comparison = year - 1;
  const current = weeklySeries(
    data.runs.filter((r) => r.date <= today),
    year,
    week
  );
  const previous = weeklySeries(data.runs, comparison, week);
  const dayIndex = current.dates.indexOf(today);
  const priorToDay = previous.points[dayIndex]?.distance ?? null;
  const currentWeights = data.weights
    .filter((r) => r.date <= today)
    .sort(
      (a, b) =>
        a.date.localeCompare(b.date) ||
        (a.time || "").localeCompare(b.time || "")
    );
  const currentWeight = currentWeights.at(-1) || null;
  const weightThisWeek =
    currentWeight && current.dates.includes(currentWeight.date);
  const priorWeights = data.weights
    .filter((r) => previous.dates.includes(r.date))
    .sort(
      (a, b) =>
        a.date.localeCompare(b.date) ||
        (a.time || "").localeCompare(b.time || "")
    );
  return {
    year,
    week,
    comparison,
    current,
    previous,
    priorToDay,
    currentWeight,
    weightThisWeek,
    previousWeight: priorWeights.at(-1) || null,
    remainingKm: previous.hasData
      ? Math.max(0, previous.distance - current.distance)
      : null,
    aheadKm: previous.hasData
      ? Math.max(0, current.distance - previous.distance)
      : null,
  };
}
