# Notices and attribution

NezuUI began as an independent component studio. Its initial component
inventory and several interaction patterns were researched from
[Vyline](https://github.com/nezumi0627/Vyline), a React + Vite LINE client
released under the MIT License.

The portable primitives in `src/components/` are adapted for this repository:
they contain no LINE protocol, API, storage, or Vyline runtime dependency.
`MessageComposer` was ported from the user-provided Vyline composer source
archive used for this catalog update. NezuUI keeps the interaction and visual
behavior while exposing product-specific work through callback props.
When copying a component or animation from Vyline in the future, preserve the
source copyright and MIT notice, and record the source path in the pull request
or this file.

"LINE" is a trademark of LY Corporation. NezuUI is independent software and
is not affiliated with or endorsed by LY Corporation.
