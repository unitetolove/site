# Transparency Report — Template

*Canonical source. Standard: GRI-style transparency reporting (informal practice, not full GRI
Standards certification — see Honest note below). Register:
`strategy/standards/STANDARDS_REGISTER_v2_2026-07-17.md` §3 item 9. Status: DRAFT TEMPLATE — this
converts the existing 3-week/donor report cadence into a standing public template the fleet drafts
from metrics each cycle; the operator skims and ratifies, not drafts from scratch.*

## Honest note on what this is (and is not)

This is a **GRI-style** report — a discipline of regular, structured, comparable self-reporting
that the Global Reporting Initiative popularized — not a certified **GRI Standards** report. Full
GRI certification is corporate-ESG-scale and the wrong fit for an organization at our size; we
borrow the practice of structured, standardized, recurring public reporting without claiming the
certification. Any published instance of this template should say "transparency report" or
"GRI-style report," never "GRI-certified" or "GRI-compliant."

## Cadence

One report per reporting cycle, matching the existing 3-week operating cadence already in use
internally. Each report covers the period since the previous one, with no gaps — a missed cycle is
noted as missed, not silently skipped.

## Template structure

### 1. Period covered
`[start date] – [end date]`. Only the two ratified dates from this project's fixed calendar
(2026-08-21 / 2026-10-26) or the actual report-generation date may appear here — no invented dates.

### 2. Activity summary
- Backgrounders/briefs/cards published or updated this period (count, pulled from
  `research/backgrounders/`, `research/briefs/`, `research/cards/` directory state — not
  hand-counted).
- Claims added to the ledger this period, by `trust_status` (count of new `VERIFY`, promotions to
  `VERIFIED`, any `DISPUTED`/`UNVERIFIED-REMOVED` demotions) — pulled from
  `research/ledger/claims.csv`.
- Corrections issued this period (count and one-line description each) — pulled from the
  correction mechanism described in the Corrections Policy page, never hand-recalled.

### 3. Spend summary
- Total spend this period, by the fixed purpose-category enum (research-infra / movement-content /
  fleet-compute / engineering / reserve / TPA-if-ever) — pulled directly from WP-G22's
  `finance/LEDGER.csv`, aggregated to category level. Never a hand-typed total.
- Running total since the funding period began, same category breakdown.

### 4. Metrics
`[DATA SLOT: whatever the fleet's standing metrics template already tracks per cycle — reuse that
template's fields here rather than inventing a parallel metrics vocabulary]`.

### 5. What did not go as planned
A short, honest section naming anything that slipped, was deferred, or did not work — a
transparency report that only ever reports success is not a transparency report. If nothing
material happened this period, say so plainly rather than padding the section.

### 6. Corrections issued this period
Cross-reference to the Corrections Policy mechanism — list each correction made in this period by
claim ID and one-line description of what changed and why. If none, state that plainly.

### 7. Next period's plan
One short paragraph, drafted by the fleet from the current state file's next-actions list, not
invented fresh for the report.

## Production discipline

The fleet drafts each cycle's report directly from the metrics/ledger/finance sources named above
— never from memory or narrative reconstruction. The operator's role is to skim and ratify, the
same "Op(rare)" maintenance tier the standards register assigns this item: the reporting habit
already exists; this template only standardizes its shape and publication cadence. A report that
requires the operator to manually assemble figures has failed this template's purpose.

## Renderer note

This file is a canonical content source and template. `tools/site_renderer.py` has no mechanism
yet to instantiate this template from live metrics/ledger/finance data or to publish successive
dated report instances — see `strategy/standards/integrations/SITE_ENG_NEEDS.md`.
