---
tags: [workflow, playbook, stable]
updated: 2026-09-17
---

# Workflow — Add a Page or Section

The repeatable playbook for this codebase. Prompt template:
[[generic-layout-prompt]].

## 1. The route

`src/app/[locale]/<path>/page.tsx` — thin, and only these imports:

```tsx
import { ThingView } from "@/views/ThingView/ThingView";
import { getStrapiData } from "@/utils/strapi";
import { createMetadataGenerator } from "@/utils/createMetadataGenerator";

export const generateMetadata = createMetadataGenerator({
  getMetadata: async (locale) => getStrapiData('get-thing-data', locale),
  getPath: (locale) => `/${locale}/thing`,
  fallback: { title: 'Street Barbell - Thing', description: '…' },
});

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const data = await getStrapiData('get-thing-data', locale);
  return <ThingView data={data ?? { /* fallback shape */ }} />;
}
```

Dynamic segment? `params: Promise<{ locale: string; slug: string }>`, and pass
the slug into the query: `get-thing-data?slug=${slug}`.

## 2. The endpoint, if the content is new

`src/app/api/get-thing-data/route.ts`, copied from a neighbour — see
[[api-architecture]] for the exact nine lines. `API_URL` is read **only** here.

## 3. The view

```
src/views/ThingView/
├── ThingView.tsx          export const ThingView = ({ data }) => …
├── screens/<Section>/     full-width sections (large pages)
└── components/            pieces used only here
```

Views receive props and never fetch. Reuse before creating — check
[[components]] first; `LinesGrid`, `Skeleton/*`, `MediaComponent`, `Breadcrumbs`
and everything in `Ui/` already exist.

## 4. Styling

- Colours: `colors.*`. A new one goes in `_colors` in `src/styles/colors.ts` first.
- Every dimension: `rm(px)`. Breakpoints: `` media.xsm`…` ``. Fonts:
  `fontOnest(400)` / `fontGolosText()` / `fontSageGrotesk()`.
- Full-height: `minHeightLvh(100)`, not `100vh`.
- Styled-components named `Styled<Thing>`, declared above the component.

[[design-system]]

## 5. Motion

| Need | Use |
|---|---|
| Reveal on entering the viewport | `Inview mode="once"` |
| Parallax / continuous scroll | `SpringTrigger mode="scrub"` |
| Snap at a scroll point | `SpringTrigger mode="toggle"` |
| Hover (desktop only) | `Hover` |
| Heading / copy reveal | `TLine` |
| Content swap | `Handle` (renders a `div` — no semantics) |
| Hover colour/opacity only | a `transition` in the styled-component |

Pass the real element: `tag="section"`, `tag="h2"`. Transform and opacity only.
Never a bare `requestAnimationFrame` — `useLoop` / `useLoopInView`.
[[motion-system]]

## 6. A 3D scene, if there is one

Follow the existing four. `next/dynamic` with `ssr: false` in a `DynamicX.tsx`
wrapper, `useLazyScene` to defer mounting, `SceneSkeleton` while it loads,
`frameloop` toggled on visibility, `SceneReadyDetector` reporting into
`useAnimationStore` (add the new `SceneType`). Then [[optimize-3d-scene]].

## 7. Markup

One `<h1>`. Real `<button>` for actions. `next/link` or `AnimLink` for
navigation. `next/image` with `alt`. Sections inside the shell's `<main>` — do
not add a second one. [[html-semantics]]

## 8. SEO — in the same change

1. `src/app/sitemap.ts` — add the path to `staticPages` (or the dynamic loop).
2. [[site-map]] — add the route → view → endpoint row.
3. `src/redirects.mjs` — if it replaces an old URL.
4. Structured data if a schema type fits ([[seo-metadata]]).

## 9. Verify

```bash
.claude/scripts/verify.sh
yarn lint && yarn build
```

No new FAILs. Then the judgement pass in [[qa-verification]].

## 10. Update the vault

New components/hooks/utils → the catalog notes. Notable change → [[changelog]].
An architectural choice → an ADR.

## Deliverables

The route, the endpoint (if any), the view and its components, the sitemap entry,
the [[site-map]] row, and a short summary of assumptions, new colours added and
anything that could not map to an existing token or component.

> [!important] Editing an existing page?
> Preserve the existing logic. Keep the diff minimal and focused. Several views
> are `"use client"` wholesale — if you touch one, split the interactive leaf out
> rather than adding to the client bundle.

## Related

[[routing-views]] · [[component-conventions]] · [[design-system]] · [[motion-system]] · [[site-map]] · [[qa-verification]]
