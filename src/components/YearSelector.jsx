import { yearColor } from "../lib/series.mjs";
export default function YearSelector({
  years,
  selected,
  year,
  comparison,
  onChange,
}) {
  return (
    <section className="panel year-selector" aria-label="Chart year visibility">
      <div className="section-heading">
        <div>
          <span className="eyebrow">YOUR WHOLE HISTORY</span>
          <h2>Choose the years you want to see.</h2>
          <p>
            Switch individual chart lines on or off. Summary cards and targets
            still compare {year} with {comparison}.
          </p>
        </div>
        <div className="button-group">
          <button onClick={() => onChange(years)}>Show all years</button>
          <button onClick={() => onChange([year, comparison])}>
            Comparison years
          </button>
          <button onClick={() => onChange([])}>Hide all</button>
        </div>
      </div>
      <div className="year-switches">
        {years.map((y) => (
          <button
            key={y}
            aria-pressed={selected.includes(y)}
            onClick={() =>
              onChange(
                selected.includes(y)
                  ? selected.filter((v) => v !== y)
                  : [...selected, y]
              )
            }
          >
            <i
              className="legend-dot"
              style={{ background: yearColor(y, year, comparison) }}
            />
            {y}
            <span aria-hidden="true">{selected.includes(y) ? "✓" : "+"}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
