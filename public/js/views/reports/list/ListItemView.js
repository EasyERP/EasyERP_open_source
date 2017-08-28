define([
    'Backbone',
    'Underscore',
    'text!templates/reports/list/ListTemplate.html',
    'helpers',
    'moment'
], function (Backbone, _, ListTemplate, helpers, moment) {
    'use strict';

    var ListItemView = Backbone.View.extend({
        el: '#listTable',

        initialize: function (options) {
            this.collection = options.collection;
            this.headers = options.headers;
            this.dataTypes = options.dataTypes;
            this.groupBy = options.groupBy;
        },

        pushStages: function (stages) {
            this.stages = stages;
        },

        render: function () {
            var total = this.collection.total;
            var headers = this.headers;

            this.$el.append(_.template(ListTemplate, {
                collection  : this.collection.toJSON(),
                headerMapper: this.collection.reportHeaderMapper,
                dataTypes   : this.dataTypes,
                total       : total,
                headers     : headers,
                moment      : moment,
                groupBy     : this.groupBy,
                fieldsMapper: helpers.mappingReportFields
            }));
        }
    });

    return ListItemView;
});