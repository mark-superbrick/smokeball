# On-Scroll Reveal Animation — Design

## Summary

Replace the current `scripts/on-scroll/index.js` (IntersectionObserver + CustomEvent dispatcher) with a GSAP ScrollTrigger reveal system. Elements fade in and slide up from `4rem` when they scroll into view. Three independent modes, all driven by the `data-on-scroll` attribute:

1. **Reveal** (`data-on-scroll="reveal"`) — the element is its own trigger and target; it reveals individually when it hits `top 80%`. No stagger.
2. **Stagger reveal** (`data-on-scroll="stagger-reveal"`) — the element is a batch container; its **direct children** reveal as one staggered group, triggered by the container.
3. **Image reveal** (`data-on-scroll="image-reveal"`) — the element is a wrapper/trigger; its `<img>` descendants animate from `scale 1.2` + `blur 2rem` to `scale 1` + `blur 0`. No opacity/y, no stagger; shares the reveal tuning params.

## Markup Contract

- **Reveal target:** `[data-on-scroll="reveal"]` — reveals itself. Works anywhere on the page.
- **Stagger-reveal container:** `[data-on-scroll="stagger-reveal"]` — its **direct children** (`el.children`) become the staggered reveal targets, with the container as the ScrollTrigger trigger.
- **Image-reveal wrapper:** `[data-on-scroll="image-reveal"]` — all `<img>` descendants (`el.querySelectorAll('img')`) become the animated targets, with the wrapper as the ScrollTrigger trigger.

## Behavior

- `gsap.registerPlugin(ScrollTrigger)` once at the top of `initOnScroll` (matches the `logo-marquee-vertical` convention; `gsap` and `ScrollTrigger` are globals provided by the Webflow site, not npm).
- **Mode 1 — reveal.** For each `[data-on-scroll="reveal"]`:
  - Idempotent init guard via `dataset.onScrollInit === 'true'`.
  - One tween, element is both trigger and target, no stagger:
    ```js
    gsap.fromTo(
      el,
      { opacity: 0, y: '4rem' },
      {
        opacity: 1,
        y: 0,
        duration: 0.7,
        delay: 0,
        ease: 'power1.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
      }
    );
    ```
- **Mode 2 — stagger reveal.** For each `[data-on-scroll="stagger-reveal"]`:
  - Idempotent init guard via `dataset.onScrollInit === 'true'`.
  - Targets are its direct children (`el.children`). If empty, skip.
  - One tween, container is trigger, children stagger at 0.2s:
    ```js
    gsap.fromTo(
      children,
      { opacity: 0, y: '4rem' },
      {
        opacity: 1,
        y: 0,
        duration: 0.7,
        delay: 0,
        ease: 'power1.out',
        stagger: 0.2,
        scrollTrigger: {
          trigger: el,
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
      }
    );
    ```
  - No cap on child count — all direct children stagger in sequence.
- **Mode 3 — image reveal.** For each `[data-on-scroll="image-reveal"]`:
  - Idempotent init guard via `dataset.onScrollInit === 'true'`.
  - Targets are all `<img>` descendants (`el.querySelectorAll('img')`). If none, skip.
  - One tween, wrapper is trigger, no stagger:
    ```js
    gsap.fromTo(
      images,
      { scale: 1.2, filter: 'blur(2rem)' },
      {
        scale: 1,
        filter: 'blur(0rem)',
        duration: 0.7,
        delay: 0,
        ease: 'power1.out',
        scrollTrigger: {
          trigger: el,
          start: 'top bottom',
          toggleActions: 'play none none none',
        },
      }
    );
    ```
- All modes play once and stay (`toggleActions: 'play none none none'` — no reverse on scroll up).
- Init on `DOMContentLoaded`, consistent with every other script in the repo.

## Animation Parameters

| Property | Value |
|---|---|
| Reveal selector | `[data-on-scroll="reveal"]` (self-triggered, no stagger) |
| Stagger-reveal selector | `[data-on-scroll="stagger-reveal"]` → `el.children` (container-triggered, staggered) |
| Image-reveal selector | `[data-on-scroll="image-reveal"]` → `img` descendants (wrapper-triggered, scale + blur) |
| Delay | `0` |
| Duration | `0.7s` |
| Ease | `power1.out` |
| Stagger | `0.2s` (stagger-reveal mode only) |
| Opacity | `0` → `1` (reveal / stagger-reveal) |
| Move Y | `4rem` → `0` (reveal / stagger-reveal) |
| Scale | `1.2` → `1` (image-reveal) |
| Blur | `2rem` → `0` (image-reveal) |
| Trigger start | `top 80%` (reveal / stagger-reveal); `top bottom` (image-reveal) |
| Replay | play once, stay visible |

## Customization Attributes

Every value above is overridable per element via a `data-on-scroll-<param>` attribute placed on the same element that carries `data-on-scroll`. A missing or unparseable attribute falls back to the default. Numeric attributes are parsed with `parseFloat` (fallback on `NaN`); string attributes are used verbatim (fallback when absent or empty).

| Attribute | Type | Default | Notes |
|---|---|---|---|
| `data-on-scroll-duration` | number (s) | `0.7` | |
| `data-on-scroll-delay` | number (s) | `0` | |
| `data-on-scroll-ease` | string | `power1.out` | any GSAP ease string |
| `data-on-scroll-stagger` | number (s) | `0.2` | stagger-reveal mode only |
| `data-on-scroll-y` | string | `4rem` | move distance, any CSS unit (reveal / stagger-reveal) |
| `data-on-scroll-scale` | number | `1.2` | starting scale (image-reveal only) |
| `data-on-scroll-blur` | string | `2rem` | starting blur, any CSS unit (image-reveal only) |
| `data-on-scroll-start` | string | `top 80%` (`top bottom` for image-reveal) | ScrollTrigger `start` |
| `data-on-scroll-toggle-actions` | string | `play none none none` | ScrollTrigger `toggleActions` |

All attributes are read from the element carrying `data-on-scroll` (the trigger element in all modes).

## Error Handling

Guard-clause style only, matching the codebase: skip elements whose init guard is already set; skip stagger-reveal containers with no direct children and image-reveal wrappers with no `<img>` descendants. No further handling.

## Testing

Manual verification via `npm run dev`:
1. **Reveal:** scroll a `[data-on-scroll="reveal"]` element into view — confirm it fades in and slides up from `4rem`, independently of siblings.
2. **Stagger reveal:** scroll a `[data-on-scroll="stagger-reveal"]` container into view — confirm its direct children fade/slide in with a 0.2s stagger.
3. **Image reveal:** scroll a `[data-on-scroll="image-reveal"]` wrapper into view — confirm its `<img>` descendants scale down from `1.2` and un-blur from `2rem`.
4. Scroll back up past the trigger in all cases — confirm elements stay visible (no reverse).
