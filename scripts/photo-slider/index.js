function initPhotoSlider() {
  const photoSliderGroups = document.querySelectorAll("[data-swiper-group='photo-slider']");

  photoSliderGroups.forEach((swiperGroup) => {
    const swiperSliderWrap = swiperGroup.querySelector("[data-swiper-wrap='photo-slider']");
    if(!swiperSliderWrap) return;
    if (swiperGroup.hasAttribute('data-swiper-initialized')) return;
    swiperGroup.setAttribute('data-swiper-initialized', '');

    // const prevButton = swiperGroup.querySelector("[data-swiper-prev]");
    // const nextButton = swiperGroup.querySelector("[data-swiper-next]");

    const dsWrapper = 'smokeball-design-system--swiper-wrapper';
    const dsSlide = 'smokeball-design-system--swiper-slide';
    const wrapperClass = swiperSliderWrap.querySelector('.' + dsWrapper) ? dsWrapper : 'swiper-wrapper';
    const slideClass = swiperSliderWrap.querySelector('.' + dsSlide) ? dsSlide : 'swiper-slide';

    const swiper = new Swiper(swiperSliderWrap, {
      wrapperClass,
      slideClass,
      slidesPerView: 4,
      speed: 600,
      // mousewheel: true,
      grabCursor: true,
      autoplay: {
        delay: 3000,
        disableOnInteraction: false,
      },
      breakpoints: {
        480: {
          slidesPerView: 2,
        },
        768: {
          slidesPerView: 3,
        },
        1440: {
          slidesPerView: 4,
        },
        1920: {
          slidesPerView: 5,
        },
      },
      // navigation: {
      //   nextEl: nextButton,
      //   prevEl: prevButton,
      // },
      // pagination: {
      //   el: swiperGroup.querySelector('.swiper-pagination'),
      //   type: 'bullets',
      //   clickable: true
      // },
      // keyboard: {
      //   enabled: true,
      //   onlyInViewport: false,
      // },
    });

  });
}

// Initialize Swiper Slider Setup
document.addEventListener('DOMContentLoaded', () => {
  initPhotoSlider();
});
