import { useEffect, useState } from "react";
import {
  sobrietyProgress,
  toLocalInput,
  validateSobriety,
} from "../lib/sobriety.mjs";
export default function Sobriety({ config, onSave, blocked }) {
  const [now, setNow] = useState(null),
    [editing, setEditing] = useState(false),
    [error, setError] = useState(""),
    [message, setMessage] = useState("");
  useEffect(() => {
    const tick = () => setNow(new Date());
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  const progress = now ? sobrietyProgress(config, now) : null;
  const money = (value) =>
    new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: config.currency,
    }).format(value);
  const date = new Date(config.startedAt).toLocaleString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
  const milestones = [
    1, 7, 30, 90, 180, 365, 500, 730, 1000, 1500, 2000, 3000, 5000,
  ];
  const next = progress ? milestones.find((d) => d > progress.wholeDays) : null;
  function submit(event) {
    event.preventDefault();
    setError("");
    setMessage("");
    try {
      const f = new FormData(event.currentTarget);
      const start = new Date(f.get("start"));
      if (!Number.isFinite(start.getTime()))
        throw new Error("Choose a valid start date.");
      if (start.getTime() > Date.now())
        throw new Error("Your sobriety start cannot be in the future.");
      const next = validateSobriety({
        startedAt: start.toISOString(),
        dailySpending: Number(f.get("spending")),
        dailyCalories: Number(f.get("calories")),
        currency: f.get("currency"),
      });
      onSave(next);
      setEditing(false);
      setMessage("Sobriety settings saved on this device.");
    } catch (e) {
      setError(e.message);
    }
  }
  return (
    <section className="panel sobriety-panel" aria-labelledby="sobriety-title">
      <div className="section-heading">
        <div>
          <span className="eyebrow">KEEP MOVING FORWARD</span>
          <h2 id="sobriety-title">One day at a time.</h2>
          <p>
            Since {date} · {Intl.DateTimeFormat().resolvedOptions().timeZone}
          </p>
        </div>
        <button
          onClick={() => {
            setEditing(!editing);
            setError("");
          }}
        >
          {editing ? "Close settings" : "Edit sobriety settings"}
        </button>
      </div>
      {progress && (
        <>
          <div className="sober-counter">
            <span className="eyebrow">DAYS SOBER</span>
            <div className="sober-days">
              {progress.wholeDays.toLocaleString("en-GB")}
              <span>days</span>
            </div>
            <div
              className="sober-clock"
              aria-label="Time within the current sober day"
            >
              {progress.hours}h · {progress.minutes}m · {progress.seconds}s
            </div>
            <p>
              {progress.started
                ? "Every day counts. Keep moving forward."
                : "Your saved start date is ahead of this device’s clock."}
            </p>
          </div>
          <div className="metrics-grid sober-estimates">
            <div className="metric">
              <span className="metric-label">ESTIMATED MONEY SAVED</span>
              <div className="sober-estimate green-text">
                {money(progress.moneySaved)}
              </div>
              <p>Based on {money(config.dailySpending)} per day</p>
            </div>
            <div className="metric">
              <span className="metric-label">ESTIMATED CALORIES AVOIDED</span>
              <div className="sober-estimate">
                {Math.floor(progress.caloriesSaved).toLocaleString("en-GB")}
                <span>kcal</span>
              </div>
              <p>
                Based on {config.dailyCalories.toLocaleString("en-GB")} kcal per
                day
              </p>
            </div>
          </div>
          {next && (
            <div className="sober-milestone">
              <span>
                Next milestone:{" "}
                <strong>{next.toLocaleString("en-GB")} days</strong>
              </span>
              <progress
                max={next}
                value={progress.days}
                aria-label={`Progress towards ${next} sober days`}
              />
              <span>
                About {Math.ceil(next - progress.days)} day
                {Math.ceil(next - progress.days) === 1 ? "" : "s"} to go
              </span>
            </div>
          )}
          <p className="muted">
            Savings are estimates based on your daily settings, calculated from
            elapsed time. They aren’t measured spending or calorie totals.
          </p>
        </>
      )}
      {editing && (
        <form className="entry-form sober-form" onSubmit={submit}>
          <h3>Your sobriety settings</h3>
          <label>
            Start date and time
            <input
              type="datetime-local"
              name="start"
              required
              defaultValue={toLocalInput(config.startedAt)}
            />
            <small>
              In this device’s timezone. Changing this date recalculates your
              counter and estimates.
            </small>
          </label>
          <label>
            Daily drink spending
            <input
              type="number"
              name="spending"
              min="0"
              step="0.01"
              required
              defaultValue={config.dailySpending}
            />
          </label>
          <label>
            Currency
            <select name="currency" defaultValue={config.currency}>
              <option value="GBP">GBP (£)</option>
              <option value="EUR">EUR (€)</option>
              <option value="USD">USD ($)</option>
            </select>
          </label>
          <label>
            Daily drink calories
            <input
              type="number"
              name="calories"
              min="0"
              step="any"
              required
              defaultValue={config.dailyCalories}
            />
          </label>
          <div className="button-group">
            <button className="primary" disabled={blocked}>
              Save sobriety settings
            </button>
          </div>
        </form>
      )}
      {error && (
        <p className="error" role="alert">
          {error}
        </p>
      )}
      {message && (
        <p className="success" role="status">
          {message}
        </p>
      )}
    </section>
  );
}
