define([
    'Backbone',
    'Underscore',
    'jQuery',
    'socketio',
    'collections/Jobs/filterCollection',
    'collections/Invoices/filterCollection',
    'dataService',
    'custom'
], function (Backbone, _, $, io, JobsCollection, InvoiceCollection, dataService, custom) {
    'use strict';
    var socket = io.connect();
    var counterForOrdersProgress = 0;
    var counterForProductsProgress = 0;
    var counterForInvoicesProgress = 0;
    var counterForCustomersProgress = 0;
    var counterForCategoriesProgress = 0;
    var counterForInventoryProgress = 0;
    var eventsChannel = App.eventsChannel || _.extend({}, Backbone.Events);

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

        if (((fragment && fragment.indexOf('Persons') !== -1) && (idServer === personId)) && (currentUserIdServer !== currentUserId)) {
            App.render({type: 'notify', message: 'Data was updated. Please refresh browser.'});
        }

        if (((fragment && fragment.indexOf('Companies') !== -1) && (idServer === companyId)) && (currentUserIdServer !== currentUserId)) {
            App.render({type: 'notify', message: 'Data was updated. Please refresh browser.'});
        }

        // custom.removeFromCash('projectInfo');
    }

    function clearAllCashedData() {
        App.cashedData = {};
        App.storage.clear();
        App.filtersObject = {};

        App.render({type: 'notify', message: 'Cash was cleaned. Please refresh your browser.'});
    }

    function savedCategories(options) {
        var uId = options.uId;
        var $barCategories = $('#categoriesBar');
        var $statusCategoriesBar = $('#statusCategoriesBar');

        if (uId === App.currentUser._id) {
            if (options.count <= 1) {
                counterForCategoriesProgress = 0;
            }

            counterForCategoriesProgress += (100 / options.total);

            if (options.count === options.total) {
                counterForCategoriesProgress = 100;
            }

            $barCategories.width(counterForCategoriesProgress + '%');
            $statusCategoriesBar.html('<p>' + Math.floor(counterForCategoriesProgress) + '% ' + options.count + '/' + options.total + '</p>');
        }
    }

    function savedProduct(options) {
        var uId = options.uId;
        var $barProducts = $('#productsBar');
        var $statusProductsBar = $('#statusProductsBar');

        if (uId === App.currentUser._id) {
            if (options.count <= 1) {
                counterForProductsProgress = 0;
            }

            counterForProductsProgress += (100 / options.total);

            if (options.count === options.total) {
                counterForProductsProgress = 100;
            }

            $barProducts.width(counterForProductsProgress + '%');
            $statusProductsBar.html('<p>' + Math.floor(counterForProductsProgress) + '% ' + options.count + '/' + options.total + '</p>');
        }
    }

    function savedCustomers(options) {
        var uId = options.uId;
        var $barCustomers = $('#customersBar');
        var $statusCustomersBar = $('#statusCustomersBar');

        if (uId === App.currentUser._id) {
            if (options.count <= 1) {
                counterForCustomersProgress = 0;
            }

            counterForCustomersProgress += (100 / options.total);

            if (options.count === options.total) {
                counterForCustomersProgress = 100;
            }

            $barCustomers.width(counterForCustomersProgress + '%');
            $statusCustomersBar.html('<p>' + Math.floor(counterForCustomersProgress) + '% ' + options.count + '/' + options.total + '</p>');
        }
    }

    function savedOrders(options) {
        var uId = options.uId;
        var $barOrders = $('#ordersBar');
        var $statusOrdersBar = $('#statusOrdersBar');

        if (uId === App.currentUser._id) {
            if (options.count <= 1) {
                counterForOrdersProgress = 0;
            }

            counterForOrdersProgress += (100 / options.total);

            if (options.count === options.total) {
                counterForOrdersProgress = 100;
            }

            $barOrders.width(counterForOrdersProgress + '%');
            $statusOrdersBar.html('<p>' + Math.floor(counterForOrdersProgress) + '% ' + options.count + '/' + options.total + '</p>');
        }
    }

    function savedInvoices(options) {
        var uId = options.uId;
        var $barInvoices = $('#invoicesBar');
        var $statusInvoicesBar = $('#statusInvoicesBar');

        if (uId === App.currentUser._id) {

            if (options.count <= 1) {
                counterForInvoicesProgress = 0;
            }

            counterForInvoicesProgress += (100 / options.total);

            if (options.count === options.total) {
                counterForInvoicesProgress = 100;
            }

            $barInvoices.width(counterForInvoicesProgress + '%');
            $statusInvoicesBar.html('<p>' + Math.floor(counterForInvoicesProgress) + '% ' + options.count + '/' + options.total + '</p>');
        }
    }

    function savedInventory(options) {
        var uId = options.uId;
        var $barInventory = $('#inventoryBar');
        var $statusInventoryBar = $('#statusInventoryBar');

        if (uId === App.currentUser._id) {
            if (options.count <= 1) {
                counterForInventoryProgress = 0;
            }

            counterForInventoryProgress += (100 / options.total);

            if (options.count === options.total) {
                counterForInventoryProgress = 100;
            }

            $barInventory.width(counterForInventoryProgress + '%');
            $statusInventoryBar.html('<p>' + Math.floor(counterForInventoryProgress) + '% ' + options.count + '/' + options.total + '</p>');
        }
    }

    function notifyAboutGetAllIntegration(options) {
        var dbName = options.dbName;
        var fragment = Backbone.history.fragment;
        var url = 'integration/countOfConflictsAndImported';

        if (fragment && fragment.indexOf('integrations') !== -1 && App.currentDb === dbName /* && uId === App.currentUser._id */) {
            App.render({
                type   : 'notify',
                message: 'Inventory from eCommerce was synced'
            });

            dataService.getData(url, null, function (result) {
                if (result && !result.error) {
                    eventsChannel.trigger('retrievedInventoryCount', result);
                }
            });
        }

        return false;
    }

    function rerenderStats(options) {
        var dbName = options.dbName;
        var fragment = Backbone.history.fragment;
        var result = options.stats;

        if (fragment && fragment.indexOf('integrations') !== -1 && App.currentDb === dbName && result) {
            eventsChannel.trigger('retrievedInventoryCount', result);
        }

        return false;
    }

    function showResolveConflict(options) {
        if (App && App.currentUser && App.currentUser._id === options.uId) {
            eventsChannel.trigger('showResolveConflict');
        }
    }

    function showInfoDelete(options) {
        if (App && App.currentUser && App.currentUser._id === options.uId) {
            App.render({
                type   : 'notify',
                message: options.message
            });
        }
    }

    socket.on('recollectVacationDash', _.debounce(fetchData, 1000));
    socket.on('fetchJobsCollection', _.debounce(fetchJobs, 1000));
    socket.on('fetchInvoiceCollection', _.debounce(fetchInvoice, 1000));
    socket.on('sendMessage', _.debounce(sendMessage, 1000));
    socket.on('editModel', _.debounce(editModel, 1000));
    socket.on('clearAllCashedData', _.debounce(clearAllCashedData, 1000));
    socket.on('savedCategories', _.debounce(savedCategories, true));
    socket.on('savedProduct', _.debounce(savedProduct, true));
    socket.on('savedCustomers', _.debounce(savedCustomers, true));
    socket.on('savedOrders', _.debounce(savedOrders, true));
    socket.on('savedInvoices', _.debounce(savedInvoices, true));
    socket.on('savedInventory', _.debounce(savedInventory, true));
    socket.on('getAllDone', notifyAboutGetAllIntegration);
    socket.on('recollectedStats', rerenderStats);
    socket.on('showResolveConflict', showResolveConflict);
    socket.on('showInfoDelete', showInfoDelete);

    App.socket = socket;
});
