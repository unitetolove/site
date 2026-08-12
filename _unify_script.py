#!/usr/bin/env python3
"""
W-BUILD lane 3 — SITE UNIFICATION.
Moves slice_v0.1's door pages up into site/ root, reconciles the two style
sheets, and rewrites every nav/link across the whole tree (both the 605-page
class-C library tree and the newly-moved pages) onto one absolute-path
convention:

  /index.html            door (was slice_v0.1/index.html)
  /library.html           library index (was site/index.html)
  /map/index.html         (was slice_v0.1/map.html)   -- served at /map/
  /questions/...          (was slice_v0.1/questions/) -- already dir-style
  /programs/...           (was slice_v0.1/programs/)
  /coming/...             (was slice_v0.1/coming/)
  /vision.html /who.html /how-this-was-made.html /corrections.html
  /how-we-verify.html
  /explainers/...         UNCHANGED, root's own pre-existing older content

This script does not touch slice_v0.1/ (left in place as a record) except to
add a README_SUPERSEDED.md there, and does not touch the identity-firewall
files. Copy, don't destroy: slice's originals stay put.
"""
import os
import re
import shutil
import sys

ROOT = os.environ.get(
    "UNIFY_ROOT",
    "./site"  # scrubbed 2026-07-28, D-008 class,
)
SLICE = os.path.join(ROOT, "slice_v0.1")

def log(msg):
    print(msg, flush=True)

# ---------------------------------------------------------------------------
# STEP 1: rename root's library index out of the way, then copy slice's door
# pages up.
# ---------------------------------------------------------------------------

def step1_move_pages():
    # 1a. root's current index.html (library index) -> library.html
    root_index = os.path.join(ROOT, "index.html")
    root_library = os.path.join(ROOT, "library.html")
    if os.path.exists(root_index) and not os.path.exists(root_library):
        shutil.move(root_index, root_library)
        log(f"moved {root_index} -> {root_library}")
    elif os.path.exists(root_library):
        log(f"SKIP: {root_library} already exists")
    else:
        log(f"WARN: {root_index} not found")

    # 1b. flat pages copied up from slice_v0.1
    flat_pages = [
        "index.html",
        "vision.html",
        "who.html",
        "how-this-was-made.html",
        "corrections.html",
        "how-we-verify.html",
    ]
    for name in flat_pages:
        src = os.path.join(SLICE, name)
        dst = os.path.join(ROOT, name)
        if os.path.exists(src):
            shutil.copy2(src, dst)
            log(f"copied {src} -> {dst}")
        else:
            log(f"WARN: missing slice source {src}")

    # 1c. map.html -> map/index.html (dir-style, matches the 605-page nav's
    # existing /map/ convention)
    src_map = os.path.join(SLICE, "map.html")
    dst_map_dir = os.path.join(ROOT, "map")
    dst_map = os.path.join(dst_map_dir, "index.html")
    os.makedirs(dst_map_dir, exist_ok=True)
    if os.path.exists(src_map):
        shutil.copy2(src_map, dst_map)
        log(f"copied {src_map} -> {dst_map}")
    else:
        log(f"WARN: missing {src_map}")

    # 1d. directories copied up wholesale: questions/, programs/, coming/
    for dirname in ["questions", "programs", "coming"]:
        src_dir = os.path.join(SLICE, dirname)
        dst_dir = os.path.join(ROOT, dirname)
        if os.path.exists(src_dir):
            if os.path.exists(dst_dir):
                log(f"SKIP dir (exists): {dst_dir}")
            else:
                shutil.copytree(src_dir, dst_dir)
                log(f"copied dir {src_dir} -> {dst_dir}")
        else:
            log(f"WARN: missing slice dir {src_dir}")


# ---------------------------------------------------------------------------
# STEP 2: rewrite links.
#
# 2a. The 605-page class-C library tree already uses absolute paths
#     (/index.html, /map/, /questions/, /vision.html, /who.html,
#     /how-this-was-made.html, /corrections.html) EXCEPT the "Library" nav
#     item, which pointed at /index.html (a placeholder — index.html was the
#     library index until step 1 moved it to /library.html). Fix that one
#     link, everywhere it appears, verbatim string replace.
#
# 2b. The pages just copied up from slice_v0.1 (index/vision/who/
#     how-this-was-made/corrections/how-we-verify/map + questions/ programs/
#     coming/) used relative hrefs (index.html, vision.html,
#     explainers/index.html, ../index.html, etc.) sized for slice_v0.1's own
#     flat layout. Now that they live at site/ root (one level shallower for
#     the top-level pages, same depth for questions/programs/coming/), those
#     relative hrefs still mostly resolve correctly EXCEPT:
#       - explainers/index.html (slice's old name for the programs section,
#         no index.html ever existed there) -> programs/index.html
#       - map.html -> map/ (map.html became map/index.html in step 1)
#     Everything else relative continues to resolve because the directory
#     depth is unchanged by the move (root-level pages stay root-level;
#     questions/programs/coming keep their one-level-deep position, now
#     under site/ instead of site/slice_v0.1/).
# ---------------------------------------------------------------------------

LIBRARY_LINK_OLD = '<li><a href="/index.html">Library</a></li>'
LIBRARY_LINK_NEW = '<li><a href="/library.html">Library</a></li>'

# Files/dirs never touched by any rewrite pass.
EXCLUDE_DIRS = {"slice_v0.1", ".git"}


def iter_html_files(root, exclude_dirs=EXCLUDE_DIRS):
    for dirpath, dirnames, filenames in os.walk(root):
        dirnames[:] = [d for d in dirnames if d not in exclude_dirs]
        for fn in filenames:
            if fn.endswith(".html"):
                yield os.path.join(dirpath, fn)


def step2a_fix_library_link():
    changed = 0
    for path in iter_html_files(ROOT):
        with open(path, "r", encoding="utf-8") as f:
            text = f.read()
        if LIBRARY_LINK_OLD in text:
            text = text.replace(LIBRARY_LINK_OLD, LIBRARY_LINK_NEW)
            with open(path, "w", encoding="utf-8") as f:
                f.write(text)
            changed += 1
    log(f"step2a: fixed Library nav link in {changed} files")


# Newly-moved top-level pages (originally slice-relative), now living at
# site/ root directly.
MOVED_TOPLEVEL = [
    "index.html",
    "vision.html",
    "who.html",
    "how-this-was-made.html",
    "corrections.html",
    "how-we-verify.html",
]
MOVED_DIRS = ["questions", "programs", "coming", "map"]


def rewrite_relative_hrefs(text):
    # explainers/index.html never existed (slice's old name for the
    # programs/ section) -> programs/index.html, at every relative depth.
    text = re.sub(r'href="(\.\./)*explainers/index\.html"',
                   lambda m: f'href="{m.group(1) or ""}programs/index.html"',
                   text)
    # map.html (a file) -> map/ (now a directory with its own index.html),
    # at every relative depth, but not when already map/... or map/index.html
    text = re.sub(r'href="(\.\./)*map\.html"',
                   lambda m: f'href="{m.group(1) or ""}map/"',
                   text)
    return text


def step2b_fix_moved_pages():
    changed = 0
    targets = []
    for name in MOVED_TOPLEVEL:
        p = os.path.join(ROOT, name)
        if os.path.exists(p):
            targets.append(p)
    for d in MOVED_DIRS:
        dpath = os.path.join(ROOT, d)
        if os.path.isdir(dpath):
            targets.extend(iter_html_files(dpath))

    for path in targets:
        with open(path, "r", encoding="utf-8") as f:
            text = f.read()
        new_text = rewrite_relative_hrefs(text)
        if new_text != text:
            with open(path, "w", encoding="utf-8") as f:
                f.write(new_text)
            changed += 1
    log(f"step2b: rewrote relative hrefs in {changed} moved files (of {len(targets)} scanned)")


# ---------------------------------------------------------------------------
# STEP 3: leave a superseded marker in slice_v0.1/ (do not delete anything).
# ---------------------------------------------------------------------------

SUPERSEDED_NOTE = """# SUPERSEDED — 2026-07-27 (D-097)

This tree (`site/slice_v0.1/`) has been superseded by the unified site at
`site/` root. Its pages — the door (`index.html`), `vision.html`, `who.html`,
`how-this-was-made.html`, `corrections.html`, `how-we-verify.html`,
`map.html`, `questions/`, `programs/`, and `coming/` — were copied up into
`site/` root on 2026-07-27 as part of W-BUILD lane 3 (SITE UNIFICATION), so
that the whole site (the door plus the 605-page library) lives as one tree
with one working nav instead of two trees with a broken seam between them.

This directory is kept in place as a record, not deleted. Nothing here is
authoritative any longer — read the corresponding page at `site/` root
instead (e.g. `site/index.html`, `site/map/index.html`, `site/programs/`,
`site/questions/`, `site/coming/`).
"""


def step3_write_superseded_note():
    path = os.path.join(SLICE, "README_SUPERSEDED.md")
    with open(path, "w", encoding="utf-8") as f:
        f.write(SUPERSEDED_NOTE)
    log(f"wrote {path}")


if __name__ == "__main__":
    step1_move_pages()
    step2a_fix_library_link()
    step2b_fix_moved_pages()
    step3_write_superseded_note()
