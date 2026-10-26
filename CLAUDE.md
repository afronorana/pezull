# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Pezull.js is a tiny, dependency-free browser library (published to npm as `pezull`, also served via unpkg) that simulates hover on touch devices: on scroll, elements with the listener class (`pezull`) that enter a fixed "active area" of the viewport get the active class (`hovering`); it is removed when they leave.

The entire library is `index.js`. There is no build step, bundler, transpiler, linter, or test suite (`npm test` is the default stub that exits 1). Changes are verified manually in a browser — the README links a JSFiddle demo.

## Architecture (`index.js`)

- A single `Pezull` object literal holds everything. Only `Pezull.default` is exported (`module.exports.default`), so consumers do `require('pezull').default(options)`.
- `windowHeight` / `windowWidth` are read from `document.documentElement` **once, at module load**. Unit conversion and the breakpoint check use these cached values, so the module must be loaded in a browser and does not react to resize/orientation changes.
- Flow: `default(options)` merges options over defaults → bails if above breakpoint or (with `touchOnly`) not a touch device → optionally draws the dev overlay (`showDevArea`) → `activateClasses` attaches one `scroll` listener that checks each element's `getBoundingClientRect().top` against the active area.
- `convertTopPx` turns a number (px) or a `'px' | 'vw' | 'vh'` string into integer pixels; any other unit throws a string.
- Elements are collected with `getElementsByClassName` (a live collection), so elements added after init are picked up.

## Releasing

Releases are version-bump commits (e.g. `1.0.6`), i.e. `npm version patch` followed by `npm publish`. Keep `readme.md` in sync with option changes since it is the npm package page.
