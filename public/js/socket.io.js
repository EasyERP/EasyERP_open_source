define([
    'Backbone',
    'Underscore',
    'socketio',
    'collections/Dashboard/vacationDashboard',
    'collections/Projects/projectInfoCollection',
    'collections/Jobs/filterCollection',
    'collections/Invoice/filterCollection',
    'custom'
], function (Backbone, _, io, VacationDashboard, ProjectCollection, JobsCollection, InvoiceCollection, custom) {
    'use strict';
    var socket = io.connect();
    var fetch = _.debounce(fetchData, 500);
    var fetchProjects = _.debounce(fetchProjects, 500);
    var fetchJobs = _.debounce(fetchJobs, 500);
    var fetchInvoice = _.debounce(fetchInvoice, 500);

    socket.on('recollectVacationDash', fetch);
    socket.on('recollectProjectInfo', fetchProjects);
    socket.on('fetchJobsCollection', fetchJobs);
    socket.on('fetchInvoiceCollection', fetchInvoice);

    socket.emit('custom');

    function fetchProjects() {
        var projectCollection;
        var fragment = Backbone.history.fragment;

        if (fragment && fragment.indexOf('projectDashboard') !== -1) {
            App.render({type: 'notify', message: "Data was updated. Please refresh browser."});
        }

        projectCollection = new ProjectCollection();
        custom.cacheToApp('projectInfo', projectCollection);

        return projectCollection;
    }

    function fetchJobs(options) {
        var jobsCollection;
        var projectId = options.project;
        var key = 'jobs_projectId:' + projectId;
        var collection = custom.retriveFromCash(key);

        var filter = {
            "project": {
                key  : "project._id",
                value: [projectId]
            }
        };

        if (collection && collection.length) {
            jobsCollection = new JobsCollection({
                viewType : 'list',
                filter   : filter,
                count    : 50,
                projectId: projectId,
                bySocket : true
            });
        }

        return jobsCollection;
    }

    function fetchInvoice(options) {
        var invoiceCollection;

        var filter = {
            'project': {
                key  : 'project._id',
                value: [options.project]
            }
        };

        invoiceCollection = new InvoiceCollection({
            viewType: 'list',
            filter  : filter,
            count   : 50
        });

        return invoiceCollection;
    }

    function fetchData() {
        var fragment = Backbone.history.fragment;
        var filter = custom.retriveFromCash('DashVacation.filter') || {};
        var dashCollection;

        function notifyAndCache() {
            if (fragment && fragment.indexOf('DashBoardVacation') !== -1) {
                App.render({type: 'notify', message: "Data was updated. Please refresh browser."});
            }

            custom.cacheToApp('dashboardVacation', dashCollection);

            return dashCollection;
        }

        dashCollection = new VacationDashboard({filter: filter});
        dashCollection.on('reset', notifyAndCache, dashCollection);
    }

    App.socket = socket;
});
