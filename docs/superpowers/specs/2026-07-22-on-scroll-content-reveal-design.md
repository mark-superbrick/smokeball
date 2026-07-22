# On-Scroll `content-reveal` Animation — Design

## Summary

Replace the current `scripts/on-scroll/index.js` (IntersectionObserver + CustomEvent dispatcher) with a GSAP ScrollTrigger reveal system. Elements fade in and slide up from `4rem` when they scroll into view. Two independent modes:

1. **Standalone** — any `[data-on-scroll="content-reveal"]` element is its own trigger and target; it reveals individually when it hits `top 80%`. No stagger.
2. **List batch** — a `[data-on-scroll-list]` that contains **no** `content-reveal` descendants reveals its **direct children** as one staggered group, triggered by the list.

The two modes are mutually exclusive per list: if a list has `content-reveal` descendants, those handle themselves (mode 1) and the list adds nothing.

## Markup Contract

- **Standalone target:** `[data-on-scroll="content-reveal"]` — reveals itself. Works anywhere on the page, inside or outside a list.
- **List wrapper:** `[data-on-scroll-list]` — a batch container. Only activates when it has **no** `[data-on-scroll="content-reveal"]` descendants; then its **direct children** (`list.children`) become the staggered reveal targets, with the list as the ScrollTrigger trigger.

## Behavior

- `gsap.registerPlugin(ScrollTrigger)` once at the top of `initOnScroll` (matches the `logo-marquee-vertical` convention; `gsap` and `ScrollTrigger` are globals provided by the Webflow site, not npm).
- **Mode 1 — standalone reveals.** For each `[data-on-scroll="content-reveal"]`:
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
- **Mode 2 — list batch (fallback).** For each `[data-on-scroll-list]`:
  - Idempotent init guard via `dataset.onScrollListInit === 'true'`.
  - If the list has any `[data-on-scroll="content-reveal"]` descendant, skip (those self-handle in mode 1).
  - Otherwise use its direct children (`list.children`). If empty, skip.
  - One tween, list is trigger, children stagger at 0.2s:
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
          trigger: list,
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
| Animation name | `content-reveal` (matched via `data-on-scroll` value) |
| Standalone selector | `[data-on-scroll="content-reveal"]` (self-triggered, no stagger) |
| List batch selector | `[data-on-scroll-list]` → `list.children` (list-triggered, staggered) |
| Delay | `0` |
| Duration | `0.7s` |
| Ease | `power1.out` |
| Stagger | `0.2s` (list batch mode only) |
| Opacity | `0` → `1` |
| Move Y | `4rem` → `0` |
| Trigger start | `top 80%` |
| Replay | play once, stay visible |

## Error Handling

Guard-clause style only, matching the codebase: skip elements/lists whose init guard is already set; skip lists that have `content-reveal` descendants (self-handled) or no direct children. No further handling.

## Testing

Manual verification via `npm run dev`:
1. **Standalone:** scroll a `[data-on-scroll="content-reveal"]` element into view — confirm it fades in and slides up from `4rem`, independently of siblings.
2. **List batch:** scroll a `[data-on-scroll-list]` with plain children (no `content-reveal`) into view — confirm children fade/slide in with a 0.2s stagger.
3. Scroll back up past the trigger in both cases — confirm elements stay visible (no reverse).
