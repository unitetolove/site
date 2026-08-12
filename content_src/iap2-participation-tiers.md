# Participation Tiers — What Level of Say You Actually Have

*Canonical source. Standard: IAP2 Spectrum of Public Participation + Core Values (International
Association for Public Participation). Register:
`strategy/standards/STANDARDS_REGISTER_v2_2026-07-17.md` §3 item 11. Status: DRAFT — tier legend
page plus the mandatory `iap2_tier` label spec for participation surfaces. Note the register's
"Moving*" flag: IAP2 is running a "Spectrum Evolution 2026" review; this page adopts the current
published vocabulary and should be revisited with a one-line update once that review finalizes.*

## Why this page exists

"Consultation theatre" — inviting public input while implying more influence than participants
actually have — is one of the most common and most corrosive failures in public participation. We
commit to never letting a participation surface imply more power than it actually grants. This page
defines the five tiers we use and what each one honestly promises.

## The five tiers (IAP2 Spectrum)

| Tier | What it promises the public | What it does NOT promise |
|---|---|---|
| **Inform** | We will keep you informed. | No mechanism to change the outcome — this is one-way communication. |
| **Consult** | We will listen to your input and consider it. | We do not commit to acting on it, and we do not promise our decision will match majority input. |
| **Involve** | We will work directly with you throughout the process to ensure your concerns are understood and reflected. | Final decision authority may still sit elsewhere. |
| **Collaborate** | We will partner with you in each aspect of the decision, including developing options and identifying the preferred solution. | The process is shared, but exact final ratification authority should still be stated explicitly per surface. |
| **Empower** | We will implement what you decide. | This is the only tier where public input is binding — it must not be used for anything less than a genuinely binding mechanism. |

## Core Values we hold ourselves to (IAP2 Core Values, adapted)

- The public has a right to be involved in decisions that affect them.
- Participation includes the promise that public input will influence the decision — at whatever
  tier is honestly labeled, never a tier higher than what's actually true.
- We seek out and facilitate involvement of those potentially affected by or interested in a
  decision, with specific attention to Indigenous and newcomer communities who are too often
  under-reached by default outreach.
- We communicate to participants how their input affected the decision, win or lose.
- Promises made are promises kept — a surface labeled `Consult` will never quietly function as
  `Inform`, and a surface labeled `Empower` will never quietly become advisory.

## Mandatory `iap2_tier` label spec

**Rule: every participation surface must carry an explicit `iap2_tier` label before it ships. A
new surface cannot launch unlabeled.** "Participation surface" means any mechanism inviting public
input, feedback, votes, or co-design — feedback forms, comment threads, citizens'-assembly
processes, community review panels, and any future binding-vote feature.

### Field spec

```
iap2_tier:
  value: "inform" | "consult" | "involve" | "collaborate" | "empower"
  surface_name: "<short name of the participation surface>"
  promise_text: "<the one-sentence honest promise from the table above, verbatim or close
                  paraphrase — never softened or inflated>"
  binding: true | false          # only "empower" may ever set this true
  last_reviewed: "<date this label was last checked against actual practice>"
```

### Enforcement rules

- `binding: true` is only valid when `value: "empower"`. Any other combination is a labeling error
  that must block publication of that surface, the same way the hedge-preservation gate blocks a
  build — a false `binding: true` claim is a worse failure than an unlabeled surface.
- The label must be visibly rendered on the participation surface itself, not only in page
  metadata — participants should see their tier before they invest time engaging.
- If a surface's actual practice ever diverges from its stated tier (e.g., a `Consult` surface's
  input starts being treated as binding, or an `Empower` surface's results get quietly overridden),
  that is itself a correction-worthy event under our Corrections Policy, not a silent process
  change.

## Honest note on sortition/assembly recruitment

Where a participation surface is a citizens'-assembly-style process, the `iap2_tier` label is a
distinct question from *how participants were recruited* (open self-selection vs. genuine
stratified random sortition). A lighter, non-random recruitment model must be named accurately
(e.g., "open recruitment, weighted toward demographic targets") rather than implying scientific
randomness it does not have — true stratified sortition is a separately budgeted, deferred item
(register §4) and its absence does not by itself change a surface's `iap2_tier` value, but it must
be disclosed alongside the tier label wherever recruitment method is relevant to how much weight a
reader should give the results.

## Renderer note

This file is a canonical content source. The "participation-surface component" referenced by the
standards register (where the `iap2_tier` label would actually render) does not exist yet in
`tools/site_renderer.py` or elsewhere in the codebase as of this writing — see
`strategy/standards/integrations/SITE_ENG_NEEDS.md`. This spec is what that future component
implements.
