# AI-Disclosure Label — Pinned Wording

*Canonical source. Standard: EU AI Act (Regulation (EU) 2024/1689) Article 50 transparency
obligations, adopted voluntarily. Register:
`strategy/standards/STANDARDS_REGISTER_v2_2026-07-17.md` §3 item 12; drift management per §5
("EU AI Act Art. 50" — pin label wording to the Article text itself, ignore the draft Code of
Practice until final). Status: PINNED — this wording is fixed until Article 50's text materially
changes; do not silently reword this label in individual pages.*

## Why we adopt Article 50 voluntarily

Article 50 is not legally binding on us — we have no EU establishment and do not target the EU
market. We adopt its disclosure bar anyway because it is the strictest publicly-codified
AI-transparency standard currently in force anywhere, and pre-committing to it pre-empts the
"gotcha" of being measured against the world's toughest AI-disclosure law and found short. This is
the same logic as adopting Ontario's stricter accessibility floor ahead of a strict legal trigger:
adopt the higher bar voluntarily rather than wait to be forced to it.

## What Article 50 requires (summary, not legal advice)

Article 50 requires clear, timely disclosure — no later than the time of first interaction or
exposure — when content is AI-generated or AI-manipulated, and when a user is interacting with an
AI system, using machine-readable marking where feasible. This page is not a legal compliance
document; it states the disclosure bar we hold ourselves to, pinned to the Article's actual text,
not to a draft or informal summary of it.

## Pinned label wording

Use these labels verbatim. Do not paraphrase per-page — the whole point of a pinned label is that
it reads identically everywhere it appears, so a reader who learns what one label means can trust
every instance of it.

### AI-modeled opinion / synthesis label

> **AI-modeled content.** This section presents a model's synthesis, prediction, or simulated
> perspective — not a sourced, independently verifiable fact. It is not a `VERIFIED` claim in our
> ledger.

Used wherever content represents a model's generated analysis, projection, or simulated stance,
distinct from claim-ledger-sourced fact.

### AI-drafted, human-reviewed content label

> **AI-drafted, human-reviewed.** This content was drafted by an AI system and reviewed under our
> standard publication process before release.

Used on backgrounders, briefs, cards, and similar documents produced through the fleet's drafting
pipeline — the honest middle case between "pure AI output" and "no AI involvement," disclosed
rather than blended invisibly into ordinary authored prose.

### Machine-translation draft banner (already in production use)

> **MACHINE DRAFT** — requires human/Sonnet review. Do not publish.

This banner already exists verbatim in `tools/site_renderer.py`'s `render_translation_draft_page()`
(the `MACHINE_DRAFT_BANNER` constant) and is preserved here as the pinned wording for that specific
case — cited, not duplicated with drift risk. Any future change to this exact string must be made
in one place (the renderer's constant) and reflected here, never the reverse.

## Placement rule (Article 50 "no later than first interaction")

The applicable label must appear **before or at the point a reader first encounters the AI-involved
content** — never below the fold, never only in a footer, never only in page metadata invisible to
a human reader. This matches Article 50's own timing requirement and our own pre-existing rule that
simulated/AI-modeled opinion is always labeled.

## Machine-readable layer

The same disclosure should also be emitted as structured metadata (not just visible text) so
automated tools can detect AI involvement without parsing prose — see
`strategy/standards/integrations/JSONLD_EMISSION_SPEC.md` for how this maps into the page's
schema.org JSON-LD block (a `CreativeWork` property indicating AI involvement, aligned to whatever
schema.org's current AI-disclosure vocabulary supports at implementation time — flagged as an
implementation detail for the renderer work, not resolved here).

## Drift management

Per the standards register's drift-taxing note (§5): this wording is pinned to Article 50's actual
legal text, not to the EU's draft Code of Practice on AI-generated content labelling, which is still
in draft as of this writing. Re-pin this page only when the Code of Practice is finalized or
Article 50 itself is amended — do not chase draft guidance.

## Renderer note

This file is a canonical content source. The AI-disclosure label component described above exists
in one specific case today (`render_translation_draft_page()`'s MACHINE DRAFT banner); the other
two labels (AI-modeled content, AI-drafted/human-reviewed) are not yet implemented as a reusable
template component elsewhere in `tools/site_renderer.py` — see
`strategy/standards/integrations/SITE_ENG_NEEDS.md`.
