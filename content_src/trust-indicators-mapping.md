# Trust Indicators Mapping

*Canonical source. Standard: The Trust Project — Trust Indicators. Register:
`strategy/standards/STANDARDS_REGISTER_v2_2026-07-17.md` §3 item 1. Status: DRAFT — 1:1 mapping of
our existing ledger trust-statuses and AI-modeled-opinion labels onto the 8 Trust Project
indicators, plus the markup block spec the claim/article template implements. This is a mapping and
a spec, not new practice — we already do the substance described below.*

## Why this mapping exists

The Trust Project's 8 Trust Indicators are a widely recognized, machine-legible vocabulary for
signaling how a piece of published content earns trust. We already run the underlying practice —
explicit trust statuses, sourcing discipline, honest labeling of AI-modeled content — this document
maps that existing practice onto the Trust Project's named vocabulary so it's legible to readers,
platforms, and reviewers who already know the standard, and defines the markup block our claim and
article page templates should emit.

## 1:1 mapping

| Trust Indicator | What it asks for | Our existing mechanism |
|---|---|---|
| **Best Practices** | Who we are, our ethics and other standards, our funding | Our Methodology page, Corrections Policy page, and Funding & Governance Transparency page together — cross-linked from every claim/article page footer. |
| **Author/Reporter Expertise** | Who wrote this and what qualifies them | We publish under a single authorial identity, **The Unknown Soldier**, per our stated identity-firewall policy — this indicator is satisfied by pointing to the Funding & Governance Transparency page's "Identity-firewall scope and rationale" section rather than a named-individual bio, consistent with our institutional-addressees-only, pointer-never-author design. |
| **Type of Work** | Is this a factual report, analysis, opinion, or something else — clearly labeled | Maps directly onto our `trust_status` field (`VERIFY` / `VERIFIED` / `DISPUTED` / `UNVERIFIED-REMOVED`) plus our AI-modeled-opinion label — every claim states its type and status, never presented as more certain than its actual status. |
| **Citations and References** | Sources are named and linkable | Every claim ledger row carries a `source_res_id` pointer into our source registry, plus a `verification_path` describing how the source was checked. Both are shown on the rendered claim/article page. |
| **Methods** | How the reporting/verification was done | Our Methodology page ("How We Assess Confidence") documents the four-status verification discipline and the independent re-check requirement for `VERIFIED` status. |
| **Locally Sourced** | Was the reporting done with local knowledge/presence | Applies per-claim via `jurisdiction_sgc` (our StatsCan-joinable jurisdiction code) — the rendered page shows the jurisdiction a claim is scoped to, so a reader can see whether a claim is Toronto-specific, provincial, or federal. |
| **Diverse Voices** | Whose perspectives are represented | Tracked qualitatively today via our Indigenous/newcomer-community engagement workstream and CARE Principles review check; not yet a structured per-claim field — flagged honestly as a gap, not overclaimed. |
| **Actionable Feedback** | A real way for the public to respond/correct | Our Corrections Policy page's "How to request a correction" section, linked from every claim/article page footer. |

## Honest gaps

- **Diverse Voices** is the one indicator without a structured, per-claim mechanism today —
  addressed at the workstream level (Indigenous/newcomer engagement, CARE review), not yet
  surfaced as a per-page badge. Do not render a "Diverse Voices: yes" badge until a real per-claim
  signal exists.
- **Author/Reporter Expertise** is satisfied by policy (identity-firewall rationale), not by a
  named-individual credential — this is a deliberate design choice tied to the identity firewall,
  not a gap, but it should be presented as such rather than silently substituted for what a
  reader might expect (a named byline with credentials).

## Indicator markup block spec (for the claim/article page template)

Each rendered claim or article page should carry a single, consistently-placed metadata block
implementing the mapping above. Two layers:

**1. Human-visible block** (rendered HTML, near the top of the page, adjacent to the existing
`.meta` badge block already used by `tools/site_renderer.py`'s page shell):

```
Trust Indicators for this page:
  Best Practices        -> [link: Methodology] [link: Corrections Policy] [link: Funding & Governance]
  Author/Expertise      -> [link: Identity-firewall policy]
  Type of Work          -> <trust_status badge> (VERIFY | VERIFIED | DISPUTED | UNVERIFIED-REMOVED)
                            + AI-modeled-opinion label if applicable
  Citations/References  -> <source link(s), verification_path text>
  Methods               -> [link: Methodology - How We Assess Confidence]
  Locally Sourced       -> <jurisdiction_sgc, rendered as plain jurisdiction name>
  Diverse Voices        -> not yet structured (see Honest gaps above) — omit badge, do not fake it
  Actionable Feedback   -> [link: Corrections Policy - How to request a correction]
```

**2. Machine-readable layer:** the same fields SHOULD be emitted as part of the page's
schema.org JSON-LD block (see `strategy/standards/integrations/JSONLD_EMISSION_SPEC.md`) — the
Trust Indicator markup and the `ClaimReview`/`Dataset` JSON-LD are complementary, not duplicate,
emissions: schema.org describes the claim/dataset itself; the Trust Indicator block describes the
editorial trust signals around it (who, how, how to respond). Field-level mapping from ledger
columns to both layers is the renderer's job once built — see the engineering need below.

## Renderer note

This file is a canonical content source. `tools/site_renderer.py` does not yet emit the markup
block above on any generated page (backgrounder, brief, card, day-one, or render page) — see
`strategy/standards/integrations/SITE_ENG_NEEDS.md`. This spec is what that future template work
implements; it is not itself the implementation.
