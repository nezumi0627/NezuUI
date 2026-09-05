# Component checklist

Use this only while adding a new primitive.

- Does it accept props and callbacks instead of importing a product store?
- Does every clickable element use a native button, input, or link with an
  accessible name?
- Does the stylesheet use a `nezu-` selector and CSS variables rather than
  product colors?
- Does motion respond to `prefers-reduced-motion`?
- Is the named export included in `src/components/index.ts`?
- If it was adapted from Vyline, are the source and MIT attribution recorded in
  `NOTICE.md`?
