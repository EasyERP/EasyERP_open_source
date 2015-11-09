define([
	'socketio',
	'collections/Dashboard/vacationDashboard',
	'collections/Projects/projectInfoCollection',
	'collections/Jobs/filterCollection',
	'custom'
], function (io, VacationDashboard, ProjectCollection, JobsCollection, custom) {
	'use strict';
	var socket = io.connect();
	var fetch = _.debounce(fetchData, 500);
	var fetchProjects = _.debounce(fetchProjects, 500);
	var fetchJobs = _.debounce(fetchJobs, 500);

	socket.on('recollectVacationDash', fetch);
	socket.on('recollectProjectInfo', fetchProjects);
	socket.on('fetchJobsCollection', fetchJobs);

	function fetchProjects(){
		var projectCollection;
		var fragment = Backbone.history.fragment;

		if (fragment && fragment.indexOf('projectDashboard') !== -1) {
			App.render({type: 'notify', message: "Data was updated. Please refresh browser."});
		}

		projectCollection = new ProjectCollection();
		custom.cacheToApp('projectInfo', projectCollection);

		return projectCollection;
	}

	function fetchJobs(options){
		var jobsCollection;
		var fragment = Backbone.history.fragment;

		//if (fragment && fragment.indexOf('Project') !== -1) {
		//	App.render({type: 'notify', message: "Data was updated. Please refresh browser."});
		//}

		var filter = {
			"project": {
				key: "project",
				value: [options.project]
			}
		};

		jobsCollection = new JobsCollection({
			viewType: 'list',
			filter: filter,
			count: 50
		});

		return jobsCollection;
	}

	function fetchData() {
		var dashCollection;
		var fragment = Backbone.history.fragment;

		if (fragment && fragment.indexOf('DashBoardVacation') !== -1) {
			App.render({type: 'notify', message: "Data was updated. Please refresh browser."});
		}

		dashCollection = new VacationDashboard();
		custom.cacheToApp('dashboardVacation', dashCollection);

		return dashCollection;
	}

	App.socket = socket;
});
