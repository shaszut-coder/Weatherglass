# Weatherglass v3.0.0

Combined release: performance work + Speaker Mode + backup/export improvements. No data migration needed — safe to test and roll back like any other version (just revert `index.html` if anything looks wrong). The home screen's Activity/Conditions tiles (Total Observations, This Month, Logging Streak, Avg Temperature, etc.) are untouched by anything in this release.

## Performance

- **Journal virtualization**: replaced "Load more" pagination (hard-capped at 300 entries) with true windowed rendering — only rows actually scrolled into view are in the DOM. No practical ceiling on journal size anymore.
- **Insights off the main thread**: the four Trends → Insights cards (correlation, comfort threshold, peak heat index, alert coverage) now compute in a Web Worker, with an automatic synchronous fallback where Workers aren't available. Built from a single source function (`computeInsightsCore`) via `.toString()`, so there's no separate worker-only copy of the math to drift out of sync.

## Speaker Mode

- New **Speaker Mode** section in Settings: pick a date range, tap "Start Presentation" for a fullscreen, high-contrast slide sequence built from that range of your journal.
- Slides generated: title (range + entry/location counts), stats (temp range, peak feels-like, pressure range, alert coverage), alert timeline, photos (capped at 25 slides for very large ranges — samples evenly across the set rather than dropping the tail), and a chronological list of stops/locations.
- Fullscreen on start (best-effort — some browsers, notably iOS Safari, may not grant it; the overlay still works at normal size either way), arrow-key/spacebar navigation, Escape or the Exit button to leave.
- **Deferred, not forgotten**: the route/stops slide is a simple ordered list rather than an interactive map. A live map slide needs its own Leaflet instance separate from the Map tab's — doable, but scoped out of this release rather than rushed. Natural follow-up.

## Backup & Export

- **Import dedup fix**: importing a JSON file that overlaps with entries you already have now skips duplicates by id instead of silently appending them. You'll see a count of how many were skipped.
- **"Days since last export" nudge**: a banner in Settings → Data & Backup appears once it's been 7+ days since your last export (tracked via a local timestamp, not app data — losing it just resets the nudge, never a data-loss risk).
- **Speaker Kit export**: one button, one `.zip` — bundles a full JSON backup, a CSV, and every photo (extracted from their stored base64 form into real image files) into a single archive, plus a `manifest.txt` with entry/photo counts and a SHA-256 checksum of the JSON for integrity verification. Uses JSZip (added via the same CDN pattern as Leaflet/Chart.js/exif-js).

## Not included in this pass

- Pattern Tiles and Pressure Watch still compute synchronously — not currently a bottleneck, but a straightforward follow-up on the same Worker pattern.
- No service worker / offline app-shell caching yet — separate discussion, still open.
- No persistent auto-backup folder via the File System Access API yet — the "Speaker Kit" one-click archive covers the immediate need; scheduled/automatic backups are a reasonable v3.x addition later.
