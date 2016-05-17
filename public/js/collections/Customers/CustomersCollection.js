define([
    'Backbone',
    'jQuery',
    'constants'
], function (Backbone, $, CONSTANTS) {
    'use strict';

    var CustomerModel = Backbone.Model.extend({
        idAttribute: '_id'
    });
    var CustomersCollection = Backbone.Collection.extend({
        model     : CustomerModel,
        url       : function () {
            return CONSTANTS.URLS.CUSTOMERS;
        },
        initialize: function () {
            var mid = 39;
            this.fetch({
                data   : $.param({
                    mid: mid
                }),
                type   : 'GET',
                reset  : true,
                success: this.fetchSuccess,
                error  : this.fetchError
            });
        },

        parse: function (response) {
            return response.data;
        }
    });
    return CustomersCollection;
});