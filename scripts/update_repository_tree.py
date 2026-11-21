"""Regenerate the file list used by the GitHub Pages repository explorer."""

from pathlib import Path
import json


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "assets" / "repository-tree.json"
SKIP_PARTS = {".git", "__pycache__"}


def main():
    paths = []
    for path in ROOT.rglob("*"):
        if SKIP_PARTS.intersection(path.parts) or path.name == ".DS_Store":
            continue
        if path.is_file() and path != OUTPUT:
            paths.append(path.relative_to(ROOT).as_posix())
    paths.append(OUTPUT.relative_to(ROOT).as_posix())
    paths.sort(key=str.casefold)

    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT.write_text(
        json.dumps({"branch": "main", "files": paths}, indent=2) + "\n",
        encoding="utf-8",
    )
    print(f"Updated {OUTPUT.relative_to(ROOT)} with {len(paths)} files.")


if __name__ == "__main__":
    main()
