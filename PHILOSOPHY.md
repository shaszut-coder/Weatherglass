# Weatherglass Philosophy & Direction

**Status:** Living document, edited down from a much longer draft manuscript. This is the working resource — the single place that says what's actually decided, what's deliberately shelved, and what's still genuinely open. Anything not written here shouldn't be assumed settled just because it appeared somewhere in an earlier draft.

## Why this exists

Weatherglass didn't start from a business plan or a product gap. It started from someone whose life genuinely revolves around weather — capturing the feeling of a moment while traveling, not just the temperature. That's the actual origin, and it's a better answer than anything more polished, because everything else in this document is downstream of it.

It answers a different question than a forecast app does. Not "what will happen" but **what actually happened, and what was it like to be there for it.** A forecast expires the moment it's confirmed or wrong. An observation, once recorded, only becomes more valuable with time.

The closest real lineage isn't other weather apps — it's the tradition of patient, personal natural observation: John Muir's attention to wild places for its own sake, Alexander von Humboldt's decades of obsessively recording natural phenomena before "citizen science" had a name, the general instinct behind conservation-minded naturalists like Roosevelt. That's a sharper heritage than "front porch weather watching," and it's a real one, not a decorative one.

## Who it's for

Not meteorologists — **weather observers.** People who notice a shelf cloud looked incredible or that the pressure dropped fast enough to feel it, rather than checking tomorrow's forecast. Storm and pressure-change enthusiasts, cloud watchers, photographers who need to remember why a sky looked the way it did, travelers whose memories come with weather attached, outdoor people for whom weather shaped the day, people who just like collecting their own long-term data. What they share isn't expertise — it's curiosity and the habit of noticing.

## What actually matters in each entry

An entry is worth more than a number. A photo, a note, the cloud type, the location, and what it actually felt like are what turn "82°F, 60% humidity" into something recognizable years later. Context is part of the data, not an optional extra.

## Design principles

- **Observation before interaction.** Recording something should take as little attention as possible, so a person stays looking at the sky instead of the screen.
- **The tool stays out of the way.** Automation collects whatever context it reasonably can; a person only contributes what actually gives the moment meaning.
- **Every entry should be able to explain why it mattered**, not just what the reading was.
- **Personal history compounds.** A forecast is available to everyone and expires immediately. Years of your own observations are unique to you.
- **No expertise required.** Curiosity is the only prerequisite.
- **Time is a feature.** Long-term patterns should emerge from having enough entries, not from a dashboard forcing insight before there's anything to find.
- **Design like it'll still be running in ten years**, with tens of thousands of entries.

## The practical test

Before adding anything: does it help someone **observe** something they'd have otherwise missed, **preserve** more of the real moment, or **discover** a pattern or memory later they wouldn't have found on their own? If not, reconsider it regardless of how technically interesting it is. This single test replaces every longer checklist that's been drafted — they were all restating it.

## Engineering principles — the filter for every technical decision

This section governs Chapters 8 and 9's proposals below, not the other way around:

- Engineer for decades of use, not for the next release.
- Trust is a feature — reliability and data integrity are part of the actual user experience, not background concerns.
- The observer owns their data — export, portability, and open formats come before anything else.
- Offline first. Observation should never depend on connectivity.
- **Architecture should support the philosophy, not define it.** Technology choices are justified by what they let someone observe and preserve, not by their own sophistication.
- Reliability before novelty.

## Settled decisions

These have been decided, specifically to stop them from quietly drifting in future drafts or conversations — this list exists because that drift already happened more than once:

- The home screen keeps the five-tab structure — a minimal single-card redesign was proposed and explicitly rejected. The stats above it don't render as tiles anymore, though (v4.0.0/4.0.1) — two quiet text lines instead: **Insights** (total observations, this week, this month, avg temp, severe count — the last one tappable, jumps to Journal pre-filtered) and **Latest Conditions** (the single most recent entry's temp/pressure/humidity, whatever it has, never a different "more complete" entry). **Logging Streak was removed entirely**, not relocated — a direct application of "the tool should disappear" and "finishing an entry should feel like closing a notebook, not winning something." This is also the precedent for how future tile/section overlap should be handled: when Trends' Insights section turned out to duplicate Personal Records and Snapshots in two places, the duplicate ("Peak Feels Like") came out; a second overlap (Alert Coverage vs. Alert Summary) was found during the same audit and *kept* deliberately rather than removed automatically — overlap gets a real decision each time, not a reflex removal.
- **Record tab is capture-first, not form-first.** The full entry form used to sit permanently visible below the capture buttons; it's now collapsed behind a "+ Manual Entry" button that opens a dedicated overlay — a deliberately distinct mode, not an inline expansion, specifically because an inline "did that just happen or not" ambiguity was what caused real confusion with an early Notebooks capture session. Editing an existing entry opens the same overlay, pre-filled — one form, two entry points.
- **Capture cooldown is 30 seconds, not 60, and it's visible, not just enforced.** A live red/green dot above the capture buttons shows readiness before you tap, not just after — replacing a status message that used to vanish in 2.5 seconds with no other feedback.
- **Notebooks** — linking several entries into one ongoing moment (a storm as it rolls through) shipped as a real feature. Two design choices worth preserving: (1) the notebook's name lives on *every* member entry, not one required "anchor" — the first version tied the name to a single entry and that was a real fragility, fixed before Rename/Delete were built on top of it; (2) "which notebook is active" lives in localStorage as ephemeral app state, same category as the export-nudge timestamp, not in IndexedDB — losing it only stops new captures from auto-joining, entries already linked stay linked. All three capture paths (Quick Log, Quick Photo Log, and the manual form) auto-join an active notebook identically — the manual form was a real gap here for a while (editing an entry could silently strip its notebook membership) and got fixed alongside the Record tab overlay work. The notebook list itself lives in Settings, generated on demand — same "not a live-synced view" reasoning as Trip Summaries, deliberately, given how many of tonight's actual bugs traced back to live-updating surfaces having to stay in sync with changing state.
- No forecasting. Not a feature, not "forecast context" quietly auto-filled into an entry.
- Single device, browser-based, no account system — for now. iPhone Safari specifically.
- Cloud sync is a real *possible* future direction, not active work. If it's ever built, the smallest real step (a single Cloudflare Worker + KV for push notifications) comes before anything resembling Chapter 8's full architecture.
- Cloud classification: a guided, non-AI picker first. AI-based photo classification is a later possibility, not now — mainly because it would require a client-exposed API key, which breaks the app's free/keyless pattern.
- Derived comfort metrics (dew point, VPD, wet bulb, wind chill, apparent temperature, humidex) are stored as six separate fields, redundancy accepted, rather than unified into one "feels like" value.
- Impression stays single-select, using its existing option set, just presented as tap chips. A separate new multi-select field handles sensory/situational tags (Hot, Breezy, Hazy, Storm approaching, etc.). Notes stays free text alongside both.
- GPS high-accuracy mode is opt-in for specific flows, not always-on — a deliberate battery/speed tradeoff, not an oversight.
- Sun position/golden hour data is a per-entry field, computed the same way moon phase already is — not a separate live planning widget.

## Explicitly shelved, not now

Distinct from "rejected" — these are real ideas that don't match where the project actually is today:

- **The full cloud backend** — D1, R2, Workers-based sync, conflict resolution, event sourcing, immutable revision history, a microservices-style split into separate Observation/Discovery/Media/Sync/AI services. This describes operating a different, larger product. Worth revisiting only if cloud sync itself is ever actually greenlit, and even then, scaled down substantially from how it's currently drafted.
- **Full operational engineering** — CI/CD pipelines, authentication/authorization, monitoring, disaster recovery, formal conflict resolution. These solve problems a single-user local app doesn't have yet.
- **A formal Engineering Reference appendix** (domain model, ERD, Cloudflare architecture diagrams, sync workflow, security model) — this is the above infrastructure re-described as diagrams. Shelved for the same reason; drafting the diagrams doesn't make the infrastructure decision any more settled.
- **A UI/UX wireframe appendix**, if and when it's written, must start from the settled decisions above (tiles stay, five tabs stay) — not from the minimal single-card mockup that was already proposed and rejected once.

## Open questions — genuinely undecided, not resolved by being written down elsewhere

- **Multi-user / shared journals** ("Family Journals," "Building a Community," "Families, Friends, and Generations" — the same idea has resurfaced under three names). This is a different product shape, not a feature — it requires accounts and sharing infrastructure. Worth a real, deliberate decision when it comes up, not something that should accumulate momentum just from being mentioned repeatedly across drafts.
- **The epilogue's tone and placement.** Mortality/witnessing framing ("The Last Observation") is a legitimate idea but a heavy one for something sitting in a GitHub repo next to a changelog. Undecided whether it belongs in the repo at all, versus staying a personal reflection kept elsewhere.
- **Whether to draft a real Author's Note.** The actual material now exists — travel, the real personal motivation, the Muir/Humboldt/Roosevelt influences — in the user's own words, from direct conversation. Not yet written up. Should only be written from those actual words, not invented or generalized.
- **The cloud picker — designed in real detail, not yet built.** A texture-first dichotomous key (2-3 taps: layered/flat vs. clumped-puffs vs. heaping-towers vs. wispy, then a narrowing second question) replacing the current three raw Genus/Species/Varieties dropdowns. Agreed to live inside the shared entry form (the Manual Entry/Edit overlay), as the default path, with the raw dropdowns still available for "I already know exactly what this is." Pairs with extending the existing `renderMyCloudAtlas()` (which already groups logged entries by genus with photos) to also show genera *not yet spotted* — turning it into an actual life list rather than just a browsable collection. Worth building this before adding more data fields to the capture flow, given how directly it serves the stated real goal (learning to recognize cloud types, collecting the full set) versus how indirectly most other roadmap items do.

## A tension that's real, partially addressed

Recent development added more structured data per entry (six comfort metrics, confidence tiers, weather deltas, sensory tags — all decided, none built yet) in service of richer long-term discovery, which pulls against "the tool stays out of the way." The Record tab overlay rework addresses the *structural* half of this — quick capture stays exactly as fast as it was, and all the detail-heavy fields live behind a deliberate "+ Manual Entry" tap instead of sitting permanently in view. What it doesn't resolve is the deeper version of the tension: once those richer fields actually get built and someone *does* open the detailed form, filling in six comfort metrics and confidence tiers and sensory tags is still real friction at that moment, just friction that's now opt-in rather than constant. Not fully resolved — meaningfully smaller than it was.

## What's deliberately left out of this document

The original draft manuscript included a full "book" structure — ten chapters, part introductions, an epilogue, multiple appendices, 150–250 pages, diagrams. That scale doesn't match what this actually is: documentation for a single-file app maintained by one person. This document keeps the ideas that survived scrutiny and drops the ceremony. If something from an earlier chapter isn't referenced here, it was either redundant with something above, or it didn't hold up against the app as it actually exists.
