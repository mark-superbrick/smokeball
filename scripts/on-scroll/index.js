function initOnScroll() {
  gsap.registerPlugin(ScrollTrigger);

  const numAttr = (el, key, fallback) => {
    const raw = el.dataset[key];
    if (raw === undefined) return fallback;
    const parsed = parseFloat(raw);
    return Number.isNaN(parsed) ? fallback : parsed;
  };

  const strAttr = (el, key, fallback) => {
    const raw = el.dataset[key];
    return raw === undefined || raw === '' ? fallback : raw;
  };

  const baseVars = (trigger, startDefault = 'top 80%') => ({
    duration: numAttr(trigger, 'onScrollDuration', 0.7),
    delay: numAttr(trigger, 'onScrollDelay', 0),
    ease: strAttr(trigger, 'onScrollEase', 'power1.out'),
    scrollTrigger: {
      trigger,
      start: strAttr(trigger, 'onScrollStart', startDefault),
      toggleActions: strAttr(trigger, 'onScrollToggleActions', 'play none none none'),
    },
  });

  const revealTween = (targets, trigger, useStagger) => {
    const to = { opacity: 1, y: 0, ...baseVars(trigger) };
    if (useStagger) to.stagger = numAttr(trigger, 'onScrollStagger', 0.2);

    gsap.fromTo(targets, { opacity: 0, y: strAttr(trigger, 'onScrollY', '4rem') }, to);
  };

  document.querySelectorAll('[data-on-scroll="reveal"]').forEach((el) => {
    if (el.dataset.onScrollInit === 'true') return;
    el.dataset.onScrollInit = 'true';

    revealTween(el, el, false);
  });

  document.querySelectorAll('[data-on-scroll="stagger-reveal"]').forEach((el) => {
    if (el.dataset.onScrollInit === 'true') return;
    el.dataset.onScrollInit = 'true';

    if (!el.children.length) return;

    revealTween(el.children, el, true);
  });

  document.querySelectorAll('[data-on-scroll="image-reveal"]').forEach((el) => {
    if (el.dataset.onScrollInit === 'true') return;
    el.dataset.onScrollInit = 'true';

    const images = el.querySelectorAll('img');
    if (!images.length) return;

    gsap.fromTo(
      images,
      {
        scale: numAttr(el, 'onScrollScale', 1.2),
        filter: `blur(${strAttr(el, 'onScrollBlur', '2rem')})`,
      },
      { scale: 1, filter: 'blur(0rem)', ...baseVars(el, 'top bottom') }
    );
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initOnScroll();
});
