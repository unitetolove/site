# Corrections Policy

*Canonical source. Standards: SPJ/CAJ corrections norm, IFCN Principle 5 (open & honest corrections),
Trust Project "Best Practices" indicator. Register: `strategy/standards/STANDARDS_REGISTER_v2_2026-07-17.md`
§3 item 3. Status: DRAFT — describes the mechanism as it actually runs today; update only by editing
this file (not a generated leaf page — see the renderer note at the bottom).*

## Our commitment

Every claim in our ledger carries an explicit trust status, and every trust status can move —
including downward. When a fact we published turns out to be wrong, imprecise, or no longer
supportable by its original source, we correct it, we say so, and we do not quietly delete the
record of having been wrong.

We do not treat a downgrade as an embarrassment to hide. A claim moving from `VERIFIED` to
`DISPUTED` or `UNVERIFIED-REMOVED` is the system working as designed — the same evidentiary
discipline that earns a claim its `VERIFIED` status is what catches and demotes it when new
evidence contradicts it.

## How a correction actually works, mechanically

This section describes the real mechanism, not an idealized one, so a reader can verify it against
our claim ledger directly.

1. **Every claim is a row, not a sentence buried in prose.** Each fact we publish traces to a row
   in our claim ledger (`CL-####`), carrying a `trust_status`, a `verified_date`, a
   `verification_path` (how it was checked), and a source pointer. Nothing is cited in a
   backgrounder or brief except through a ledger row.
2. **Rows are never deleted.** When re-verification finds a problem, the row's `trust_status` is
   downgraded in place — `VERIFIED` can move to `DISPUTED` (actively contradicted by
   re-verification) or `UNVERIFIED-REMOVED` (the source could no longer be relocated or confirmed
   after real effort). The original row stays, with a dated correction note appended to its record
   explaining what changed and why. A reader can always see both the current status and the history
   of how it got there.
3. **Corrections propagate, not just the source row.** A correction to one fact is not considered
   complete when the ledger row is fixed. We check every derived document — backgrounders, briefs,
   cards, day-one papers, translations — for the same stale fact repeated in its own words, and fix
   every instance we find. This is a corpus-wide check, verified directly against the files, not
   trusted to memory.
4. **An automated gate blocks publication of new attrition.** Our site build includes a
   hedge-preservation check that specifically looks for a figure or claim losing its uncertainty
   qualifier (a "roughly" or "as of [date]" dropped) between a backgrounder and a document derived
   from it. A high-confidence finding stops the build until it's resolved — a dropped hedge is
   exactly the kind of silent, corpus-wide honesty failure a corrections policy exists to prevent
   before it ships, not just to fix after.
5. **Nothing publishes with an unresolved identity or leak-firewall finding.** Every document is
   scanned before publication; anything flagged is held back rather than shipped and corrected
   later.

## What counts as a correction

- A factual error in the original claim (wrong figure, misattributed source, misdated event).
- A source that can no longer be confirmed or located after a real re-verification effort.
- A source that, on re-reading, does not actually support the claim as stated.
- A material update to source data that changes a claim's accuracy (e.g., a revised government
  figure).

Style/wording fixes that do not change a claim's factual content are not corrections in this sense
and are not tracked with the same discipline — only changes to what a claim asserts trigger the
correction mechanism above.

## What we do not yet do

Honestly, not aspirationally: there is currently no single public-facing "corrections log" page
listing every correction chronologically. The mechanism above is real and runs today at the
ledger level; a consolidated public corrections feed is a publishing-layer feature, not yet built.
Until it exists, the record of any correction is visible in the affected claim's own row (dated
note, status history) rather than in one central list. This gap is tracked as an engineering need
(see `strategy/standards/integrations/SITE_ENG_NEEDS.md`).

## How to request a correction

If you believe a claim we've published is inaccurate, tell us what claim, what you believe is
wrong, and what source supports the correction. We check every request against the original
source and any new evidence, using the same verification discipline described above — we do not
accept or reject a correction on say-so in either direction, ours or a challenger's.

## Renderer note

This file is a canonical content source, not a generated leaf page. `tools/site_renderer.py`
currently has no mechanism to render standalone static pages like this one from `site/content_src/`
— see `strategy/standards/integrations/SITE_ENG_NEEDS.md` for the engineering need this creates.
Every claim-page footer should link to the rendered version of this page once that mechanism
exists.
