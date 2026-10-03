#!/usr/bin/env python3
"""Reapplies the site integration to a standalone interactive page.

These pages are generated elsewhere and dropped into the repo wholesale, which wipes the few
things that tie them to the site. This puts them back:

  - the SEO / social metadata (description, canonical, Open Graph, Twitter)
  - the back link to the articles index, and its styles
  - on pages with a film capture mode, the rule that hides the link during capture
  - on pages that translate their own interface, the back link's label

Idempotent: only what is missing gets added, so run it after every re-export.

    python3 tools/integrate_map.py                        # every page listed in PAGES
    python3 tools/integrate_map.py from-pollen-to-pixel.html   # just one

A new standalone page needs an entry in PAGES. Its 'shape' says how the page is built:

  'map'   — a fixed, full-viewport canvas app (the two maps): the link is positioned
            absolutely over the canvas and hidden during film capture.
  'sheet' — a scrolling document whose canvas sits in the page (the STEM films): the link
            goes above the header, like a breadcrumb, in the page's own typography.
"""
import io
import os
import re
import sys

SITE = 'https://profconradi.github.io'

PAGES = {
 'map-of-ai.html': dict(
    shape='map', label='← articles',
    desc="An interactive hand-drawn map of the history of artificial intelligence: nineteen "
         "stops from Ada Lovelace's Note G in 1843 to ChatGPT, walking across the summers "
         "and the two winters of AI."),
 'map-of-llms.html': dict(
    shape='map', label='← articles',
    desc="Bilingual (English and Italian), an interactive hand-drawn map of the ideas behind "
         "large language models: fifteen stops from generative models to tokens, temperature, "
         "scale, assistants, prompts, agents and hallucination, each with a small experiment "
         "to play with."),
 'from-pollen-to-pixel.html': dict(
    shape='sheet', label='← articoli',
    desc="Bilingual (Italian and English), a four-minute animated film drawn as a scientific "
         "engraving: the history of Brownian motion in nine chapters, from Lucretius' dust in a "
         "sunbeam and Robert Brown's pollen in 1827 to Einstein, Perrin, option pricing and the "
         "diffusion models that generate images from noise."),
}

# --- shape 'map': the link floats over the canvas -------------------------------------------
MAP_CSS = '''#home{position:fixed;left:12px;top:calc(12px + env(safe-area-inset-top,0px));z-index:6;font-family:var(--hand);font-size:21px;line-height:1.15;
  text-decoration:none;color:var(--ink);background-color:var(--paper);background-image:var(--grain,none);border:1.6px solid var(--ink);
  border-radius:255px 14px 225px 14px/14px 225px 14px 255px;padding:3px 14px 4px}
#home:hover{background-color:color-mix(in srgb,var(--yellow) 28%,transparent)}
#home:focus-visible{outline:2px dashed var(--blue);outline-offset:3px}
body.film #home{display:none!important}
@media (max-width:760px){#home{left:8px;font-size:18px;padding:2px 10px}}
'''
MAP_CSS_ANCHOR = '@media (prefers-reduced-motion:reduce){*{transition:none!important}}'
FILM_RULE = 'body.film #home{display:none!important}\n'

# --- shape 'sheet': the link sits above the header, as a breadcrumb --------------------------
SHEET_CSS = '''#home{justify-self:start;font:italic 400 1.05rem/1.3 var(--f-b);color:var(--ink2);text-decoration:none;border-bottom:1px solid transparent}
#home:hover{color:var(--ink);border-bottom-color:var(--rule)}
#home:focus-visible{outline:2px solid var(--blue);outline-offset:3px}
'''


def meta_block(name, title, desc):
    return f'''<meta name="description" content="{desc}">
<meta name="author" content="Simone Conradi">
<meta name="robots" content="index, follow">
<link rel="canonical" href="{SITE}/{name}">
<meta property="og:type" content="article">
<meta property="og:url" content="{SITE}/{name}">
<meta property="og:title" content="{title}">
<meta property="og:description" content="{desc}">
<meta property="og:site_name" content="Simone Conradi">
<meta name="twitter:card" content="summary">
<meta name="twitter:title" content="{title}">
<meta name="twitter:description" content="{desc}">
<meta name="twitter:creator" content="@S_Conradi">
'''


def add_metadata(s, name, desc, done):
    if 'og:title' in s:
        return s
    m = re.search(r'<title>(.*?)</title>\n', s)
    if not m:
        done.append('! no <title> to anchor the metadata to')
        return s
    done.append('metadata')
    return s.replace(m.group(0), m.group(0) + meta_block(name, m.group(1), desc))


def integrate_map(s, label, done):
    # The page may style the link itself — map-of-ai.html puts it in a #top group next to its
    # own language button — so look for any #home selector, not just the one this script writes.
    if not re.search(r'#home\s*[,{:]', s):
        if s.count(MAP_CSS_ANCHOR) != 1:
            done.append('! no reduced-motion rule to anchor the styles to')
        else:
            s = s.replace(MAP_CSS_ANCHOR, MAP_CSS + MAP_CSS_ANCHOR)
            done.append('back link styles')
    elif 'body.film' in s and not re.search(r'body\.film\s+#(home|top)\b', s):
        # the page gained a film capture mode after the styles were added
        s = s.replace(MAP_CSS_ANCHOR, FILM_RULE + MAP_CSS_ANCHOR)
        done.append('film rule')

    if 'id="home"' not in s:
        m = re.search(r'<body>\n(<canvas id="map")', s)
        if not m:
            done.append('! no <body> + canvas to anchor the back link to')
        else:
            s = s.replace(m.group(0), f'<body>\n<a id="home" href="articles.html">{label}</a>\n' + m.group(1))
            done.append('back link')
    return s


def integrate_sheet(s, label, done):
    if not re.search(r'#home\s*[,{:]', s):
        m = re.search(r'\n</style>', s)
        if not m:
            done.append('! no </style> to append the styles to')
        else:
            s = s.replace(m.group(0), '\n' + SHEET_CSS + '</style>', 1)
            done.append('back link styles')

    if 'id="home"' not in s:
        m = re.search(r'(<main class="wrap">\n)', s)
        if not m:
            done.append('! no <main class="wrap"> to anchor the back link to')
        else:
            s = s.replace(m.group(0), m.group(0) + f'  <a id="home" href="articles.html">{label}</a>\n')
            done.append('back link')

    # The page translates its own interface, so the label belongs in that machinery.
    if 'UI.home' not in s:
        entry = "  home:['\u2190 articoli','\u2190 articles'],\n"
        call = "document.getElementById('home').textContent=S(...UI.home);"
        title_line = "document.getElementById('h1').textContent=S(...UI.title);"
        if s.count('const UI={\n') == 1 and s.count(title_line) == 1:
            s = s.replace('const UI={\n', 'const UI={\n' + entry)
            s = s.replace(title_line, call + title_line)
            done.append('back link label follows the language toggle')
        else:
            done.append('! label left in Italian: the UI/applyLang anchors moved')
    return s


def integrate(path):
    name = os.path.basename(path)
    cfg = PAGES.get(name)
    if cfg is None:
        return ['unknown page — add an entry to PAGES']
    if not os.path.exists(path):
        return ['file not found']

    s = io.open(path, encoding='utf-8').read()
    done = []
    s = add_metadata(s, name, cfg['desc'], done)
    s = (integrate_map if cfg['shape'] == 'map' else integrate_sheet)(s, cfg['label'], done)
    io.open(path, 'w', encoding='utf-8').write(s)
    return done or ['already integrated']


if __name__ == '__main__':
    for p in (sys.argv[1:] or sorted(PAGES)):
        print('%-26s %s' % (os.path.basename(p), ', '.join(integrate(p))))
