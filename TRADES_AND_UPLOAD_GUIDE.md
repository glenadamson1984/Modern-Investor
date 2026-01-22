# Trades & Data Upload Guide

## Where Trades Show Up

### 1. **Live Trades Page** (`/live-trades`) - **Member-Only**
   - **Who can see it:** Members and admins (requires login)
   - **What it shows:** All trades in a beautiful card layout
   - **Features:**
     - Trade symbol (e.g., AAPL, TSLA)
     - Trade type (BUY/SELL) with color coding
     - Entry and exit prices
     - Quantity
     - Profit/Loss (green for profit, red for loss)
     - Trade rationale/explanation
     - Sorted by date (newest first)
   - **Access:** Click "Live Trades" in the navigation menu (visible to logged-in members)

### 2. **Admin Trade Management** (`/admin/trades`) - **Admin-Only**
   - **Who can see it:** Admins only
   - **What it shows:** All trades in a table format for management
   - **Features:**
     - View all trades
     - Delete trades
     - Add new trades button
     - Quick overview of all trade data
   - **Access:** Admin Dashboard → "Manage Trades"

## How to Add Trades

### Option 1: Manual Entry (Single Trade)
1. Go to **Admin Dashboard** → **Manage Trades**
2. Click **"Add New Trade"**
3. Fill in the form:
   - Symbol (e.g., AAPL, TSLA, BTC)
   - Type (BUY or SELL)
   - Date
   - Entry Price
   - Exit Price (optional)
   - Quantity
   - Profit/Loss (auto-calculated if exit price provided)
   - Rationale (optional explanation)
4. Click **"Add Trade"**

### Option 2: Bulk Upload (Multiple Trades)
1. Go to **Admin Dashboard** → **Upload Data**
2. Prepare a CSV or Excel file with your trades
3. Upload the file
4. Trades are automatically imported

## Data Upload Use Cases

### Use Case 1: Bulk Import Historical Trades
**Scenario:** You have a spreadsheet with 100+ trades from Trading 212, eToro, or Hargreaves Lansdown

**How it works:**
- Export your trades from the platform (CSV/Excel)
- Format the file with required columns (see below)
- Upload via `/admin/upload`
- All trades are imported automatically

**Example CSV format:**
```csv
type,date,symbol,type,entryPrice,exitPrice,quantity,profit,rationale
trade,2024-01-15,AAPL,BUY,150.50,155.20,10,47.00,Strong earnings expected
trade,2024-01-20,TSLA,SELL,250.00,245.50,5,-22.50,Market correction
trade,2024-02-01,MSFT,BUY,380.00,,20,,Long-term hold
```

### Use Case 2: Bulk Import Performance Data
**Scenario:** You have monthly performance metrics from multiple platforms

**How it works:**
- Export performance data from your platforms
- Format with date, platform, returns, etc.
- Upload via `/admin/upload`
- Data appears on charts automatically

**Example CSV format:**
```csv
date,platform,totalReturn,ytdReturn,yearlyReturn,sharpeRatio
2024-01-01,t212,15.5,5.2,12.3,1.8
2024-01-01,etoro,18.2,6.1,14.5,2.1
2024-02-01,t212,16.8,5.8,13.1,1.9
```

### Use Case 3: Regular Monthly Updates
**Scenario:** You want to update your website monthly with new data

**Workflow:**
1. Export latest data from your platforms (Trading 212, eToro, HL)
2. Format into CSV/Excel
3. Upload via `/admin/upload`
4. Website automatically updates with new charts and trades

## Benefits of Data Upload

1. **Time Saving:** Import 100+ trades in seconds vs. entering manually
2. **Accuracy:** No manual data entry errors
3. **Consistency:** Same format every time
4. **Historical Data:** Easily import years of past trades/performance
5. **Multi-Platform:** Import from multiple platforms in one go

## File Format Requirements

### For Trades:
- **Required columns:** `type`, `date`, `symbol`, `type` (BUY/SELL), `entryPrice`, `quantity`
- **Optional columns:** `exitPrice`, `profit`, `rationale`
- **Important:** First column must be `type` with value `"trade"` to route to trades collection

### For Performance:
- **Required columns:** `date`, `totalReturn`, `ytdReturn`, `yearlyReturn`
- **Optional columns:** `platform`, `sharpeRatio`
- **Note:** If no `type` column, defaults to performance collection

## Where Uploaded Data Appears

### Trades:
- ✅ `/live-trades` - Member-facing page
- ✅ `/admin/trades` - Admin management page

### Performance:
- ✅ `/` - Homepage (latest metrics)
- ✅ `/performance` - Charts page (all platforms)
- ✅ `/admin/performance` - Admin management page

## Quick Reference

| Action | Location | Access |
|--------|----------|--------|
| View trades (members) | `/live-trades` | Members + Admins |
| Manage trades (admin) | `/admin/trades` | Admins only |
| Add single trade | `/admin/add-trade` | Admins only |
| Bulk upload | `/admin/upload` | Admins only |

## Tips

1. **Test with small files first** - Upload 2-3 rows to verify format
2. **Check date formats** - Use YYYY-MM-DD for best compatibility
3. **Remove currency symbols** - Don't include £ or $ in number fields
4. **Include headers** - Always have column names in first row
5. **Use "type" column** - Include `type: "trade"` to route trades correctly
