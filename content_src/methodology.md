# Methodology — How We Assess Confidence

*Canonical source. Standards: TI methodology practice, FAIR Principles, OECD AI Principles,
IPC Privacy by Design (7 principles), Montréal Declaration for Responsible AI, UNDRIP Art. 31/FPIC,
5-Star Open Data. Register: `strategy/standards/STANDARDS_REGISTER_v2_2026-07-17.md` §3 items
6, 7, 8, and §7 (5-Star). Status: DRAFT — every section below states current, real practice; nothing
here is aspirational language dressed as a compliance claim.*

## 1. How we assess confidence

Every fact we publish carries an explicit trust status, not an implied one. We use four:

- **`VERIFY`** — provisional. A source has been read and a claim recorded, but it has not yet been
  through our independent re-check discipline. This is the honest default for freshly mined
  material — we do not round a provisional finding up to sound more certain than it is.
- **`VERIFIED`** — confirmed. An independent check (not the same person or process that first
  recorded the claim) has re-examined the source and confirmed the claim holds.
- **`DISPUTED`** — actively contradicted. Re-verification found the cited source does not actually
  support the claim as originally recorded. The row is kept, not deleted, with the contradiction
  documented.
- **`UNVERIFIED-REMOVED`** — retracted. The source could not be relocated or confirmed after a real
  effort. The row is preserved as a record that the claim was made and later could not stand, not
  erased from history.

Each claim also records a `verification_path` — the actual method used (e.g., "primary URL fetched
and read directly," "Wayback-archived snapshot fetched and read," "confirmed via direct primary
source retrieval"), so a reader can see not just *that* something was checked but *how*.

**What we do not do:** present a `VERIFY`-status claim as if it were `VERIFIED`; cite a claim in a
backgrounder or brief without a ledger row behind it; delete a claim row when it turns out to be
wrong (see our [Corrections Policy](corrections-policy.md) for the full mechanism).

## 2. AI-modeled opinion — always labeled

Any content that represents a model's synthesis, prediction, or simulated perspective — as
distinct from a sourced, verifiable fact — is labeled as such at the point of publication, not
folded silently into ordinary prose. See our AI-disclosure label spec for the exact wording.

## 3. Standards alignment

We hold our data practices to named external frameworks rather than inventing our own vocabulary,
so a reader or reviewer can check our claims against a recognized bar instead of trusting our
self-description alone.

### FAIR Data Principles

FAIR — Findable, Accessible, Interoperable, Reusable — is a data-hygiene framework we assess
ourselves against honestly, one letter at a time:

- **Findable:** every claim carries a stable ID (`CL-####`) and jurisdiction code; a persistent-ID
  (ARK) minting pass for published reports/datasets is planned (register §3 item 28) but not yet
  live — flagged here rather than overclaimed.
- **Accessible:** the public site is reachable over standard HTTP with no access barrier for the
  public tier; private- and vault-tier data (source protection, personal information) is
  deliberately not accessible by design — see Privacy by Design principle 2 below.
  and reused by other researchers.
- **Interoperable:** we describe claims and datasets using shared vocabularies where they exist
  (schema.org `ClaimReview`/`Dataset`, DCAT — see our JSON-LD emission spec) rather than a bespoke
  format only we can parse.
- **Reusable:** every published output carries an explicit license (see our License page) and a
  documented provenance chain (source, verification path, date), so a reuser knows both what they
  can do with it and where it came from.

### OECD AI Principles

We align with the OECD's 2019/2024-updated Recommendation on Artificial Intelligence — transparency,
accountability, human oversight, and robustness — as the international vocabulary underneath our own
"pointer, never author" design: AI agents propose and draft; verification, publication judgment, and
correction authority stay with a human-reviewed process, never an unsupervised model.

### Privacy by Design — 7-principle self-assessment (IPC Ontario)

Privacy by Design originated at the Ontario Information and Privacy Commissioner's office. We
assess our current practice against each of its seven principles honestly, including where we are
not yet fully there:

1. **Proactive not reactive; preventative not remedial** — our pre-publication firewall scan runs
   *before* anything ships, not after a complaint.
2. **Privacy as the default setting** — our three-tier public/private/vault sensitivity model means
   nothing is exposed publicly unless it is explicitly classified as public-tier.
3. **Privacy embedded into design** — the tiering and firewall scan are built into the publication
   pipeline itself, not a bolt-on review step a busy team can skip.
4. **Full functionality — positive-sum, not zero-sum** — we aim for both a useful public research
   library and real source/participant protection, not one traded off against the other.
5. **End-to-end security** — vault-tier material (source-identifying, personal information) is kept
   out of anything that gets published or publicly archived.
6. **Visibility and transparency** — this page, our Corrections Policy, and our Funding &
   Governance Transparency page are the visibility half of this principle; we document the rule,
   not just follow it silently.
7. **Respect for user privacy** — data-minimization is a standing checklist item on any new
   feature that collects information from participants or donors (what field, for how long, under
   what consent).

**Honest gap:** this is a self-assessment, not an audited certification (ISO 31700-1 would be the
audited version — deferred per the register, §4, as overkill at current scale). Treat it as a
documented internal discipline, not a third-party guarantee.

### Montréal Declaration for a Responsible Development of AI

The Montréal Declaration is a Canadian-originated (Université de Montréal / Mila), publicly
deliberated ethical framework for AI, with a strong emphasis on democratic participation — a
close match to a project built around mass public participation and deliberation. **Signature
pending** — formal sign-on to the Declaration is a one-time operator action distinct from the
substantive alignment described here; this page states the alignment honestly without claiming a
signature that has not yet been made.

## 4. UNDRIP Article 31 and free, prior, and informed consent — rationale for differential handling

Any content touching Traditional Knowledge, First Nations, Métis, or Inuit communities, or
Indigenous data more broadly, is handled under a stricter, relationship-first discipline than our
general publication process — an "honest-limitation" flag rather than default publication.

The normative basis for this differential handling is Article 31 of the UN Declaration on the
Rights of Indigenous Peoples (2007), which recognizes Indigenous peoples' right to maintain,
control, protect, and develop their cultural heritage, traditional knowledge, and intellectual
property over such knowledge — paired with the Declaration's free, prior, and informed consent
(FPIC) standard for anything affecting Indigenous peoples, their lands, or their knowledge. Canada
adopted implementing legislation via the federal *United Nations Declaration on the Rights of
Indigenous Peoples Act* (2021).

We cite this as normative and legal context, not as a claim of direct regulatory obligation: the
UNDRIP Act binds the federal government to align its own laws with the Declaration; it does not
directly regulate a civic-research initiative. We hold ourselves to the standard anyway because it
is the right standard, and because a research library that treats Indigenous knowledge like any
other public-domain fact repeats exactly the extractive pattern Article 31 exists to prevent.
Concretely, this rationale underlies our TK Labels metadata field and our CARE Principles review
check (Collective Benefit, Authority to Control, Responsibility, Ethics) — see our forthcoming
Indigenous data-handling policy for the full operational detail.

## 5. Current open-data maturity — 5-Star self-assessment

We use the 5-Star Open Data scale (Tim Berners-Lee, 2010) as a plain, publicly legible way to state
where our data practice currently stands, rather than an unqualified "open data" claim:

- ★ Available under an open license — **yes**, for public-tier content (see our License page).
- ★★ Available as structured data — **yes**, the claim ledger is structured (CSV/JSONL), not
  prose-only.
- ★★★ Available in a non-proprietary format — **yes**, CSV/JSON, not a proprietary spreadsheet
  format.
- ★★★★ URIs used to identify things, so people can point at your data — **not yet**. Persistent
  identifiers (ARK) and stable per-claim URIs are planned (register §3 item 28) but not live.
- ★★★★★ Data is linked to other data to provide context — **not yet**. Wikidata Q-ID referencing is
  planned (register §3 item 15) but not populated at scale.

**Current level: 3 stars.** We state this honestly rather than rounding up; reaching 4-5 stars is a
named roadmap item tied to the ARK and Wikidata work above, not a claim made in advance of the
work.

## Renderer note

This file is a canonical content source, not a generated leaf page. `tools/site_renderer.py`
currently has no mechanism to render standalone static pages like this one — see
`strategy/standards/integrations/SITE_ENG_NEEDS.md`. Every ledger entry should cross-link to the
rendered version of this page once that mechanism exists.
