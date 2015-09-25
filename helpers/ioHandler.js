module.exports = function (io) {
	io.sockets.on('connection', function (socket) {
		console.log('----socket connected-----');

		socket.on('disconnect', function () {
			console.log('disconnect');
		});
	});
};
