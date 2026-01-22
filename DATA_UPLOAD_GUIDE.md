# Data Upload Guide

## Overview

The Data Upload screen (`/admin/upload`) allows you to bulk import performance data or trades from CSV or Excel files. This is useful when you have data exported from platforms like Trading 212, eToro, or Hargreaves Lansdown.

## How It Works

1. **Go to Admin Dashboard** → Click "Upload Data"
2. **Select a File** → Choose a CSV or Excel (.xlsx, .xls) file
3. **Upload** → The system will automatically parse the file and import the data

## File Format Requirements

### For Performance Data

Your CSV/Excel file should have columns matching the performance data structure:

**Required Columns:**
- `date` - Date in format: YYYY-MM-DD or DD/MM/YYYY
- `totalReturn` - Total return percentage (number)
- `ytdReturn` - Year-to-date return percentage (number)
- `yearlyReturn` - Yearly return percentage (number)
- `sharpeRatio` - Sharpe ratio (number, optional)

**Optional Columns:**
- `platform` - Platform identifier: `"total"`, `"t212"`, `"etoro"`, or `"hl"`
- `type` - Should be `"performance"` (or omit if all rows are performance)

**Example CSV:**
```csv
date,platform,totalReturn,ytdReturn,yearlyReturn,sharpeRatio
2024-01-01,t212,15.5,5.2,12.3,1.8
2024-01-01,etoro,18.2,6.1,14.5,2.1
2024-02-01,t212,16.8,5.8,13.1,1.9
```

### For Trade Data

Your CSV/Excel file should have columns matching the trade data structure:

**Required Columns:**
- `date` - Date in format: YYYY-MM-DD or DD/MM/YYYY
- `symbol` - Stock/ticker symbol (e.g., "AAPL", "TSLA")
- `type` - Trade type: `"BUY"` or `"SELL"`
- `entryPrice` - Entry price in £ (number)
- `quantity` - Number of shares/units (number)

**Optional Columns:**
- `exitPrice` - Exit price in £ (number)
- `profit` - Profit/loss in £ (number, auto-calculated if exitPrice provided)
- `rationale` - Explanation of the trade (text)
- `type` - Should be `"trade"` (to identify these as trades)

**Example CSV:**
```csv
type,date,symbol,type,entryPrice,exitPrice,quantity,profit,rationale
trade,2024-01-15,AAPL,BUY,150.50,155.20,10,47.00,Strong earnings expected
trade,2024-01-20,TSLA,SELL,250.00,245.50,5,-22.50,Market correction concerns
```

## How Data is Processed

1. **File Parsing**: The system reads your CSV/Excel file
2. **Data Detection**: It checks for a `type` column:
   - If `type = "trade"` → Saves to `trades` collection
   - Otherwise → Saves to `performance` collection
3. **Data Import**: Each row becomes a document in Firestore
4. **File Storage**: The original file is saved to Firebase Storage (if configured)

## Where Uploaded Data Appears

### Performance Data
- **Homepage** (`/`) - Shows latest overall performance metrics
- **Performance Page** (`/performance`) - Displays charts with all platforms
- **Admin → Manage Performance** (`/admin/performance`) - View and delete entries

### Trade Data
- **Live Trades Page** (`/live-trades`) - Member-only page showing all trades
- **Admin → Manage Trades** (`/admin/trades`) - View and delete trade entries

## Tips

1. **Date Format**: Use consistent date formats (YYYY-MM-DD recommended)
2. **Numbers**: Don't include currency symbols (£, $) in number fields
3. **Platform Names**: Use exact values: `"total"`, `"t212"`, `"etoro"`, `"hl"`
4. **Type Column**: Include `type: "trade"` or `type: "performance"` to route data correctly
5. **Headers**: Always include column headers in the first row

## Manual Entry Alternative

If you prefer to add data one entry at a time:
- **Performance**: Go to `/admin/add-performance`
- **Trades**: Go to `/admin/add-trade`

## Troubleshooting

- **"Unsupported file type"**: Make sure your file is CSV (.csv) or Excel (.xlsx, .xls)
- **"No records processed"**: Check that your file has data rows (not just headers)
- **Data not appearing**: Verify the column names match exactly (case-sensitive)
- **Wrong collection**: Make sure you include `type: "trade"` or `type: "performance"` column
