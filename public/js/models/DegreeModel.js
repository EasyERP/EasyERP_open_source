define([
    'Backbone',
    'constants'
], function (Backbone, CONSTANTS) {
    'use strict';

    var DegreeModel = Backbone.Model.extend({

    idAttribute: "_id",
        defaults   : {
            name: ''
        },
        urlRoot    : function () {
            return CONSTANTS.URLS.COMPANIES;
        }
    });
    return DegreeModel;
});