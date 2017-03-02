define([
    'Backbone',
    'collections/parent',
    'models/WeeklySchedulerModel',
    'constants'
], function (Backbone, Parent, Model, CONSTANTS) {
    'use strict';

    var Collection = Parent.extend({
        model: Model,
        url  : CONSTANTS.URLS.WEEKLYSCHEDULER_LIST,

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


