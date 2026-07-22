
function initTestimonialSlider() {  
  const swiperSliderGroups = document.querySelectorAll("[data-swiper-group='testimonial-slider']");
  
  swiperSliderGroups.forEach((swiperGroup) => {
    const swiperSliderWrap = swiperGroup.querySelector("[data-swiper-wrap='testimonial-slider']");
    if(!swiperSliderWrap) return;
    if (swiperGroup.hasAttribute('data-swiper-initialized')) return;
    swiperGroup.setAttribute('data-swiper-initialized', '');

    const prevButton = swiperGroup.querySelector("[data-swiper-prev='testimonial-slider']");
    const nextButton = swiperGroup.querySelector("[data-swiper-next='testimonial-slider']");

    const dsWrapper = 'smokeball-design-system--swiper-wrapper';
    const dsSlide = 'smokeball-design-system--swiper-slide';
    const wrapperClass = swiperSliderWrap.querySelector('.' + dsWrapper) ? dsWrapper : 'swiper-wrapper';
    const slideClass = swiperSliderWrap.querySelector('.' + dsSlide) ? dsSlide : 'swiper-slide';

    const swiper = new Swiper(swiperSliderWrap, {
      wrapperClass,
      slideClass,
      slidesPerView: 1,
      speed: 600,
      // mousewheel: true,
      grabCursor: true,
      // breakpoints: {
      //   // when window width is >= 480px
      //   480: {
      //     slidesPerView: 1.8,
      //   },
      //   // when window width is >= 992px
      //   992: {
      //     slidesPerView: 3.5,
      //   }
      // },
      navigation: {
        nextEl: nextButton,
        prevEl: prevButton,
      },
      pagination: {
        el: swiperGroup.querySelector('.swiper-pagination'),
        type: 'bullets',
        clickable: true
      },    
      keyboard: {
        enabled: true,
        onlyInViewport: false,
      },      
    });    
    
  });
}

// Initialize Swiper Slider Setup
document.addEventListener('DOMContentLoaded', () => {
  initTestimonialSlider();
});
