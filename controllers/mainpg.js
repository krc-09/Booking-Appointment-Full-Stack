
exports.gethomePage = (request, response, next) => {
    response.sendFile('home.html', { root: 'public/views' });
}