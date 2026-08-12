# License

*Canonical source. Standards: Creative Commons CC BY-NC-SA 4.0, Open Definition v2.1 (OKFN).
Register: `strategy/standards/STANDARDS_REGISTER_v2_2026-07-17.md` §3 item 5. Status: DRAFT —
notice text plus per-page metadata spec.*

## License notice (footer text, all public-tier pages)

> This work is licensed under a [Creative Commons Attribution-NonCommercial-ShareAlike 4.0
> International License (CC BY-NC-SA 4.0)](https://creativecommons.org/licenses/by-nc-sa/4.0/).
> You may share and adapt this material for non-commercial purposes, with attribution, under the
> same license. Content marked with a TK (Traditional Knowledge) Label is excluded from this
> license — see the label's specific terms instead.

## What the license permits and requires

- **Share** — copy and redistribute in any medium or format.
- **Adapt** — remix, transform, and build upon the material.
- **Attribution required** — credit must be given, a link to the license provided, and any changes
  indicated.
- **NonCommercial** — the material may not be used for commercial purposes.
- **ShareAlike** — if you remix, transform, or build upon the material, your contributions must be
  distributed under the same license as the original.

This license was chosen deliberately over a more permissive one (e.g., CC BY or CC0): it supports
reuse by allies, researchers, and media with attribution, while the NonCommercial and ShareAlike
terms prevent a hostile actor from silently repackaging our verified claims for profit or stripping
attribution — directly relevant to a claim-ledger project designed to be resistant to bad-faith
reuse.

## TK-Labeled content is automatically excluded

Creative Commons licensing assumes individual or organizational copyright ownership. It is not an
appropriate framework for Traditional Knowledge, which is community-held, not individually owned.
Any content carrying a TK (Traditional Knowledge) Label — per our ledger schema's TK-Labels-
compatible metadata field — is automatically excluded from the CC BY-NC-SA license stated above.
That content's terms of use are set by the specific TK Label attached to it, as determined by the
originating community, not by us. A page or claim carrying a TK Label must display that label's
terms instead of the general site license notice, never both, and never the CC notice alone.

## Per-page metadata spec

Every publicly-rendered page (backgrounder, brief, card, day-one paper, translation, dataset page,
claim page) should carry a machine-readable license field alongside its existing metadata:

```
license:
  type: "CC-BY-NC-SA-4.0"        # or "TK-LABEL" if a TK Label applies — see below
  url: "https://creativecommons.org/licenses/by-nc-sa/4.0/"
  tk_label: null                  # populated with the specific TK Label identifier when applicable;
                                   # when tk_label is non-null, type MUST be "TK-LABEL", never
                                   # "CC-BY-NC-SA-4.0" — the two are mutually exclusive per page
```

This should be emitted both as visible footer text (the notice above) and as part of the page's
`schema.org` `Dataset`/`CreativeWork` JSON-LD (`license` property) per
`strategy/standards/integrations/JSONLD_EMISSION_SPEC.md`, so the license is both human-readable
and machine-checkable by reuse tooling.

## Honest Open Definition statement

We state this plainly rather than let a hostile fact-checker catch an overclaim: **the NonCommercial
(NC) clause in CC BY-NC-SA 4.0 means this license is not Open Definition-conformant.** The Open
Definition (Open Knowledge Foundation, v2.1) requires free reuse without field-of-use restrictions;
NC is exactly such a restriction. We do not describe our content as "open data" or "Open
Definition-conformant" anywhere — we describe it as "openly licensed with attribution and
non-commercial/share-alike terms." Anyone quoting us as claiming full open-data conformance is
misquoting the actual license terms stated on this page.

If a future dataset export specifically needs full Open Definition conformance (e.g., for
inclusion in a government open-data portal that requires it), that would require a separate,
explicitly different license choice (e.g., CC0 or ODbL) scoped to that specific export — not a
silent reinterpretation of the general CC BY-NC-SA 4.0 notice above.

## Renderer note

This file is a canonical content source. `tools/site_renderer.py`'s page templates do not yet emit
a footer license notice or the per-page license metadata block — see
`strategy/standards/integrations/SITE_ENG_NEEDS.md`.
