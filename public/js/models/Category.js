/**
 * Created by soundstorm on 29.04.15.
 */
define([
    'Backbone',
    'constants'
], function (Backbone, CONSTANTS) {
    'use strict';
    var Model = Backbone.Model.extend({
        idAttribute: "_id",

        urlRoot: function () {
            return CONSTANTS.URLS.CATEGORY;
        }
    });
    return Model;
});