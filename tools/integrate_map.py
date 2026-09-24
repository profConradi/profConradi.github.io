#!/usr/bin/env python3
"""Reapplies the site integration to a standalone interactive page.

The maps are generated elsewhere and dropped into the repo wholesale, which wipes the few
things that tie them to the site. This puts them back:

  - the SEO / social metadata (description, canonical, Open Graph, Twitter)
  - the '← articles' back link and its styles
  - on pages with a film capture mode, the rule that hides the link during capture

Idempotent: only what is missing gets added, so run it after every re-export.

    python3 tools/integrate_map.py                       # every page listed in PAGES
    python3 tools/integrate_map.py map-of-llms.html      # just one

A new standalone page needs its description added to PAGES below.
"""
import io
import os
import re
import sys

SITE = 'https://profconradi.github.io'

PAGES = {
 'map-of-ai.html': ("An interactive hand-drawn map of the history of artificial intelligence: nineteen "
                    "stops from Ada Lovelace's Note G in 1843 to ChatGPT, walking across the summers "
                    "and the two winters of AI."),
 'map-of-llms.html': ("Bilingual (English and Italian), an interactive hand-drawn map of the ideas behind "
                      "large language models: fifteen stops from generative models to tokens, temperature, "
                      "scale, assistants, prompts, agents and hallucination, each with a small experiment "
                      "to play with."),
}

CSS = '''#home{position:fixed;left:12px;top:calc(12px + env(safe-area-inset-top,0px));z-index:6;font-family:var(--hand);font-size:21px;line-height:1.15;
  text-decoration:none;color:var(--ink);background-color:var(--paper);background-image:var(--grain,none);border:1.6px solid var(--ink);
  border-radius:255px 14px 225px 14px/14px 225px 14px 255px;padding:3px 14px 4px}
#home:hover{background-color:color-mix(in srgb,var(--yellow) 28%,transparent)}
#home:focus-visible{outline:2px dashed var(--blue);outline-offset:3px}
body.film #home{display:none!important}
@media (max-width:760px){#home{left:8px;font-size:18px;padding:2px 10px}}
'''
CSS_ANCHOR = '@media (prefers-reduced-motion:reduce){*{transition:none!important}}'
FILM_RULE = 'body.film #home{display:none!important}\n'
BACK_LINK = '<a id="home" href="articles.html">← articles</a>'


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
<meta property="og:locale" content="en_US">
<meta name="twitter:card" content="summary">
<meta name="twitter:title" content="{title}">
<meta name="twitter:description" content="{desc}">
<meta name="twitter:creator" content="@S_Conradi">
'''


def integrate(path):
    name = os.path.basename(path)
    desc = PAGES.get(name)
    if desc is None:
        return ['unknown page — add its description to PAGES']
    if not os.path.exists(path):
        return ['file not found']

    s = io.open(path, encoding='utf-8').read()
    done = []

    if 'og:title' not in s:
        m = re.search(r'<title>(.*?)</title>\n', s)
        if not m:
            return ['no <title> to anchor the metadata to']
        s = s.replace(m.group(0), m.group(0) + meta_block(name, m.group(1), desc))
        done.append('metadata')

    # The page may style the link itself — map-of-ai.html puts it in a #top group next to its
    # own language button — so look for any #home selector, not just the one this script writes.
    styled = re.search(r'#home\s*[,{:]', s)
    if not styled:
        if s.count(CSS_ANCHOR) != 1:
            return ['no reduced-motion rule to anchor the styles to']
        s = s.replace(CSS_ANCHOR, CSS + CSS_ANCHOR)
        done.append('back link styles')
    elif 'body.film' in s and not re.search(r'body\.film\s+#(home|top)\b', s):
        # the page gained a film capture mode after the styles were added
        s = s.replace(CSS_ANCHOR, FILM_RULE + CSS_ANCHOR)
        done.append('film rule')

    if 'id="home"' not in s:
        m = re.search(r'<body>\n(<canvas id="map")', s)
        if not m:
            return ['no <body> + canvas to anchor the back link to']
        s = s.replace(m.group(0), '<body>\n' + BACK_LINK + '\n' + m.group(1))
        done.append('back link')

    io.open(path, 'w', encoding='utf-8').write(s)
    return done or ['already integrated']


if __name__ == '__main__':
    for p in (sys.argv[1:] or sorted(PAGES)):
        print('%-18s %s' % (os.path.basename(p), ', '.join(integrate(p))))
