#!/usr/bin/env python3
"""Fetch the site's photography from Pexels into public/.

The repo previously shipped nine byte-identical grey "broken image" placeholders
and referenced a dozen og-*.jpg files that were never committed. This script is
the record of where each real photo came from, so an image can be re-fetched or
swapped later without guessing.

Set PEXELS_API_KEY in the environment; the key is never stored in the repo.

    PEXELS_API_KEY=... python3 scripts/fetch-site-images.py

Photos are Pexels-licensed (free for commercial use, no attribution required).
Credits are written to public/IMAGE_CREDITS.md anyway.
"""

import json
import os
import subprocess
import sys
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path

# Pexels rejects the default urllib user agent with 403.
UA = (
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
    "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36"
)

PUBLIC = Path(__file__).resolve().parent.parent / "public"

# filename -> (pexels_id, width, height, description)
# Widths are ~2x the largest rendered size so images stay sharp on retina screens.
IMAGES = {
    # --- On-page photography -------------------------------------------------
    "gallery-interior.jpg": (1872892, 1000, 1200, "Classic trattoria dining room"),
    "gallery-dining.jpg": (8856554, 1600, 800, "Candlelit dining room"),
    "gallery-exterior.jpg": (33047581, 1600, 1000, "Street-side terrace seating"),
    "gallery-table-setting.jpg": (17057034, 1600, 1000, "Laid table with glassware"),
    "gallery-ambiance.jpg": (30420679, 1600, 1000, "Candlelit tables at night"),
    "gallery-plating.jpg": (15671273, 1600, 1000, "Chef plating antipasti"),
    "gallery-wine.jpg": (16547178, 1200, 800, "Wine bottles and glasses"),
    "gallery-cocktail.jpg": (36189464, 1200, 800, "Martini at the bar"),
    "story-ingredients.jpg": (17477762, 1200, 800, "Tomatoes, basil and herbs"),
    # Referenced by the Restaurant schema on the About page.
    "restaurant-image.jpg": (1872892, 1200, 800, "Trattoria dining room"),

    # --- Open Graph / Twitter cards, 1200x630 per spec -----------------------
    "og-home.jpg": (8856554, 1200, 630, "Candlelit dining room"),
    "og-hatch-end.jpg": (1872892, 1200, 630, "Trattoria dining room"),
    "og-pinner.jpg": (17057034, 1200, 630, "Laid table with glassware"),
    "og-harrow.jpg": (17243892, 1200, 630, "Linguine alle vongole"),
    "og-northwood.jpg": (25389772, 1200, 630, "Steak with vegetables"),
    "og-watford.jpg": (30420679, 1200, 630, "Candlelit tables at night"),
    "og-ruislip.jpg": (905847, 1200, 630, "Wood-fired pizza"),
    "og-menu.jpg": (36430169, 1200, 630, "Spaghetti al pomodoro"),
    "og-about.jpg": (10135116, 1200, 630, "Restaurant interior"),
    "og-contact.jpg": (33047581, 1200, 630, "Street-side terrace seating"),
    "og-reserve.jpg": (1872889, 1200, 630, "Set table with candles"),
    "og-lunch.jpg": (15704113, 1200, 630, "Pasta and salad lunch"),
    "og-best-italian.jpg": (15671273, 1200, 630, "Chef plating antipasti"),
    "og-valentines.jpg": (8903641, 1200, 630, "Romantic table with rose and candle"),
    "og-mothers-day.jpg": (7705403, 1200, 630, "Table set with candles and flowers"),
}


def fetch(pexels_id, width, height, dest):
    """Download a Pexels photo cropped server-side to exactly width x height."""
    query = urllib.parse.urlencode(
        {"auto": "compress", "cs": "tinysrgb", "fit": "crop", "w": width, "h": height}
    )
    url = f"https://images.pexels.com/photos/{pexels_id}/pexels-photo-{pexels_id}.jpeg?{query}"
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=60) as response:
        data = response.read()
    if not data.startswith(b"\xff\xd8"):
        raise ValueError(f"{dest.name}: response was not a JPEG")
    dest.write_bytes(data)
    return len(data)


def photo_meta(pexels_id, key):
    """Look up photographer and source page for the credits file."""
    req = urllib.request.Request(
        f"https://api.pexels.com/v1/photos/{pexels_id}",
        headers={"Authorization": key, "User-Agent": UA},
    )
    with urllib.request.urlopen(req, timeout=30) as response:
        return json.load(response)


def build_apple_touch_icon():
    """apple-touch-icon.png was committed as a text file, so iOS had no icon."""
    source = PUBLIC / "android-chrome-512x512.png"
    dest = PUBLIC / "apple-touch-icon.png"
    subprocess.run(
        ["sips", "-z", "180", "180", str(source), "--out", str(dest)],
        check=True,
        capture_output=True,
    )
    size = dest.stat().st_size / 1024
    print(f"  {'apple-touch-icon.png':28} {size:7.0f} KB  180x180  Rebuilt from android-chrome-512")


def main():
    key = os.environ.get("PEXELS_API_KEY")
    if not key:
        print("PEXELS_API_KEY is not set", file=sys.stderr)
        return 1

    print(f"Fetching {len(IMAGES)} images into {PUBLIC}\n")
    credits = []
    total = 0
    for name, (pexels_id, width, height, description) in IMAGES.items():
        dest = PUBLIC / name
        try:
            size = fetch(pexels_id, width, height, dest)
        except (urllib.error.URLError, ValueError) as exc:
            print(f"  {name:28} FAILED: {exc}", file=sys.stderr)
            return 1
        total += size
        print(f"  {name:28} {size / 1024:7.0f} KB  {width}x{height}  {description}")
        credits.append((name, pexels_id, description))

    print()
    build_apple_touch_icon()

    lines = [
        "# Image credits",
        "",
        "Site photography comes from [Pexels](https://www.pexels.com/license/), which is",
        "free for commercial use and does not require attribution. Credits are listed",
        "here anyway, so any photo can be traced back to its source and swapped out.",
        "",
        "Regenerate with `PEXELS_API_KEY=... python3 scripts/fetch-site-images.py`.",
        "",
        "| File | Description | Photographer | Source |",
        "| --- | --- | --- | --- |",
    ]
    for name, pexels_id, description in credits:
        try:
            meta = photo_meta(pexels_id, key)
            photographer = meta.get("photographer", "Unknown")
            page = meta.get("url", f"https://www.pexels.com/photo/{pexels_id}/")
        except (urllib.error.URLError, ValueError):
            photographer = "Unknown"
            page = f"https://www.pexels.com/photo/{pexels_id}/"
        lines.append(
            f"| `{name}` | {description} | {photographer} | [Pexels #{pexels_id}]({page}) |"
        )

    (PUBLIC / "IMAGE_CREDITS.md").write_text("\n".join(lines) + "\n")

    print(f"\nTotal: {total / 1024 / 1024:.1f} MB across {len(IMAGES)} files")
    print("Wrote public/IMAGE_CREDITS.md")
    return 0


if __name__ == "__main__":
    sys.exit(main())
