# Changelog

All notable changes to Weatherglass are documented here, newest first.

> **Deployment status note (as of v5.6.6, Nov 27, 2026):** **v5.6.6 is in a pull request waiting to be merged. v5.6.5 is live at https://weatherglass.earth** (merged as PR #4 on Nov 25). Earlier: v5.6.3 was verified on the phone (new icon; the app opens offline, confirmed in airplane mode). Releases since v5.6.0: v5.6.0 (Gallery rebuild), v5.6.1 (brass icon), v5.6.2 (address shown in the app).

## v5.6.6

**Settings is now "Tools."** The footer row and the panel are renamed, and the gear icon is now a wrench. The panel holds tools (backup, cleanup, backfills, notebooks, Speaker Mode) rather than settings. Help text that said "Settings → …" now says "Tools → …". The element ids keep their old `settings…` names, so nothing else had to change.

**New: Tools → Diagnostics.**
- **Error log.** The app now writes down the last 20 problems it runs into, with the time, the app version and the message: uncaught errors, failed promises, console errors and warnings (such as "Quick log save failed"), and outside libraries that fail to load. Repeats within 5 seconds are counted rather than listed again. Tap **Copy** to paste them into a chat, or **Clear** to empty the list. The log is kept in this browser's storage (`wg-error-log`) and is never sent anywhere.
  - The logger is the first script on the page, so it can catch problems in everything after it. A typing mistake that stops the whole app from loading still can't be caught.
- **Connection test.** One button checks whether the app can reach Ambient Weather's online service (`rt.` and `api.ambientweather.net`) straight from the browser, using made-up keys. It also checks Open-Meteo as a control. It explains the result in plain words:
  - Ambient answered: no relay needed.
  - Ambient didn't answer but Open-Meteo did: a Cloudflare relay is probably needed.
  - Neither answered: check the connection.
  - The result is also added to the error log, so Copy includes it.

`sw.js` and `manifest.json` are unchanged, so there's no `CACHE_VERSION` bump.

Tested in Chrome at iPhone size, with the outside libraries and services stubbed because there was no network:
- No console errors, and the footer shows v5.6.6.
- The footer row reads "Tools" with a wrench icon; the panel title and its screen-reader labels say Tools; Diagnostics sits just above About, and Danger Zone is still last.
- A deliberate error and a failed promise both appeared in the log; Copy put them on the clipboard with a version header; Clear emptied it.
- Connection test: both outcomes worked. When Ambient answered with code 401 it reported "Good news"; when Ambient was blocked it reported that a relay is probably needed.
- **Offline:** the service worker installed and saved its 5 core files. After a second online load, the library cache held the chart add-on (`chartjs-adapter-date-fns` from `cdn.jsdelivr.net`). With the network off, the app reloaded, showed v5.6.6, and loaded the add-on from the cache.

## v5.6.5

**Settings button moved to the footer.** The floating Settings button from v5.6.4 is replaced by a slim, centered **⚙ Settings** row in the footer at the end of every tab, just above "weatherglass.earth · version". This is option 3 from the design mockups. The user tried the floating button and preferred the footer.
- The slide-up Settings panel is unchanged: Danger Zone is still last, and it still closes with ✕, by tapping above it, or by switching tabs.
- Removed the extra bottom space the floating button needed, and the "saved" messages are back at their original position.
- Everything else from v5.6.4 stays: the 5 s and 3 s capture guards and the offline crash fix.

Tested in Chrome at iPhone size, with the CDN libraries stubbed: the footer shows v5.6.5; scrolled to the end of each of the 5 tabs, the Settings row is on screen; it opens and closes the panel; and there are no console errors.

## v5.6.4

**Settings moved out of the Journal tab.** A slim **⚙ Settings** button now floats at the bottom center of every tab. Settings slides up as a panel over whatever tab you're on, instead of opening inside Journal and pushing the calendar down. Close it with ✕, by tapping the dimmed area above it, or by switching tabs. The panel scrolls on its own, and the page behind it stays put.
- **Danger Zone moved to the very end** of Settings (it was third).
- The large gear next to Journal's search box is gone.
- Pages got extra space at the bottom so the button never covers the last thing on a page, and the "saved" messages now appear just above it.
- **Rollback:** this release only changes `index.html`, so re-uploading v5.6.3's `index.html` undoes it. The button is one separate piece of markup, so moving it (for example to a footer line) won't touch the panel.

**Shorter, separate capture guards.** The shared 30-second wait between captures is replaced with short guards that only stop an accidental double tap:
- **Quick Log:** 5 seconds.
- **Quick Photo Log:** 3 seconds, so you can shoot a burst during a storm.
- Each has its own timer, so a Quick Log no longer blocks a Quick Photo, or the other way round. The Record tab's ready/cooling indicator follows whichever is longer.

**Fixed: a crash after an offline capture.** Entries saved offline have no pressure until they're filled in. Pressure Watch's check treated that empty value as a real reading of 0, so the barometer dial crashed while redrawing the screen. In practice, an offline Quick Log was saved but could show "Could not save quick entry — try again," and the rest of the screen didn't refresh until the conditions filled in. A failed redraw also skipped starting the capture wait. Pressure Watch, the barometer dial, the Trends temperature/pressure/humidity check and Speaker Mode's pressure figures now count only real numbers (`hasNumber()`).

`sw.js` and `manifest.json` are unchanged, so there's no `CACHE_VERSION` bump. The app page is network-first, so installed copies get v5.6.4 the next time they open online.

Tested in Chrome at iPhone size, with the CDN libraries stubbed because there was no network:
- No console errors, and the footer shows v5.6.4.
- The Settings button shows on all 5 tabs. The panel opens, locks the page behind it, lists Danger Zone last, and closes with ✕, by tapping above it and by switching tabs.
- Scrolled to the bottom, the footer ends above the button.
- **Quick Log:** a second tap at once shows "Wait 5s"; after 5 s it saves.
- **Quick Photo:** a photo right after a Quick Log saves; a second photo at once shows "Wait 3s"; after 3 s it saves.
- Before the crash fix, the same test on v5.6.3 showed the `toFixed` error after each offline save.

## Repo housekeeping (Nov 25, 2026, no app version change)

- **The live site now publishes only the app.** Added `.assetsignore` so the docs, Worker source and `wrangler.jsonc` stop appearing on weatherglass.earth. Removed the old `weatherglass-netlify 11.zip` / `12.zip` backups (still in GitHub history)
- **Security headers now actually apply.** Moved them from `netlify.toml` (Netlify-only, ignored by Cloudflare) into `_headers`, and removed `netlify.toml`
- **AI Worker locked to Weatherglass.** `cloud-classify-worker.js` now refuses requests from other websites and photos over ~6 MB. **Re-paste it into the Cloudflare dashboard** for this to take effect on the deployed Worker
- README: fixed the `DEPLOYMENT.md` path and updated the repo layout

## v5.6.3

**New app icon: "Dusk Weatherglass."** The brass dial now looks up at the sky. Changes from v5.6.1:
- the cream face is now a window onto a dusk sky, with a cumulus cloud and a low sun
- navy ticks run in a barometer arc over the top, with a gap at the bottom
- a navy needle shows the current reading, and a slim bronze **set hand** behind it marks the last one, as on a real weatherglass, where you set it to compare "then vs now"
- a soft glass highlight on the top left

It replaces `icon-192.png`, `icon-512.png` (also the maskable icon) and `apple-touch-icon.png`, plus the 180 px logo embedded in `index.html` (header logo and iPhone home-screen icon).

**Fixed: the service worker never installed on the live site.** `sw.js` and `manifest.json` looked for the icons in an `icons/` folder, but the repo keeps them at the top level beside `index.html`. The missing files made the service worker's install step fail, so the app couldn't open with no connection, and the install icons in the manifest were missing. Both files now point at the top-level icons.

**Browser-tab icon:** `index.html` now links `icon-192.png` as the favicon. This clears the old "favicon 404" item.

`sw.js` `CACHE_VERSION` → `v5.6.3`.

Tested in Chrome at iPhone size, with the CDN libraries stubbed because there was no network: no console errors, the footer shows v5.6.3, the service worker installs and caches all five core files, and all three icons load. Run against the v5.6.2 files, the same test showed the service worker failing on `GET /icons/icon-192.png 404`.

**After uploading:** iPhone keeps the old home-screen icon until the app is removed and re-added, and removing it can delete its journal. **Export a backup first**, then import it into the re-added app.

## v5.6.2

**The app now shows its address.** `weatherglass.earth` wasn't shown anywhere in the app. It now appears in two places:
- **Footer, on every screen:** **weatherglass.earth · v5.6.2**, which links to the official address.
- **Settings → About:** "Official address: weatherglass.earth", plus a line saying **which copy you're in**:
  - on `weatherglass.earth`: *"You're using the official address ✓"*
  - on an old address, such as `weatherglass.shaszut.workers.dev`: a brass note explaining that each address keeps its own separate journal on the device, with the steps to move (Export here, add weatherglass.earth to the Home Screen, Import there)
  - on a test copy, such as `beta.weatherglass.earth` or a Cloudflare preview URL: *"This is a test copy… log real observations at weatherglass.earth"*

This matters because each web address, and on iPhone each Safari tab as opposed to the home-screen app, keeps a separate journal. Since the move to the new domain, it's easy to open the wrong copy without noticing.

**Speaker Kit:** the archive's `manifest.txt` now includes "Official app: https://weatherglass.earth".

Tested in Chromium on all three kinds of address (official, old workers.dev, beta), each showing the right message, with no errors.

## v5.6.1

**A more colorful app icon: the "brass instrument."** It's the same barometer dial, redrawn as an antique weatherglass:
- a brass bezel around a cream face
- a dark hand with a brass center
- three soft colored zones around the dial, blue to teal to gold, echoing the Rain / Change / Fair markings on a real barometer
- a twilight sky behind it, fading from deep blue to a sunset glow

It replaces the plain steel-blue icon everywhere: the home-screen icon (`icons/apple-touch-icon.png`), the install icons (`icons/icon-192.png`, `icons/icon-512.png`, also used as the maskable icon), and the small logo in the app header. The dial sits inside the safe area, so Android's rounded and circular icon masks don't crop it.

**`sw.js` `CACHE_VERSION` bumped to `v5.6.1`.** The service worker serves icons cache-first, so the bump is what makes phones fetch the new ones.

**iPhone note:** iOS saves a home-screen icon when the app is added and doesn't refresh it afterwards. To see the new icon, delete the Weatherglass icon from the home screen and add `weatherglass.earth` again from Safari. **Export a backup first.** On iPhone, removing the home-screen app can also remove its stored journal, so re-import afterwards if the new icon opens empty.

If v5.6.0 (the Gallery rebuild) wasn't deployed yet, this release includes it. Uploading v5.6.1 ships both.

## v5.6.0

**The Gallery shows every photo, and the tiles load reliably.** There were two causes behind photos not showing up:
- **The Recent view stopped at 60 photos.** With 120+ in the journal, everything older than the newest 60 never appeared, and By Genus showed only 6 per type.
- **Every tile was the full-size photo,** about 100 KB of image data each, with up to 60 on the page at once. That's heavy enough on an iPhone that tiles could come up blank, especially in the installed home-screen app.

**Now it's a Photos-style grid:**
- A tight, square grid, 3 across on a phone (5 or 7 on wider screens), grouped under month headings that stay pinned while you scroll, e.g. *September 2026 · 64 photos*.
- **Every photo is included,** with no cap.
- Each tile has a small cloud-type label (Cb, Ci, Ac…). Untagged photos show a brass dot instead, and offline entries still waiting on conditions show ⏳.
- **Filter chips:** All · Untagged · one per cloud type you've logged, with counts. *Untagged* is a quick way to work through the classification backlog.
- Tapping a photo opens its entry, and swiping or prev/next moves through only the photos in the current filter, e.g. "3 of 50" in Untagged.
- **By Genus** keeps its life-list layout with the same thumbnails, and a **See all N →** button jumps to Recent filtered to that type.

**How the loading works:**
- **Thumbnails.** Each photo gets a small, center-cropped square JPEG copy (360 px, about 10–25 KB), made once in the background (one at a time to keep memory low) and saved on the device.
- **Separate storage.** Thumbnails live in a new IndexedDB store, `thumbs`, so they aren't part of entries or exports. Backups stay the same size, and after an import the thumbnails rebuild themselves as you scroll. A thumbnail is remade automatically if its entry's photo changes, and leftovers from deleted entries are cleaned up at startup.
- **Lazy loading.** A thumbnail loads just before its tile scrolls into view and is released once it's far off-screen, so memory stays flat however many photos there are. Tapping still opens the full photo.
- The database upgrades from version 1 to 2 on first launch. The change only adds a store, and nothing in your entries changes. The app now also releases its database connection if a newer version needs to upgrade, so future updates aren't blocked.

Tested in Chromium at iPhone size with 150 seeded photos:
- All 150 tiles appeared under 6 month headings. Thumbnails averaged 9 KB and were served as lightweight blob URLs.
- Only about 35 tiles were loaded at a time, and the first ones were released after scrolling to the bottom.
- The Untagged filter showed exactly 50, and opening a tile showed "1 of 50".
- By Genus showed 6 per type with "See all 25 →", which landed on the right filter. No errors.

Not yet tested on a real iPhone.

## v5.5.0

**Weatherglass is now an installable app that works offline.** This closes the biggest remaining gap in the README. Add it to your home screen (Safari → Share → Add to Home Screen; Chrome → Install) and it opens full-screen with its own icon, with or without a connection.

**Three new files sit next to `index.html`.** Browsers require these to be separate, so they're the one exception to the single-file rule. The app itself is still one file.
- **`sw.js`, the service worker.**
  - The app page is **network-first**, so every new deploy still arrives the normal way when you're online. If there's no signal, or the network takes longer than 4 seconds, the saved copy opens instead.
  - Libraries and fonts (Leaflet, Chart.js, the date adapter, exif-js, JSZip, Google Fonts) are **cache-first**, saved the first time the app loads online.
  - Map tiles you've already looked at are kept, up to 400, so a recently viewed map still draws offline. Nothing is pre-downloaded.
  - Weather, alert, place-name and tide requests are never cached. It holds no journal data.
- **`manifest.json`**: the name, colors and icons used for installation.
- **`icons/`**: the barometer-dial icon, redrawn crisply at 192, 512 (also used as the maskable icon) and 180 px.

**Quick Log and Quick Photo Log work with no signal.** Before, an offline quick log waited out every network call and then saved an almost empty entry. Now, with no connection, it skips the network entirely and saves what the phone knows: GPS, time, moon and photo. The entry is marked *conditions pending*. When you're back online, the app rebuilds the rest for that exact time and place:
- weather from Open-Meteo's hourly history (the nearest hour)
- UV and PM2.5
- place name, which also corrects the entry's title
- tides
- for entries from the last 5 days, the NWS alerts that were actually in effect at that moment, with the entry's Level updated to match

This runs on startup, when the connection returns, and whenever the app comes back to the foreground. A toast reports how many entries were filled. The entry's details show "Saved offline, filled in later from historical data", so reconstructed readings are never mistaken for live ones. Alerts that can't be recovered stay *unknown*, never a false "no alert". An entry that still can't be filled after 6 tries stops retrying.

**Weak signal no longer stalls a quick log.** The weather, air-quality and place-name requests now time out (8 s, 6 s and 6 s) instead of hanging.

**Storage protection:** the app now asks the browser to make its storage persistent, so the journal isn't cleared automatically. Installed home-screen apps are usually granted this without a prompt.

**⚠️ iPhone migration step.** An installed home-screen app has storage separate from Safari's, so it starts out empty. Export a backup from Safari, import every part into the installed app, and from then on log only from the installed app.

Tested in Chromium against a local server with mocked APIs:
- The service worker installed and pre-cached the core files, and the CDN libraries were cached on load.
- With the network switched off, a reload opened the app from cache with all libraries present.
- An offline Quick Log saved instantly as pending.
- On reconnecting, the entry filled itself in: weather from the right hour, UV, place name and title, and the in-effect alert. An expired alert was correctly excluded, and Level was re-derived.
- An online Quick Log was unaffected.

Not yet tested on a real iPhone or on Cloudflare. After deploying, check that `/sw.js` and `/manifest.json` load from the live site.

## v5.4.0

**Quick Log and Quick Photo Log now save UV Index and PM2.5.** An analysis of the full Nov 14 export found 91 entries since late September with no UV or PM2.5 at all. The cause turned out to be older than that: these two capture paths had never fetched air quality. Only the manual form's auto-fill did. Every quick-log value from earlier months came from running Settings → Backfill UV & PM2.5, and nothing logged after the last backfill had any. Air quality is now fetched in parallel with the weather call on every quick capture, and if it fails the save still goes ahead.

**Tides actually populate now.** None of the 155 Florida and Alabama coastal entries had tide data. Quick captures never looked tides up; only the manual form's "Fetch tides" button did, and only once a coastal site type was chosen. The lookup has been rewritten as one shared function used by Quick Log, Quick Photo Log, the manual button and the new backfill:
- **Right day, every time.** The old code built the date in UTC but read NOAA's times as station-local, so every evening after about 7 PM Central it asked for tomorrow. Predictions are now requested in GMT across a 72-hour window around the entry's time, so a previous and next high/low always exist. Before, there was nothing after the day's last tide or before its first.
- **40 km range.** Stations farther away than that are ignored, so inland entries stay empty rather than borrowing a station hundreds of miles off.
- **Station list cached** for the session instead of re-downloaded (about 3,000 stations) on every lookup.
- **Better water-level estimate:** cosine interpolation between the previous and next high/low follows the real tide curve more closely than a straight line.
- **Never holds up a save:** the tide wait on quick captures is capped at 8 seconds.
- **The manual button uses the entry's own time:** the original time when editing, the EXIF time for photo backfills, otherwise now.

**New: Settings → Backfill tides.** Fills in tide state, water level and next high/low for existing entries logged within 40 km of a NOAA tide station, using NOAA's predictions for each entry's exact time. It only fills empty fields and skips inland entries. Predictions are cached per station per day, so a week at the beach is a handful of requests, not one per entry.

**Also fixed in passing:** a manually entered tide height of 0.0 ft was being saved as empty, because `parseFloat(...) || null` treats zero as missing.

**After deploying:** run Settings → Backfill UV & PM2.5 (for the 91 entries) and then Settings → Backfill tides (for the Gulf Coast trips).

Tested in a headless browser against mocked Open-Meteo and NOAA responses: a coastal quick log got UV, PM2.5 and tides; an inland quick log got UV and PM2.5 and no tides, reusing the cached station list; and the backfill filled the coastal entries, skipped the inland one, and shared one prediction request between entries on the same day. Not yet tested against the live NOAA API, so the first real coastal entry is the final check.

## v5.3.0

**Gallery's photo redundancy removed.** It used to show your photos twice — once at the top (a flat, chronological grid) and again near the bottom (grouped by genus, as "My Cloud Atlas"), with the entire Cloud Atlas reference guide and Goethe's verses sandwiched between the two. Anyone scrolling straight through hit their own photos, then a wall of reference text, then their own photos again.

**Now it's one photo section, up top, with a toggle:**
- **Recent** — every photo you've taken, chronological, newest first, regardless of whether it's been classified. This was the actual gap in the old "Sky only" default — it filtered to classified photos even though you might want to see something you just took and haven't classified yet.
- **By Genus** — the classification collection (what "My Cloud Atlas" used to show separately), grouped by cloud genus, life-list style.

The Cloud Atlas reference (Howard's classification, Goethe's verses) and Sky Statistics are unchanged and still shown exactly once each, right after the photo section.

**Also fixed in passing:** the empty-state message for zero classified photos referenced a "Category" field that hasn't existed since v5.0.0 — leftover text nobody had reason to notice until this section got touched again. Verified with the same systematic check that caught the `filterCategory` crash a few versions back (zero dangling element references anywhere in the script) before shipping this.

## v5.2.0

**Journal's default view is now a calendar, not a flat list.** As the journal grew past a few hundred entries, scrolling to find one day stopped being the exception and became the norm — this replaces that with a month grid, color-coded per day:

- 🟢 **Green** — entries logged, no alert active
- 🟠 **Orange** — at least one entry under a non-severe active alert
- 🔴 **Red** — at least one entry under a Severe/Extreme alert (always wins if a day has both)
- **No color** — no entries that day
- **👁 eye icon** — layered on top of any color, independent of it, whenever a day has at least one entry manually marked Notable — so a calm, alert-free day you flagged as personally worth remembering still stands out, without fighting the alert-severity color scale for a slot

**Search is untouched** — type anything, and the calendar is replaced by the exact same flat list Journal has always used; clear the search box and the calendar comes back. No new interaction to learn for the workflow that already works.

**Tap a colored day → a simple list of just that day's entries → tap one to open it**, with swipe/arrow navigation now correctly scoped to *that day* rather than jumping into the whole journal — verified directly, including that navigating with the arrows preserves the day-scoping rather than silently resetting to the global list on the second tap (a real bug caught and fixed during the build, not just a passed-by-luck test).

**Built deliberately without touching the flat list's virtualization at all** — the day view is a plain, non-virtualized list, safe because a single day is always a small, bounded number of entries. Given that virtualization has been the single most fragile part of this app across two real bugs tonight already, this was worth the small extra restraint rather than routing the new feature through it.

## v5.1.0

**Speaker Mode overhaul — six changes, all from direct feedback after actually presenting with it:**

- **Removed the "Overall, so far" all-time tiles slide** — Speaker Mode now stays focused entirely on the chosen date range, not a mix of range-specific and lifetime stats.
- **"By the Numbers" now includes Humidity range**, completing the Temperature/Pressure/Humidity trio (TOT/POT/HOT) alongside the existing peak feels-like and alert-coverage stats.
- **Alert timeline rebuilt as an escalation narrative, not a flat list.** Consecutive entries sharing the same alert are the same ongoing event, not separate ones — now collapsed to just the moments the situation actually changed, with the timeline's left-border color shifting by severity (Extreme/Severe/Moderate) so the escalation is visible at a glance. Verified directly: 6 raw alert-active entries (with duplicates from rapid captures) correctly collapse to the 3 real state changes, in order.
- **Photo slides now show that entry's own weather data** — temperature, pressure, humidity, and active alert (if any) as a row of chips beneath the photo, not just the picture and a caption.
- **The route slide is a real map now**, using the same colored-polyline-and-markers visualization already built for the Map tab's Route mode — temperature-colored route line, tappable markers with popups, auto-fit bounds. Previously deferred as "would need its own Leaflet instance"; built this time. Gets its own map instance (separate from the Map tab's), properly torn down when navigating away or closing Speaker Mode, so it can't leak or conflict with a fresh one on the next view.
- **Rotation mid-presentation (landscape for data, portrait for photos) — confirmed unbroken**, and the route map specifically gets a resize nudge both when its slide is first shown and if you rotate while already looking at it, so the map doesn't end up measured wrong for whichever orientation you're actually in.

## v5.0.1 — CRITICAL HOTFIX

**v5.0.0 had a fatal, app-breaking bug — one line survived the Category removal that shouldn't have.** `document.getElementById("filterCategory").addEventListener(...)` was still wiring up the Category filter dropdown, which had already been removed from the HTML in the same version. Since that element no longer existed, `getElementById` returned `null`, and calling `.addEventListener` on `null` threw immediately — during the app's main synchronous startup sequence, before entries were loaded and before the Settings button's click handler got wired up. One uncaught error there was enough to silently halt everything after it.

**This explains all three reported symptoms as one single root cause, not three separate problems:** entries appeared "gone" because the app crashed before it could load and display them from storage (not because they were deleted — they were never touched), new captures appeared "not saved" for the same reason (rendering never happened, so nothing looked different, though the save itself may have partially completed), and Settings couldn't open because its click listener was registered after the crash point and never ran.

**Found by systematically cross-referencing every `getElementById()` call in the script against every actual `id` in the HTML** — the same category of bug (a leftover reference to a removed element) that caused the Journal-list scroll bug much earlier in this app's history, this time in a more severe form since it broke startup entirely instead of just one view. Confirmed this was the *only* dangling reference before shipping, not just the first one found.

`node --check`, used throughout this project to validate changes, only checks JavaScript *syntax* — it cannot catch a runtime error like this, where the code is syntactically valid but crashes the moment it actually executes against real DOM elements. Worth remembering as a real limitation of that check, not a guarantee of correctness.

## v5.0.0

**Category removed entirely, Level auto-derived, Titles enriched — the biggest data-model change this app has had.** Prompted by a real, honest observation: with quick capture as the dominant workflow, "Entry Type" and "Category" were quietly getting worse than useless — not just unfilled, but *actively wrong*, since both fields defaulted to fixed values regardless of real conditions and were never revisited afterward.

**The concrete finding that started this:** Quick Log and Quick Photo Log hardcoded `level: "Routine"` unconditionally — meaning even today's actual tornado warning photos got saved as "Routine," completely disconnected from the real `alertSeverity: "Extreme"` stored on those same entries. The Severe Events count and severe-search feature have likely been undercounting real severe entries this whole time.

**Level is now auto-derived from real alert data on every quick capture:** no active alert → Routine, an active non-severe alert → Notable, an active Severe/Extreme alert → Severe. Manual entry keeps full control over all three — this derivation only replaces what was previously guessing wrong every time, not deliberate human judgment (e.g. marking a beautiful but alert-free sky as Notable is still entirely your call).

**Category is gone as a concept, not just hidden.** There was no honest way to auto-derive Temperature vs. Wind vs. Sky vs. Storm from a quick capture — any guess would just be a different flavor of wrong. Removed from: the manual entry form, the Journal filter, the entry detail view, CSV export, and the cloud-classification fields (previously gated behind Category === "Sky," now always visible in the form). The "Top Category" Pattern Tile is gone. A completely dead, unreachable "Entries by Category" chart was found and removed in the process. Gallery's sky-photo view and Sky Statistics now key off `cloudGenus` instead — more accurate than the old category ever was, since it reflects entries you've actually classified rather than a coarse label.

**Quick capture titles now include location** when a real place name is available ("Quick log — Lockport, Illinois — Jul 27, 5:08 PM"), replacing the previous plain timestamp — a small, free improvement to scannability.

**Retroactive cleanup, not just a going-forward fix:** Settings → Data Cleanup → "Fix Severity & Clear Old Category Field" re-derives Level from each entry's own already-stored alert data and clears the legacy category field — scoped specifically to quick-capture entries (identified by title), leaving anything set manually completely untouched. Verified against a simulated dataset matching today's actual tornado warning before shipping: the real severe entry correctly flips to Severe, a genuinely calm entry stays Routine, a moderate-alert entry becomes Notable, and a manual entry's own choices are left exactly as set.

## v4.10.1

**Fixed a real gap in the guided cloud picker's logic**, found from an actual photo: standing directly under a shelf cloud during a severe storm, the cloud's texture genuinely reads as "flat, dark, layered" — the towering structure that would otherwise identify it as Cumulonimbus is invisible from directly beneath it. The picker would have walked that straight into Nimbostratus, incorrectly.

Fixed with the same question meteorologists actually use to resolve this exact ambiguity in the real world: **is there thunder, lightning, or clearly severe weather happening right now?** Nimbostratus produces steady, non-convective rain; Cumulonimbus produces real thunderstorms — silhouette alone can't always tell them apart, but that question always can. Verified the full tree still reaches all 10 genera with no dead ends, and confirmed the exact shelf-cloud scenario now resolves to Cumulonimbus while true steady-rain Nimbostratus still resolves correctly.

## v4.10.0

**AI cloud identification — the first real backend component Weatherglass has ever had.** Settings → Cloud Classification now has an optional "AI Worker URL" field; once connected, an **"✨ Ask AI to identify this cloud"** button appears in the classification queue, sending the photo to your own self-hosted Cloudflare Worker, which asks Claude (Haiku 4.5) to identify the genus and returns a suggestion with a confidence level and a one-sentence explanation — reviewed and accepted the same way as a guided-picker result, never auto-saved without a look.

**This is a deliberate architecture change, not a small feature.** Every other part of this app runs entirely in the browser, with no server and no ongoing cost. This required stepping outside that: a real Cloudflare Worker (deployed to your own account, not Anthropic's or Weatherglass's), holding your own Anthropic API key as a private server-side secret — the only way to use a real AI without exposing that key to anyone who opens dev tools on the live site. Full Worker source and step-by-step deployment instructions provided separately; nothing was built into the app that could function without you completing that setup yourself.

The guided dichotomous-key picker and manual dropdown both remain fully available — Ask AI is additive, not a replacement, and the button only appears at all once a Worker URL is configured.

## v4.9.0

**Classify Cloud Photos** — Settings → Cloud Classification. The guided picker designed weeks ago and never built, finally shipped, paired with the review workflow that actually makes it useful: scans for every entry with a photo but no cloud type set, and lets you page through them one at a time.

For each photo, a texture-first guided picker resolves most cloud types in 2 taps ("what's its texture — layered, clumped puffs, heaping towers, or wispy?" then one follow-up), rather than digging through a 10-option dropdown. Save & Next advances automatically; Skip moves on without saving; "I already know" swaps in the plain dropdown for anyone confident enough to skip the questions. Verified the decision tree reaches all 10 WMO genera with no typos or dead ends before shipping.

## v4.8.1

**Entry navigation buttons redesigned** — moved out of the cramped title row into their own centered block below the header, doubled in size (26px → 48px), recolored to burnt-orange to match the app's other action buttons, and labeled with "Swipe or tap to browse entries" underneath. The "N of M" position count stays between the two buttons.

## v4.8.0

**Swipe through entries in the detail view** — open any entry, swipe left for the next one, right for the previous, no need to close and reopen from the list each time. A small position indicator ("3 of 47") with ‹ › buttons appears too, both as a discoverable fallback for anyone who doesn't think to swipe and as a way to confirm where you are in the list.

Navigation follows whatever's currently filtered and sorted in Journal (respects your search, category filter, and sort order) — swiping moves through entries in the same order you'd see scrolling the list itself, not raw creation order. Stops at the first/last entry rather than wrapping around. Swipe detection requires the gesture to be clearly more horizontal than vertical, so it doesn't interfere with normal scrolling inside a longer entry.

One known limitation, not built out yet: opening an entry from inside a notebook's list still navigates through the *whole* Journal when you swipe, not just that notebook's entries.

## v4.7.0

**"Create Notebook from Date Range"** — Settings → Notebooks, right below View All Notebooks. Built for exactly the scenario that prompted it: a real storm gets logged in the moment, and only afterward does it become obvious it should've been a notebook. Name it, pick a start and end time, and every matching entry in that window gets grouped in one action — no need to have thought "start a notebook" before the event happened.

Entries already belonging to a *different* notebook are left alone, not reassigned — the tool reports how many were skipped for this reason so it's never a silent surprise. Verified the date-range matching handles timezones correctly (a local noon–9pm selection correctly captures entries stored in UTC) before shipping, since getting that wrong would have silently included or excluded the wrong entries.

## v4.6.0

**YOY, MOM, and DOD now have a "Relationship" view** — a **Compare / Relationship** toggle appears above the chart when any of the three are active. Compare is the existing behavior (temperature overlaid across years/months/days). Relationship is new: pick one specific period from a dropdown (a year, a month, or a day), and see that period's own Pressure-vs-Humidity-colored-by-Temperature scatter — the same relationship TPH already shows for your whole dataset, now scoped to just that one period, so you can ask things like "did the pressure/humidity/temperature relationship look different in July 2026 than July 2025."

**Built as a genuine extraction, not a duplicate:** the scatter logic itself was pulled out of TPH into one shared `renderRelationshipScatter()` function, which both TPH and the new per-period view call — TPH's behavior is completely unchanged, just now sourced from the same function this feature uses. Verified the period-filtering logic directly (correctly separating 2025 from 2026, and July from August) before shipping.

## v4.5.0

**Two new chart tiles: MOM (Month-over-Month) and DOD (Day-over-Day)**, built as genuine companions to the existing YOY — same overlay-and-compare idea, one and two granularities finer:

- **YOY**: years overlaid on a day-of-year axis
- **MOM**: individual months overlaid on a day-of-month axis (e.g. compare how April, May, and June each progressed)
- **DOD**: individual days overlaid on an hour-of-day axis (e.g. compare Tuesday's temperature curve against Wednesday's)

Both cap at the 6 most recent months/days to keep the overlay readable — same reasoning YOY already used for its 6-color palette. Verified the grouping logic directly (May/June/July entries correctly separated into distinct series; two same-day readings correctly averaged into one point) before shipping.

## v4.4.0

**Fixed for real this time: unequal gaps between Search → Category → Sort.** The screenshot made clear what the actual problem was — Category and Sort were stacking vertically (not side-by-side, which the previous fix incorrectly assumed), and the gap above Category didn't match the gap between Category and Sort, both governed by flex-wrap's automatic line-wrapping rather than anything explicit. Rebuilt with deterministic spacing instead of relying on wrap behavior: search has an explicit 14px margin below it, and Category/Sort sit in their own column with an explicit 14px gap between them — same visual arrangement already showing, just guaranteed equal now instead of left to browser wrapping math. Settings sits beside this column, sized and positioned as before.

**Under the hood:** this required retiring the `.table-toolbar` class (its `display:flex` was fighting the new deterministic layout) in favor of a lighter `.toolbar-field` class carrying just the visual styling (padding, border, font) — verified no other part of the app referenced the old class before removing it.

## v4.3.2

**Fixed: horizontal gap between Category and Sort read as much larger than the vertical gap above them**, even though both were numerically the same 14px in CSS. Likely cause: iOS Safari's native `<select>` rendering adds its own internal spacing around the dropdown arrow that sits on top of the CSS gap, so equal gap values didn't produce equal visual results between a horizontal (select-to-select) and vertical (row-to-row) gap. Reduced the horizontal gap specifically (14px → 4px) to compensate, without touching the vertical spacing.

## v4.3.1

**Reverted v4.3.0's two-row split** — back to v4.2.2's single-row toolbar (search, category, sort, and settings flowing together with natural wrapping, settings pushed right via `margin-left:auto`, 76px button / 48px icon).

## v4.3.0

**Journal toolbar split into two rows again**, rebuilt around the specific problems with the layout that got reverted: search sits alone on its own row (14px margin below), then Category and Sort keep their natural width on the row beneath it — not stretched to fill space this time — with Settings occupying whatever room is left to their right, truly centered (both directions) within that leftover space via `flex:1` + `justify-content:center` on its own wrapper, rather than pinned to the edge.

**Spacing is now provably equal everywhere**: search-row to picklist-row is 14px (explicit margin), and picklist to picklist to settings-wrapper is 14px (`column-gap`) — same number, not just visually close.

## v4.2.2

**Settings icon doubled in size** (24px → 48px icon, 44px → 76px button) and pushed to the right edge of its row via `margin-left:auto` — a lighter-touch way to move it right than v4.2.0's forced two-row layout, without reintroducing the rigid structure that got reverted.

**Toolbar spacing made explicitly equal** — `row-gap` and `column-gap` set to the same value (14px) individually rather than relying on the `gap` shorthand's implicit equality, so search-to-picklist and picklist-to-picklist spacing are guaranteed identical.

## v4.2.1

**Reverted v4.2.0's toolbar restructure** — back to the previous layout (search/category/sort/settings flowing together, wrapping naturally) at v4.1.5's sizing (44px button, 24px icon). The two-row forced-layout didn't work in practice.

## v4.2.0

**Journal toolbar restructured into two deliberate rows**, instead of relying on flex-wrap to arrange things based on available width (which is what put Category and Sort on separate lines in the first place). Search now sits alone, full-width, on its own row. Below it: Category and Sort share the row equally, with Settings fixed to the right of both — guaranteed by `flex-wrap:nowrap` rather than left to chance.

**Settings icon enlarged again** (44px → 52px button, 24px → 30px icon) per feedback that it should be a little bigger still.

## v4.1.5

**Fixed: settings icon wasn't centered in its button** — `justify-content:center` was missing (only vertical centering was set), so the icon drifted toward the top-left. Button is now a fixed 44×44 square with the icon properly centered both ways, plus a small "Settings" caption underneath, matching the label style already used under Quick Log/Quick Photo Log.

## v4.1.4

**Fixed for real this time: the settings icon wasn't changing color.** Root cause was different from what v4.1.3 assumed — this is a documented iOS Safari quirk where certain Unicode characters render as colorful emoji even *without* the emoji variation selector, silently ignoring CSS `color`. Relying on Unicode text-vs-emoji presentation rules wasn't reliable enough. Replaced the character entirely with a small inline SVG gear icon using `currentColor`, which respects CSS color unconditionally on every platform — no font or emoji-rendering ambiguity possible.

## v4.1.3

Journal settings icon enlarged (17px → 24px) and recolored to the same burnt-orange used elsewhere (Quick Photo Log, date/time header). Switched from the color emoji gear (⚙️) to the plain text glyph (⚙) — the emoji version ignores CSS color entirely, so that swap was required for the orange to actually apply. Already vertically centered against the category/sort dropdowns via the toolbar's existing flex alignment.

## v4.1.2

Bumped Insights and Latest Conditions text from 12px to 13.5px — a small readability increase, not a redesign.

## v4.1.1

**Fixed: Personal Records dates were getting cut off, hiding the year.** The title/date line under each record (Hottest logged, Coldest logged, etc.) was set to truncate with an ellipsis on a single line — fine for short text, but cut off anything longer, which included the year most of the time. Now wraps to as many lines as needed instead of truncating, so the full date is always visible.

## v4.1.0

**Map tab date navigation replaced — a real month calendar instead of a flat scrolling strip of every date.** With 300+ entries, scrolling through dozens of individual date chips to find one day stopped being practical. Now: a proper month grid, days with entries marked with a small dot, tap a day to filter the map to it (tap again to clear), prev/next arrows to move between months, and an **All** button to see everything at once. Navigation is bounded to the actual range of your data — you can't page into a month with nothing in it.

**Caught and fixed a real date-math bug while building this**, verified with a direct test before shipping: the month-boundary comparison (used to disable prev/next at the edges of your data range) compared a noon timestamp against a midnight one, so equal months didn't register as equal — the "next month" arrow would have stayed clickable one month past where your data actually ends. Fixed by normalizing both to the same time-of-day before comparing.

## v4.0.3

**Swapped YOY and WDR positions in Charts.** WDR now sits where YOY used to (start of row two); YOY moves to the very last position. With 11 buttons wrapping 5-per-row, YOY landing 11th means it naturally falls alone onto its own third row — giving it the standalone visual grouping that makes sense for a genuinely different kind of comparison chart, without needing any special-case layout code.

**Also fixed: WDR and HIOT were using the identical icon (✦)** — a collision from when WDR was added last version. WDR now uses a distinct symbol (✷).

## v4.0.2

**Fixed: Scatter view rendered completely blank.** Root cause found via direct verification: the date adapter added for scatter's time-based axis used `chartjs-adapter-date-fns.bundle.min.js` from cdnjs — but cdnjs doesn't host that "bundle" filename, only jsDelivr does. The script likely 404'd silently, leaving the scatter chart's time scale with no adapter to work with, so Chart.js failed to render anything rather than throwing a visible error. Switched to jsDelivr's actual bundle URL, which is the officially documented way to load this library.

**Fixed: Wind Rose became completely unreachable — a real regression from v4.0.1.** Making the Prevailing Wind snapshot tile stop hijacking the shared chart (previous release) accidentally removed the *only* path to the wind rose chart, since it never had its own button in Charts. Added a proper **WDR** button alongside TOT/POT/HOT/etc. — same permanent, discoverable home every other chart type already has.

## v4.0.1

**Removed the "Peak Feels Like" tile from Trends → Insights** — duplicated Personal Records' "Hottest logged." Insights now shows two cards (Temp/Humidity Correlation, Comfort Threshold), both confirmed genuinely unique — nothing else in the app computes either. A second overlap was found and flagged during the audit (Alert Coverage vs. Snapshots' Alert Summary) but kept as-is, deliberately.

**Fixed: the Daily Min/Max and Prevailing Wind snapshot tiles no longer hijack the shared chart.** Both used to force-switch whatever chart you were looking at the moment you tapped them — most noticeable with wind, since tapping the snapshot tile while comparing something else would silently replace it with the wind rose, no way back except manually reselecting. Both tiles now expand their own inline detail instead, matching how Alert Summary/Peak Log Time/Top Category already behaved. The full Daily and Wind Rose charts are still one tap away in Charts — this only stops the summary tiles from doing it *for* you unexpectedly.

**Cleaned up under the hood:** the peak-heat-index calculation (and its Worker-local helper, now unused) were removed entirely from `computeInsightsCore` rather than just hidden — confirmed nothing else in the app referenced it before removing.

## v4.0.0

**The home screen's tile grid is gone**, replaced by two quiet text lines above the tabs:

- **Insights** — *"303 observations · 66 this week · 265 this month · avg 82.4°F · 5 severe"*. Tapping the severe count jumps to Journal with "severe" pre-filled in search — a small addition to the search system itself (it now also scans `level`, so searching "severe" works anywhere, not just from this link).
- **Latest Conditions** — the single most recent entry, whatever it has: *"As of Jul 25, 5:12 PM — 82°F · 30.05 inHg · 58% humidity"*, temperature/pressure/humidity in that order. Shows the absolute latest capture even if some fields are missing (shown as "—"), never a different, more "complete" entry.

**Logging Streak is removed entirely** — not moved, not merged, gone. It's the one piece of this app that ever pushed toward "don't break the chain" thinking, which runs directly against PHILOSOPHY.md's own stated position that finishing an entry should feel like closing a notebook, not winning something. This wasn't a new decision — it's a tile that predated that principle finally catching up to it.

**Under the hood:** `computeOverviewCards()` (the shared function Speaker Mode's "Overall, so far" slide also uses) had the streak calculation removed entirely — so Speaker Mode's presentation tiles lose it too, automatically, no separate change needed there. Speaker Mode still renders the remaining stats as tiles, since a presentation slide is a different context than the everyday home screen the "feels like a game" feedback was actually about.

## v3.9.1

**New chart tile: TPH — Temperature, Pressure & Humidity compared.** The three-variable scatter from earlier chat analysis (pressure vs. humidity, colored by temperature) is now a real tile in Trends → Charts, tied into the app's actual filters and date range instead of a one-off export. Blue points are your coolest readings, red points are your hottest, scaled automatically to whatever range is in the currently selected time window — tap any point for the exact pressure/humidity/temperature values. Needs at least 3 entries with all three fields logged to render.

## v3.9.0

**Trend / Scatter toggle for TOT, POT, and HOT** — Temperature, Pressure, and Humidity Over Time now have a small toggle above the chart switching between the existing line-trend view and a new scatter plot. Scatter uses a real time-based x-axis (added the `chartjs-adapter-date-fns` library for this — same trusted-CDN pattern as every other library in the app), so points are spaced by actual elapsed time rather than evenly by index — a genuine tool for spotting clustering or gaps, not just a different line style. The toggle only appears for these three single-metric charts; it's hidden for multi-series or categorical charts (Daily Min/Avg/Max, Alert Severity, Wind Rose, etc.) where a scatter view wouldn't mean anything.

Built as one shared function (`renderSingleMetricChart`) instead of three near-identical copies — the old temp/pressure/humidity branches were byte-for-byte the same shape, just different field/color/label, so extending three separately would have meant tripling the same toggle logic. UV and PM2.5 charts weren't touched — same underlying shape, could get the same toggle later if wanted.

## v3.8.2

Added **2d** and **3d** chart range buttons in Trends → Charts, alongside the existing 1d/7d/30d/All. Slotted in numeric order between 1d and 7d. No changes needed to the underlying range-filtering or chart-label logic — both were already written generically for any day count, not hardcoded to the four original options.

## v3.8.1

**Record tab reorganized into three clear blocks**, separated by subtle dividers, before any further building on top of it:

1. **Quick capture** — the two buttons, shared help text, cooldown indicator (unchanged)
2. **Notebook** — the active banner, or a "Start a Notebook" button with new explanatory text ("groups your next several captures into one storm or sequence")
3. **Manual Entry** — now a distinct amber/brass-outlined button (was plain gray, easy to confuse with Start Notebook above it), with its own explanatory line

**Fixed along the way:** the notebook prompt's show/hide logic was setting `display:flex`, which was correct for the old single-button layout but wrong for the new button-plus-help-text stacked layout — would have rendered the button and its explanation side-by-side instead of stacked. Caught before shipping.

## v3.8.0

**Record tab revamped — the full entry form is no longer permanently visible.** Reflects an actual workflow pattern: quick capture now, detail added later (sometimes days later) via Edit. The Record tab now shows just the two capture buttons, the notebook banner, and a new **"+ Manual Entry"** button. Tapping it — or tapping Edit on any existing entry — opens the full form in a **dedicated overlay**, a deliberately distinct mode rather than an inline expansion. This directly addresses the same ambiguity that caused confusion with notebooks earlier (a rejected tap and a successful one looking nearly identical) — you're now unambiguously either in quick-capture mode or in the deliberate entry screen, never something in between.

**Two real bugs found and fixed while rebuilding this:**
- **Editing any entry via the manual form silently removed it from its notebook.** The save logic rebuilt a flat new object from the form fields — and since the form has no fields for `eventId`/`eventName`/`eventAnchor`, saving an edit just dropped them. Fixed: editing now preserves whatever notebook membership an entry already had.
- **The manual form never auto-joined an active notebook** — the gap identified a while back (only Quick Log and Quick Photo Log had this). Fixed as part of the same edit: a brand-new manual entry now joins the active notebook automatically, exactly like the other two capture paths.

Editing an existing entry works exactly as before — same form, same fields, same "Edit"/"Cancel — discard changes" flow — just opening in the overlay instead of inline on the Record tab.

## v3.7.1

**Fixed: heat index could compute below actual air temperature** — physically impossible, since heat index can never make something feel cooler than it really is. Found via a real CSV export analysis (6 instances, all just above 80°F where the heat index formula switches on). This is a known quirk of the standard NWS Rothfusz regression the app uses — it can slightly under-predict right at that threshold. Fixed by clamping the result to never go below actual air temperature. Fixed in both places the formula exists — the main `calcHeatIndex()` and the Insights Web Worker's self-contained copy — so they can't drift apart. The CSV export's heat index column recomputes live rather than storing a value, so it's automatically corrected too, no separate fix needed there.

**CSV export now includes Notebooks data** — `eventId`, `eventName`, and `eventAnchor` columns added, matching what's already been in the JSON export since v3.5.0. Speaker Kit's CSV picks this up automatically too, since it reuses the same export code.

## v3.7.0

**Standalone "Start a Notebook" on the Record tab** — no longer requires capturing an entry first. Tap it, name your notebook, and it's active immediately with zero entries; the very next Quick Log or Quick Photo Log becomes its first member. Starting a notebook from an existing entry's detail view still works exactly as before — this is an additional starting point, not a replacement. Buildable cleanly because of v3.6.0's reliability fix: notebook names live on every member entry now, not one required anchor, so there was never a real reason a notebook needed an entry to exist before it could start.

**Capture cooldown reduced from 60 to 30 seconds**, and made visible instead of easy to miss. A small live indicator now sits above the capture buttons — a red dot and "Cooling down (Ns)" while waiting, switching to green and "Ready to capture" the moment it's clear. Previously, a tap during cooldown showed a status message that vanished after 2.5 seconds with no other feedback, easy to miss entirely when your attention is on the sky, not the screen; now the button's readiness is visible before you tap, not just after.

## v3.6.0

**Notebook management** — Settings → **"View All Notebooks"** (next to Trip Summaries) now shows every notebook you've started, with three actions per notebook:

- **Rename** — updates the name across every entry in the notebook.
- **Present** — jumps straight into Speaker Mode with that notebook's entries, titled with the notebook's name.
- **Delete** — removes the grouping only. Entries themselves are completely untouched; they just stop being linked together. Requires a second tap to confirm.

**A reliability fix under the hood, not just a new feature:** notebook names used to live only on the "anchor" entry (the one you started the notebook from) — meaning deleting that specific entry would silently orphan the notebook's name, even though the other entries would still be grouped. Every entry that joins a notebook now carries the name itself, so the notebook survives losing any single entry, anchor included. This also made Rename straightforward to build correctly — it updates the name everywhere at once rather than one fragile source of truth.

**Where this lives, and why:** deliberately in Settings, generated on-demand when you tap it — the same pattern as Trip Summaries, not a new tab and not a permanently-live view. Notebooks are for deliberate, occasional moments, not daily use, and every rendering bug fixed today (the Journal list, the map) traced back to a *live-updating* surface having to stay in sync with changing state. A list that reads the data fresh each time you open it carries almost none of that risk.

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
