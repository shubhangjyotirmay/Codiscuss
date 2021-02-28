function getUserDashboard(username, email) {
    const user = {username, email};
    return user;
}

module.exports = {
    getUserDashboard,
};