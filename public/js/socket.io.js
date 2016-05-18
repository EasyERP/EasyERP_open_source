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

    socket.on('recollectVacationDash', _.debounce(fetchData, 1000));
    socket.on('recollectProjectInfo', _.debounce(fetchProjects, 1000));
    socket.on('fetchJobsCollection', _.debounce(fetchJobs, 1000));
    socket.on('fetchInvoiceCollection', _.debounce(fetchInvoice, 1000));
    socket.on('sendMessage', _.debounce(sendMessage, 1000));

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

        if (options.project === App.projectInfo.projectId) {
            App.render({
                type: 'notify',
                message: 'Project data updated.'
            });
        }

    }

    function fetchInvoice(options) {

        if (options.project === App.projectInfo.projectId) {
            App.render({
                type: 'notify',
                message: 'Invoices data updated.'
            });
        }

    }

    function fetchData() {
        var fragment = Backbone.history.fragment;

        if (fragment && fragment.indexOf('DashBoardVacation') !== -1) {
            App.render({type: 'notify', message: 'Data was updated. Please refresh browser.'});
        }

        custom.removeFromCash('dashboardVacation');
    }

    socket.emit('custom');

    App.socket = socket;
});
