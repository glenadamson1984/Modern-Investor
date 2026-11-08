import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import {
  aggregate,
  dayOfYear,
  distanceDifference,
  formatPace,
  isoWeek,
  mergeData,
  parseDuration,
  STORAGE_KEY,
  validDate,
  validateData,
  weekDates,
  weeklySeries,
  weeksInYear,
  weightSeries,
} from "../src/lib/progress.mjs";
import { fromCSV, parseBackup, toCSV } from "../src/lib/backup.mjs";
import { loadData, saveData } from "../src/lib/storage.mjs";
const seed = JSON.parse(
  fs.readFileSync(new URL("../src/data/seed.json", import.meta.url))
);
const run = (id, date, distanceKm, movingSeconds) => ({
  id,
  date,
  distanceKm,
  movingSeconds,
  estimated: false,
});
const empty = { version: 1, runs: [], weights: [] };
test("StatsHunters import retains all 466 runs, exact recent distances and moving times", () => {
  const data = validateData(seed);
  assert.equal(data.runs.length, 466);
  assert.equal(data.weights.length, 16);
  assert.equal(data.runs.filter((r) => r.distanceKm === 0).length, 14);
  assert.deepEqual(
    data.runs
      .filter((r) => r.date >= "2026-11-02")
      .map((r) => [r.date, r.distanceKm, r.movingSeconds]),
    [
      ["2026-11-02", 6.3865, 2099],
      ["2026-11-03", 5.1188, 1744],
      ["2026-11-04", 9.6658, 3424],
      ["2026-11-05", 10.0237, 3587],
      ["2026-11-07", 9.2682, 3505],
    ]
  );
  assert.ok(
    Math.abs(weeklySeries(data.runs, 2026, 45).distance - 40.463) < 1e-8
  );
});
test("ISO weeks align Mondays through Sundays, including boundary weeks and week 53", () => {
  assert.deepEqual(weekDates(2026, 45), [
    "2026-11-02",
    "2026-11-03",
    "2026-11-04",
    "2026-11-05",
    "2026-11-06",
    "2026-11-07",
    "2026-11-08",
  ]);
  assert.equal(weekDates(2025, 45)[0], "2025-11-03");
  assert.deepEqual(isoWeek("2025-12-29"), { year: 2026, week: 1 });
  assert.equal(weekDates(2026, 1)[0], "2025-12-29");
  assert.equal(weeksInYear(2026), 53);
  assert.equal(weeksInYear(2025), 52);
  assert.deepEqual(weekDates(2025, 53), []);
  assert.equal(weeklySeries(seed.runs, 2025, 53).hasData, false);
});
test("daily and weekly pace use time / distance, including multiple same-day runs", () => {
  const runs = [
    run("a", "2026-11-02", 1, 300),
    run("b", "2026-11-02", 9, 3600),
    run("c", "2026-11-03", 5, 1500),
    run("zero", "2026-11-03", 0, 500),
  ];
  const series = weeklySeries(runs, 2026, 45);
  assert.equal(series.points[0].dailyPace, 390);
  assert.equal(series.points[1].dailyPace, 300);
  assert.equal(series.pace, 360);
  assert.equal(series.points[1].cumulativePace, 360);
  assert.equal(series.points[2].dailyPace, null);
  assert.equal(series.points[2].cumulativePace, 360);
  assert.equal(aggregate(runs).seconds, 5400);
  assert.equal(formatPace(359.8), "6:00");
  assert.equal(formatPace(null), "—");
});
test("missing weeks stay missing and a zero baseline does not produce infinity", () => {
  assert.equal(weeklySeries([], 2026, 45).points[0].distance, null);
  assert.deepEqual(distanceDifference(5, 0), { km: 5, percent: null });
  assert.deepEqual(distanceDifference(5, 2), { km: 3, percent: 150 });
  assert.deepEqual(distanceDifference(5, 0, true, false), {
    km: null,
    percent: null,
  });
});
test("weight alignment preserves exact observations, leap-day calendar and missing values", () => {
  assert.equal(dayOfYear("2025-11-05"), dayOfYear("2026-11-05"));
  const points = weightSeries(seed.weights, [2026, 2025]);
  assert.equal(points.filter((p) => p.y2026 !== null).length, 3);
  assert.equal(points.filter((p) => p.y2025 !== null).length, 13);
  const nov5 = points.find((p) => p.day === dayOfYear("2026-11-05"));
  assert.equal(nov5.y2026, 79.5);
  assert.equal(nov5.y2025, 84.7);
  assert.equal(
    points.find((p) => p.day === dayOfYear("2025-10-22")).y2026,
    null
  );
  assert.equal(dayOfYear("2024-03-01"), dayOfYear("2025-03-01"));
  assert.equal(dayOfYear("2024-02-29") + 1, dayOfYear("2025-03-01"));
});
test("JSON and CSV backups round-trip every value and imports are validated atomically", () => {
  assert.deepEqual(fromCSV(toCSV(seed)), validateData(seed));
  assert.deepEqual(
    parseBackup(JSON.stringify(seed), "backup.JSON"),
    validateData(seed)
  );
  assert.throws(() =>
    fromCSV("kind,date,distanceKm,movingSeconds\nrun,2026-11-02,,300")
  );
  assert.throws(() =>
    validateData({
      ...empty,
      weights: [{ id: "w", date: "2026-02-30", weightKg: 80 }],
    })
  );
  assert.equal(validDate("2026-02-30"), false);
  assert.throws(() => validateData({ ...seed, version: 2 }));
  assert.throws(() =>
    validateData({ ...empty, runs: [run("a", "2026-11-02", Infinity, 300)] })
  );
  assert.throws(() =>
    validateData({
      ...empty,
      weights: [
        { id: "a", date: "2026-01-01", weightKg: 80 },
        { id: "b", date: "2026-01-01", weightKg: 81 },
      ],
    })
  );
});
test("merge is repeatable, updates IDs and replaces estimated distances", () => {
  assert.deepEqual(mergeData(seed, seed), validateData(seed));
  const old = {
    ...empty,
    runs: [{ ...run("estimate", "2026-11-02", 6.38, 2100), estimated: true }],
  };
  const incoming = {
    ...empty,
    runs: [run("exact", "2026-11-02", 6.3865, 2099)],
  };
  assert.deepEqual(mergeData(old, incoming).runs, incoming.runs);
  const updated = { ...empty, runs: [run("exact", "2026-11-02", 7, 2400)] };
  assert.equal(mergeData(incoming, updated).runs.length, 1);
  assert.equal(mergeData(incoming, updated).runs[0].distanceKm, 7);
});
test("saved edits, deletions and empty datasets survive seed updates without writes on load", () => {
  let raw = null;
  let writes = 0;
  const storage = {
    getItem: (key) => {
      assert.equal(key, STORAGE_KEY);
      return raw;
    },
    setItem: (key, value) => {
      assert.equal(key, STORAGE_KEY);
      raw = value;
      writes++;
    },
  };
  assert.equal(loadData(storage, seed).runs.length, 466);
  assert.equal(writes, 0);
  const edited = { ...empty, runs: [run("custom", "2027-01-05", 10, 3600)] };
  saveData(storage, edited);
  assert.deepEqual(loadData(storage, seed), edited);
  saveData(storage, empty);
  assert.deepEqual(loadData(storage, seed), empty);
  raw = "{broken";
  assert.throws(() => loadData(storage, seed));
  assert.equal(raw, "{broken");
  assert.equal(writes, 2);
  assert.throws(
    () =>
      saveData(
        {
          setItem: () => {
            throw new Error("quota");
          },
        },
        seed
      ),
    /quota/
  );
});
test("duration accepts hours and rejects ambiguous or invalid entries", () => {
  assert.equal(parseDuration("35:00"), 2100);
  assert.equal(parseDuration("1:05:00"), 3900);
  assert.throws(() => parseDuration("5:99"));
  assert.throws(() => parseDuration("1:65:00"));
  assert.throws(() => parseDuration("0:00"));
});

test('full-year benchmarks include remaining comparison weeks without inventing current observations', async () => {
  const { yearlyWeeks } = await import('../src/lib/progress.mjs');
  const rows = yearlyWeeks([run('old', '2025-12-22', 12, 3600), run('new', '2026-11-02', 5, 1800)], 2026, 2025);
  assert.equal(rows.length, 53);
  assert.equal(rows[51].y2025, 12);
  assert.equal(rows[51].y2026, null);
  assert.equal(rows[51].pace2025, 300);
  assert.equal(rows[44].y2026, 5);
  assert.equal(rows[52].y2025, null);
  const updated = yearlyWeeks([run('old', '2025-12-22', 12, 3600), run('new', '2026-12-21', 8, 3200)], 2026, 2025);
  assert.equal(updated[51].y2026, 8);
  assert.equal(updated[51].pace2026, 400);
});
