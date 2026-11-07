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
        ]),
        ...data.weights.map((r) => [
          "weight",
          r.id,
          r.date,
          "",
          "",
          r.weightKg,
          "",
        ]),
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
    if (!["run", "weight"].includes(row.kind))
      throw new Error(`CSV row ${i + 2}: kind must be run or weight.`);
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
        id: row.id || `weight-${row.date}`,
        date: row.date,
        weightKg: row.weightKg?.trim() ? Number(row.weightKg) : NaN,
      });
  }
  return validateData(data);
}
export function parseBackup(text, filename) {
  return filename.toLowerCase().endsWith(".csv")
    ? fromCSV(text)
    : validateData(JSON.parse(text));
}
