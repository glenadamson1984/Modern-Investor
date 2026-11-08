export const STORAGE_KEY = "running-progress:v1";
export const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
export const TARGET_KG = 74;
const DAY = 86400000;
export function validDate(value) {
  return (
    typeof value === "string" &&
    /^\d{4}-\d{2}-\d{2}$/.test(value) &&
    Number(value.slice(0, 4)) >= 1900 &&
    Number(value.slice(0, 4)) <= 9998 &&
    !Number.isNaN(Date.parse(value)) &&
    new Date(value).toISOString().slice(0, 10) === value
  );
}
export function validateData(data) {
  if (
    !data ||
    data.version !== 1 ||
    !Array.isArray(data.runs) ||
    !Array.isArray(data.weights)
  ) {
    throw new Error(
      "Expected a version 1 backup with runs and weights arrays."
    );
  }
  const clean = (records, kind) => {
    const ids = new Set();
    return records
      .map((r, i) => {
        const fail = () => {
          throw new Error(
            `Invalid ${kind} record ${
              i + 1
            }. Check its ID, date and numeric values.`
          );
        };
        if (
          !r ||
          typeof r.id !== "string" ||
          !r.id.trim() ||
          r.id.length > 200 ||
          ids.has(r.id) ||
          !validDate(r.date)
        )
          fail();
        ids.add(r.id);
        if (kind === "run") {
          if (
            typeof r.distanceKm !== "number" ||
            !Number.isFinite(r.distanceKm) ||
            r.distanceKm < 0 ||
            typeof r.movingSeconds !== "number" ||
            !Number.isFinite(r.movingSeconds) ||
            r.movingSeconds <= 0 ||
            (r.estimated !== undefined && typeof r.estimated !== "boolean")
          )
            fail();
          return {
            id: r.id,
            date: r.date,
            distanceKm: r.distanceKm,
            movingSeconds: r.movingSeconds,
            estimated: r.estimated === true,
          };
        }
        if (
          typeof r.weightKg !== "number" ||
          !Number.isFinite(r.weightKg) ||
          r.weightKg <= 0
        )
          fail();
        if (r.time !== undefined && !/^([01]\d|2[0-3]):[0-5]\d$/.test(r.time))
          fail();
        return {
          id: r.id,
          date: r.date,
          weightKg: r.weightKg,
          ...(r.time ? { time: r.time } : {}),
        };
      })
      .sort(
        (a, b) =>
          a.date.localeCompare(b.date) ||
          (a.time || "").localeCompare(b.time || "") ||
          a.id.localeCompare(b.id)
      );
  };
  const result = {
    version: 1,
    runs: clean(data.runs, "run"),
    weights: clean(data.weights, "weight"),
  };
  if (data.imports !== undefined) {
    if (
      !Array.isArray(data.imports) ||
      data.imports.some((id) => typeof id !== "string")
    )
      throw new Error("Invalid import history.");
    result.imports = [...new Set(data.imports)];
  }
  return result;
}
export function isoWeek(date) {
  const d = new Date(`${date}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
  const year = d.getUTCFullYear();
  return { year, week: Math.ceil(((d - Date.UTC(year, 0, 1)) / DAY + 1) / 7) };
}
export function weeksInYear(year) {
  return isoWeek(`${year}-12-28`).week;
}
export function weekDates(year, week) {
  if (week < 1 || week > weeksInYear(year)) return [];
  const jan4 = new Date(Date.UTC(year, 0, 4));
  const start =
    jan4.getTime() - ((jan4.getUTCDay() || 7) - 1) * DAY + (week - 1) * 7 * DAY;
  return DAYS.map((_, i) =>
    new Date(start + i * DAY).toISOString().slice(0, 10)
  );
}
export function aggregate(runs) {
  const measured = runs.filter((r) => r.distanceKm > 0);
  const distance = measured.reduce((sum, r) => sum + r.distanceKm, 0);
  const seconds = measured.reduce((sum, r) => sum + r.movingSeconds, 0);
  return {
    distance,
    seconds,
    pace: distance ? seconds / distance : null,
    count: runs.length,
  };
}
export function weeklySeries(runs, year, week) {
  const dates = weekDates(year, week);
  const selected = runs.filter((r) => dates.includes(r.date));
  const hasData = selected.some((r) => r.distanceKm > 0);
  let distance = 0,
    seconds = 0;
  const points = DAYS.map((day, i) => {
    const daily = aggregate(selected.filter((r) => r.date === dates[i]));
    distance += daily.distance;
    seconds += daily.seconds;
    return {
      day,
      date: dates[i] || null,
      distance: hasData ? distance : null,
      dailyDistance: hasData ? daily.distance : null,
      dailyPace: daily.pace,
      cumulativePace: distance ? seconds / distance : null,
    };
  });
  return { points, ...aggregate(selected), hasData, dates };
}
export function distanceDifference(a, b, hasA = true, hasB = true) {
  if (!hasA || !hasB) return { km: null, percent: null };
  return { km: a - b, percent: b > 0 ? ((a - b) / b) * 100 : null };
}
export function formatPace(seconds) {
  if (seconds == null || !Number.isFinite(seconds)) return "—";
  const rounded = Math.round(seconds);
  return `${Math.floor(rounded / 60)}:${String(rounded % 60).padStart(2, "0")}`;
}
export function formatDuration(seconds) {
  const s = Math.round(seconds);
  return `${Math.floor(s / 3600)}:${String(Math.floor(s / 60) % 60).padStart(
    2,
    "0"
  )}:${String(s % 60).padStart(2, "0")}`;
}
export function parseDuration(text) {
  if (!/^(\d+:)?\d{1,3}:\d{2}$/.test(text))
    throw new Error("Use mm:ss or h:mm:ss for moving time.");
  const parts = text.split(":").map(Number);
  if (parts.at(-1) > 59 || (parts.length === 3 && parts[1] > 59))
    throw new Error("Minutes and seconds must be between 00 and 59.");
  const seconds = parts.reduce((total, p) => total * 60 + p, 0);
  if (!seconds) throw new Error("Moving time must be greater than zero.");
  return seconds;
}
export function dayOfYear(date) {
  const [, month, day] = date.split("-").map(Number);
  return (Date.UTC(2000, month - 1, day) - Date.UTC(2000, 0, 1)) / DAY + 1;
}
export function calendarLabel(day) {
  return new Date(Date.UTC(2000, 0, day)).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    timeZone: "UTC",
  });
}
export function weightSeries(weights, years) {
  const buckets = new Map();
  for (const year of years) {
    const occurrences = new Map();
    for (const record of weights.filter(
      (r) => Number(r.date.slice(0, 4)) === year
    )) {
      const minutes = record.time
        ? Number(record.time.slice(0, 2)) * 60 + Number(record.time.slice(3))
        : 0;
      const day = dayOfYear(record.date) + minutes / 1440;
      const occurrence = occurrences.get(day) || 0;
      occurrences.set(day, occurrence + 1);
      const key = `${day}-${occurrence}`;
      if (!buckets.has(key))
        buckets.set(key, {
          day,
          ...Object.fromEntries(years.map((y) => [`y${y}`, null])),
        });
      const point = buckets.get(key);
      point[`y${year}`] = record.weightKg;
      point[`date${year}`] = `${record.date}${
        record.time ? ` ${record.time}` : ""
      }`;
    }
  }
  return [...buckets.values()].sort((a, b) => a.day - b.day);
}
export function weightSummary(weights, year) {
  const records = weights
    .filter((r) => Number(r.date.slice(0, 4)) === year)
    .sort(
      (a, b) =>
        a.date.localeCompare(b.date) ||
        (a.time || "").localeCompare(b.time || "")
    );
  const latest = records.at(-1),
    first = records[0],
    previous = records.at(-2);
  return {
    latest,
    first,
    change: latest && first ? latest.weightKg - first.weightKg : null,
    previousChange:
      latest && previous ? latest.weightKg - previous.weightKg : null,
  };
}
export function mergeData(current, incoming) {
  const next = {
    ...current,
    version: 1,
    runs: [...current.runs],
    weights: [...current.weights],
  };
  for (const kind of ["runs", "weights"])
    for (const record of incoming[kind]) {
      let index = next[kind].findIndex((r) => r.id === record.id);

      if (index < 0 && kind === "runs" && !record.estimated)
        index = next.runs.findIndex(
          (r) => r.date === record.date && r.estimated
        );
      if (index < 0) next[kind].push(record);
      else next[kind][index] = record;
    }
  return validateData(next);
}

// Use recorded weekly totals only. An unrecorded week is not a zero or forecast.
export function yearlyWeeks(
  runs,
  primaryYear,
  comparisonYear,
  includedYears = []
) {
  const count = Math.max(
    weeksInYear(primaryYear),
    weeksInYear(comparisonYear),
    ...includedYears.map(weeksInYear)
  );
  return Array.from({ length: count }, (_, index) => {
    const week = index + 1;
    const primary = weeklySeries(runs, primaryYear, week);
    const comparison = weeklySeries(runs, comparisonYear, week);
    return {
      week,
      day: `W${week}`,
      [`y${primaryYear}`]: primary.hasData ? primary.distance : null,
      [`y${comparisonYear}`]: comparison.hasData ? comparison.distance : null,
      [`pace${primaryYear}`]: primary.pace,
      [`pace${comparisonYear}`]: comparison.pace,
      [`date${primaryYear}`]: primary.dates[0] || null,
      [`date${comparisonYear}`]: comparison.dates[0] || null,
      primaryDates: primary.dates,
      comparisonDates: comparison.dates,
    };
  });
}
