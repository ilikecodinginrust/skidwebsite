# SKIDCLIENT — website

The marketing site for a fictional Minecraft client. Dark, technical, a little
rebellious: near-black surfaces, acid-lime accents, hairline rules, mono
micro-labels and oversized editorial type.

**This is a visual showcase only.** Nothing on the page functions. There is no
navigation, no download, no authentication, no settings and no calls to any
external service. Every button, toggle, field and menu is drawn decoration.
The only thing that does anything is scrolling, which drives the animation.

## Live site

<https://ilikecodinginrust.github.io/skidwebsite/> — built and published by
`.github/workflows/deploy.yml` on every push to `main`.

## Running it

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # static output in dist/
npm run preview  # serve the build
npm run lint
```

## Stack

React 19 + Vite, plain CSS. No animation library, no CSS framework, no runtime
dependencies beyond React. Fonts (Archivo, Inter, JetBrains Mono — all SIL OFL
1.1, see `public/fonts/OFL.txt`) are self-hosted from `public/fonts`, so the
page makes zero third-party requests at runtime.

## How the motion works

Two mechanisms, deliberately kept apart.

**Entrance reveals** use `IntersectionObserver` (`src/hooks/useInView.js`) and
only ever touch `transform` and `opacity`. Elements re-arm once they have fully
left the viewport, so a reveal replays when you scroll back to it and never
flickers on the way up.

**Scroll-linked motion** goes through a single shared bus
(`src/lib/scroll.js`): one passive listener, one `requestAnimationFrame` per
frame, all geometry read in a first pass and all writes done in a second, so
layout is never interleaved with style changes. Each subscriber is handed a
normalised 0–1 progress value and writes CSS custom properties directly onto
its element. React does not re-render while you scroll.

Progress is one of two kinds: `cover` (element travels through the viewport) or
`pin` (a tall wrapper holding a `position: sticky` child, used by the client
mockup). The odometer is deliberately *not* on this bus — it runs on its own
timer.

## The counter

`999,999` is fixed fiction. It is not a count of anything, and it makes no
network requests.

The instrument holds at zero until it is comfortably in view, then runs to its
ceiling on a local timer — scrolling does not drive the number. Each digit is a
vertical wheel of 60 stacked glyphs behind a one-cell window; each frame writes
one unitless custom property, `--off`, per wheel and CSS turns it into a
`translate3d`. Six wheels, six property writes per frame, no canvas. Wheels get
different rotations and start times, so the number rolls and settles the way a
mechanical counter does. When it lands on the maximum the lights go off: a
bloom and rays behind the digits, a sweep across the cluster, a strobe on the
instrument's own rules, a hit on the glyphs and a `MAX` chip.

Leaving the section resets it to zero so the moment can be watched again.
Under `prefers-reduced-motion` it sits at the finished reading with no run and
no flash. Everything lives in `src/lib/odometer.js` and
`src/components/SkiddedFrom.*`.

## Structure

```
src/
  lib/          scroll bus, isometric wireframe builder, counter constants
  hooks/        useInView, usePresence, useScrollProgress, useReducedMotion
  styles/       fonts, design tokens, base layer
  components/   one component + one stylesheet per section
  App.jsx       section order
```

`src/components/ClientMockup.jsx` is the entire client interface — title bar,
module list, viewport, HUD, inspector, status bar — built from CSS and one
generated SVG terrain silhouette. No screenshots, no images.

## Accessibility and performance

- `prefers-reduced-motion: reduce` is honoured throughout: reveals resolve
  instantly, the counter is set to its final value, the mockup sits flat, and
  the hero's ambient animations are switched off.
- Continuous animations are gated behind a presence observer so off-screen
  sections cost nothing.
- No `backdrop-filter`, no large `filter: blur()`, no canvas, no page-wide
  blend modes. Roughly 1.3k DOM nodes in total.

## Content notice

All client names, archive entries, statuses, build identifiers and statistics
are invented for the fiction. They are not claims about anyone's code, and
nothing here implies a partnership, endorsement or affiliation with any real
project.
