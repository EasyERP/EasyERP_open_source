/**
 * Created by soundstorm on 12.08.15.
 */
define([
    'Backbone'
], function (Backbone) {
    'use strict';
    var FilterModel = Backbone.Model.extend({
        idAttribute: "_id",

        defaults: {
            name  : '',
            status: false
        }
    });
    return FilterModel;
});