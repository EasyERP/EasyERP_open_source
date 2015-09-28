define([
	'socketio',
	'collections/Dashboard/vacationDashboard',
	'custom'
], function (io, VacationDashboard, custom) {
	'use strict';
	var socket = io.connect();
	var fetch = _.debounce(fetchData, 500);

	socket.on('recollectVacationDash', fetch);

	function fetchData() {
		var dashCollection;
		var fragment = Backbone.history.fragment;

		if (fragment && fragment.indexOf('DashBoardVacation') !== -1) {
			App.render({type: 'notify', message: "Data was updated. Please refresh browser."});
		}

		dashCollection = new VacationDashboard();
		custom.cashToApp('dashboardVacation', dashCollection);

		return dashCollection;
	}

	App.socket = socket;
});
