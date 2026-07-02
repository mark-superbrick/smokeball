// Note: The Javascript is optional. Read the documentation below how to use the CSS Only version.

function initCSSMarquee() {
  const pixelsPerSecond = 75; // Set the marquee speed (pixels per second)
  const marquees = document.querySelectorAll('[data-css-marquee]');
  
  // Duplicate the items inside each [data-css-marquee-list] so it can loop seamlessly
  marquees.forEach(marquee => {
    marquee.querySelectorAll('[data-css-marquee-list]').forEach(list => {
      if (list.dataset.marqueeReady) return;
      [...list.children].forEach(item => list.appendChild(item.cloneNode(true)));
      list.dataset.marqueeReady = 'true';
    });
  });

  // Create an IntersectionObserver to check if the marquee container is in view
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      entry.target.querySelectorAll('[data-css-marquee-list]').forEach(list => 
        list.style.animationPlayState = entry.isIntersecting ? 'running' : 'paused'
      );
    });
  }, { threshold: 0 });
  
  // Calculate the width and set the animation duration accordingly
  const applyDurations = () => {
    marquees.forEach(marquee => {
      marquee.querySelectorAll('[data-css-marquee-list]').forEach(list => {
        const speed = parseFloat(list.dataset.marqueeSpeed) || pixelsPerSecond;
        list.style.animationDuration = (list.offsetWidth / 2 / speed) + 's';
      });
    });
  };

  marquees.forEach(marquee => {
    marquee.querySelectorAll('[data-css-marquee-list]').forEach(list => {
      list.style.animationPlayState = 'paused';
    });
    observer.observe(marquee);
  });
  applyDurations();

  let lastWidth = window.innerWidth;
  let resizeTimer;
  window.addEventListener('resize', () => {
    if (window.innerWidth === lastWidth) return;
    lastWidth = window.innerWidth;
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(applyDurations, 250);
  });
}

// Initialize CSS Marquee
document.addEventListener('DOMContentLoaded', function() {
  initCSSMarquee();
});