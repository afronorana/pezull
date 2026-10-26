/*!
 * pezull.js: IntersectionObserver fallback for pezull.css, for browsers
 * without scroll-driven animations. Does nothing where pezull.css works on
 * its own. Toggles `.pezull-active`, which pezull.css maps to `--pezull: 1`.
 * https://github.com/afronorana/pezull (ISC)
 */

const SELECTOR = '.pezull';
const ACTIVE_CLASS = 'pezull-active';

/**
 * Starts the fallback if the browser needs it.
 * @returns {() => void} stops the fallback and clears active classes
 */
export default function pezull() {
  if (typeof window === 'undefined' || CSS.supports('animation-timeline: view()')) {
    return () => {};
  }

  // Same gate as pezull.css
  const media = matchMedia('(hover: none)');
  let stop = null;
  const update = () => {
    stop?.();
    stop = media.matches || document.documentElement.classList.contains('pezull-dev')
      ? observe()
      : null;
  };

  media.addEventListener('change', update);
  update();

  return () => {
    media.removeEventListener('change', update);
    stop?.();
  };
}

/**
 * An element's top edge is inside the area when the element intersects the
 * area but not the strip above it.
 * @returns {() => void}
 */
function observe() {
  const style = getComputedStyle(document.documentElement);
  const percent = (name, fallback) => {
    const value = parseFloat(style.getPropertyValue(name));
    return Number.isNaN(value) ? fallback : value;
  };
  const top = percent('--pezull-area-top', 20);
  const bottom = 100 - top - percent('--pezull-area-height', 40);

  const state = new Map();
  const toggle = (key) => (entries) => {
    for (const entry of entries) {
      const s = state.get(entry.target);
      if (!s) continue;
      s[key] = entry.isIntersecting;
      entry.target.classList.toggle(ACTIVE_CLASS, s.inArea && !s.inStrip);
    }
  };

  const observers = [
    new IntersectionObserver(toggle('inArea'), { rootMargin: `-${top}% 0px -${bottom}% 0px` }),
  ];
  // With the area at the very top, elements above the viewport can't be told apart
  if (top > 0) {
    observers.push(new IntersectionObserver(toggle('inStrip'), {
      rootMargin: `0px 0px -${100 - top}% 0px`,
    }));
  }

  const add = (el) => {
    if (state.has(el)) return;
    state.set(el, { inArea: false, inStrip: false });
    observers.forEach((o) => o.observe(el));
  };
  const remove = (el) => {
    if (!state.delete(el)) return;
    observers.forEach((o) => o.unobserve(el));
    el.classList.remove(ACTIVE_CLASS);
  };
  const each = (node, fn) => {
    if (!(node instanceof Element)) return;
    if (node.matches(SELECTOR)) fn(node);
    node.querySelectorAll(SELECTOR).forEach(fn);
  };

  document.querySelectorAll(SELECTOR).forEach(add);
  const mutations = new MutationObserver((records) => {
    for (const record of records) {
      record.addedNodes.forEach((node) => each(node, add));
      record.removedNodes.forEach((node) => each(node, remove));
    }
  });
  mutations.observe(document.documentElement, { childList: true, subtree: true });

  return () => {
    mutations.disconnect();
    observers.forEach((o) => o.disconnect());
    [...state.keys()].forEach(remove);
  };
}
