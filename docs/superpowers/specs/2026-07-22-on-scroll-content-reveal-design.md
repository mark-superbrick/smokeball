# On-Scroll Reveal Animation — Design

## Summary

Replace the current `scripts/on-scroll/index.js` (IntersectionObserver + CustomEvent dispatcher) with a GSAP ScrollTrigger reveal system. Elements fade in and slide up from `4rem` when they scroll into view. Two independent modes, both driven by the `data-on-scroll` attribute:

1. **Reveal** (`data-on-scroll="reveal"`) — the element is its own trigger and target; it reveals individually when it hits `top 80%`. No stagger.
2. **Stagger reveal** (`data-on-scroll="stagger-reveal"`) — the element is a batch container; its **direct children** reveal as one staggered group, triggered by the container.

## Markup Contract

- **Reveal target:** `[data-on-scroll="reveal"]` — reveals itself. Works anywhere on the page.
- **Stagger-reveal container:** `[data-on-scroll="stagger-reveal"]` — its **direct children** (`el.children`) become the staggered reveal targets, with the container as the ScrollTrigger trigger.

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
- Both modes play once and stay (`toggleActions: 'play none none none'` — no reverse on scroll up).
- Init on `DOMContentLoaded`, consistent with every other script in the repo.

## Animation Parameters

| Property | Value |
|---|---|
| Reveal selector | `[data-on-scroll="reveal"]` (self-triggered, no stagger) |
| Stagger-reveal selector | `[data-on-scroll="stagger-reveal"]` → `el.children` (container-triggered, staggered) |
| Delay | `0` |
| Duration | `0.7s` |
| Ease | `power1.out` |
| Stagger | `0.2s` (stagger-reveal mode only) |
| Opacity | `0` → `1` |
| Move Y | `4rem` → `0` |
| Trigger start | `top 80%` |
| Replay | play once, stay visible |

## Error Handling

Guard-clause style only, matching the codebase: skip elements whose init guard is already set; skip stagger-reveal containers with no direct children. No further handling.

## Testing

Manual verification via `npm run dev`:
1. **Reveal:** scroll a `[data-on-scroll="reveal"]` element into view — confirm it fades in and slides up from `4rem`, independently of siblings.
2. **Stagger reveal:** scroll a `[data-on-scroll="stagger-reveal"]` container into view — confirm its direct children fade/slide in with a 0.2s stagger.
3. Scroll back up past the trigger in both cases — confirm elements stay visible (no reverse).
