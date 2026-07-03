# Changelog

All notable changes to Weatherglass are documented here.

## [2.6.0]

### Bug fixes
- **Quick Log duplicate prevention** — a 60-second cooldown now
  prevents accidental duplicate entries from rapid taps. The button
  shows "Wait Xs before logging again." and clears after 2.5 seconds
  if tapped too soon after the last save.

### New features
- **Heat Index ("Feels Like")** — auto-calculated from temp +
  humidity on every entry using the Rothfusz equation. Shown in the
  entry detail view as "Feels Like: X°F" whenever temp ≥ 80°F and
  humidity is present. Also added as a new `heatIndex` column in
  CSV exports.
- **NOAA Tides** — a "Tides" section appears automatically in the
  Record form when Location is set to a coastal spot (Beach, Bay,
  Dock, Shoreline, Boat, Lake shore, Coastal lookout). Tap "Check
  tide conditions" to find the nearest NOAA tide prediction station
  and fetch today's tide state (Rising/Falling/High/Low), current
  approximate water level, and next predicted tide. Shows in entry
  detail and exports to JSON/CSV.
- **Air Quality (UV + PM2.5)** — "Use current weather" now fetches
  UV Index and PM2.5 in parallel from Open-Meteo's air quality API
  alongside the existing weather data. New UV Index and PM2.5 fields
  added to the Record form, entry detail view, and CSV export.
- **Historical weather** — a "Fill historical weather" button sits
  alongside "Use current weather." For backdated entries, it pulls
  what conditions actually were from Open-Meteo's archive API, using
  the entry's Time of Day to pick the nearest hour. Prompts for a
  date (YYYY-MM-DD) if not editing an existing entry.
- **Location filter in Trends** — a "Filter by location" dropdown
  at the top of the Trends tab filters all charts, Personal Records,
  Insights, and Pressure Watch to only the selected location.
  Populated automatically from your logged entries; "All locations"
  is the default. Particularly useful once Illinois and Florida
  entries coexist in the same log.

## [2.5.0]

### Added
- **Quick Log button (⚡)** — a steel-blue pill button centered above
  the tabs, visible on every tab. One tap silently grabs your
  location, fetches current weather from Open-Meteo, calculates moon
  phase, tags time of day, and saves a Routine entry timestamped
  right now. No form, no decisions. Open Journal to review or add
  notes afterward. Falls back gracefully if location or weather fetch
  fails — the entry still saves.
- **Pressure Watch card** — always-visible card at the top of the
  Trends tab comparing the two most recent pressure readings. Uses
  the standard 0.06 inHg/hour threshold to detect rapid drops
  (storm/weather change signal) or rapid rises (clearing signal).
  Shows a placeholder explaining what it needs if readings are
  missing or too far apart, rather than hiding silently.
- **"On this day" strip** — top of the Journal tab, surfaces any
  entries logged on this exact month+day in previous years. Strict
  year-over-year only (true almanac feel). Hides cleanly when
  nothing matches. Entries shown as compact brass-tinted cards,
  tapping opens the full detail view.
- **Barometer dial home-screen icon** — an `apple-touch-icon` tag
  with a custom dial matching the app's steel/brass palette, embedded
  as a base64 data URI so no separate image file is needed.
  `apple-mobile-web-app-capable` tags also added so adding to the
  home screen opens full-screen without Safari's address bar.
- **Logo in masthead** — the barometer dial also appears next to the
  "Weatherglass" title in the app header.

### Changed
- Cloud photo identification (AI) removed — the feature required an
  Anthropic API key in the deployed environment which isn't available
  in a no-backend single-file app. Noted for future revisit via
  option 1 (user-supplied key) or option 2 (backend proxy).

## [2.4.1]

### Added
- A proper home-screen icon (barometer dial, matching the app's
  blue/grey/brass palette), embedded directly in `index.html` as a
  data URI — no separate image file needed. Previously, "Add to
  Home Screen" fell back to a plain gray square with the page
  title's first letter, since no `apple-touch-icon` was defined.
- `apple-mobile-web-app-capable` and related meta tags, so adding
  Weatherglass to the home screen opens it full-screen without
  Safari's address bar/chrome, feeling closer to a real app.

## [2.4.0]

### Added
- **Weather Alerts** section in the Record tab: a "Check active
  alerts" button pulls live data from the National Weather Service
  (api.weather.gov, US locations only, no API key needed) for the
  entry's location. Fills in Alert Active (yes/no), Alert Severity
  (the highest one, if multiple alerts are active at once), and
  Alert Summary, with the full official NWS wording kept in a
  separate field so it doesn't clutter the Journal list — shown only
  in the entry detail view when present. All four fields are also
  columns in JSON/CSV exports.
- **Moon Phase** and **Illumination %** are now calculated
  automatically for every entry from its real timestamp — pure date
  math, no API, no button, nothing to fill in. Shows in the entry
  detail view and as export columns.
- **Export CSV** button (Journal tab), alongside the existing Export
  JSON, for spreadsheet analysis. Flattens location into
  name/lat/lng columns, joins cloud varieties into one column, and
  replaces photos with a simple yes/no flag (photo data itself isn't
  included — JSON remains the full, lossless backup format).
- **Cloud Atlas reference sheet**: a "View Cloud Atlas reference"
  button in the Cloud Classification section opens a browsable
  reference of all 10 cloud genera (grouped Low/Middle/High), their
  species, varieties, and accessory clouds — pulled from the same
  data already powering the dropdowns, so it can't drift out of
  sync. Presented in Weatherglass's own layout rather than
  reproducing the source book's table design.
- **Humidity Over Time (HOT)** added as a 4th Trends chart button,
  alongside TOT/POT/EBC. The button row now uses an even-split flex
  layout (same pattern as the four main tabs) so all four fit
  cleanly on one line at any screen width.
- **"Most humid"** tile added to the Personal Records row, alongside
  Hottest/Coldest/Wettest/Windiest/Lowest Pressure.

### Changed
- The "New Reading" tab is now labeled **"Record"**.
- The live clock at the top now displays in a muted burnt orange,
  rather than the default ink-grey, to stand out from the rest of
  the header.

## [2.3.0]

Real-world testing reached ~2500 entries with great results overall
— 12-file export, all files landing correctly, and all 12
re-importing successfully. One remaining issue found: repeatedly
tapping "Load more" in the Journal eventually crashed the tab around
~2000 entries shown.

### Fixed
- The 2.1.0 pagination fix capped how many *new* rows "Load more"
  added per tap, but nothing capped the *total* — keep tapping
  enough times and it eventually rebuilds one giant list with every
  loaded entry's photo embedded at once anyway, the same underlying
  problem just deferred rather than solved. Added a real ceiling:
  the Journal list now stops offering "Load more" past 300 entries
  and instead points toward using search or the category filter,
  which still work against the complete underlying log regardless
  of this on-screen limit — so nothing becomes unreachable, it's
  just no longer found by endless scrolling once a log gets large.

## [2.2.2]

### Added
- A hard 50MB pre-flight size check on Import: oversized files are
  now refused immediately with a clear explanation, before any
  reading or parsing is attempted — rather than letting the tab
  crash partway through. Reading and `JSON.parse`-ing a huge file is
  one big blocking step that happens *before* any of the chunking
  fixes in 2.1.x/2.2.x can help, so this is a hard boundary rather
  than a graceful degradation. The message points toward importing
  Weatherglass's own "partN-of-N" export files individually instead
  of one combined file, since those are sized to safely stay well
  under this limit.

### Known limitation (unchanged)
True protection against an arbitrarily large single import file
would require streaming JSON parsing, which is a much bigger
undertaking not included here. This guard prevents the crash by
refusing the attempt outright instead.

## [2.2.1]

Testing of 2.2.0 found both new features had real problems.

### Fixed
- **Multi-file export**: the 2.2.0 version downloaded all parts
  automatically in a loop — but browsers (Safari especially) only
  reliably allow one file download per genuine user tap; firing
  several in a row from a script gets some of them silently dropped,
  which is exactly what happened. Export now shows a "Download part
  X of Y" button that requires an explicit tap per file — slightly
  more taps for very large logs, but every file now actually
  downloads. This same flow is reused for Reset Storage's safety
  backup step.
- **Reset Storage** could get stuck indefinitely on "Clearing
  storage…" with no way to know if it was still working or
  truly frozen — `indexedDB.deleteDatabase()` can hang if the
  database is already in the same corrupted state Reset Storage is
  trying to fix. Added an 8-second timeout: if clearing storage
  doesn't finish in that window, it stops waiting and shows a clear
  message rather than spinning forever — your entries are unaffected
  either way, since the backup download always happens first.

## [2.2.0]

Follow-up to extreme stress testing (~1800 entries) that found two
more issues beyond what 2.1.x fixed.

### Fixed
- **Export** now splits into multiple smaller files (e.g.
  `weatherglass-2026-06-26-part1-of-4.json`) once the log exceeds
  150 entries, instead of trying to build one giant file. The 2.1.1
  fix chunked the *string-building* loop, but the final
  `new Blob(parts)` assembly step still had to hold everything at
  once — at very large entry counts that single step could still be
  large enough to crash the tab. Splitting into files means no
  single Blob ever holds more than ~150 entries' worth of data.

### Added
- **Reset Storage** tool (Journal tab): for the rare case where
  repeated crashes leave the browser's database reporting storage
  used (e.g. hundreds of MB) that doesn't match what actually loads
  — a sign of an inconsistent/corrupted local database, not data
  that's truly gone. This tool automatically downloads a backup of
  whatever currently loads successfully, fully clears storage, then
  restores just that clean backup — discarding only the
  corrupted/unreadable leftovers, never anything that was actually
  loading fine.

### Known limitation
Sustained stress testing toward 1000+ entries with many photos can
still push mobile Safari's storage engine itself into a flaky state
under extreme memory pressure — this is a real constraint of running
a database inside a phone browser tab, not something app-level code
alone can fully eliminate. Normal day-to-day logging (one entry at a
time) was never at risk; this only surfaces under deliberate,
repeated bulk stress testing.

## [2.1.1]

Export had the exact same root-cause bug as the Journal/Map/import
hangs fixed in 2.1.0, just in a spot that hadn't been touched yet:
`JSON.stringify(entries, null, 2)` built one giant pretty-printed
string containing every embedded photo, all at once, in a single
blocking call — large enough with ~1000 photographed entries to
crash the tab the same way.

### Fixed
- Export now builds the JSON as many smaller per-entry string parts
  fed directly to `Blob()`, instead of one giant combined string —
  with brief yields every 50 entries (plus a "Preparing export: X of
  Y…" progress readout) so it never blocks solid on large logs

## [2.1.0] — Fixed the real cause of the "hangs forever" crash

The 2.0.0 storage migration fixed *silent data loss*, but a separate
bug remained: importing a very large number of entries (~1000, most
with photos) could make the page hang indefinitely. This turned out
to have nothing to do with which storage engine was used — the same
hang happened both before and after the IndexedDB migration, which
was the clue it was actually a **rendering** problem, not a storage
one.

### Root cause
Two places built one giant HTML string with *every* entry's full
photo (as base64 text) embedded directly inside it, with no limit:
the Journal list, and every Map marker's popup (built upfront, even
for pins never clicked). With hundreds of photos, that string could
balloon into the hundreds of MB — easily enough to freeze a phone.

### Fixed
- **Journal tab** is now paginated (50 entries at a time, with a
  "Load more" button) instead of rendering every entry's photo
  thumbnail into one giant blob at once
- **Map popups** no longer embed their photo upfront — the photo
  loads lazily only if/when that specific pin's popup is actually
  opened. The map also caps at the 300 most recently-dated mapped
  entries as a safety net, with a note if more exist
- **Import** now writes in small batches (25 entries per database
  transaction) with a "Importing X of Y…" progress readout, instead
  of one giant blocking transaction
- Selecting a large import file (>15MB) now shows an upfront notice
  that it may take a while / use noticeable memory

### Known limitation
Reading and JSON-parsing an extremely large import file is still a
single blocking step before any of the above kicks in — full
protection against arbitrarily huge single-file imports would need
streaming JSON parsing, which is a much bigger undertaking not
included here. Day-to-day logging (one entry at a time) was never
affected by any of this; it only showed up under deliberate bulk
stress-testing.

## [2.0.0] — Storage engine migration

A real-world stress test (repeatedly importing an exported file)
surfaced a serious bug: around ~900 entries (with most carrying a
photo), `localStorage` writes started silently failing. The entry
still *looked* saved in the UI, but wasn't actually written to disk
— so on the next reload, the app would snap back to whatever the
last successful write was, discarding everything added since,
with no warning that this had happened.

### Fixed
- Migrated the entire data layer from `localStorage` to
  **IndexedDB**, which has a dramatically higher storage quota
  (typically hundreds of MB+, scaling with device free space) and
  doesn't share `localStorage`'s single-blob-per-write bottleneck
- Every save, delete, and import now persists to storage **first**
  and only updates the visible list *after* that succeeds — so a
  failed write can never again silently diverge from what's actually
  on disk. If a write does fail, nothing already saved is touched,
  and what you were entering stays in the form so you don't lose it
- Import specifically now fails atomically: if importing a file
  would exceed available storage, none of those entries are added —
  your existing log is left completely untouched, rather than ending
  up in an unpredictable in-between state
- Existing `localStorage` data from older versions is automatically
  migrated into IndexedDB the first time this version loads. The old
  data is left in place (not deleted) as an extra safety net

### Added
- A persistent warning banner (must be manually dismissed, not an
  auto-disappearing toast) appears if a storage write ever fails,
  clearly stating that existing entries are safe
- A live storage-usage indicator in the Journal tab
  (`Storage: X used of Y available`), via the browser's
  `navigator.storage.estimate()` API, turning amber past 85% usage

## [1.3.4]

- Instruments Used is now a dropdown (Visual observation, iPhone,
  Weather app, Outdoor thermometer, Rain gauge, Other) instead of a
  free-text field, matching the realistic gear a casual backyard
  observer actually uses rather than professional-grade equipment.
  "Other" reveals a free-text field for anything not listed, same
  pattern as the Location dropdown

## [1.3.3]

- Added attribution for the cloud classification source: *The
  Cloudspotter's Guide* by Gavin Pretor-Pinney (founder of the Cloud
  Appreciation Society) — credited both in-app under the Cloud
  Classification fields and in the README

## [1.3.2]

- Added "Comfortable" to the Personal Impression dropdown

## [1.3.1]

- Renamed Entry Type from Reading / Forecast / Severe to **Routine /
  Notable / Severe**. "Forecast" was a meteorologist-style label that
  didn't match how a backyard observer actually logs things;
  "Notable" better captures "this caught my eye" (whether pretty,
  dramatic, or just plain strange), while Personal Impression + Notes
  carry the specific flavor of why it stood out

## [1.3.0]

- Added an optional **Cloud Classification** section, shown only
  when Category is set to "Sky & Cloud": Genus (the 10 main cloud
  types), Species, and Varieties (multiple selectable), based on the
  standard Latin cloud classification chart. Species and Varieties
  options update automatically based on which Genus is picked, since
  each genus only has certain valid species/varieties. All three
  fields are optional and show up in the entry detail sheet when
  filled in

## [1.2.3]

- Fixed a regression from 1.2.1: the single photo field with
  `capture="environment"` always opened the camera directly, with no
  way to choose an existing photo from your library. Replaced it
  with two separate buttons — **Take Photo** (camera) and **Choose
  Photo** (library/Photos app) — so both paths work side by side

## [1.2.2]

- Standardized on Safari for iOS, since Chrome on iOS has a known
  weak spot with camera capture, while Safari hands camera access
  off to the native Camera app reliably
- Updated the "location permission denied" message shown by the
  "Use current weather" button — it now points directly to Safari's
  per-site Website Settings (the "aA" icon → Website Settings →
  Location) and the Settings app → Safari → Location toggle, instead
  of the old message which assumed the app was still being viewed
  inside Claude's preview rather than deployed standalone

## [1.2.1]

- Photo field now requests the rear camera directly
  (`capture="environment"`) instead of showing the full
  camera/library/browse picker sheet. This works around an iOS
  Safari bug where the camera viewfinder could render as a black
  screen on some real-device deployments. **Trade-off:** tapping the
  photo field now opens the camera directly rather than offering a
  choice — there's no longer a one-tap option to pick an existing
  photo from your library from that same control.

## [1.2.0]

### Form changes
- Location field is now a dropdown of common observation spots (Home,
  Backyard, Front yard, Patio, Pool, Beach, Bay, Dock, Shoreline,
  Trailhead, Hiking trail, Car (in transit), Boat, Park, Scenic
  overlook, Neighborhood, Home weather station), with an "Other"
  option that reveals a free-text field for anything not listed
- Replaced the manual "Time Captured" field with fully automatic
  timestamping — date and time are captured silently the moment an
  entry is saved, and preserved (not overwritten) when an entry is
  later edited
- Added a "Time of Day" tag (Early Morning / Morning / Midday /
  Afternoon / Evening / Night / Late Night) as an independent,
  optional descriptive field — separate from the real timestamp, for
  flavor or for backdating by feel rather than the clock
- Photos with EXIF date metadata now suggest a Time of Day tag
  automatically, when one hasn't already been chosen

### Trends tab
- Chart toggle buttons shortened to abbreviations (TOT / POT / EBC),
  shrunk, and centered, with hover tooltips spelling out the full
  name
- Added a full descriptive title above the chart itself (e.g.
  "Pressure Over Time") that updates with the selected chart

### Journal tab
- Removed the location name from each entry's row in the list to fix
  text overflow on narrow screens; full location is still visible in
  the entry detail sheet

## [1.1.0]

- Added a "Personal Records" row to the Trends tab: Hottest,
  Coldest, Wettest, Windiest, and Lowest Pressure ever logged, each
  showing which entry set the record and when
- Added an optional "Personal impression" tag to each entry
  (Beautiful, Exciting, Peaceful, Ominous, Thrilling, Gloomy,
  Magical, Uncomfortable), searchable from the Journal tab and shown
  in the entry detail sheet as "Felt like"
- Renamed the "Log Book" tab to "Journal"
- Subheading changed to "A Personal Weather Journal"
- Tabs resized to fit all four (New Reading / Journal / Trends /
  Map) on one row without wrapping on narrow screens

## [1.0.0] — Initial release

A weather-focused sibling to Field Log, split out as its own
standalone app with an independent local data store.

### Core logging
- Structured JSON entries with entry type (Reading / Forecast /
  Severe), category (Temperature / Precipitation / Wind / Pressure /
  Sky & Cloud / Storm), location, coordinates, and notes
- Weather-specific fields: temperature (°F), humidity, pressure
  (inHg), wind speed (mph) and direction, cloud cover, precipitation,
  sky conditions, and instruments used
- Data persists locally in the browser via `localStorage` — nothing
  leaves the device
- Export / import entries as JSON for backup or transfer

### Photos
- Attach a sky photo to any entry; images are auto-resized and
  compressed client-side before saving, to keep local storage usage
  manageable
- Reads EXIF metadata from photos to auto-fill location and time,
  when available
- Tap any thumbnail to view full-size in a lightbox

### Weather
- "Use current weather" button fetches live temperature, humidity,
  pressure, wind, cloud cover, precipitation, and sky conditions from
  Open-Meteo (no API key required), in US units (°F, mph, inches,
  inHg)

### Journal / Log Book
- Slim, tappable list of entries (title + quick meta line)
- Tap an entry to open a detail sheet with full information and
  Edit / Delete actions
- Search by text, filter by category, sort newest/oldest first
- Two-step inline delete confirmation (no native browser dialogs)

### Trends & Map
- Temperature-over-time and pressure-over-time line charts, plus an
  entries-by-category bar chart (Chart.js)
- Map view (Leaflet + OpenStreetMap) plotting every entry with
  coordinates; pins show entry details and photos on tap

### Design
- Light blue / grey, old-world instrument-station visual theme
  (Playfair Display italics, brass accents for severe weather, faint
  ledger-line page texture)
- Mobile-first, slim-list navigation patterns
- `color-scheme: light` locked, so the page itself never follows
  system/OS dark mode

### Reliability notes
- No native browser dialogs (`alert`/`confirm`) — all confirmations
  and errors render as in-page UI, since these can be silently
  blocked in some embedded/preview contexts
- Map markers are drawn with CSS instead of external icon images, to
  avoid breakage from CDN path differences
- Defensive fallbacks if the map or photo-metadata libraries fail to
  load — the rest of the app keeps working
