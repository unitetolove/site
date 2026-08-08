*Internal header (strip on render): redacted merged public render of the sharing tiers memo +
sharing architecture memo (tier-map rows 1.4–1.5), OPEN-AFTER-REDACTION → GO (walk 2026-08-07).
Strip list per the ruling: internal file paths, the Lane-3 named-person share-log mechanics
(persons never publish; the lane's existence does). One page, not two. Public register.*

---

# How we share

Publishing our own sharing rules is the constitution's move: instead of "trust us with your
access request," the answer is "here is exactly what we publish, what we hold, and why" — which
is the strongest possible answer to "what are you hiding?"

## Two stable states, not three

A "friends and collaborators" tier that's more open than private but less than public sounds
reasonable and doesn't survive contact with how sharing actually works. Trust doesn't survive
forwarding, and a copy of a folder is permanent — ten trusted readers means the eleventh reader is
whoever any one of the ten forwards to. There are only two states that hold: **private**, and
**published**. Everything in between drifts toward public, on someone else's timeline, without
any of the discipline publishing deserves. So when something is good enough to hand a trusted
friend, our rule is: it's good enough to publish, or it stays private. No side door.

## What can't move, and why

Almost everything this project builds is written to survive a hostile reader, on the theory that
a strategy that only works while hidden isn't a strategy worth having. What's actually held back
is narrow and principled: records that would identify specific people (attendance, private
conversations, contact details beyond what a signature form needs), anything not yet finished or
ruled on, and machinery whose only job is coordinating outreach to specific people or
organizations before that outreach happens. That's the whole list. Screening a claim to publish it
costs about the same as screening it to hand a friend — so there's no efficient middle tier, only
the discipline of doing the screening once, in public.

## The public repos

The pattern we actually use: separate, public, org-owned repositories, each with fresh history and
a clear license, holding only what's cleared to leave:

- **[unitetolove/site](https://github.com/unitetolove/site)** — the whole live site, exactly as
  it's served.
- **[unitetolove/commons](https://github.com/unitetolove/commons)** — the data desk and the
  document commons: sealed research, schemas, guides, and the sourced datasets behind the site's
  claims.

Nothing crosses into either repository automatically. Every export runs through a screen: local
paths and identity-bearing text are hard-blocked; anything that looks like internal process
language is flagged for a human read before it ships; and a second, independent pass checks the
exported files themselves, not just the sources they came from. Copy-out only — never a fork or a
filtered copy of anything private, since that would carry private history along with it.

## How collaboration comes in

The honest answer to "can I get access to your private files?" is no — but that turns out to
matter less than it sounds, because nobody actually needs estate-wide access to collaborate on a
real project. What works better:

- **Issues and pull requests** on the public repos — scoped to one thing, reviewable by anyone, no
  access to anything private required. Every contribution is treated as a draft until it's
  independently checked, the same discipline this project applies to its own work.
- **A contributor's guide** ([the standing contributor
  ethics](https://unitetolove.ca/contributor-ethics.html)) sets the ground rules once, the same
  for everyone.
- **Working rooms for real projects.** When a specific collaboration needs more than the public
  repos hold — a dataset in progress, a toolkit being built together — the answer is a scoped
  project repository, built for that project alone, with only what that project needs. Its blast
  radius is one project; closing it is as simple as archiving it. Nobody gets a key to the whole
  estate to work on one room in the house.
- **A narrow channel for material that has real timing value before it's ready to publish** — a
  handful of specific people, asked one at a time, shown something before it's public because
  timing matters and it will be public soon regardless. This is the exception, not a tier: it's a
  promise made to a person, not standing access to anything, and it exists alongside the two
  stable states above, not instead of them.

## Why publish this page at all

Publishing our own sharing rules is the same move as everything else on this shelf: instead of
"trust us with your access request," the answer is "here is exactly what we publish, what we hold
back, and why — check it yourself." A commons that can explain its own boundaries in public is
more trustworthy than one that grants access case by case behind closed doors, and it's also just
less work: the rule is the same for everyone, including us.

---

**Where this leads:** [the code and data](https://github.com/unitetolove/commons) · [contributor
ethics](https://unitetolove.ca/contributor-ethics.html) · [the publishing
discipline](https://unitetolove.ca/strategy/open/04-the-publishing-discipline.html).
