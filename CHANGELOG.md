# Changelog

All notable changes to Weatherglass are documented here, newest first.

## v3.1.0

**Speaker Mode: analysis tiles added to the slide deck**
- Two new tile slides now appear right after the title slide in every presentation:
  1. **"This presentation"** — tiles scoped to the selected date range: Entries in Range, Avg Temperature, Severe Events, Locations.
  2. **"Overall, so far"** — the same six tiles as the home screen (Total Observations, This Month, This Week, Logging Streak, Avg Temperature, Severe Events), computed across the entire journal.
- Extracted the home screen's tile math into a standalone `computeOverviewCards()` function, shared by `renderCards()` (home screen) and `buildSpeakerSlides()` (Speaker Mode) — one source of truth instead of two copies to keep in sync. Home screen tiles are unaffected.

## v3.0.0

Combined release: performance work + Speaker Mode + backup/export improvements.

**Performance**
- Journal virtualization: replaced "Load more" pagination (hard-capped at 300 entries) with true windowed rendering. No practical ceiling on journal size anymore.
- Insights (Trends → Insights cards: correlation, comfort threshold, peak heat index, alert coverage) now compute in a Web Worker, with automatic synchronous fallback. Built from a single source function via `.toString()` — no separate worker-only copy of the math.

**Speaker Mode** *(new)*
- Settings → Speaker Mode: pick a date range, get a fullscreen, high-contrast slide sequence — title, stats, alert timeline, photos (capped at 25, sampled evenly for large ranges), and a chronological list of stops/locations.
- Fullscreen on start (best-effort — not guaranteed on iOS Safari), arrow-key/spacebar navigation, Escape or Exit button to leave.
- Known limitation: the route/stops slide is a list, not a live interactive map — would need a second Leaflet instance independent of the Map tab's. Deferred, not forgotten.

**Backup & Export**
- Import dedup fix: importing a JSON file that overlaps with existing entries now skips duplicates by id instead of silently appending them, with a skipped-count shown.
- "Days since last export" nudge banner in Settings → Data & Backup, appears after 7+ days since the last export.
- Speaker Kit export: one `.zip` bundling a full JSON backup, a CSV, every photo (extracted to real image files), and a `manifest.txt` with a SHA-256 checksum of the JSON.

## v2.9.14 and earlier

Baseline prior to this collaboration — "Load more" pagination capped the Journal at 300 entries, Insights computed synchronously on the main thread, no Speaker Mode, and import appended entries without checking for duplicates.
