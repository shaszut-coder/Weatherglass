# Changelog

All notable changes to Weatherglass are documented here, newest first.

## v3.5.0

**Notebooks** — link several entries together into one ongoing moment, like a storm rolling through where conditions are genuinely changing between shots, not one static reading.

- From any entry's detail view, **"Start a Notebook from this entry"** — name it, and that entry becomes the anchor.
- While a notebook is active, every **Quick Log** or **Quick Photo Log** you save automatically joins it — no extra taps, matching how the rest of capture already works.
- A small banner appears above the capture buttons on the Record tab showing the active notebook's name and entry count, with an **End** button.
- Any entry that's part of a notebook shows **"Part of [name] — N entries"** in its detail view, with a **View notebook** button opening a dedicated list of every linked entry, chronologically.
- You can also add an *existing* entry (one that predates the notebook) via **"Add to [name]"** in its detail view, while a notebook is active.

**Design notes, for anyone extending this later:**
- Implemented as a single additive `eventId` field on entries (plus `eventAnchor`/`eventName` on the anchor entry only) — no schema migration, no new IndexedDB store. The "clean" version (a dedicated events object store) was considered and deliberately deferred, since it's gated behind building real `onupgradeneeded` migration scaffolding, which doesn't exist yet.
- "Which notebook is active" lives in localStorage, not IndexedDB — same category as the export-nudge timestamp. Losing it just means new captures stop auto-joining; entries already linked keep that link permanently.
- The notebook viewer is a deliberately separate, lightweight overlay — the virtualized Journal list itself was not touched, per the earlier assessment that its scroll-position math (already the source of a real bug fixed in v3.4.8) was the highest-risk part of this app to modify casually.

## v3.4.8

**Fixed: the Journal list could render completely empty**, surviving tab switches and full page reloads, while all data underneath stayed completely intact (confirmed via a real 290-entry export — no data loss, no corruption, every entry present and valid).

Root cause: the Journal's virtualized list computes which rows to render based on scroll position (`startIdx`/`endIdx`), added back in v3.0.0. `startIdx` was only ever clamped to a *minimum* of 0 — never a maximum. If scroll position and the list's on-page offset combined to compute a `startIdx` larger than the actual entry count, `vlistRows.slice(startIdx, endIdx)` with a start point past the end silently returns an empty array in JavaScript — no error, no visible failure, just nothing rendered. Since this is driven by scroll state rather than the data itself, it reproduced the same broken result on every reload rather than resolving on its own.

Fixed by clamping `startIdx` to never exceed the last valid row index. Verified against the exact failure condition (a large leftover scroll offset against 290 rows) — the old logic produced a slice length of zero; the fixed logic correctly renders starting from the last valid row instead.

## v3.4.7

**Fixed: chart x-axis labels were crowding out the plot area.** This was a side effect of the v3.4.5 year fix — charts (Temperature, Pressure, Humidity, UV, PM2.5, Alert Severity) were reusing the same `formatTs()` function as Journal/Gallery/detail views, so each rotated axis label became the full "Jul 20, 2026 at 09:03 PM" instead of something shorter, squeezing the actual chart down to make room for the text.

Added a separate `formatChartLabel()` just for chart axes, adapted to the selected range: 1D/7D/30D views drop the year (it's implied — you're looking at a recent window) and show date + time; the "All" view keeps a compact year (since it can span multiple years) but drops the time. Full, unambiguous dates are still exactly one tap away in the entry detail view — this only shortens what's on the chart axis itself.

## v3.4.6

**Fixed: "Name existing locations" was silently skipping entries with a blank location name.** The bulk tool only matched entries whose location name was *exactly* the string "Current location" or "Unknown" — an entry with coordinates but an empty name (e.g. a photo attached through the manual entry form, where EXIF fills in latitude/longitude but never a place name, and the Location Name field was left blank) didn't match either string, so it was treated as "nothing to do" rather than "needs naming." The tool now also catches blank names.

**Also fixed at the source:** the manual entry form now defaults an empty Location Name field to "Current location" at save time, instead of saving an empty string — matching Quick Log and Quick Photo Log's existing convention, so this specific gap can't reoccur for new entries going forward. Entries already saved with a blank name will get picked up correctly the next time "Name existing locations" runs.

## v3.4.5

**Year added everywhere dates are shown**, plus two real bugs fixed along the way:

- Quick Log and Quick Photo Log entry titles now include the year.
- Route map point labels and the Map tab's date-strip chips now include the year.
- **Fixed:** the Daily Min/Avg/Max Temperature chart grouped entries by "month + day" only, meaning the same calendar date in different years (e.g. two Jul 19ths) silently merged into a single bar, blending temperatures from different years together. Now grouped by full date.
- **Fixed:** the Heating Rate chart had the same bug, but worse — a morning reading from one year could get paired with an afternoon reading from an entirely different year, producing a nonsense °F/hour rate. Now grouped by full date, so morning/afternoon pairs always come from the same actual day.
- **Deliberately unchanged:** the Year-over-Year chart's x-axis uses a fake shared year on purpose, to overlay multiple real years on the same axis for comparison — adding real years there would break the comparison it's designed to show.

## v3.4.4

**Fixed: dates were missing the year everywhere, not just the Gallery.** The shared `formatTs()` function used across the whole app — Gallery captions, Journal rows, Speaker Mode slides, alert timelines, entry detail sheets (21 call sites total) — was formatting timestamps as "Jul 19, 3:15 PM" with no year. Fixed at the source, so it's corrected everywhere at once rather than patched in just the Gallery. Existing entries are unaffected — this only changes how dates are *displayed*, not any stored data.

## v3.4.3

**Photo Capture renamed to Quick Photo Log** — mirrors "Quick Log" directly so the two buttons read as the same family of action, not two unrelated features. Updated everywhere: button tooltip, the label underneath the button, the shared help text, and the title on every entry it saves (new entries read "Quick photo log — ..." in the Journal).

**Button colors and help text finalized:**
- Quick Log: steel blue (`var(--steel)`), unchanged from the original.
- Quick Photo Log: burnt orange (`var(--burnt-orange)`) — the same color already used for the date/time in the header, not just a similar shade.
- Small uppercase labels now sit under each button ("Quick Log" / "Quick Photo Log"), plus one shared line explaining both: both save location/weather/alerts instantly, Quick Photo Log also opens the camera first and attaches the photo. Built for a passenger operating the buttons while the driver's attention stays on the road.

## v3.4.2

Photo Capture button is now a distinctly darker navy (`#1F3A52`) than Quick Log's steel blue (`#3E6079`) — two shades of the same navy family, chosen to be glanceable-different for a passenger operating the buttons while the driver's attention stays on the road. No functional change.

## v3.4.1

Photo Capture button now shows ⚡📷 (lightning + camera) on the same steel-blue background as Quick Log, instead of a separate brass/camera-only style — visually ties the two buttons together as variants of the same action. No functional change.

## v3.4.0

**Photo Capture** — new camera button (📷) next to Quick Log on the Record tab. Opens the camera directly; once you take the photo, location, current weather, active alerts, and place name all fill in automatically and the entry saves — same one-tap philosophy as Quick Log, just photo-first. Uses live GPS rather than the photo's embedded location data, since this is a "right now" capture (EXIF location remains how the manual entry form backfills past photos).

Under the hood: extracted Quick Log's location/weather/alert/geocode logic into a shared `gatherCurrentConditions()` function so Quick Log and Photo Capture both call the same implementation instead of maintaining two copies. Both buttons share the existing 60-second cooldown protection against accidental duplicate entries.

## v3.3.0

**New chart tiles: UV Index and PM2.5 Over Time** — two new buttons in Trends → Charts, alongside the existing TOT/POT/HOT/HIOT/HRC/YOY/ATX set: **UVOT** (UV Index Over Time) and **PMOT** (PM2.5 Over Time). Same simple line-chart treatment as Temperature/Pressure/Humidity Over Time, pulling from whichever entries in the selected date range have UV/PM2.5 data (including anything filled in by the v3.2.0 backfill tool). Shows a clear "no data yet" message rather than an empty chart if nothing's logged.

**1-day analysis window** — Trends → Charts now has a **1d** option alongside the existing 7d/30d/All range buttons, for zooming into just the current day's readings.

## v3.2.1

Renamed the "Backfill air quality" button to **"Backfill UV & PM2.5"** for clarity — no functional change.

## v3.2.0

**Backfill air quality for existing entries** — new tool in Settings → Location Tools ("Backfill air quality"). Fills UV Index and PM2.5 for entries that don't have them yet, using Open-Meteo's historical air-quality data matched to each entry's exact date, hour, and location — same source and same accuracy model as live captures, just fetched for the entry's actual timestamp instead of "now."
- Only ever fills empty fields; anything entered by hand (or already backfilled) is never overwritten.
- Matches each entry to its precise UTC hour in the historical dataset rather than approximating — more precise than the existing single-entry historical backfill (which buckets by a rough time-of-day tag), since bulk entries already have exact timestamps to match against.
- Processed in small batches with a short delay between requests and periodic saves, same pattern as the existing "Name existing locations" tool.
- Caveat carried over from when we discussed this: air quality models are coarser/more regional than temperature or pressure models, so treat filled-in values as regional estimates, not hyperlocal readings — noted directly in the tool's description in-app.

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
