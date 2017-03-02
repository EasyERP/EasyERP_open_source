define([
    'Backbone',
    'collections/parent',
    'models/ScheduledPayModel',
    'constants'
], function (Backbone, Parent, Model, CONSTANTS) {
    'use strict';

    var Collection = Parent.extend({
        model: Model,
        url  : CONSTANTS.URLS.SCHEDULEDPAY,

        initialize: function () {

            this.fetch({
                reset  : true,
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
    return Collection;
});
