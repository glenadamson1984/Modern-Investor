# How to Add Performance Data

There are **3 ways** to add your performance stats and charts:

## Method 1: Manual Entry via Firebase Console (Quick Start)

1. Go to **Firebase Console** → **Firestore Database** → **Data** tab
2. Click **"Start collection"** (if `performance` doesn't exist)
3. Collection ID: `performance`
4. Click **"Add document"**
5. Add these fields:

```
Field Name          Type        Value Example
─────────────────────────────────────────────
date                timestamp   [Select a date]
ytdReturn           number      15.5
yearlyReturn        number      18.2
totalReturn         number      45.8
sharpeRatio         number      1.85
```

6. Click **"Save"**
7. Repeat for each month/period you want to track

**Note:** The `date` field must be a **timestamp** type in Firestore.

## Method 2: CSV/Excel Upload (Bulk Import)

### CSV Format

Create a CSV file with these columns:

```csv
date,ytdReturn,yearlyReturn,totalReturn,sharpeRatio
2024-01-01,12.5,15.2,42.3,1.75
2024-02-01,13.8,16.1,43.8,1.82
2024-03-01,15.2,17.5,45.2,1.88
```

### Excel Format

Same columns in Excel:
- Column A: `date` (format as date)
- Column B: `ytdReturn` (number)
- Column C: `yearlyReturn` (number)
- Column D: `totalReturn` (number)
- Column E: `sharpeRatio` (number)

### Upload Steps

1. Make sure you're logged in as **admin**
2. Go to `/admin/upload`
3. Select your CSV or Excel file
4. Click **"Upload File"**
5. Data will be automatically imported

## Method 3: Admin Form (Coming Soon)

A simple form will be added to manually enter data through the website.

## Data Structure Reference

Each performance document should have:

```javascript
{
  date: Timestamp,        // Required - when this data is for
  ytdReturn: Number,      // Year-to-date return percentage
  yearlyReturn: Number,   // Annual return percentage
  totalReturn: Number,    // Total return since inception
  sharpeRatio: Number,    // Sharpe ratio metric
  createdAt: String       // Auto-added (ISO date string)
}
```

## Example Data

Here's sample data for 3 months:

**January 2024:**
- date: 2024-01-31
- ytdReturn: 5.2
- yearlyReturn: 15.8
- totalReturn: 42.5
- sharpeRatio: 1.75

**February 2024:**
- date: 2024-02-29
- ytdReturn: 8.7
- yearlyReturn: 16.5
- totalReturn: 44.2
- sharpeRatio: 1.82

**March 2024:**
- date: 2024-03-31
- ytdReturn: 12.3
- yearlyReturn: 17.2
- totalReturn: 46.1
- sharpeRatio: 1.88

## Where Data Appears

- **Homepage**: Latest metrics (YTD, Yearly, Total, Sharpe)
- **Performance Page**: Interactive charts with time period filters
- **Dashboard**: Member view of performance metrics

## Tips

- Add data monthly for best chart visualization
- Use consistent date format (end of month recommended)
- Keep historical data for year-over-year comparisons
- The chart automatically shows the most recent data
