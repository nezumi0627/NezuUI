# AGENTS.md

## Purpose

NezuUI is a portable React UI toolkit and its browser catalog. Keep
the reusable primitives independent from a product, backend, account, or API.

## Layout

- `src/components/`: dependency-free React primitives and their stylesheet.
- `src/App.tsx`: the interactive public component catalog.
- `docs/`: adoption guidance and durable architecture decisions.
- `skills/nezuui/`: instructions for using NezuUI in another project.
- `.github/workflows/`: GitHub Pages deployment.

## Implementation rules

- Prefer CSS custom properties and native HTML controls. Do not add a UI,
  animation, icon, or state dependency for a component that can be expressed in
  this repository.
- Components accept presentation data and callbacks only. Keep API calls,
  stores, and product-specific data in the consuming application.
- Provide an accessible name for every interactive control, visible focus,
  keyboard behavior, and `prefers-reduced-motion` support for new motion.
- Add a named export through `src/components/index.ts` when a primitive is ready
  to be reused. Keep its stylesheet selector prefixed with `nezu-`.
- Do not import from Vyline at runtime. A ported pattern must be adapted into
  `src/components/`, documented in `NOTICE.md`, and retain applicable MIT
  notices.
- When a service adopts NezuUI, add its verified entry to the `services` array
  in `src/App.tsx`. Use the `使用中` label only after the service actually uses
  the listed UI pattern.

## Validation

Run `npm run check` and `npm run build` after TypeScript, CSS, or workflow
changes. Test the catalog in a browser and ensure a GitHub Pages build works
under the `/NezuUI/` base path.

## Publishing

`main` deploys through `.github/workflows/deploy-pages.yml`. Do not commit
`dist/`, `node_modules/`, browser storage, tokens, or credentials.
