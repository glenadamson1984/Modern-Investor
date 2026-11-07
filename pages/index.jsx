import Head from "next/head";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";
import seed from "../src/data/seed.json";
import DataManager from "../src/components/DataManager";
import {
  DAYS,
  distanceDifference,
  formatPace,
  isoWeek,
  STORAGE_KEY,
  TARGET_KG,
  weeklySeries,
  weeksInYear,
  weightSeries,
  weightSummary,
} from "../src/lib/progress.mjs";
import { loadData, saveData } from "../src/lib/storage.mjs";
const ProgressChart = dynamic(() => import("../src/components/ProgressChart"), {
  ssr: false,
  loading: () => <div className="chart-wrap loading">Loading chart…</div>,
});
const TABS = ["Distance", "Pace", "Weight"];
const number = (value) =>
  value == null
    ? "—"
    : value.toLocaleString("en-GB", {
        maximumFractionDigits: 2,
        minimumFractionDigits: 2,
      });
const signed = (value) =>
  value == null ? "—" : `${value > 0 ? "+" : ""}${number(value)}`;
const dateLabel = (date) =>
  date
    ? new Date(`${date}T12:00:00Z`).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        timeZone: "UTC",
      })
    : "No dates";
function Metric({ label, value, unit, detail, accent }) {
  return (
    <div className={`metric ${accent ? "accent" : ""}`}>
      <span className="metric-label">{label}</span>
      <div className="metric-value">
        {value}
        <span>{unit}</span>
      </div>
      <p>{detail}</p>
    </div>
  );
}
export default function Home() {
  const [data, setData] = useState(null);
  const [storageError, setStorageError] = useState("");
  const [blocked, setBlocked] = useState(false);
  const [tab, setTab] = useState("Distance");
  const [year, setYear] = useState(2026),
    [comparison, setComparison] = useState(2025),
    [week, setWeek] = useState(45);
  const [showManager, setShowManager] = useState(false);
  useEffect(() => {
    try {
      const loaded = loadData(window.localStorage, seed);
      setData(loaded);
      const latest = loaded.runs.at(-1);
      if (latest) {
        const lastWeek = isoWeek(latest.date);
        setYear(lastWeek.year);
        setComparison(lastWeek.year - 1);
        setWeek(lastWeek.week);
      }
    } catch {
      setData({ version: 1, runs: [], weights: [] });
      setBlocked(true);
      setShowManager(true);
      setStorageError(
        "Your saved data could not be read. It has not been overwritten. Export or recover it from browser storage before importing a replacement JSON/CSV backup. If browser storage is disabled, enable it and reload."
      );
    }
    function storageChanged(event) {
      if (event.key === STORAGE_KEY || event.key === null) {
        setBlocked(true);
        setStorageError(
          "The data changed in another browser tab. Reload this page before making further edits."
        );
      }
    }
    window.addEventListener("storage", storageChanged);
    return () => window.removeEventListener("storage", storageChanged);
  }, []);
  const years = useMemo(() => {
    const set = new Set([
      2025,
      2026,
      year,
      comparison,
      new Date().getFullYear(),
      new Date().getFullYear() + 1,
    ]);
    data?.runs.forEach((r) => {
      const y = isoWeek(r.date).year;
      set.add(y);
      set.add(Number(r.date.slice(0, 4)));
    });
    data?.weights.forEach((r) => set.add(Number(r.date.slice(0, 4))));
    return [...set].sort((a, b) => b - a);
  }, [data, year, comparison]);
  function persist(next) {
    if (blocked)
      throw new Error("Resolve the browser storage warning before editing.");
    try {
      const clean = saveData(window.localStorage, next);
      setData(clean);
      setStorageError("");
    } catch (e) {
      throw new Error(
        `Changes were not saved. ${e.message} Check browser storage or export a backup.`
      );
    }
  }
  function recover(next) {
    const clean = saveData(window.localStorage, next);
    setData(clean);
    setBlocked(false);
    setStorageError("");
  }
  function changeYear(value, secondary = false) {
    const next = Number(value);
    if (secondary) {
      if (next === year) setYear(comparison);
      setComparison(next);
    } else {
      if (next === comparison) setComparison(year);
      setYear(next);
    }
  }
  function openManager() {
    setShowManager(true);
    setTimeout(
      () =>
        document
          .getElementById("data-manager")
          ?.scrollIntoView({ behavior: "smooth" }),
      30
    );
  }
  const primary = weeklySeries(data?.runs || [], year, week);
  const previous = weeklySeries(data?.runs || [], comparison, week);
  const diff = distanceDifference(
    primary.distance,
    previous.distance,
    primary.hasData,
    previous.hasData
  );
  const weight = weightSummary(data?.weights || [], year);
  const olderWeight = weightSummary(data?.weights || [], comparison);
  const weightData = weightSeries(data?.weights || [], [year, comparison]);
  const chartData = primary.points.map((p, i) => ({
    day: p.day,
    [`y${year}`]: tab === "Pace" ? p.cumulativePace : p.distance,
    [`y${comparison}`]:
      tab === "Pace"
        ? previous.points[i].cumulativePace
        : previous.points[i].distance,
    [`daily${year}`]: p.dailyPace,
    [`daily${comparison}`]: previous.points[i].dailyPace,
    [`date${year}`]: p.date,
    [`date${comparison}`]: previous.points[i].date,
  }));
  const paceDiff =
    primary.pace != null && previous.pace != null
      ? primary.pace - previous.pace
      : null;
  const maxWeeks = Math.max(weeksInYear(year), weeksInYear(comparison));
  const displayedWeek = Math.min(week, maxWeeks);
  useEffect(() => {
    if (week > maxWeeks) setWeek(maxWeeks);
  }, [week, maxWeeks]);
  return (
    <>
      <Head>
        <title>Running Progress · Glen Adamson</title>
        <meta
          name="description"
          content="A personal running journal. Compare distance, pace and weight, one week at a time."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#232323" />
        <link rel="icon" href="/favicon.svg" />
      </Head>
      <a className="skip-link" href="#main">
        Skip to dashboard
      </a>
      <header className="site-header">
        <Link href="/">
          <a className="brand" aria-label="Running Progress home">
            <span className="brand-icon" aria-hidden="true">
              <svg viewBox="0 0 32 32" fill="none">
                <path
                  d="M3 17h7l4-10 5 19 4-9h6"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <span>
              RUNNING<span className="brand-light"> / PROGRESS</span>
            </span>
          </a>
        </Link>
        <div className="header-right">
          <span className="personal-label">GLEN ADAMSON · PERSONAL LOG</span>
          <button onClick={openManager}>
            Manage data <span aria-hidden="true">→</span>
          </button>
        </div>
      </header>
      <main id="main">
        <section className="hero">
          <div>
            <span className="eyebrow">
              <span className="status-dot" /> THE LONG GAME
            </span>
            <h1>
              Running <span>Progress</span>
              <span className="title-dot">.</span>
            </h1>
            <p>One run at a time. A little further. A little stronger.</p>
          </div>
          <button className="primary add-button" onClick={openManager}>
            <span aria-hidden="true">＋</span> Add an entry
          </button>
        </section>
        {storageError && (
          <div className="storage-warning" role="alert">
            {storageError}{" "}
            <button onClick={() => window.location.reload()}>Reload</button>
          </div>
        )}
        {!data ? (
          <div className="panel loading" role="status">
            Loading your training log…
          </div>
        ) : (
          <>
            <div className="dashboard-controls">
              <div className="tabs" role="tablist" aria-label="Progress metric">
                {TABS.map((t, i) => (
                  <button
                    key={t}
                    role="tab"
                    id={`tab-${t.toLowerCase()}`}
                    aria-selected={tab === t}
                    aria-controls="progress-panel"
                    tabIndex={tab === t ? 0 : -1}
                    onClick={() => setTab(t)}
                    onKeyDown={(event) => {
                      const moves = {
                        ArrowRight: (i + 1) % 3,
                        ArrowLeft: (i + 2) % 3,
                        Home: 0,
                        End: 2,
                      };
                      if (moves[event.key] !== undefined) {
                        event.preventDefault();
                        const next = TABS[moves[event.key]];
                        setTab(next);
                        document
                          .getElementById(`tab-${next.toLowerCase()}`)
                          ?.focus();
                      }
                    }}
                  >
                    <span aria-hidden="true" className="tab-number">
                      0{i + 1}
                    </span>
                    {t}
                  </button>
                ))}
              </div>
              <div className="year-controls">
                <label className="sr-only" htmlFor="primary-year">
                  Primary year
                </label>
                <select
                  id="primary-year"
                  value={year}
                  onChange={(e) => changeYear(e.target.value)}
                >
                  {years.map((y) => (
                    <option key={y}>{y}</option>
                  ))}
                </select>
                <span>vs</span>
                <label className="sr-only" htmlFor="comparison-year">
                  Comparison year
                </label>
                <select
                  id="comparison-year"
                  value={comparison}
                  onChange={(e) => changeYear(e.target.value, true)}
                >
                  {years.map((y) => (
                    <option key={y}>{y}</option>
                  ))}
                </select>
              </div>
            </div>
            <section
              id="progress-panel"
              role="tabpanel"
              aria-labelledby={`tab-${tab.toLowerCase()}`}
            >
              <div className="metrics-grid">
                {tab === "Weight" ? (
                  <>
                    <Metric
                      accent
                      label={`LATEST WEIGHT · ${year}`}
                      value={
                        weight.latest ? number(weight.latest.weightKg) : "—"
                      }
                      unit="kg"
                      detail={
                        weight.latest
                          ? `Measured ${dateLabel(weight.latest.date)} ${year}`
                          : "No measurements for this year"
                      }
                    />
                    <Metric
                      label={`CHANGE SINCE FIRST · ${year}`}
                      value={signed(weight.change)}
                      unit="kg"
                      detail={
                        weight.first
                          ? `Since ${dateLabel(weight.first.date)} · ${
                              weight.first.weightKg
                            } kg`
                          : "Add a weigh-in to start"
                      }
                    />
                    <Metric
                      label="DISTANCE TO TARGET"
                      value={
                        weight.latest
                          ? number(
                              Math.max(0, weight.latest.weightKg - TARGET_KG)
                            )
                          : "—"
                      }
                      unit="kg"
                      detail={
                        weight.latest && weight.latest.weightKg <= TARGET_KG
                          ? "Target of 74 kg reached"
                          : "Your target is 74 kg"
                      }
                    />
                  </>
                ) : (
                  <>
                    <Metric
                      accent
                      label={`${year} · WEEK ${displayedWeek}`}
                      value={
                        tab === "Pace"
                          ? formatPace(primary.pace)
                          : primary.hasData
                          ? number(primary.distance)
                          : "—"
                      }
                      unit={tab === "Pace" ? "/km" : "km"}
                      detail={`${primary.count} recorded ${
                        primary.count === 1 ? "run" : "runs"
                      } · ${dateLabel(primary.dates[0])}–${dateLabel(
                        primary.dates[6]
                      )}`}
                    />
                    <Metric
                      label={`${comparison} · WEEK ${displayedWeek}`}
                      value={
                        tab === "Pace"
                          ? formatPace(previous.pace)
                          : previous.hasData
                          ? number(previous.distance)
                          : "—"
                      }
                      unit={tab === "Pace" ? "/km" : "km"}
                      detail={
                        previous.dates.length
                          ? `${previous.count} recorded ${
                              previous.count === 1 ? "run" : "runs"
                            } · ${dateLabel(previous.dates[0])}–${dateLabel(
                              previous.dates[6]
                            )}`
                          : `No ISO week ${week} in ${comparison}`
                      }
                    />
                    <Metric
                      label={
                        tab === "Pace"
                          ? "PACE DIFFERENCE"
                          : "DISTANCE DIFFERENCE"
                      }
                      value={
                        tab === "Pace"
                          ? paceDiff == null
                            ? "—"
                            : `${
                                paceDiff > 0 ? "+" : paceDiff < 0 ? "−" : ""
                              }${formatPace(Math.abs(paceDiff))}`
                          : signed(diff.km)
                      }
                      unit={tab === "Pace" ? "/km" : "km"}
                      detail={
                        tab === "Pace"
                          ? paceDiff == null
                            ? "Both years need recorded distance"
                            : `${year} is ${
                                paceDiff < 0
                                  ? "faster"
                                  : paceDiff > 0
                                  ? "slower"
                                  : "the same pace"
                              } than ${comparison}`
                          : diff.percent == null
                          ? "Percentage needs a non-zero baseline"
                          : `${signed(
                              diff.percent
                            )}% compared with ${comparison}`
                      }
                    />
                  </>
                )}
              </div>
              <section className="panel chart-panel">
                <div className="section-heading">
                  <div>
                    <span className="eyebrow">
                      {tab === "Weight" ? "BODY & BALANCE" : "WEEK BY WEEK"}
                    </span>
                    <h2>
                      {tab === "Distance"
                        ? "Every kilometre adds up."
                        : tab === "Pace"
                        ? "Find your rhythm."
                        : "See the bigger picture."}
                    </h2>
                    <p>
                      {tab === "Distance"
                        ? "Cumulative distance · Monday to Sunday"
                        : tab === "Pace"
                        ? "Daily pace & cumulative weekly average · min:sec /km"
                        : "Actual weigh-ins · aligned by month and day"}
                    </p>
                  </div>
                  {tab !== "Weight" && (
                    <div className="week-picker">
                      <button
                        aria-label="Previous week"
                        disabled={week <= 1}
                        onClick={() => setWeek(week - 1)}
                      >
                        ←
                      </button>
                      <label className="sr-only" htmlFor="week">
                        Week
                      </label>
                      <select
                        id="week"
                        value={displayedWeek}
                        onChange={(e) => setWeek(Number(e.target.value))}
                      >
                        {Array.from({ length: maxWeeks }, (_, i) => (
                          <option key={i} value={i + 1}>
                            Week {String(i + 1).padStart(2, "0")}
                          </option>
                        ))}
                      </select>
                      <button
                        aria-label="Next week"
                        disabled={week >= maxWeeks}
                        onClick={() => setWeek(week + 1)}
                      >
                        →
                      </button>
                    </div>
                  )}
                </div>
                <div className="chart-legend">
                  <span>
                    <i className="legend-dot pink" />
                    {year}
                  </span>
                  <span>
                    <i className="legend-dot green" />
                    {comparison}
                  </span>
                  {tab === "Pace" && (
                    <span className="legend-note">
                      Solid: weekly average · Dotted: daily pace
                    </span>
                  )}
                  {tab === "Weight" && (
                    <span className="legend-note">Dashed: 74 kg target</span>
                  )}
                </div>
                <ProgressChart
                  mode={tab.toLowerCase()}
                  years={[year, comparison]}
                  data={tab === "Weight" ? weightData : chartData}
                  empty={
                    tab === "Weight"
                      ? !weightData.length
                      : !primary.hasData && !previous.hasData
                  }
                />
                <div className="chart-footnote">
                  <span className="status-dot" />
                  <p>
                    {tab === "Distance"
                      ? "Equivalent ISO weeks, aligned by weekday. Totals include all recorded runs in each selected week; an empty day means no recorded distance."
                      : tab === "Pace"
                      ? "Average pace = total moving seconds ÷ total kilometres. Lower is faster. Zero-distance activities are excluded from pace calculations."
                      : "Dots are actual measurements. Lines join observations as a visual guide; no missing measurements are filled in or counted."}
                  </p>
                </div>
              </section>
              <section className="panel breakdown">
                <div className="section-heading">
                  <div>
                    <span className="eyebrow">THE DETAILS</span>
                    <h2>
                      {tab === "Weight"
                        ? "Weight over time"
                        : "Your weekly breakdown"}
                    </h2>
                  </div>
                  <span className="muted">
                    {tab === "Weight"
                      ? "Recorded observations only"
                      : "Monday → Sunday"}
                  </span>
                </div>
                {tab === "Weight" ? (
                  <>
                    <div className="weight-summary">
                      {[
                        [year, weight],
                        [comparison, olderWeight],
                      ].map(([y, summary], i) => (
                        <div key={y}>
                          <span
                            className={i === 0 ? "pink-text" : "green-text"}
                          >
                            {y}
                          </span>
                          <h3>
                            {summary.latest
                              ? `${summary.latest.weightKg} kg`
                              : "No measurements"}
                          </h3>
                          <p>
                            {summary.previousChange == null
                              ? "No earlier weigh-in"
                              : `${signed(
                                  summary.previousChange
                                )} kg since previous weigh-in`}
                          </p>
                          <p>
                            {summary.latest
                              ? `Latest: ${summary.latest.date}`
                              : "Add measurements in Manage data"}
                          </p>
                        </div>
                      ))}
                    </div>
                    <div className="table-scroll">
                      <table>
                        <caption className="sr-only">
                          Actual weight measurements for the selected years
                        </caption>
                        <thead>
                          <tr>
                            <th>Date</th>
                            <th>Year</th>
                            <th>Weight</th>
                            <th>To target</th>
                          </tr>
                        </thead>
                        <tbody>
                          {data.weights
                            .filter((r) =>
                              [year, comparison].includes(
                                Number(r.date.slice(0, 4))
                              )
                            )
                            .sort((a, b) => b.date.localeCompare(a.date))
                            .map((r) => (
                              <tr key={r.id}>
                                <td>{r.date}</td>
                                <td>{r.date.slice(0, 4)}</td>
                                <td>{r.weightKg} kg</td>
                                <td>{signed(r.weightKg - TARGET_KG)} kg</td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  </>
                ) : (
                  <div className="table-scroll">
                    <table>
                      <caption className="sr-only">
                        Daily and cumulative {tab.toLowerCase()} for both
                        selected weeks
                      </caption>
                      <thead>
                        <tr>
                          <th>Day</th>
                          <th className="pink-text">
                            {year} {tab === "Pace" ? "daily" : "distance"}
                          </th>
                          <th className="green-text">
                            {comparison} {tab === "Pace" ? "daily" : "distance"}
                          </th>
                          <th className="pink-text">{year} cumulative</th>
                          <th className="green-text">
                            {comparison} cumulative
                          </th>
                          {tab === "Distance" && <th>Difference</th>}
                        </tr>
                      </thead>
                      <tbody>
                        {DAYS.map((day, i) => {
                          const p = primary.points[i],
                            b = previous.points[i];
                          const d = distanceDifference(
                            p.distance,
                            b.distance,
                            p.distance != null,
                            b.distance != null
                          );
                          return (
                            <tr key={day}>
                              <td>
                                <strong>{day}</strong>
                                <small>
                                  {year}: {dateLabel(p.date)} / {comparison}:{" "}
                                  {dateLabel(b.date)}
                                </small>
                              </td>
                              <td>
                                {tab === "Pace"
                                  ? formatPace(p.dailyPace)
                                  : `${number(p.dailyDistance)} km`}
                              </td>
                              <td>
                                {tab === "Pace"
                                  ? formatPace(b.dailyPace)
                                  : `${number(b.dailyDistance)} km`}
                              </td>
                              <td>
                                {tab === "Pace"
                                  ? formatPace(p.cumulativePace)
                                  : `${number(p.distance)} km`}
                              </td>
                              <td>
                                {tab === "Pace"
                                  ? formatPace(b.cumulativePace)
                                  : `${number(b.distance)} km`}
                              </td>
                              {tab === "Distance" && (
                                <td>
                                  {signed(d.km)} km
                                  <small>
                                    {d.percent == null
                                      ? "—"
                                      : `${signed(d.percent)}%`}
                                  </small>
                                </td>
                              )}
                            </tr>
                          );
                        })}
                      </tbody>
                      <tfoot>
                        <tr>
                          <th>
                            Week total{tab === "Pace" ? " / average" : ""}
                          </th>
                          <td>
                            {tab === "Pace"
                              ? formatPace(primary.pace)
                              : `${
                                  primary.hasData
                                    ? number(primary.distance)
                                    : "—"
                                } km`}
                          </td>
                          <td>
                            {tab === "Pace"
                              ? formatPace(previous.pace)
                              : `${
                                  previous.hasData
                                    ? number(previous.distance)
                                    : "—"
                                } km`}
                          </td>
                          <td colSpan={tab === "Pace" ? 2 : 3}>
                            {tab === "Pace"
                              ? "Weighted by distance"
                              : "All recorded runs in each week"}
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                )}
              </section>
            </section>
            {showManager && (
              <DataManager
                data={data}
                onSave={persist}
                blocked={blocked}
                onRecover={recover}
              />
            )}
            <div className="journal-banner">
              <div>
                <span className="eyebrow">KEEP SHOWING UP</span>
                <p>Progress is built in the everyday.</p>
              </div>
              <button onClick={openManager}>
                Update your log <span aria-hidden="true">→</span>
              </button>
            </div>
          </>
        )}
        <footer>
          <span>RUNNING / PROGRESS</span>
          <p>Personal data stays in this browser. Back it up regularly.</p>
          <span>THE NEXT RUN IS WHAT COUNTS.</span>
        </footer>
      </main>
    </>
  );
}
