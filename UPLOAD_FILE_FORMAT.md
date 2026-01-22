# Upload File Format Guide

## Quick Reference

### For Trades
**Required columns:** `type`, `date`, `symbol`, `type` (BUY/SELL), `entryPrice`, `quantity`  
**Optional columns:** `exitPrice`, `profit`, `rationale`

### For Performance
**Required columns:** `date`, `totalReturn`, `ytdReturn`, `yearlyReturn`  
**Optional columns:** `platform`, `sharpeRatio`

---

## Trade File Format

### CSV Example for Trades
```csv
type,date,symbol,type,entryPrice,exitPrice,quantity,profit,rationale
trade,2024-01-15,AAPL,BUY,150.50,155.20,10,47.00,Strong earnings expected
trade,2024-01-20,TSLA,SELL,250.00,245.50,5,-22.50,Market correction concerns
trade,2024-02-01,MSFT,BUY,380.00,,20,,Long-term hold
```

### Excel Example for Trades
Same structure, but in Excel format (.xlsx or .xls)

### Column Details for Trades

| Column | Required | Type | Example | Notes |
|--------|----------|------|---------|-------|
| `type` | ✅ Yes | Text | `"trade"` | Must be exactly `"trade"` to route to trades collection |
| `date` | ✅ Yes | Date | `2024-01-15` or `15/01/2024` | Supports YYYY-MM-DD or DD/MM/YYYY |
| `symbol` | ✅ Yes | Text | `AAPL`, `TSLA`, `BTC` | Stock/crypto symbol |
| `type` | ✅ Yes | Text | `BUY` or `SELL` | Trade direction |
| `entryPrice` | ✅ Yes | Number | `150.50` | Entry price in £ (no currency symbol) |
| `exitPrice` | ❌ No | Number | `155.20` | Exit price in £ (optional) |
| `quantity` | ✅ Yes | Number | `10` | Number of shares/units |
| `profit` | ❌ No | Number | `47.00` | Profit/loss in £ (auto-calculated if exitPrice provided) |
| `rationale` | ❌ No | Text | `"Strong earnings"` | Explanation of trade |

### Important Notes for Trades:
- ✅ **First column must be `type` with value `"trade"`** - This tells the system to save to trades collection
- ✅ **Date format:** Use `YYYY-MM-DD` (e.g., `2024-01-15`) or `DD/MM/YYYY` (e.g., `15/01/2024`)
- ✅ **No currency symbols:** Don't include £ or $ in number fields
- ✅ **Numbers only:** Entry price, exit price, quantity, and profit should be numbers only

---

## Performance File Format

### CSV Example for Performance
```csv
date,platform,totalReturn,ytdReturn,yearlyReturn,sharpeRatio
2024-01-01,t212,15.5,5.2,12.3,1.8
2024-01-01,etoro,18.2,6.1,14.5,2.1
2024-02-01,t212,16.8,5.8,13.1,1.9
2024-02-01,hl,12.5,4.2,10.8,1.5
```

### Excel Example for Performance
Same structure, but in Excel format (.xlsx or .xls)

### Column Details for Performance

| Column | Required | Type | Example | Notes |
|--------|----------|------|---------|-------|
| `date` | ✅ Yes | Date | `2024-01-01` or `01/01/2024` | Supports YYYY-MM-DD or DD/MM/YYYY |
| `platform` | ❌ No | Text | `t212`, `etoro`, `hl`, `total` | Platform identifier |
| `totalReturn` | ✅ Yes | Number | `15.5` | Total return percentage |
| `ytdReturn` | ✅ Yes | Number | `5.2` | Year-to-date return percentage |
| `yearlyReturn` | ✅ Yes | Number | `12.3` | Yearly return percentage |
| `sharpeRatio` | ❌ No | Number | `1.8` | Sharpe ratio (optional) |

### Platform Values:
- `total` - All platforms combined
- `t212` - Trading 212
- `etoro` - eToro
- `hl` - Hargreaves Lansdown

### Important Notes for Performance:
- ❌ **No `type` column needed** - If no `type` column, defaults to performance collection
- ✅ **Date format:** Use `YYYY-MM-DD` (e.g., `2024-01-01`) or `DD/MM/YYYY` (e.g., `01/01/2024`)
- ✅ **Percentages:** Enter as numbers (e.g., `15.5` for 15.5%, not `0.155`)
- ✅ **Platform:** Use exact values: `t212`, `etoro`, `hl`, or `total`

---

## Common Mistakes to Avoid

### ❌ Wrong Format Examples:

```csv
# WRONG - Missing "type" column for trades
date,symbol,entryPrice,quantity
2024-01-15,AAPL,150.50,10

# WRONG - Currency symbols in numbers
type,date,symbol,entryPrice
trade,2024-01-15,AAPL,£150.50

# WRONG - Wrong date format (might not parse correctly)
type,date,symbol,entryPrice
trade,Jan 15 2024,AAPL,150.50

# WRONG - Missing required fields
type,date,symbol
trade,2024-01-15,AAPL
```

### ✅ Correct Format Examples:

```csv
# CORRECT - Trades with all fields
type,date,symbol,type,entryPrice,exitPrice,quantity,profit,rationale
trade,2024-01-15,AAPL,BUY,150.50,155.20,10,47.00,Strong earnings

# CORRECT - Trades with minimal fields
type,date,symbol,type,entryPrice,quantity
trade,2024-01-15,AAPL,BUY,150.50,10

# CORRECT - Performance data
date,platform,totalReturn,ytdReturn,yearlyReturn,sharpeRatio
2024-01-01,t212,15.5,5.2,12.3,1.8
```

---

## Step-by-Step: Creating Your File

### Option 1: Excel/Google Sheets
1. Open Excel or Google Sheets
2. Create headers in first row (see examples above)
3. Fill in your data
4. Save as CSV (File → Save As → CSV) or keep as Excel (.xlsx)

### Option 2: CSV Editor
1. Open a text editor or CSV editor
2. Type headers separated by commas
3. Add data rows
4. Save as `.csv` file

### Option 3: Export from Trading Platform
1. Export your trades/performance from Trading 212, eToro, etc.
2. Check the column names match the required format
3. Add `type` column with value `"trade"` if needed
4. Adjust date format if needed
5. Remove currency symbols from number columns

---

## Testing Your File

Before uploading a large file:

1. **Create a test file** with 2-3 rows
2. **Upload it** via `/admin/upload`
3. **Check the results:**
   - For trades: Go to `/admin/trades` or `/live-trades`
   - For performance: Go to `/admin/performance` or `/performance`
4. **Verify the data** looks correct
5. **If successful**, upload your full file

---

## Troubleshooting

### "No records processed"
- Check that your file has data rows (not just headers)
- Verify column names match exactly (case-sensitive)
- Ensure at least one row has data in required fields

### "Invalid date format"
- Use `YYYY-MM-DD` (e.g., `2024-01-15`) or `DD/MM/YYYY` (e.g., `15/01/2024`)
- Avoid formats like `Jan 15, 2024` or `15-Jan-2024`

### "Missing required fields"
- For trades: Need `type`, `date`, `symbol`, `type` (BUY/SELL), `entryPrice`, `quantity`
- For performance: Need `date`, `totalReturn`, `ytdReturn`, `yearlyReturn`

### Data going to wrong collection
- For trades: Must have `type` column with value `"trade"` in first column
- For performance: Don't include `type` column (or use different value)

---

## Quick Templates

### Trade Template (Copy & Paste)
```csv
type,date,symbol,type,entryPrice,exitPrice,quantity,profit,rationale
trade,2024-01-15,AAPL,BUY,150.50,155.20,10,47.00,Your reason here
trade,2024-01-20,TSLA,SELL,250.00,245.50,5,-22.50,Your reason here
```

### Performance Template (Copy & Paste)
```csv
date,platform,totalReturn,ytdReturn,yearlyReturn,sharpeRatio
2024-01-01,t212,15.5,5.2,12.3,1.8
2024-01-01,etoro,18.2,6.1,14.5,2.1
2024-02-01,t212,16.8,5.8,13.1,1.9
```

---

## Need Help?

If your file isn't working:
1. Check the console for specific error messages
2. Try the test file first (2-3 rows)
3. Verify column names match exactly
4. Check date formats
5. Remove any currency symbols from numbers
