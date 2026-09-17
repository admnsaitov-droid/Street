---
tags: [workflow, design, stable]
updated: 2026-09-17
---

# Workflow — Figma to Code

Skill: `figma-to-section`. Command: `/section`. Agent: `section-builder` (one per
section, in parallel).

## Order of operations

1. **Fetch both** `get_design_context` **and** `get_screenshot` for the node. The
   context gives values; the screenshot gives intent. Neither alone is enough.
2. **Record the node ID** in your working notes. QA re-fetches it — see
   [[qa-verification]]. Never QA against your own earlier summary.
3. **Get desktop and mobile frames.** This project scales rather than reflows
   (`rm()` + a root font size in `vw`), so a design measured at 1920 mostly holds
   down to 768. Below that, `related.xsm = 360` means the mobile frame must be
   measured at **360px** or the numbers will not translate.
4. **Download assets**, verify they opened, and place them:
   `public/` for images and 3D, `public/fonts/` for a new face. Content imagery
   normally comes from Strapi instead — check before committing a static asset.

## Mapping design values

| Figma | Becomes |
|---|---|
| A colour | `colors.<name>` — add to `_colors` in `src/styles/colors.ts` if new |
| Any px dimension | `rm(px)` |
| A font | `fontOnest(w)` / `fontGolosText(w)` / `fontSageGrotesk(w)` |
| A breakpoint | `` media.xlg/lg/md/xsm`…` `` (max-width, cascading down) |
| Full-viewport height | `minHeightLvh(100)`, never `100vh` |
| An auto-layout frame | a `Styled<Thing>` with flex — not a utility soup |

A value that cannot map to an existing token is a **design-review flag**, not a
literal. Add the colour to `_colors` with a comment naming its origin, or raise
it.

## Mapping design intent to motion

The design will not say "scrub". Read the prototype and the annotations:

| Design says | Use |
|---|---|
| "fades/slides in as you reach it" | `Inview mode="once"` |
| "moves as you scroll" / parallax | `SpringTrigger mode="scrub"` |
| "sticks/changes at this point" | `SpringTrigger mode="toggle"` |
| "on hover" | `Hover` — remember it is **off below 768px** |
| A heading revealing by line | `TLine` |
| Content swapping in place | `Handle` |

[[motion-system]]

## Building

Follow [[new-page]] from step 3. Structure:
`src/views/<Name>View/screens/<Section>/` for a full-width section of an existing
page, `components/` for a piece used only there.

## Before calling it done

- Re-fetch the node and compare side by side, desktop **and** 360px.
- `.claude/scripts/verify.sh` — especially the hardcoded-colour and
  `tag="div"` checks, which are what a Figma pass usually trips.
- Report: what was built, which values became new colours, what could not map.

## Related

[[new-page]] · [[design-system]] · [[motion-system]] · [[qa-verification]] · [[component-conventions]]
