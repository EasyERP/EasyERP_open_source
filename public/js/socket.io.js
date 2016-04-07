define([
    'Backbone',
    'Underscore',
    'socketio',
    'collections/Jobs/filterCollection',
    'collections/Invoice/filterCollection',
    'custom'
], function (Backbone, _, io, JobsCollection, InvoiceCollection, custom) {
    'use strict';
    var socket = io.connect();
    var fetch = _.debounce(fetchData, 500);
    var fetchProjects = _.debounce(fetchProjects, 500);
    var fetchJobs = _.debounce(fetchJobs, 500);
    var fetchInvoice = _.debounce(fetchInvoice, 500);
    var sendMessage = _.debounce(sendMessage, 500);

    socket.on('recollectVacationDash', fetch);
    socket.on('recollectProjectInfo', fetchProjects);
    socket.on('fetchJobsCollection', fetchJobs);
    socket.on('fetchInvoiceCollection', fetchInvoice);
    socket.on('sendMessage', sendMessage);

    function sendMessage(options){
        var view = options.view;
        var message = options.message;
        var fragment = Backbone.history.fragment;

        if (fragment && fragment.indexOf(view) !== -1) {
            App.render({type: 'notify', message: message});
        }

        return false;
    }

    function fetchProjects() {
        var fragment = Backbone.history.fragment;

        if (fragment && fragment.indexOf('projectDashboard') !== -1) {
            App.render({type: 'notify', message: 'Data was updated. Please refresh browser.'});
        }

        custom.removeFromCash('projectInfo');
    }

    function fetchJobs(options) {
        var jobsCollection;
        var projectId = options.project;
        var key = 'jobs_projectId:' + projectId;
        var collection = custom.retriveFromCash(key);

        var filter = {
            project: {
                key  : 'project._id',
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
            project: {
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

        if (fragment && fragment.indexOf('DashBoardVacation') !== -1) {
            App.render({type: 'notify', message: 'Data was updated. Please refresh browser.'});
        }

        custom.removeFromCash('dashboardVacation');
    }

    fetch = _.debounce(fetchData, 500);
    fetchProjects = _.debounce(fetchProjects, 500);
    fetchJobs = _.debounce(fetchJobs, 500);
    fetchInvoice = _.debounce(fetchInvoice, 500);

    socket.on('recollectVacationDash', fetch);
    socket.on('recollectProjectInfo', fetchProjects);
    socket.on('fetchJobsCollection', fetchJobs);
    socket.on('fetchInvoiceCollection', fetchInvoice);

    socket.emit('custom');

    App.socket = socket;
});
