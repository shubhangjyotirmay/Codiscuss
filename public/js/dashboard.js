const socket = io();

socket.on("dashboard", ({username, email}) => {
    $(".dashboard-user").text(`${username}`);
});