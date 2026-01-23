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
        // Calculate date cutoff based on period
        const now = new Date();
        let cutoffDate = null;
        
        if (period === "1Y") {
          cutoffDate = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
        } else if (period === "3Y") {
          cutoffDate = new Date(now.getFullYear() - 3, now.getMonth(), now.getDate());
        } else if (period === "5Y") {
          cutoffDate = new Date(now.getFullYear() - 5, now.getMonth(), now.getDate());
        }
        // "ALL" means no cutoff
        
        // Fetch entries - use a reasonable limit for ALL, or filter by date for others
        const limitCount = period === "ALL" ? 500 : 300;
        const q = query(
          collection(db, "performance"),
          orderBy("date", "desc"),
          limit(limitCount)
        );
        const snapshot = await getDocs(q);
        let allEntries = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        
        // Filter by date if period is not "ALL"
        if (cutoffDate && period !== "ALL") {
          const cutoffTimestamp = cutoffDate.getTime();
          allEntries = allEntries.filter((entry) => {
            const entryDate = entry.date?.seconds 
              ? new Date(entry.date.seconds * 1000).getTime()
              : new Date(entry.date).getTime();
            return entryDate >= cutoffTimestamp;
          });
        }
        
        // Reverse to chronological order for processing
        allEntries.reverse();

        // Calculate totals from individual platform entries
        const entriesWithTotals = calculateTotalPerformance(allEntries);

        // Calculate cumulative returns from monthly returns for each platform
        // Group entries by platform and sort chronologically
        const platformEntries = {};
        entriesWithTotals.forEach((entry) => {
          const platform = entry.platform || "total";
          if (!platformEntries[platform]) {
            platformEntries[platform] = [];
          }
          platformEntries[platform].push(entry);
        });

        // Calculate cumulative returns per platform
        Object.keys(platformEntries).forEach((platform) => {
          const entries = platformEntries[platform].sort((a, b) => {
            const dateA = a.date?.seconds ? a.date.seconds * 1000 : new Date(a.date).getTime();
            const dateB = b.date?.seconds ? b.date.seconds * 1000 : new Date(b.date).getTime();
            return dateA - dateB;
          });

          let cumulative = 1;
          let hasStartedCalculation = false;
          
          entries.forEach((entry) => {
            // Priority 1: If we have a manually entered totalReturn, use that and reset cumulative
            if (entry.totalReturn != null && entry.totalReturn !== 0) {
              entry.calculatedTotalReturn = parseFloat(entry.totalReturn.toFixed(2));
              cumulative = 1 + (entry.totalReturn / 100);
              hasStartedCalculation = true;
            }
            // Priority 2: If we have monthlyReturn, calculate cumulative from monthly returns
            else if (entry.monthlyReturn != null && entry.monthlyReturn !== 0) {
              const monthlyDecimal = entry.monthlyReturn / 100;
              cumulative *= (1 + monthlyDecimal);
              entry.calculatedTotalReturn = parseFloat(((cumulative - 1) * 100).toFixed(2));
              hasStartedCalculation = true;
            }
            // Priority 3: If we've started calculating but this entry has no monthly return, 
            // carry forward the last cumulative value
            else if (hasStartedCalculation) {
              entry.calculatedTotalReturn = parseFloat(((cumulative - 1) * 100).toFixed(2));
            }
            // Otherwise, calculatedTotalReturn will remain null and we'll fall back to YTD
          });
        });

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
            platform === "cfd212" ? "CFD 212" :
            platform === "inv212" ? "INV 212" :
            platform === "etoro" ? "eToro" :
            platform === "hl" ? "HL" :
            "Total";
          
          // For Total Return: Use calculated cumulative if totalReturn is 0 or null, otherwise use totalReturn
          // If totalReturn is 0, it means it wasn't provided, so calculate from monthly returns
          // Treat 0 as "not provided" since it was likely from the CSV template with zeros
          const hasValidTotalReturn = entry.totalReturn != null && entry.totalReturn !== 0;
          let totalReturnValue = hasValidTotalReturn
            ? entry.totalReturn 
            : (entry.calculatedTotalReturn != null 
                ? entry.calculatedTotalReturn 
                : (entry.ytdReturn || 0));
          
          // Round to 2 decimal places
          totalReturnValue = parseFloat(totalReturnValue.toFixed(2));
          
          dateMap[dateKey][`${platformName}_Total`] = totalReturnValue;
          dateMap[dateKey][`${platformName}_YTD`] = entry.ytdReturn || 0;
        });

        // Calculate combined totals for each date (average across all platforms)
        Object.keys(dateMap).forEach((dateKey) => {
          const dateEntry = dateMap[dateKey];
          const platforms = ["CFD 212", "INV 212", "eToro", "HL"];
          
          // Calculate average total return across all platforms for this date
          const totalReturns = platforms
            .map(p => dateEntry[`${p}_Total`])
            .filter(v => v != null && v !== undefined);
          
          if (totalReturns.length > 0) {
            dateEntry["Total_Total"] = parseFloat((totalReturns.reduce((sum, v) => sum + v, 0) / totalReturns.length).toFixed(2));
          }
          
          // Calculate average YTD return across all platforms for this date
          const ytdReturns = platforms
            .map(p => dateEntry[`${p}_YTD`])
            .filter(v => v != null && v !== undefined);
          
          if (ytdReturns.length > 0) {
            dateEntry["Total_YTD"] = parseFloat((ytdReturns.reduce((sum, v) => sum + v, 0) / ytdReturns.length).toFixed(2));
          }
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
      <>
        <StyledChartContainer>
          <StyledChartTitle>Overall Return</StyledChartTitle>
          <div style={{ color: colours.white, textAlign: "center" }}>
            Loading chart data...
          </div>
        </StyledChartContainer>
        <StyledChartContainer>
          <StyledChartTitle>YTD Return</StyledChartTitle>
          <div style={{ color: colours.white, textAlign: "center" }}>
            Loading chart data...
          </div>
        </StyledChartContainer>
      </>
    );
  }

  if (data.length === 0) {
    return (
      <>
        <StyledChartContainer>
          <StyledChartTitle>Overall Return</StyledChartTitle>
          <div style={{ color: colours.white, textAlign: "center" }}>
            No performance data available yet.
          </div>
        </StyledChartContainer>
        <StyledChartContainer>
          <StyledChartTitle>YTD Return</StyledChartTitle>
          <div style={{ color: colours.white, textAlign: "center" }}>
            No performance data available yet.
          </div>
        </StyledChartContainer>
      </>
    );
  }

  return (
    <>
      {/* Overall Return Chart */}
      <StyledChartContainer>
        <StyledChartTitle>Overall Return</StyledChartTitle>
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
                <Line
                  type="monotone"
                  dataKey="Total_Total"
                  stroke={colours.pink}
                  strokeWidth={3}
                  name="Total (Combined)"
                  dot={{ fill: colours.pink, r: 5 }}
                />
                <Line
                  type="monotone"
                  dataKey="CFD 212_Total"
                  stroke={colours.white}
                  strokeWidth={2}
                  name="CFD 212"
                  dot={{ fill: colours.white, r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="INV 212_Total"
                  stroke="#00FF88"
                  strokeWidth={2}
                  name="INV 212"
                  dot={{ fill: "#00FF88", r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="eToro_Total"
                  stroke="#4A90E2"
                  strokeWidth={2}
                  name="eToro"
                  dot={{ fill: "#4A90E2", r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="HL_Total"
                  stroke="#FFB800"
                  strokeWidth={2}
                  name="HL"
                  dot={{ fill: "#FFB800", r: 4 }}
                />
              </>
            ) : (
              <>
                <Line
                  type="monotone"
                  dataKey="Total_Total"
                  stroke={colours.pink}
                  strokeWidth={3}
                  name="Total (Combined)"
                  dot={{ fill: colours.pink, r: 5 }}
                />
                <Line
                  type="monotone"
                  dataKey="CFD 212_Total"
                  stroke={colours.white}
                  strokeWidth={2}
                  name="CFD 212"
                  dot={{ fill: colours.white, r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="INV 212_Total"
                  stroke="#00FF88"
                  strokeWidth={2}
                  name="INV 212"
                  dot={{ fill: "#00FF88", r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="eToro_Total"
                  stroke="#4A90E2"
                  strokeWidth={2}
                  name="eToro"
                  dot={{ fill: "#4A90E2", r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="HL_Total"
                  stroke="#FFB800"
                  strokeWidth={2}
                  name="HL"
                  dot={{ fill: "#FFB800", r: 4 }}
                />
              </>
            )}
          </LineChart>
        </ResponsiveContainer>
      </StyledChartContainer>

      {/* YTD Return Chart */}
      <StyledChartContainer>
        <StyledChartTitle>YTD Return</StyledChartTitle>
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
                <Line
                  type="monotone"
                  dataKey="Total_YTD"
                  stroke={colours.pink}
                  strokeWidth={3}
                  name="Total (Combined)"
                  dot={{ fill: colours.pink, r: 5 }}
                />
                <Line
                  type="monotone"
                  dataKey="CFD 212_YTD"
                  stroke={colours.white}
                  strokeWidth={2}
                  name="CFD 212"
                  dot={{ fill: colours.white, r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="INV 212_YTD"
                  stroke="#00FF88"
                  strokeWidth={2}
                  name="INV 212"
                  dot={{ fill: "#00FF88", r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="eToro_YTD"
                  stroke="#4A90E2"
                  strokeWidth={2}
                  name="eToro"
                  dot={{ fill: "#4A90E2", r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="HL_YTD"
                  stroke="#FFB800"
                  strokeWidth={2}
                  name="HL"
                  dot={{ fill: "#FFB800", r: 4 }}
                />
              </>
            ) : (
              <>
                <Line
                  type="monotone"
                  dataKey="Total_YTD"
                  stroke={colours.pink}
                  strokeWidth={3}
                  name="Total (Combined)"
                  dot={{ fill: colours.pink, r: 5 }}
                />
                <Line
                  type="monotone"
                  dataKey="CFD 212_YTD"
                  stroke={colours.white}
                  strokeWidth={2}
                  name="CFD 212"
                  dot={{ fill: colours.white, r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="INV 212_YTD"
                  stroke="#00FF88"
                  strokeWidth={2}
                  name="INV 212"
                  dot={{ fill: "#00FF88", r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="eToro_YTD"
                  stroke="#4A90E2"
                  strokeWidth={2}
                  name="eToro"
                  dot={{ fill: "#4A90E2", r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="HL_YTD"
                  stroke="#FFB800"
                  strokeWidth={2}
                  name="HL"
                  dot={{ fill: "#FFB800", r: 4 }}
                />
              </>
            )}
          </LineChart>
        </ResponsiveContainer>
      </StyledChartContainer>
    </>
  );
};

export default PerformanceChart;
