# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Pezull (npm `pezull`, also served via unpkg) simulates hover on touch devices: while a `.pezull` element's top edge is inside an "active area" of the viewport (default 20%–80% of its height), it is treated as hovered. There is no build step and no dependencies; the published package is just `pezull.css` and `pezull.js` (see `files` in `package.json`).

## Commands

- `npm test` runs `test/run.mjs`, which launches headless Chrome (`CHROME` env var overrides the macOS default path), drives `test/index.html` over the DevTools protocol using Node's built-in WebSocket, and runs three suites: CSS path on a hover device (all off), CSS path forced on via `pezull-dev`, and the JS fallback in isolation. There is no single-test filter; edit the `cases` array in `test/index.html`.
- Headless `--dump-dom` / `--virtual-time-budget` does not render frames, so scroll timelines never update there. That's why the runner uses CDP with real frames.
- In the test page, position elements with `getBoundingClientRect()`, not `offsetTop` (they disagreed by 13px in that layout).

## Architecture

The state is the registered custom property `--pezull` (`<integer>`, inherits, initial 0), not a class. Authors consume it with `@container style(--pezull: 1)` (descendants only) or `var(--pezull)` math on the element itself.

- **`pezull.css`** (primary): inside `@supports (animation-timeline: view())`, `.pezull` gets a constant-value keyframe animation on `view(block <top> <bottom>)` built from `--pezull-area-top` / `--pezull-area-height`, with `animation-range: entry-crossing 0% exit-crossing 0%` (= "top edge inside the area", independent of element height) and `fill-mode: none` so it turns off outside. `animation-name` is `none` by default and only set under `@media (hover: none)` or `:root.pezull-dev`, which also draws the area overlay.
- **`pezull.js`** (fallback, ESM default export, returns a stop function): no-op when `CSS.supports('animation-timeline: view()')`. Otherwise, under the same gate, two IntersectionObservers (the area, and the strip above it) mark an element active when it intersects the area but not the strip; it toggles `.pezull-active`, which `pezull.css` maps to `--pezull: 1`. A MutationObserver picks up added/removed elements. Area percentages are read from the root's custom properties, so CSS stays the single source of config.
- Known divergence: `view()` binds to the nearest scroll container, the fallback always to the viewport.

When changing behavior, keep CSS and fallback semantics identical and extend `test/index.html` cases for both.

## Releasing

Releases are version-bump commits made with `npm version <patch|minor|major>` (which also tags), followed by `npm publish`. Keep `readme.md` in sync, since it is the npm package page; it pins CDN links to the major version (`pezull@2`).
