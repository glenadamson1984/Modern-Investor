# Running Progress

A personal running dashboard replacing Modern Investor. Built with Next.js, React and Recharts, retaining the charcoal, pink, Poppins and Inter visual theme.

## Run locally

```sh
npm ci
npm run dev
npm test
npm run lint
npm run build
npm start
```

The homepage has Distance, Pace and Weight tabs, accessible on mobile and desktop. Old investment, admin, authentication and API routes have been removed, along with Firebase and investment dependencies. No Firebase or other service credentials are needed. Existing hosting can continue building this repository with `npm run build`.

## Activity source

`src/data/seed.json` contains 466 Run / VirtualRun activities from the supplied **StatsHunters-Export-2026-11-07.xlsx**, covering 2017–2026, plus the 16 supplied weight records. Only activity IDs, dates, exact distance in kilometres and moving seconds were retained; GPS, names and device metadata were omitted. The workbook itself is not published. All 14 zero-distance activities are retained for completeness but excluded from pace calculations. Other activity types are excluded.

The exact recent distances are 6.3865 km (2 Nov), 5.1188 km (3 Nov), 9.6658 km (4 Nov), 10.0237 km (5 Nov) and 9.2682 km (7 Nov 2026): **40.463 km** in total. Pace is calculated from exported moving seconds, so it can differ from a pace estimated using rounded speeds.

## Calculations

- Weeks use ISO week numbers and Monday–Sunday dates, rather than matching calendar dates between years. ISO week years may include dates from an adjacent calendar year. Week 53 is supported, and a year without it shows no comparison data. Both full selected weeks are compared; incomplete weeks are not projected.
- Distance is the cumulative sum of recorded activity distances. A day with no record in a week containing measured runs adds zero recorded distance; a completely unrecorded week stays missing. Differences are primary year minus comparison year; percentages use the comparison year as the baseline. Missing or zero baselines have no percentage.
- Daily and cumulative pace use summed moving seconds / summed distance, never a mean of per-run paces. Multiple same-day runs are combined. Zero-distance activities contribute neither time nor distance to pace. Lower pace is faster; the chart has a reversed pace axis. Dotted lines show daily pace; solid lines show cumulative weekly pace. Days without a daily pace are gaps.
- Weight uses a leap-year calendar anchor to align month/day across years, including February 29. Only observed values have dots and tooltip entries; connecting lines are visual guides, not interpolated records. Latest weight, change since first measurement, previous-measurement change, and distance to the 74 kg target refer to the primary selected calendar year.

## Updating and backups

Open **Manage data** or **Add an entry** to add, edit or delete runs and weigh-ins. Run moving time accepts `mm:ss` or `h:mm:ss`. One weigh-in is supported per calendar date; multiple runs per day are supported. Future years appear automatically after adding records.

The initial data is loaded only if the `running-progress:v1` local-storage key is absent. Existing saved data, including an empty dataset or deleted seed records, always takes precedence over bundled seeds. Records are validated and saved before the UI reports success. Invalid stored data is not overwritten. Concurrent tab changes block edits until reload. This is a single-device browser log, not a server account or synchronized database. Clearing browser data removes saved changes: export backups regularly.

- **Export JSON** is a complete, versioned backup. Import and choose **Replace all records** to restore it exactly, including deletions. Replacement is an explicit step after previewing record counts.
- **Export CSV** provides an editable template with columns `kind,id,date,distanceKm,movingSeconds,weightKg,estimated`. Kind is `run` or `weight`; dates are `YYYY-MM-DD`; distance is kilometres; moving time is numeric seconds; weight is kilograms. Leave irrelevant fields blank. `estimated` is `true` or `false`. Keep exported IDs to update records. New CSV rows may omit IDs.
- **Merge records** updates existing IDs and matches weigh-ins by date. Exact runs replace estimated runs on the same date. Stable import IDs prevent repeat imports from duplicating records. To remove a row through a backup, use Replace, not Merge.
- For future StatsHunters exports, filter to Run / VirtualRun, convert `Distance (m)` to kilometres, use `Moving time` in seconds, and convert Date to `YYYY-MM-DD` in the template. Preserve stable IDs across repeated imports. No averages of rounded exported speeds are needed.

Changes to the bundled seed apply to new browsers only, so future deployments never overwrite personal edits. Import updates intentionally in an existing browser.

## Validation

`npm test` checks exact import values, ISO week boundaries, weighted daily and weekly pace, missing-data behavior, weight alignment and leap days, validation, backup round-trips, merges, and persistence including deletions and corruption. `npm run lint` and `npm run build` validate the Next.js application. Interactive charts also have text tables for accessing their underlying values.
