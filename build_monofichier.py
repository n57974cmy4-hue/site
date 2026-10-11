"""Build version-monofichier.html: the whole site in one file that opens by double-click.

Every stylesheet and script linked from index.html is inlined, and the fonts are
embedded as data. Python 3, no dependencies:

    python3 build_monofichier.py
"""
from __future__ import annotations
import base64
import pathlib
import re

ROOT = pathlib.Path(__file__).resolve().parent


def data_uri(path: pathlib.Path) -> str:
    mime = 'font/woff2' if path.suffix == '.woff2' else 'font/ttf'
    return f'data:{mime};base64,' + base64.b64encode(path.read_bytes()).decode('ascii')


def inline_css(match: re.Match) -> str:
    css_path = ROOT / match.group(1)
    css = css_path.read_text(encoding='utf-8')
    css = re.sub(r'url\((\.\./assets/fonts/[^)]+)\)',
                 lambda m: 'url(' + data_uri((css_path.parent / m.group(1)).resolve()) + ')', css)
    return '<style>\n' + css + '\n</style>'


def inline_js(match: re.Match) -> str:
    code = (ROOT / match.group(1)).read_text(encoding='utf-8')
    if '</script' in code:
        raise SystemExit(f'{match.group(1)} contains a closing script tag')
    return '<script>\n' + code + '\n</script>'


def build() -> pathlib.Path:
    html = (ROOT / 'index.html').read_text(encoding='utf-8')
    html = re.sub(r'<link rel="stylesheet" href="\./(css/[^"?]+)(?:\?[^"]*)?">', inline_css, html)
    html = re.sub(r'<script src="\./(js/[^"?]+)(?:\?[^"]*)?"></script>', inline_js, html)
    out = ROOT / 'version-monofichier.html'
    out.write_text(html, encoding='utf-8')
    return out


if __name__ == '__main__':
    path = build()
    print(f'{path.name}: {path.stat().st_size / 1e6:.2f} MB')
