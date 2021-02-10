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
});