#!/usr/bin/env python3
"""Link-integrity check across the unified site tree (site/ root, including
slice_v0.1 as a courtesy secondary report). Reports total internal links
scanned vs. broken (missing target file)."""
import os
import re
import sys
from urllib.parse import urlsplit

ROOT = sys.argv[1] if len(sys.argv) > 1 else os.getcwd()

HREF_RE = re.compile(r'href="([^"]+)"')
SRC_RE = re.compile(r'src="([^"]+)"')

def iter_html_files(root, exclude_dirs=()):
    for dirpath, dirnames, filenames in os.walk(root):
        dirnames[:] = [d for d in dirnames if d not in exclude_dirs]
        for fn in filenames:
            if fn.endswith(".html"):
                yield os.path.join(dirpath, fn)

def resolve(root, current_file, link):
    if link.startswith(("http://", "https://", "mailto:", "tel:", "javascript:", "#")):
        return None  # external / non-file, not checked
    split = urlsplit(link)
    path = split.path
    if not path:
        return None  # pure fragment/query, nothing to resolve
    if path.startswith("/"):
        target = os.path.join(root, path.lstrip("/"))
    else:
        target = os.path.normpath(os.path.join(os.path.dirname(current_file), path))
    return target

def check(root, exclude_dirs=(), label=""):
    total = 0
    broken = []
    for f in iter_html_files(root, exclude_dirs):
        with open(f, "r", encoding="utf-8", errors="replace") as fh:
            text = fh.read()
        links = HREF_RE.findall(text) + SRC_RE.findall(text)
        for link in links:
            target = resolve(root, f, link)
            if target is None:
                continue
            total += 1
            ok = os.path.isfile(target)
            if not ok and os.path.isdir(target):
                ok = os.path.isfile(os.path.join(target, "index.html"))
            if not ok:
                broken.append((f, link, target))
    print(f"=== {label} ===")
    print(f"total internal links checked: {total}")
    print(f"broken: {len(broken)}")
    for f, link, target in broken:
        print(f"  BROKEN: {f}  ->  {link}  (resolved: {target})")
    return total, len(broken)

if __name__ == "__main__":
    check(ROOT, exclude_dirs={"slice_v0.1"}, label="unified tree (site/ root, excl. slice_v0.1)")
    print()
    check(ROOT, exclude_dirs=set(), label="whole site/ incl. slice_v0.1 (secondary)")
