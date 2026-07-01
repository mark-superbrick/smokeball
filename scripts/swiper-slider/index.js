
function initSwiperSlider() {  
  const swiperSliderGroups = document.querySelectorAll("[data-swiper-group]");
  
  swiperSliderGroups.forEach((swiperGroup) => {
    const swiperSliderWrap = swiperGroup.querySelector("[data-swiper-wrap]");
    if(!swiperSliderWrap) return;
    
    const prevButton = swiperGroup.querySelector("[data-swiper-prev]");
    const nextButton = swiperGroup.querySelector("[data-swiper-next]");
    
    const swiper = new Swiper(swiperSliderWrap, {
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
  initSwiperSlider();
});
