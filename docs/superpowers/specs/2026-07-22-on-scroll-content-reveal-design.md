# On-Scroll `content-reveal` Animation — Design

## Summary

Replace the current `scripts/on-scroll/index.js` (IntersectionObserver + CustomEvent dispatcher) with a GSAP ScrollTrigger stagger-reveal system. Children marked `data-on-scroll="content-reveal"` inside a `data-on-scroll-list` wrapper fade and slide up in sequence when their list scrolls into view.

## Markup Contract

- **List wrapper:** `[data-on-scroll-list]` — the ScrollTrigger trigger element.
- **Reveal targets:** `[data-on-scroll="content-reveal"]` — descendants of the list (any depth) that animate in.

## Behavior

- `gsap.registerPlugin(ScrollTrigger)` once at the top of `initOnScroll` (matches the `logo-marquee-vertical` convention; `gsap` and `ScrollTrigger` are globals provided by the Webflow site, not npm).
- For each `[data-on-scroll-list]`:
  - Idempotent init guard via `dataset.onScrollListInit === 'true'` (mirrors `logo-marquee-vertical`).
  - Query its `[data-on-scroll="content-reveal"]` descendants. If none, skip.
  - Run one tween:
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
- No cap on sibling count — all matched children stagger in sequence at 0.2s intervals.
- Play once and stay (`toggleActions: 'play none none none'` — no reverse on scroll up).
- Init on `DOMContentLoaded`, consistent with every other script in the repo.

## Animation Parameters

| Property | Value |
|---|---|
| Animation name | `content-reveal` (matched via `data-on-scroll` value) |
| Selector | `[data-on-scroll="content-reveal"]` |
| Delay | `0` |
| Duration | `0.7s` |
| Ease | `power1.out` |
| Stagger (sibling offset) | `0.2s` |
| Opacity | `0` → `1` |
| Move Y | `4rem` → `0` |
| Trigger start | `top 80%` |
| Replay | play once, stay visible |

## Error Handling

Guard-clause style only, matching the codebase: skip lists whose init guard is already set, and skip lists with zero matching children. No further handling.

## Testing

Manual verification via `npm run dev`:
1. Scroll a `[data-on-scroll-list]` block into view — confirm children fade in and slide up from `4rem` with a 0.2s stagger.
2. Scroll back up past the trigger — confirm children stay visible (no reverse).
