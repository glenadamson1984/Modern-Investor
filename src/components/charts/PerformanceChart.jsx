import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";
import { db } from "../../config/firebase";
import styled from "styled-components";
import { colours } from "../../utils/style.utils";
import { calculateTotalPerformance } from "../../utils/performance.utils";

const StyledChartContainer = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 2rem;
  margin-bottom: 2rem;
`;

const StyledChartTitle = styled.h3`
  font-family: "Poppins", sans-serif;
  font-size: 24px;
  font-weight: 600;
  color: ${colours.white};
  margin: 0 0 1.5rem 0;
`;

const PerformanceChart = ({ period = "1Y", showPlatforms = true }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch more entries to account for multiple platforms per date
        const limitCount = period === "1Y" ? 50 : period === "3Y" ? 150 : 300;
        const q = query(
          collection(db, "performance"),
          orderBy("date", "desc"),
          limit(limitCount)
        );
        const snapshot = await getDocs(q);
        const allEntries = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Calculate totals from individual platform entries
        const entriesWithTotals = calculateTotalPerformance(allEntries);

        // Group by date and platform - handle multiple entries per date
        const dateMap = {};
        entriesWithTotals.forEach((entry) => {
          const dateKey = new Date(
            entry.date.seconds * 1000
          ).toLocaleDateString("en-GB", { month: "short", year: "numeric" });
          
          if (!dateMap[dateKey]) {
            dateMap[dateKey] = { 
              date: dateKey,
              dateTimestamp: entry.date.seconds ? entry.date.seconds * 1000 : new Date(entry.date).getTime()
            };
          }
          
          const platform = entry.platform || "total";
          const platformName = 
            platform === "t212" ? "T212" :
            platform === "etoro" ? "eToro" :
            platform === "hl" ? "HL" :
            "Total";
          
          // Store both Total Return and YTD Return for each platform
          // Use totalReturn if available, otherwise use ytdReturn as fallback
          dateMap[dateKey][`${platformName}_Total`] = entry.totalReturn != null ? entry.totalReturn : (entry.ytdReturn || 0);
          dateMap[dateKey][`${platformName}_YTD`] = entry.ytdReturn || 0;
        });

        // Convert to array and sort by date timestamp
        const chartData = Object.values(dateMap)
          .sort((a, b) => {
            return (a.dateTimestamp || 0) - (b.dateTimestamp || 0);
          })
          .map(({ dateTimestamp, ...rest }) => rest); // Remove timestamp from final data

        setData(chartData);
      } catch (error) {
        console.error("Error fetching performance data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [period, showPlatforms]);

  if (loading) {
    return (
      <StyledChartContainer>
        <StyledChartTitle>Performance Chart</StyledChartTitle>
        <div style={{ color: colours.white, textAlign: "center" }}>
          Loading chart data...
        </div>
      </StyledChartContainer>
    );
  }

  if (data.length === 0) {
    return (
      <StyledChartContainer>
        <StyledChartTitle>Performance Chart</StyledChartTitle>
        <div style={{ color: colours.white, textAlign: "center" }}>
          No performance data available yet.
        </div>
      </StyledChartContainer>
    );
  }

  return (
    <StyledChartContainer>
      <StyledChartTitle>Performance Over Time</StyledChartTitle>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke={colours.grey} />
          <XAxis
            dataKey="date"
            stroke={colours.white}
            style={{ fontSize: "12px" }}
          />
          <YAxis
            stroke={colours.white}
            style={{ fontSize: "12px" }}
            tickFormatter={(value) => `${value}%`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: colours.darkGrey,
              border: `1px solid ${colours.pink}`,
              borderRadius: "8px",
              color: colours.white,
            }}
          />
          <Legend />
          {showPlatforms ? (
            <>
              {/* Total Return Lines */}
              <Line
                type="monotone"
                dataKey="Total_Total"
                stroke={colours.pink}
                strokeWidth={2}
                name="Total - Overall Return"
                dot={{ fill: colours.pink, r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="T212_Total"
                stroke={colours.green}
                strokeWidth={2}
                name="T212 - Overall Return"
                dot={{ fill: colours.green, r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="eToro_Total"
                stroke="#4A90E2"
                strokeWidth={2}
                name="eToro - Overall Return"
                dot={{ fill: "#4A90E2", r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="HL_Total"
                stroke="#FFB800"
                strokeWidth={2}
                name="HL - Overall Return"
                dot={{ fill: "#FFB800", r: 4 }}
              />
              {/* YTD Return Lines (dashed) */}
              <Line
                type="monotone"
                dataKey="Total_YTD"
                stroke={colours.pink}
                strokeWidth={1.5}
                strokeDasharray="5 5"
                name="Total - YTD Return"
                dot={{ fill: colours.pink, r: 3 }}
              />
              <Line
                type="monotone"
                dataKey="T212_YTD"
                stroke={colours.green}
                strokeWidth={1.5}
                strokeDasharray="5 5"
                name="T212 - YTD Return"
                dot={{ fill: colours.green, r: 3 }}
              />
              <Line
                type="monotone"
                dataKey="eToro_YTD"
                stroke="#4A90E2"
                strokeWidth={1.5}
                strokeDasharray="5 5"
                name="eToro - YTD Return"
                dot={{ fill: "#4A90E2", r: 3 }}
              />
              <Line
                type="monotone"
                dataKey="HL_YTD"
                stroke="#FFB800"
                strokeWidth={1.5}
                strokeDasharray="5 5"
                name="HL - YTD Return"
                dot={{ fill: "#FFB800", r: 3 }}
              />
            </>
          ) : (
            <>
              <Line
                type="monotone"
                dataKey="Total_Total"
                stroke={colours.pink}
                strokeWidth={2}
                name="Total Return (Overall)"
                dot={{ fill: colours.pink, r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="Total_YTD"
                stroke={colours.pink}
                strokeWidth={1.5}
                strokeDasharray="5 5"
                name="YTD Return"
                dot={{ fill: colours.pink, r: 3 }}
              />
            </>
          )}
        </LineChart>
      </ResponsiveContainer>
    </StyledChartContainer>
  );
};

export default PerformanceChart;
