import { STORAGE_KEY, validateData } from "./progress.mjs";
export function loadData(storage, seed) {
  const raw = storage.getItem(STORAGE_KEY);
  return raw === null ? validateData(seed) : validateData(JSON.parse(raw));
}
export function saveData(storage, data) {
  const clean = validateData(data);
  storage.setItem(STORAGE_KEY, JSON.stringify(clean));
  return clean;
}
