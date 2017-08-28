define([
    'Backbone',
    'collections/parent',
    'models/warehouseMovementModel',
    'helpers/getDateHelper'
], function (Backbone, Parent, Model, DateHelper) {
    'use strict';

    var Collection = Parent.extend({
        model   : Model,
        url     : '/reports/warehouseMovements',

        initialize: function (options) {
            var page;
            var dateRange;

            function _errHandler(models, xhr) {
                if (xhr.status === 401) {
                    Backbone.history.navigate('#login', {trigger: true});
                }
            }

            dateRange = this.filter && this.filter.date ? this.filter.date.value : null;

            dateRange = dateRange || DateHelper.getDate('thisMonth');

            options.dateRange = dateRange;

            this.startDate = new Date(dateRange[0]);
            this.endDate = new Date(dateRange[1]);

            options = options || {};
            options.error = options.error || _errHandler;
            page = options.page;

            this.startTime = new Date();

            if (page) {
                return this.getPage(page, options);
            }

            this.getFirstPage(options);
        }
    });

    return Collection;
});
