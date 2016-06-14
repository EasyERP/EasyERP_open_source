define([
    'Backbone',
    'Underscore',
    'text!templates/jobsDashboard/DashboardTemplate.html',
    'helpers'
], function (Backbone, _, listTemplate, helpers) {
    'use strict';

    var jobsListItemView = Backbone.View.extend({
        el: '#listTable',

        initialize: function (options) {
            this.collection = options.collection;
            this.startNumber = (parseInt(this.collection.currentPage, 10) - 1) * this.collection.pageSize;  // Counting the start index of list items
        },

        getClass: function (job) {
            return job.payment && job.invoice && job.invoice !== job.payment.paid && job.workflow.name !== 'In Progress' ? 'redBorder' : '';
        },

        render: function () {
            var self = this;
            var result = this.collection.toJSON();

            this.$el.append(_.template(listTemplate, {
                collection      : result,
                startNumber     : this.startNumber,
                currencySplitter: helpers.currencySplitter,
                getClass        : self.getClass
            }));

        }
    });

    return jobsListItemView;
});
