define([
	'socketio',
	'collections/Dashboard/vacationDashboard',
	'custom'
], function(io, vacationDashboard, custom){
	var socket = io.connect();
	var fetch = _.debounce(fetchData, 500);


	socket.on('recollectVacationDash', fetch);

	function fetchData() {
		var dashCollection;

		dashCollection = new vacationDashboard();
		custom.cashToApp('dashboardVacation', dashCollection);

		return dashCollection;
	}

	App.socket = socket;
});
