define([
    'Backbone',
    'Underscore',
    'socketio',
    'collections/Jobs/filterCollection',
    'collections/Invoices/filterCollection',
    'custom'
], function (Backbone, _, io, JobsCollection, InvoiceCollection, custom) {
    'use strict';
    var socket = io.connect();

    function sendMessage(options) {
        var view = options.view;
        var dbName = options.dbName;
        var message = options.message;
        var fragment = Backbone.history.fragment;

        if (fragment && fragment.indexOf(view) !== -1 && App.currentDb === dbName) {
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
        var dbName = options.dbName;

        if (App.projectInfo && (options.project === App.projectInfo.projectId) && App.currentDb === dbName) {
            App.render({
                type   : 'notify',
                message: 'Project data updated.'
            });
        }

    }

    function fetchInvoice(options) {
        var dbName = options.dbName;

        if (App.projectInfo && (options.project === App.projectInfo.projectId) && App.currentDb === dbName) {
            App.render({
                type   : 'notify',
                message: 'Invoices data updated.'
            });
        }

    }

    function fetchData(dbName) {
        var fragment = Backbone.history.fragment;

        if (fragment && fragment.indexOf('DashBoardVacation') !== -1 && App.currentDb === dbName) {
            App.render({type: 'notify', message: 'Data was updated. Please refresh browser.'});
        }

        custom.removeFromCash('dashboardVacation');
    }

    function editPerson() {
        var fragment = Backbone.history.fragment;

        console.log('editPerson');

        if (fragment && fragment.indexOf('Persons') !== -1) {
            App.render({type: 'notify', message: 'Data was updated. Please refresh browser.'});
        }

        //custom.removeFromCash('projectInfo');
    }

    socket.on('recollectVacationDash', _.debounce(fetchData, 1000));
    socket.on('fetchJobsCollection', _.debounce(fetchJobs, 1000));
    socket.on('fetchInvoiceCollection', _.debounce(fetchInvoice, 1000));
    socket.on('sendMessage', _.debounce(sendMessage, 1000));
    socket.on('editPerson', _.debounce(editPerson, 1000));

    socket.emit('custom');

    App.socket = socket;
});
