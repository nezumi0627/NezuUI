# NezuUI

NezuUI is a portable React UI toolkit and public component catalog. It collects
small, accessible primitives that can move between projects without bringing a
backend, a product store, or a component-runtime dependency.

[Open the catalog](https://nezumi0627.github.io/NezuUI/)

## Included

- A GitHub Pages catalog with live Toggle, Avatar, badge, notification, token,
  and motion specimens.
- Portable `Toggle`, `Avatar`, `VerifiedBadge`, `PremiumBadge`, and
  `FloatNotice` source in `src/components/`.
- CSS-variable theming through `--nezu-accent`, `--nezu-surface`,
  `--nezu-text`, and `--nezu-border`.
- Reuse guidance for future projects and a Codex skill for portable component
  work.

## Quick start

```bash
git clone https://github.com/nezumi0627/NezuUI.git
cd NezuUI
npm ci
npm run dev
```

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the catalog locally. |
| `npm run check` | Type-check and lint source. |
| `npm run build` | Build static files in `dist/`. |
| `npm run preview` | Serve the production build locally. |

## Reuse in another project

Read the [adoption guide](docs/adoption.md). The consuming application owns
data, API calls, routing, and business rules; NezuUI owns presentational
semantics and interaction feedback.

```tsx
import { Toggle } from "./components";
import "./components/nezuui-components.css";

<Toggle checked={enabled} onCheckedChange={setEnabled} label="通知を受け取る" />
```

Ask Codex to use [`skills/nezuui/SKILL.md`](skills/nezuui/SKILL.md) when
porting or creating a reusable NezuUI component in another project.

## Services using NezuUI

The public catalog has a service registry so adoption stays visible as NezuUI
moves into other projects. Add only verified integrations to the `services`
array in `src/App.tsx`.

| Service | Status | Relationship |
| --- | --- | --- |
| [Vyline](https://github.com/nezumi0627/Vyline) | Vylineで使用中 | The initial UI patterns were organized into portable NezuUI primitives. |

## Architecture

```text
src/App.tsx              interactive public component catalog
src/components/          portable React primitives and CSS
docs/                    adoption notes and architecture decisions
skills/nezuui/           reusable Codex guidance
.github/workflows/       static GitHub Pages deployment
```

The catalog is static and has no server API, authenticated state, or browser
storage. Every push to `main` deploys to GitHub Pages. `vite.config.ts` uses
the `/NezuUI/` project-site base path for the published build.

## Vyline relationship

The initial UI inventory and interaction patterns were researched from
[Vyline](https://github.com/nezumi0627/Vyline). NezuUI is independent and does
not import the Vyline protocol, backend, data store, or LINE integration. See
[NOTICE.md](NOTICE.md) for attribution and rules for future ports.

## License

[MIT](LICENSE). Third-party and source-attribution notes are in [NOTICE.md](NOTICE.md).

## Contributing

Read [AGENTS.md](AGENTS.md) before changing code. Keep components portable,
use named exports, retain accessible semantics, and run `npm run check` plus
`npm run build` before opening a pull request.
