# Changelog

All notable changes to Weatherglass are documented here, newest first.

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
