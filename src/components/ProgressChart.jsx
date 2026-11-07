import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { calendarLabel, formatPace, TARGET_KG } from "../lib/progress.mjs";
const COLORS = ["#ff408b", "#7bcda4"];
function ChartTooltip({ active, payload, label, mode }) {
  if (!active || !payload?.length) return null;
  const actual = payload.filter((p) => p.value != null);
  if (!actual.length) return null;
  return (
    <div className="chart-tooltip">
      <strong>{mode === "weight" ? calendarLabel(label) : label}</strong>
      {actual.map((p) => {
        const year = p.dataKey.match(/\d{4}/)?.[0];
        const date = p.payload[`date${year}`];
        return (
          <div key={p.dataKey}>
            <span style={{ color: p.color }}>{p.name}</span>
            <b>
              {mode === "pace"
                ? `${formatPace(p.value)} /km`
                : `${Number(p.value).toFixed(2)} ${
                    mode === "weight" ? "kg" : "km"
                  }`}
            </b>
            {date && <small>{date}</small>}
          </div>
        );
      })}
    </div>
  );
}
export default function ProgressChart({ data, years, mode, empty }) {
  const weight = mode === "weight",
    pace = mode === "pace";
  return (
    <div
      className="chart-wrap"
      role="img"
      aria-label={
        weight
          ? "Actual weight observations by month and day. Values are also listed in the weigh-in table."
          : `${
              pace ? "Daily and cumulative average pace" : "Cumulative distance"
            } by weekday. Values are also listed in the weekly breakdown.`
      }
    >
      {empty ? (
        <div className="empty-chart">
          <span>NO RECORDS FOR THIS SELECTION</span>
          <h3>A fresh starting line.</h3>
          <p>Select another week or add your data below.</p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 18, right: 16, bottom: 5, left: 0 }}
            accessibilityLayer
          >
            <CartesianGrid stroke="#ffffff0d" vertical={false} />
            <XAxis
              dataKey="day"
              type={weight ? "number" : "category"}
              domain={weight ? ["dataMin - 2", "dataMax + 2"] : undefined}
              tickFormatter={weight ? calendarLabel : undefined}
              tick={{ fill: "#a7a7ad", fontSize: 12 }}
              tickLine={false}
              axisLine={false}
              minTickGap={24}
              interval={weight ? "preserveStartEnd" : 0}
              dy={10}
            />
            <YAxis
              width={58}
              tick={{ fill: "#a7a7ad", fontSize: 12 }}
              tickFormatter={pace ? formatPace : undefined}
              reversed={pace}
              domain={
                weight
                  ? [
                      (min) => Math.floor(Math.min(min, TARGET_KG) - 1),
                      (max) => Math.ceil(max + 1),
                    ]
                  : pace
                  ? ["auto", "auto"]
                  : [0, "auto"]
              }
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              content={<ChartTooltip mode={mode} />}
              cursor={{ stroke: "#ffffff30", strokeDasharray: "4 4" }}
              filterNull
            />
            {weight && (
              <ReferenceLine
                y={TARGET_KG}
                stroke="#c4c4ca"
                strokeDasharray="5 5"
                label={{
                  value: "TARGET · 74 KG",
                  fill: "#c4c4ca",
                  position: "insideTopRight",
                  fontSize: 10,
                }}
              />
            )}
            {years.map((year, i) =>
              pace ? (
                <Line
                  key={`${year}-daily`}
                  type="linear"
                  dataKey={`daily${year}`}
                  name={`${year} daily`}
                  stroke={COLORS[i]}
                  strokeWidth={1.5}
                  strokeDasharray="3 5"
                  dot={{ r: 3, strokeWidth: 0 }}
                  activeDot={{ r: 7 }}
                  connectNulls={false}
                  isAnimationActive={false}
                />
              ) : null
            )}
            {years.map((year, i) => (
              <Line
                key={year}
                type="linear"
                dataKey={`y${year}`}
                name={`${year}${pace ? " weekly average" : ""}`}
                stroke={COLORS[i]}
                strokeWidth={3}
                dot={{
                  r: weight ? 4 : 3,
                  fill: COLORS[i],
                  stroke: "#262626",
                  strokeWidth: 2,
                }}
                activeDot={{ r: 7, strokeWidth: 3 }}
                connectNulls={weight}
                isAnimationActive={false}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
