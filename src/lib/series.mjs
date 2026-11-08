const PALETTE = [
  "#65b8ff",
  "#ffc66d",
  "#b394ff",
  "#51d7d0",
  "#f58f72",
  "#c8d86c",
  "#f39bcd",
  "#a9b6c9",
];
export function yearColor(year, primary, comparison) {
  if (year === primary) return "#ff408b";
  if (year === comparison) return "#7bcda4";
  return PALETTE[((year % PALETTE.length) + PALETTE.length) % PALETTE.length];
}
