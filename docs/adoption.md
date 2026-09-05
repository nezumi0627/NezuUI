# Adopting NezuUI in another project

NezuUI is designed to move as small, readable pieces instead of requiring a
runtime or a global store. Copy only the primitives you need from
`src/components/`, their `nezu-` CSS rules, and the relevant tokens.

## Recommended boundary

```text
Product data / API / state store
              │ props and callbacks
              ▼
      NezuUI primitive + CSS variables
              │ DOM events
              ▼
       Product event handler
```

The consuming product owns fetching, persistence, routes, localization, and
business rules. NezuUI owns presentational semantics, interaction feedback,
and reduced-motion behavior.

## Minimal use

```tsx
import { Toggle } from "./components";
import "./components/nezuui-components.css";

function Notifications({ enabled, setEnabled }: { enabled: boolean; setEnabled: (value: boolean) => void }) {
  return <Toggle checked={enabled} onCheckedChange={setEnabled} label="通知を受け取る" />;
}
```

Use CSS variables to integrate the host theme. The defaults are intentionally
neutral: `--nezu-accent`, `--nezu-surface`, `--nezu-text`, and `--nezu-border`.

## Porting a pattern from Vyline

1. Locate the component and its surrounding behavior in Vyline.
2. Remove LINE-specific APIs, stores, media proxying, and product copy.
3. Expose only stable presentation props and callbacks.
4. Move visual values to `--nezu-*` variables and use native semantics.
5. Add the source path to `NOTICE.md` and preserve MIT notices.
6. Verify it in a browser at a narrow viewport and with reduced motion.

Do not transfer account data, local chat logs, tokens, or protocol code.
