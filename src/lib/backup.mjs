import Papa from "papaparse";
import { validateData } from "./progress.mjs";
const FIELDS = [
  "kind",
  "id",
  "date",
  "distanceKm",
  "movingSeconds",
  "weightKg",
  "estimated",
  "time",
  "startedAt",
  "dailySpending",
  "dailyCalories",
  "currency",
];
export function toCSV(data) {
  return Papa.unparse(
    {
      fields: FIELDS,
      data: [
        ...data.runs.map((r) => [
          "run",
          r.id,
          r.date,
          r.distanceKm,
          r.movingSeconds,
          "",
          r.estimated,
          "",
          "",
          "",
          "",
          "",
        ]),
        ...data.weights.map((r) => [
          "weight",
          r.id,
          r.date,
          "",
          "",
          r.weightKg,
          "",
          r.time || "",
          "",
          "",
          "",
          "",
        ]),
        ...(data.sobriety
          ? [
              [
                "sobriety",
                "sobriety-settings",
                data.sobriety.startedAt.slice(0, 10),
                "",
                "",
                "",
                "",
                "",
                data.sobriety.startedAt,
                data.sobriety.dailySpending,
                data.sobriety.dailyCalories,
                data.sobriety.currency,
              ],
            ]
          : []),
      ],
    },
    { escapeFormulae: true }
  );
}
export function fromCSV(text) {
  const parsed = Papa.parse(text.replace(/^\uFEFF/, ""), {
    header: true,
    skipEmptyLines: "greedy",
  });
  if (parsed.errors.length)
    throw new Error(`CSV could not be read: ${parsed.errors[0].message}`);
  if (!["kind", "date"].every((f) => parsed.meta.fields?.includes(f)))
    throw new Error(
      "CSV needs kind and date columns. Download a CSV backup for the template."
    );
  const data = { version: 1, runs: [], weights: [] };
  for (const [i, row] of parsed.data.entries()) {
    if (!["run", "weight", "sobriety"].includes(row.kind))
      throw new Error(
        `CSV row ${i + 2}: kind must be run, weight or sobriety.`
      );
    if (row.kind === "sobriety") {
      if (data.sobriety)
        throw new Error("Only one sobriety settings row is supported.");
      data.sobriety = {
        startedAt: row.startedAt,
        dailySpending: row.dailySpending?.trim()
          ? Number(row.dailySpending)
          : NaN,
        dailyCalories: row.dailyCalories?.trim()
          ? Number(row.dailyCalories)
          : NaN,
        currency: row.currency,
      };
      continue;
    }
    if (row.kind === "run") {
      if (row.estimated && !["true", "false"].includes(row.estimated))
        throw new Error(`CSV row ${i + 2}: estimated must be true or false.`);
      data.runs.push({
        id: row.id || `csv-${row.date}-${row.distanceKm}-${row.movingSeconds}`,
        date: row.date,
        distanceKm: row.distanceKm?.trim() ? Number(row.distanceKm) : NaN,
        movingSeconds: row.movingSeconds?.trim()
          ? Number(row.movingSeconds)
          : NaN,
        estimated: row.estimated === "true",
      });
    } else
      data.weights.push({
        id: row.id || `weight-${row.date}-${row.time || ""}-${row.weightKg}`,
        date: row.date,
        weightKg: row.weightKg?.trim() ? Number(row.weightKg) : NaN,
        ...(row.time?.trim() ? { time: row.time.trim() } : {}),
      });
  }
  return validateData(data);
}
export function parseBackup(text, filename) {
  return filename.toLowerCase().endsWith(".csv")
    ? fromCSV(text)
    : validateData(JSON.parse(text));
}
