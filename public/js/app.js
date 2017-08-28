// Filename: app.js
define([
    'Backbone',
    'jQuery',
    'router',
    'communication',
    'custom',
    'socket.io',
    'helpers/eventsBinder',
    'services/applyDefaults',
    'helpers/ga'
], function (Backbone,$, Router, Communication, Custom, io, eventsBinder, defaults, ga) {
    var initialize = function () {
        'use strict';
        var appRouter = new Router();

        App.preloaderShowFlag = false;

        appRouter.checkLogin = Communication.checkLogin;
        Communication.checkLogin(Custom.runApplication);

        App.startPreload = function () {
            App.preloaderShowFlag = true;
            $('#loading').show();
        };

        App.stopPreload = function () {
            App.preloaderShowFlag = false;
            $('#loading').hide();
        };

        ga && ga.create();

        eventsBinder.subscribeWindow();
        defaults.applyDefaults();
    };

    return {
        initialize: initialize
    };
});
