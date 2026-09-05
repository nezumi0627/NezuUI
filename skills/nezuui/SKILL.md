---
name: nezuui
description: Build or port portable React UI primitives with NezuUI when a component should be reusable across projects without backend or product-store dependencies.
---

# NezuUI

Use this skill when extracting, creating, or adapting a reusable visual React
primitive. Do not use it for a product-specific screen that still needs that
product's API calls, account data, or state store.

Read `AGENTS.md` and `docs/adoption.md` first. The target outcome is a small
component that exposes presentation props and callbacks, uses a `nezu-` CSS
prefix and `--nezu-*` theme variables, and can be copied into another React
application without a runtime dependency.

For a port from Vyline, first remove LINE protocol, data, media, store, and
network behavior. Preserve user-visible semantics with native controls, then
record the source path in `NOTICE.md`. Do not copy tokens, account state, chat
logs, or client credentials.

Before finishing, validate the component at a narrow viewport and with reduced
motion. Run `npm run check` and `npm run build` for changes in this repository.
