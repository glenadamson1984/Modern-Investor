import { useRef, useState } from "react";
import {
  formatDuration,
  formatPace,
  mergeData,
  parseDuration,
  validDate,
} from "../lib/progress.mjs";
import { parseBackup, toCSV } from "../lib/backup.mjs";
export default function DataManager({ data, onSave, blocked, onRecover }) {
  const [kind, setKind] = useState("runs");
  const [editing, setEditing] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState(null);
  const [pending, setPending] = useState(null);
  const fileRef = useRef(null);
  const formRef = useRef(null);
  const isRun = kind === "runs";
  function switchKind(next) {
    setKind(next);
    setEditing(null);
    setDeleting(null);
    setMessage("");
    setError("");
  }
  function saveRecord(event) {
    event.preventDefault();
    setError("");
    setMessage("");
    try {
      const f = new FormData(event.currentTarget);
      const date = f.get("date");
      if (!validDate(date)) throw new Error("Enter a valid date.");
      const record = isRun
        ? {
            id: editing?.id || crypto.randomUUID(),
            date,
            distanceKm: Number(f.get("distanceKm")),
            movingSeconds: parseDuration(f.get("duration").trim()),
            estimated: f.get("estimated") === "on",
          }
        : {
            id: editing?.id || crypto.randomUUID(),
            date,
            weightKg: Number(f.get("weightKg")),
            ...(f.get("time") ? { time: f.get("time") } : {}),
          };
      const records = editing
        ? data[kind].map((r) => (r.id === editing.id ? record : r))
        : [...data[kind], record];
      onSave({ ...data, [kind]: records });
      setEditing(null);
      event.target.reset();
      setMessage("Record saved on this device.");
    } catch (e) {
      setError(e.message);
    }
  }
  function remove(id) {
    try {
      onSave({ ...data, [kind]: data[kind].filter((r) => r.id !== id) });
      setDeleting(null);
      if (editing?.id === id) setEditing(null);
      setMessage("Record deleted.");
      setError("");
    } catch (e) {
      setError(e.message);
    }
  }
  function download(format) {
    const blob = new Blob(
      [format === "json" ? JSON.stringify(data, null, 2) : toCSV(data)],
      {
        type: format === "json" ? "application/json" : "text/csv;charset=utf-8",
      }
    );
    const url = URL.createObjectURL(blob),
      a = document.createElement("a");
    a.href = url;
    a.download = `running-progress-${new Date()
      .toISOString()
      .slice(0, 10)}.${format}`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  async function readImport(event) {
    setError("");
    setMessage("");
    try {
      const file = event.target.files[0];
      if (!file) return;
      if (file.size > 10 * 1024 * 1024)
        throw new Error("Please use a backup smaller than 10 MB.");
      const incoming = parseBackup(await file.text(), file.name);
      setPending(incoming);
    } catch (e) {
      setError(`Import failed. ${e.message}`);
    }
    event.target.value = "";
  }
  function applyImport(replace) {
    try {
      const result = replace ? pending : mergeData(data, pending);
      if (blocked) onRecover(result);
      else onSave(result);
      setPending(null);
      setEditing(null);
      setMessage("Import saved on this device.");
      setError("");
    } catch (e) {
      setError(e.message);
    }
  }
  const records = [...data[kind]].sort(
    (a, b) => b.date.localeCompare(a.date) || (b.time || "").localeCompare(a.time || "") || a.id.localeCompare(b.id)
  );
  return (
    <section
      className="panel manager"
      id="data-manager"
      aria-labelledby="data-title"
    >
      <div className="section-heading">
        <div>
          <span className="eyebrow">YOUR TRAINING LOG</span>
          <h2 id="data-title">Make every entry count.</h2>
        </div>
        <span className="pill">
          {data.runs.length} runs · {data.weights.length} weigh-ins
        </span>
      </div>
      <div className="backup-bar">
        <p>
          Saved in this browser on this device. Export a backup before changing
          devices or clearing browser data.
        </p>
        <div className="button-group">
          <button onClick={() => download("json")}>Export JSON</button>
          <button onClick={() => download("csv")}>Export CSV</button>
          <button onClick={() => fileRef.current.click()}>Import backup</button>
          <input
            ref={fileRef}
            type="file"
            accept=".json,.csv"
            hidden
            onChange={readImport}
          />
        </div>
      </div>
      {pending && (
        <div className="import-preview">
          <strong>
            Ready to import {pending.runs.length} runs and{" "}
            {pending.weights.length} weigh-ins.
          </strong>
          <p>
            Merge updates matching IDs. Replace restores the complete backup and
            removes records absent from it.
          </p>
          <div className="button-group">
            <button disabled={blocked} onClick={() => applyImport(false)}>
              Merge records
            </button>
            <button className="danger" onClick={() => applyImport(true)}>
              Replace all records
            </button>
            <button onClick={() => setPending(null)}>Cancel</button>
          </div>
        </div>
      )}
      <div className="segmented" aria-label="Record type">
        <button aria-pressed={isRun} onClick={() => switchKind("runs")}>
          Runs
        </button>
        <button aria-pressed={!isRun} onClick={() => switchKind("weights")}>
          Weigh-ins
        </button>
      </div>
      <form
        ref={formRef}
        key={`${kind}-${editing?.id || "new"}`}
        onSubmit={saveRecord}
        className="entry-form"
      >
        <h3>
          {editing ? "Edit" : "Add"} {isRun ? "run" : "weigh-in"}
        </h3>
        <label>
          Date
          <input
            name="date"
            type="date"
            required
            defaultValue={
              editing?.date || new Date().toLocaleDateString("en-CA")
            }
          />
        </label>
        {isRun ? (
          <>
            <label>
              Distance (km)
              <input
                name="distanceKm"
                type="number"
                min="0"
                step="any"
                placeholder="6.38"
                required
                defaultValue={editing?.distanceKm ?? ""}
              />
            </label>
            <label>
              Moving time
              <input
                name="duration"
                type="text"
                placeholder="35:00 or 1:05:00"
                required
                defaultValue={
                  editing ? formatDuration(editing.movingSeconds) : ""
                }
              />
              <small>mm:ss or h:mm:ss</small>
            </label>
            <label className="checkbox">
              <input
                name="estimated"
                type="checkbox"
                defaultChecked={editing?.estimated || false}
              />{" "}
              Estimated distance
            </label>
          </>
        ) : (
          <>
            <label>
              Time (optional)
              <input
                name="time"
                type="time"
                defaultValue={editing?.time || ""}
              />
            </label>
            <label>
              Weight (kg)
              <input
                name="weightKg"
                type="number"
                min="0.1"
                step="any"
                placeholder="79.5"
                required
                defaultValue={editing?.weightKg ?? ""}
              />
            </label>
          </>
        )}
        <div className="button-group">
          <button className="primary" type="submit" disabled={blocked}>
            {editing ? "Save changes" : "Add record"}
          </button>
          {editing && (
            <button type="button" onClick={() => setEditing(null)}>
              Cancel edit
            </button>
          )}
        </div>
      </form>
      {message && (
        <p role="status" className="success">
          {message}
        </p>
      )}
      {error && (
        <p role="alert" className="error">
          {error}
        </p>
      )}
      <p className="muted">
        {isRun
          ? "Exact StatsHunters distances and moving times are included. Zero-distance records are retained but excluded from pace averages."
          : "All actual weigh-ins are retained, including multiple readings per day. Add measurements for any year; the comparison selectors update automatically."}
      </p>
      <div className="table-scroll log-table">
        <table>
          <caption className="sr-only">
            {isRun ? "Running activity records" : "Weight measurement records"}
          </caption>
          <thead>
            <tr>
              <th>Date</th>
              <th>{isRun ? "Distance" : "Weight"}</th>
              {isRun && (
                <>
                  <th>Moving time</th>
                  <th>Pace /km</th>
                </>
              )}
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {records.map((r) => (
              <tr key={r.id}>
                <td>
                  {r.date}
                  {r.time && <small>{r.time}</small>}
                  {r.estimated && <span className="estimate">estimate</span>}
                </td>
                <td>
                  {isRun
                    ? `${r.distanceKm
                        .toFixed(4)
                        .replace(/0+$/, "")
                        .replace(/\.$/, "")} km`
                    : `${r.weightKg} kg`}
                </td>
                {isRun && (
                  <>
                    <td>{formatDuration(r.movingSeconds)}</td>
                    <td>
                      {formatPace(
                        r.distanceKm > 0 ? r.movingSeconds / r.distanceKm : null
                      )}
                    </td>
                  </>
                )}
                <td>
                  <div className="row-actions">
                    {deleting === r.id ? (
                      <>
                        <span>Delete?</span>
                        <button
                          className="danger"
                          onClick={() => remove(r.id)}
                          aria-label={`Confirm delete ${r.date}`}
                        >
                          Confirm
                        </button>
                        <button onClick={() => setDeleting(null)}>
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          aria-label={`Edit ${r.date}`}
                          onClick={() => {
                            setEditing(r);
                            setError("");
                            formRef.current.scrollIntoView({
                              behavior: "smooth",
                              block: "center",
                            });
                          }}
                        >
                          Edit
                        </button>
                        <button
                          aria-label={`Delete ${r.date}`}
                          onClick={() => setDeleting(r.id)}
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {records.length === 0 && (
          <p className="empty-log">
            No records yet. Add your first entry above.
          </p>
        )}
      </div>
      <details className="import-help">
        <summary>CSV format and importing future activities</summary>
        <p>
          Use the exported CSV as your template. Columns:{" "}
          <code>
            kind,id,date,distanceKm,movingSeconds,weightKg,estimated,time
          </code>
          . Set kind to run or weight, use YYYY-MM-DD dates, kilometres, seconds
          of moving time and kilograms. Leave irrelevant fields blank. IDs are
          optional for new CSV rows and must be retained when editing exports.
          Import the same IDs to update existing runs. Weigh-ins match by ID;
          optional time uses HH:mm. Exact imported runs replace estimated
          records on the same date.
        </p>
        <p>
          For a future StatsHunters export, convert running rows to this CSV
          format: Distance (m) ÷ 1,000 → distanceKm; Moving time →
          movingSeconds. Include Run and VirtualRun activities. JSON exports
          preserve the entire dataset, including deletions; use Replace to
          restore one.
        </p>
      </details>
    </section>
  );
}
