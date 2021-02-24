$(document).ready(function () {
    $(".verification-button").click(function (e) {
        alert("Code Sent!");
        e.preventDefault();
        $.ajax({
            global: false,
            type: 'POST',
            url: "/verification",
            dataType: 'html',
            data: {
                email: $("#email-input").val(),
            },
            success: function (result) {
                console.log(result);
            },
            error: function (request, status, error) {
                serviceError();
            }
        });
    })

});