define([
	'socketio',
	'collections/Dashboard/vacationDashboard',
	'collections/Projects/projectInfoCollection',
	'custom'
], function (io, VacationDashboard, ProjectCollection, custom) {
	'use strict';
	var socket = io.connect();
	var fetch = _.debounce(fetchData, 500);
	var fetchProjects = _.debounce(fetchProjects, 500);

	socket.on('recollectVacationDash', fetch);
	socket.on('recollectProjectInfo', fetchProjects);

	function fetchProjects(){
		var projectCollection;
		var fragment = Backbone.history.fragment;

		if (fragment && fragment.indexOf('projectDashboard') !== -1) {
			App.render({type: 'notify', message: "Data was updated. Please refresh browser."});
		}

		projectCollection = new ProjectCollection();
		custom.cashToApp('projectInfo', projectCollection);

		return projectCollection;
	}

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
