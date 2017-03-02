define([
    'Backbone'
], function (Backbone) {
    'use strict';

    var ProjectMemberModel = Backbone.Model.extend({
        idAttribute: '_id',

        defaults: {
            price: 0
        },

        urlRoot: function () {
            return '/shippingMethod';
        }
    });
    return ProjectMemberModel;

});
