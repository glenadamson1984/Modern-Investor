/**
 * Calculate annual summary from monthly returns for a given year and platform
 * Uses compound return calculation: (1 + r1) * (1 + r2) * ... * (1 + rn) - 1
 * 
 * @param {Array} monthlyEntries - Array of monthly entries for a year/platform
 * @returns {number|null} - Annual return percentage or null if no data
 */
export const calculateAnnualFromMonthly = (monthlyEntries) => {
  if (!monthlyEntries || monthlyEntries.length === 0) return null;
  
  // Filter entries that have monthlyReturn
  const entriesWithMonthly = monthlyEntries.filter(e => e.monthlyReturn != null);
  if (entriesWithMonthly.length === 0) return null;
  
  // Calculate compound return: (1 + r1/100) * (1 + r2/100) * ... - 1
  let compound = 1;
  entriesWithMonthly.forEach(entry => {
    const monthlyDecimal = entry.monthlyReturn / 100;
    compound *= (1 + monthlyDecimal);
  });
  
  // Convert back to percentage
  const annualReturn = (compound - 1) * 100;
  return parseFloat(annualReturn.toFixed(2));
};

/**
 * Calculate total performance metrics from individual platform entries
 * Groups entries by date and calculates averages across platforms
 * Also calculates annual summaries from monthly returns if available
 * 
 * @param {Array} entries - Array of performance entries from Firestore
 * @returns {Array} - Array with calculated total entries and annual summaries added
 */
export const calculateTotalPerformance = (entries) => {
  // Group entries by date (same day)
  const dateGroups = {};
  
  entries.forEach((entry) => {
    // Get the date as a key (normalize to start of day)
    const date = entry.date?.seconds 
      ? new Date(entry.date.seconds * 1000)
      : new Date(entry.date);
    
    const dateKey = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
    
    if (!dateGroups[dateKey]) {
      dateGroups[dateKey] = {
        date: entry.date,
        platforms: [],
      };
    }
    
    // Only include individual platform entries (not manually entered "total" entries)
    const platform = entry.platform || "total";
    if (platform !== "total") {
      dateGroups[dateKey].platforms.push(entry);
    }
  });
  
  // Calculate totals for each date group
  const calculatedTotals = [];
  
  Object.values(dateGroups).forEach((group) => {
    if (group.platforms.length > 0) {
      // Calculate average across platforms
      const platformCount = group.platforms.length;
      
      // For totalReturn, only average platforms that have it, otherwise use ytdReturn as fallback
      const platformsWithTotalReturn = group.platforms.filter(p => p.totalReturn != null);
      const totalReturn = platformsWithTotalReturn.length > 0
        ? platformsWithTotalReturn.reduce((sum, p) => sum + (p.totalReturn || 0), 0) / platformsWithTotalReturn.length
        : group.platforms.reduce((sum, p) => sum + (p.ytdReturn || 0), 0) / platformCount; // Fallback to YTD average
      
      const ytdReturn = group.platforms.reduce((sum, p) => sum + (p.ytdReturn || 0), 0) / platformCount;
      const yearlyReturn = group.platforms.reduce((sum, p) => sum + (p.yearlyReturn || 0), 0) / platformCount;
      
      // Average Sharpe ratio if available
      const sharpeRatios = group.platforms.filter(p => p.sharpeRatio != null && p.sharpeRatio !== 0);
      const sharpeRatio = sharpeRatios.length > 0
        ? sharpeRatios.reduce((sum, p) => sum + (p.sharpeRatio || 0), 0) / sharpeRatios.length
        : null;
      
      calculatedTotals.push({
        date: group.date,
        platform: "total",
        totalReturn: totalReturn,
        ytdReturn: ytdReturn,
        yearlyReturn: yearlyReturn,
        sharpeRatio: sharpeRatio,
        calculated: true, // Flag to indicate this is auto-calculated
      });
    }
  });
  
  // Calculate annual summaries from monthly returns
  // Group by year and platform, then calculate annual return
  const annualSummaries = [];
  const yearPlatformMap = {};
  
  entries.forEach((entry) => {
    if (entry.monthlyReturn == null) return; // Skip if no monthly return
    
    const entryDate = entry.date?.seconds 
      ? new Date(entry.date.seconds * 1000)
      : new Date(entry.date);
    const year = entryDate.getFullYear();
    const platform = entry.platform || "total";
    const key = `${year}_${platform}`;
    
    if (!yearPlatformMap[key]) {
      yearPlatformMap[key] = {
        year,
        platform,
        entries: [],
      };
    }
    
    yearPlatformMap[key].entries.push(entry);
  });
  
  // Calculate annual return for each year/platform combination
  Object.values(yearPlatformMap).forEach(({ year, platform, entries }) => {
    // Sort entries by date
    entries.sort((a, b) => {
      const dateA = a.date?.seconds ? a.date.seconds * 1000 : new Date(a.date).getTime();
      const dateB = b.date?.seconds ? b.date.seconds * 1000 : new Date(b.date).getTime();
      return dateA - dateB;
    });
    
    const annualReturn = calculateAnnualFromMonthly(entries);
    if (annualReturn != null) {
      // Create an annual summary entry for Dec 31 of that year
      const lastEntry = entries[entries.length - 1];
      const summaryDate = new Date(year, 11, 31); // Dec 31
      
      annualSummaries.push({
        date: lastEntry.date, // Use the last entry's date structure
        platform: platform,
        annualReturnFromMonthly: annualReturn,
        monthlyReturn: null, // This is a summary, not a monthly entry
        ytdReturn: annualReturn, // Annual return is also the YTD for the year
        yearlyReturn: annualReturn,
        totalReturn: null, // Would need to calculate from all years
        isAnnualSummary: true,
      });
    }
  });
  
  // Combine original entries with calculated totals and annual summaries
  // If there's already a manual "total" entry for a date, prefer that over calculated
  const result = [...entries];
  
  calculatedTotals.forEach((calculated) => {
    const calculatedDate = calculated.date?.seconds 
      ? new Date(calculated.date.seconds * 1000)
      : new Date(calculated.date);
    const calculatedDateKey = new Date(calculatedDate.getFullYear(), calculatedDate.getMonth(), calculatedDate.getDate()).getTime();
    
    // Check if there's already a manual "total" entry for this date
    const hasManualTotal = entries.some((entry) => {
      const entryDate = entry.date?.seconds 
        ? new Date(entry.date.seconds * 1000)
        : new Date(entry.date);
      const entryDateKey = new Date(entryDate.getFullYear(), entryDate.getMonth(), entryDate.getDate()).getTime();
      
      const entryPlatform = entry.platform || "total";
      return entryDateKey === calculatedDateKey && entryPlatform === "total";
    });
    
    // Only add calculated total if there's no manual total entry
    if (!hasManualTotal) {
      result.push(calculated);
    }
  });
  
  // Add annual summaries (these are informational, won't conflict with monthly entries)
  annualSummaries.forEach((summary) => {
    result.push(summary);
  });
  
  return result;
};

/**
 * Get the latest total performance (either manual or calculated)
 * @param {Array} entries - Array of performance entries
 * @returns {Object|null} - Latest total performance entry
 */
export const getLatestTotalPerformance = (entries) => {
  const totals = calculateTotalPerformance(entries);
  
  // Filter for total entries only
  const totalEntries = totals.filter((entry) => {
    const platform = entry.platform || "total";
    return platform === "total";
  });
  
  if (totalEntries.length === 0) return null;
  
  // Sort by date (most recent first)
  totalEntries.sort((a, b) => {
    const dateA = a.date?.seconds ? a.date.seconds * 1000 : new Date(a.date).getTime();
    const dateB = b.date?.seconds ? b.date.seconds * 1000 : new Date(b.date).getTime();
    return dateB - dateA;
  });
  
  return totalEntries[0];
};
