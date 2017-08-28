define([
    'Backbone',
    'collections/parent',
    'models/syncLogModel',
    'constants'
], function (Backbone, Parent, syncLogsModel, CONSTANTS) {
    'use strict';

    var PaymentCollection = Parent.extend({
        model: syncLogsModel,
        url  : '/syncLogs/',

        initialize: function (options) {
            this.fetch({
                reset  : true,
                data   : options || {},
                success: function () {
                },

                error: function (models, xhr) {
                    if (xhr.status === 401) {
                        Backbone.history.navigate('#login', {trigger: true});
                    }
                }
            });

        }
    });
    return PaymentCollection;
});
