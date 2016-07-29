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

    function editModel(data) {
        var fragment = Backbone.history.fragment;

        var personId = App.currentPerson;
        var companyId = App.currentCompany;

        var idServer = data.id;

        var currentUserId = App.currentUser._id;
        var currentUserIdServer = data.currentUser;

        if (((fragment && fragment.indexOf('Persons') !== -1) && (idServer === personId)) && (currentUserIdServer !== currentUserId))  {
                App.render({type: 'notify', message: 'Data was updated. Please refresh browser.'});
        }

        if (((fragment && fragment.indexOf('Companies') !== -1) && (idServer === companyId)) && (currentUserIdServer !== currentUserId))  {
            App.render({type: 'notify', message: 'Data was updated. Please refresh browser.'});
        }

        //custom.removeFromCash('projectInfo');
    }

    function clearAllCashedData () {

        App.cashedData = {};
        App.storage.clear();
        App.filtersObject = {};

        App.render({type: 'notify', message: 'Cash was cleaned. Please refresh your browser.'});
    }

    socket.on('recollectVacationDash', _.debounce(fetchData, 1000));
    socket.on('fetchJobsCollection', _.debounce(fetchJobs, 1000));
    socket.on('fetchInvoiceCollection', _.debounce(fetchInvoice, 1000));
    socket.on('sendMessage', _.debounce(sendMessage, 1000));
    socket.on('editModel', _.debounce(editModel, 1000));
    socket.on('clearAllCashedData', _.debounce(clearAllCashedData, 1000));

    socket.emit('custom');

    App.socket = socket;
});
