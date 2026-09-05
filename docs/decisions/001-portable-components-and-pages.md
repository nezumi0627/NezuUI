# ADR-001: Publish a static catalog and portable component source

## Status

Accepted — 2026-09-05

## Context

NezuUI will be used by multiple future projects. The initial UI research came
from Vyline, but a reusable UI repository must not depend on its LINE backend,
Zustand store, media proxy, or authenticated browser state.

## Decision

Keep NezuUI as a Vite + React static site. GitHub Pages hosts the catalog. Small
portable primitives live in `src/components/` and use CSS custom properties,
native controls, props, and callbacks. The catalog has no server API,
authentication, or persistent browser state.

The project uses the MIT License. Vyline-derived research and ports are
attributed in `NOTICE.md`; no Vyline runtime code is imported.

## Consequences

- Any project can copy or package individual primitives without a backend.
- Pages builds remain deterministic and require no secret.
- A new component needs a clear prop boundary before it is called reusable.
- Features that require a product store remain in the product until separated.
