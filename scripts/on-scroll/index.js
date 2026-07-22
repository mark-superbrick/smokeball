function initOnScroll() {
  gsap.registerPlugin(ScrollTrigger);

  document.querySelectorAll('[data-on-scroll="reveal"]').forEach((el) => {
    if (el.dataset.onScrollInit === 'true') return;
    el.dataset.onScrollInit = 'true';

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
  });

  document.querySelectorAll('[data-on-scroll="stagger-reveal"]').forEach((el) => {
    if (el.dataset.onScrollInit === 'true') return;
    el.dataset.onScrollInit = 'true';

    const children = el.children;
    if (!children.length) return;

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
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initOnScroll();
});
