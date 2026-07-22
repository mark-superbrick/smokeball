function initOnScroll() {
  document.querySelectorAll('[data-on-scroll]').forEach((el) => {
    if (el.hasAttribute('data-on-scroll-initialized')) return;
    el.setAttribute('data-on-scroll-initialized', '');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const eventName = el.getAttribute('data-on-scroll');
          const eventDetail = { element: el };
          const customEvent = new CustomEvent(eventName, { detail: eventDetail });
          el.dispatchEvent(customEvent);
        }
      });
    });
    observer.observe(el);
  });
}

// Initialize Enter on Scroll functionality when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
  initOnScroll();
});