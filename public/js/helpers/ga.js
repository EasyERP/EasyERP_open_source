define([
    'Backbone',
    'constants/googleAnalytics'
], function (Backbone, GA) {
    'use strict';

    var create = function (callback) {
        if (!callback || typeof callback !== 'function') {
            callback = function () {
            };
        }

        ga('create', GA.TRACKING_ID, 'auto');

        callback();
    };

    var send = function (page, callback) {
        if (!callback || typeof callback !== 'function') {
            callback = function () {
            };
        }

        ga('send', {
            hitType: 'pageview',
            page   : page
        });

        callback();
    };

    var set = function (param, value, callback) {
        if (!callback || typeof callback !== 'function') {
            callback = function () {
            };
        }

        ga('set', param, value);

        callback();
    };

    var event = function (options, callback) {
        var eventCategory;
        var eventAction;
        var eventLabel;
        var eventValue;
        var fieldsObject;

        if (typeof options === 'function') {
            callback = options;
            options = {};
        }

        if (!callback || typeof callback !== 'function') {
            callback = function () {
            };
        }

        eventCategory = options.eventCategory || 'Default Category';
        eventAction = options.eventAction || Backbone.history.fragment;
        eventLabel = options.eventLabel || 'Default Label';
        eventValue = options.eventValue || 0;
        fieldsObject = options.fieldsObject || {};

        ga('send', 'event', eventCategory, eventAction, eventLabel, eventValue, fieldsObject);

        callback();
    };

    var trackingEditConfirm = function (option) {
        var label = GA.EVENT_LABEL.SAVE_CHANGES;

        if (option && typeof option === 'string') {
            label += ' ' + option;
        }
        event({
            eventCategory: GA.EVENT_CATEGORIES.USER_ACTION,
            eventLabel   : label
        }, function () {

        });
    };

    var trackingEditCancel = function (option) {
        var label = GA.EVENT_LABEL.CANCEL_CHANGES;

        if (option && typeof option === 'string') {
            label += ' ' + option;
        }
        event({
            eventCategory: GA.EVENT_CATEGORIES.USER_ACTION,
            eventLabel   : label
        });
    };

    return {
        trackingEditConfirm: trackingEditConfirm,
        trackingEditCancel : trackingEditCancel,
        create             : create,
        event              : event,
        send               : send,
        set                : set
    };
});
