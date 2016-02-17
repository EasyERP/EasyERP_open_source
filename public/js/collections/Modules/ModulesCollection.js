define([
    'Backbone',
    'constants'

], function (Backbone, CONSTANTS) {
    'use strict';

    var MenuItems = Backbone.Collection.extend({
        url       : function () {
            return CONSTANTS.URLS.MODULES;
        },
        initialize: function () {
            this.fetch({
                reset: true
            });
        },
        parse     : function (response) {
            return response.data;
        }
    });
    return MenuItems;
});