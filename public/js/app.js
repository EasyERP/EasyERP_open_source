// Filename: app.js
define([
    'jQuery',
    'router',
    'communication',
    'custom',
    'socket.io',
    'helpers/eventsBinder',
    'services/applyDefaults'
], function ($, Router, Communication, Custom, io, eventsBinder, defaults) {
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

        eventsBinder.subscribeWindow();
        defaults.applyDefaults();
    };

    return {
        initialize: initialize
    };
});
