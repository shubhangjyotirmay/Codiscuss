$(document).ready(function () {
    let bigDiv = document.querySelector(".big_div");
    let diff_height = -100;
    let diff_const = 0;
    window.setInterval(() => {
        bigDiv.style.transform = `translateY(${diff_height}px)`;
        diff_height -= (100 + diff_const);
        if (diff_height < -320) {
            diff_height = 0;
            diff_const = 0;
        }
    }, 3000);

    var swiper = new Swiper('.swiper-container', {
        effect: 'coverflow',
        grabCursor: false,
        centeredSlides: true,
        observer: true,
        observeParents: true,
        loop: true,
        autoplay: {
            delay: 4000,
            disableOnInteraction: false
        },
        slidesPerView: 4,
        coverflowEffect: {
            rotate: 50,
            stretch: 0,
            depth: 100,
            modifier: 1,
            slideShadows: true,
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        pagination: {
            el: '.swiper-pagination',
        },
    });
});