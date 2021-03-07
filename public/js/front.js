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

    loader();
});

function loader() {
    mouseAnim();
    setTimeout(() => {
        $(".loader").fadeOut();
    }, 4000);
    setTimeout(() => {
        $(".loader").addClass("hidden");
        $(".page1-container1").removeClass("hidden");
    }, 4001);
}

function mouseAnim() {
    var width = "100%",
        height = "100vh";

    var i = 0;

    var svg = d3.select(".loader").append("svg")
        .attr("width", width)
        .attr("height", height);

    svg.append("rect")
        .attr("width", width)
        .attr("height", height)
        .on("ontouchstart" in document ? "touchmove" : "mousemove", particle);

    function particle() {
        var m = d3.mouse(this);

        svg.insert("circle", "rect")
            .attr("cx", m[0])
            .attr("cy", m[1])
            .attr("r", 5) // 1e-6
            .style("stroke", d3.hsl(100, .1, .6))
            .style("stroke-opacity", 1)
            .transition()
            .duration(2000)
            .ease(Math.sqrt)
            .attr("r", 100)
            .style("stroke-opacity", 1e-6)
            .style("stroke-width", 100)
            .remove();

        d3.event.preventDefault();
    }
}