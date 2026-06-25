function initLogoVerticalScroll() {
  const logoVerticalScrolls = document.querySelectorAll('[data-logo-vertical-scroll-wrap]');
  const logoLeftColumn = document.querySelectorAll('[data-logo-vertical-scroll-left]');
  const logoRightColumn = document.querySelectorAll('[data-logo-vertical-scroll-right]');
  
  logoVerticalScrolls.forEach(logoVerticalScroll => {
    logoVerticalScroll.querySelector('[data-logo-vertical-scroll-left]').forEach(list => {
      
    });
  });

}

// Initialize CSS Marquee
document.addEventListener('DOMContentLoaded', function() {
  initLogoVerticalScroll();
});
