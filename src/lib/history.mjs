import { validateData } from "./progress.mjs";
// One-time, additive import: existing dates and IDs win, and subsequent deletions stay deleted.
export function applyHistory(data, history) {
  if (data.imports?.includes(history.id)) return data;
  const ids = new Set(data.weights.map((r) => r.id));
  const dates = new Set(data.weights.map((r) => r.date));
  const additions = history.weights.filter(
    (r) => !ids.has(r.id) && !dates.has(r.date)
  );
  return validateData({
    ...data,
    weights: [...data.weights, ...additions],
    imports: [...(data.imports || []), history.id],
  });
}
