'use strict';

define([
    'Backbone',
    'Underscore',
    'Validation',
    'moment'
], function (Backbone, _, Validation, moment) {
    var Model = Backbone.Model.extend({
        idAttribute: '_id',

        initialize: function () {
            this.on('invalid', function (model, errors) {
                var msg;

                if (errors.length > 0) {
                    msg = errors.join('\n');

                    App.render({
                        type   : 'error',
                        message: msg
                    });
                }

                model.unset('isHire', {silent: true});
            });
        },

        urlRoot: function () {
            return '/channels';
        },

        defaults: {
            channelName      : '',
            type             : 'magento',
            user             : null,
            username         : '',
            password         : '',
            baseUrl          : '',
            connected        : true,
            warehouseSettings: {
                warehouse: null,
                location : null
            }
        },

        parse: function (responseData) {
            var collection = this.collection;
            var _stats;

            function filterStats(data) {
                return responseData._id === data._id;
            }

            if (responseData && collection) {
                _stats = collection.stats;
                responseData.stats = {};
                responseData.stats.products = {};
                responseData.stats.orders = {};

                if (_stats) {
                    responseData.stats.products.imported = _.find(_stats.importedProducts, filterStats);
                    responseData.stats.products.conflicted = _.find(_stats.conflictProducts, filterStats);
                    responseData.stats.orders.imported = _.find(_stats.importedOrders, filterStats);
                    responseData.stats.orders.unlinked = _.find(_stats.unlinkedOrders, filterStats);
                }
            }

            if (responseData && responseData.lastSync){
                responseData.lastSync = moment(new Date(responseData.lastSync)).format('LLL');
            }

            return responseData;
        },

        validate: function (attrs) {
            var errors = [];

            Validation.checkNameField(errors, true, attrs.channelName, 'Channel name');

            if (attrs.type !== 'etsy') {
                Validation.checkUrl(errors, true, attrs.baseUrl, 'Base URL');
            }

            if (errors.length > 0) {
                return errors;
            }
        }
    });

    return Model;
});
