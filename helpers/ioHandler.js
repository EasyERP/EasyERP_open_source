module.exports = function (io) {
	"use strict";

	io.on('connection', function (socket) {
		console.log('----socket connected-----');

		socket.on('disconnect', function () {
			console.log('disconnect');
		});

		socket.on('custom', function () {
			console.log('-------- custom ------');
		});
	});
};
