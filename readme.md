# Pezull

Hover effects for touch devices. While an element scrolls through the middle of the screen, Pezull treats it as hovered, so touch users see the same effect mouse users get on hover.

**[Try the demo](https://afronorana.github.io/pezull/)** on your phone.

It is a stylesheet: a CSS scroll-driven animation detects when an element's top edge is inside the *active area* (by default 20%–80% of the viewport height). An optional 3 kB script covers browsers without scroll-driven animations.

## Install

### With a coding agent

Paste this into Claude Code, Cursor, or any coding agent working in your project:

```text
Install pezull (https://github.com/afronorana/pezull#readme) in this project.
Add the `pezull` npm package, or the unpkg links if the project has no build step.
Load `pezull/pezull.css` globally and call the default export of `pezull` once on
the client to enable the fallback. Add the `pezull` class to the elements that
should react while scrolled into the middle of the screen, and move their
touch-hover styles into `@container style(--pezull: 1) { ... }` rules that
target the element's children.
```

### From a CDN

```html
<link rel="stylesheet" href="https://unpkg.com/pezull@2/pezull.css">
<script type="module">
  import pezull from 'https://unpkg.com/pezull@2/pezull.js';
  pezull();
</script>
```

With a bundler, `import 'pezull/pezull.css'` and `import pezull from 'pezull'`.

## Usage

Add the `pezull` class to the elements that should react:

```html
<a class="pezull" href="/product">
  <div class="card">…</div>
</a>
```

Style their children with a container style query. Pezull sets `--pezull: 1` on the element and everything inside it while it is in the active area, and `0` otherwise:

```css
@container style(--pezull: 1) {
  .card { background: rebeccapurple; color: white; }
}
```

To share styles with real hover:

```css
.pezull:hover .card { background: rebeccapurple; color: white; }
@container style(--pezull: 1) {
  .card { background: rebeccapurple; color: white; }
}
```

A style query styles descendants, not the `.pezull` element itself. To change the element itself, use `--pezull` as a number, for example `opacity: calc(0.5 + var(--pezull) * 0.5)`.

For a smooth change, add a `transition` to the children's styles. Wrap it in `@media (prefers-reduced-motion: no-preference)` if it involves movement.

## Options

Set these custom properties on `:root`. Both are percentages of the viewport height.

| Property | Default | |
|---|---|---|
| `--pezull-area-top` | `20%` | Distance of the active area from the top of the viewport |
| `--pezull-area-height` | `60%` | Height of the active area |

Pezull only runs on devices that can't hover, i.e. `@media (hover: none)`. Phones and tablets match; a laptop with a touchscreen or an iPad with a trackpad doesn't, because those users can hover for real.

### Dev mode

Add the `pezull-dev` class to `<html>` to run Pezull on any device and draw the active area:

```html
<html class="pezull-dev">
```

## Browser support

| | Chrome / Edge | Safari / iOS | Firefox |
|---|---|---|---|
| CSS only | 115+ | 26+ | 159+ |
| With `pezull.js` | 111+ | 18+ | 151+ |

The script does nothing in browsers where the CSS works on its own. The lower limits come from container style queries, which the styling API relies on.

## Limitations

- The active area is measured against the element's nearest scroll container. An ancestor with `overflow: hidden` becomes that container; use `overflow: clip` instead. The fallback always measures against the viewport.
- Pezull uses the element's `::before` pseudo-element as a zero-height marker at its top edge, so don't style `.pezull::before` yourself. Because the marker sits inside the element's padding, the active area is measured from the top of the content box.
- The state is a custom property, not a class, so it can't be selected from JavaScript. With the fallback active, elements also get the `pezull-active` class.

## Development

```
npm test
```

Runs `test/index.html` in headless Chrome (set `CHROME` to the browser binary if it isn't at the default macOS path). It checks the CSS path, the hover-device gate, and the fallback on its own.

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

[ISC](LICENSE)
