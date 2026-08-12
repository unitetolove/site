# Funding & Governance Transparency

*Canonical source. Standards: cross-cutting funding-transparency norm (IFCN Principle 3, JTI,
Trust Project "Best Practices"). Register: `strategy/standards/STANDARDS_REGISTER_v2_2026-07-17.md`
§3 item 4. Status: SKELETON — this page defines the disclosure structure and pulls live numbers
from WP-G22's provenance ledger; it does not itself hold hand-maintained figures. Do not fill in
placeholder values by hand — see the data-slot notes below.*

## Why this page exists

The most predictable attack on a pseudonymously-authored research library is "who funds and
controls the anonymous account." We answer that question at the entity level, honestly, without
unmasking individual pseudonymous contributors — because funding and governance transparency is
about who is accountable, not about which specific person typed which sentence.

## Entity-level disclosure

*Data slots below pull from WP-G22's dollar-provenance ledger (`finance/LEDGER_SCHEMA.md` +
`finance/LEDGER.csv` once populated) and `finance/ACCOUNT_MAP.md`. Every figure on this page must
trace to a ledger row — this page is a template with pointers, never a hand-typed number.*

### Who runs this

- **Authorial identity:** publications are issued under a single pseudonymous authorial identity,
  **The Unknown Soldier**. This is a stated editorial policy (see "Identity firewall" below), not
  concealment of funding or control.
- **Organizational form:** `[DATA SLOT: current legal form — e.g., "unincorporated, operator-held
  pending ONCA incorporation" — pull from finance/ONCA_TRIGGER.md's current-status field, never
  hand-typed]`.
- **Governance:** `[DATA SLOT: decision-making structure — pull from the ratified decisions log
  (state/DECISIONS.md) for the standing operating contract, and from finance/ACCOUNT_MAP.md for
  who holds signing/spending authority]`.

### Funding sources

- **Current funding:** `[DATA SLOT: funding source category and amount range — pull from
  finance/LEDGER.csv, aggregated to category level per the segregation doctrine's fixed purpose
  enum (research-infra / movement-content / fleet-compute / engineering / reserve /
  TPA-if-ever), never a raw bank record]`.
- **Funding posture:** `[DATA SLOT: pull the current burn-rate/glide-path status line from
  finance/BURN_RATE_GLIDE_PATH.md — e.g., one-time vs. ongoing, current phase]`.
- **What we do not accept:** `[DATA SLOT: pull any standing exclusion rule from the segregation
  doctrine, e.g., no funds commingled with any future third-party-advertiser (TPA) election
  spending — see finance/SEGREGATION_DOCTRINE.md]`.

### Spend categories

`[DATA SLOT: render the fixed purpose-category enum from finance/LEDGER_SCHEMA.md as a table —
category name, plain-language description, running total — generated from finance/LEDGER.csv at
build time, not maintained as prose here]`.

### Conflicts of interest

`[DATA SLOT: pull from finance/ACCOUNT_MAP.md / SEGREGATION_DOCTRINE.md any declared
conflict-of-interest policy or disclosure; if none has been formally logged yet, this section must
say so honestly rather than being left blank or silently omitted]`.

## Identity-firewall scope and rationale — why the author is anonymous until reveal

We are explicit about what the identity firewall protects and what it does not, so this reads as a
stated policy rather than evasion:

- **What is firewalled:** the operator's real, legal name; any personally identifying detail that
  would connect the authorial identity to a specific individual; retired brand names associated
  with earlier, unrelated work. These never appear in any published file, commit, or public-facing
  material.
- **What is not firewalled:** the existence of funding, its approximate scale and category
  breakdown, the organizational form, the governance/decision structure, and the editorial
  standards this outlet holds itself to (this page, the Methodology page, and the Corrections
  Policy page together are the transparency layer). Entity-level accountability does not require
  person-level unmasking.
- **Why anonymity now, not concealment forever:** the stated plan is a "reveal" at a defined future
  point, not permanent anonymity. Pre-reveal, the firewall exists because (a) research is
  positioned as neutral civic infrastructure that should be judged on its sourcing and verification
  discipline rather than on the identity of whoever is behind it, and (b) premature disclosure of
  the operator's identity before the work has an independent track record would invite exactly the
  ad hominem dismissal a claim-ledger-based library is built to resist. This is a sequencing choice
  about *when* accountability attaches to a named individual, not a refusal of accountability
  itself — the entity-level disclosures above are accountability that exists today, independent of
  the reveal timeline.
- **What changes at reveal:** the authorial identity becomes attributable to a named individual;
  the entity-level disclosures on this page do not change in kind, only in whether a name is
  attached to them.

## Honest gap

No dollar figure, funding-source name, or spend total should ever be typed directly into this page.
Every number here is a rendering of WP-G22's ledger, not an independent claim — if the ledger is not
yet populated for a given data slot, this page must show that slot as "not yet populated" rather
than a placeholder value that could be mistaken for a real figure.

## Renderer note

This file is a canonical content source, not a generated leaf page. `tools/site_renderer.py`
currently has no mechanism to (a) render standalone static pages, or (b) pull structured data from
`finance/LEDGER.csv` into a page template — see `strategy/standards/integrations/SITE_ENG_NEEDS.md`
for both engineering needs. Until that pipeline exists, this page must not be published with
manually-typed figures standing in for the data-slot mechanism described above.
