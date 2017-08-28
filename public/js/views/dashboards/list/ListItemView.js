define([
    'Backbone',
    'Underscore',
    'jQuery',
    'text!templates/dashboards/list/ListTemplate.html',
    'moment'
], function (Backbone, _, $, ListTemplate, moment) {
    'use strict';

    var CustomDashboardListItemView = Backbone.View.extend({
        el: '#listTable',

        events: {
            'click .dashboardName': 'goToCharts'
        },

        initialize: function (options) {
            this.collection = options.collection;
            // this.render();
        },

        goToCharts: function (e) {
            var $target = $(e.target).closest('tr');
            var id = $target.find('.dashboardName').attr('id');
            var currentLocation = location.hash.substring(0, location.hash.indexOf('/'));

            Backbone.history.fragment = '';
            Backbone.history.navigate(currentLocation + '/customDashboardCharts/' + id, {trigger: true});
        },

        render: function () {
            var collection = this.collection.toJSON();

            _.each(collection, function (item) {
                item.created = moment(item.created).format('MMM DD, YYYY');
            });

            this.$el.append(_.template(ListTemplate, {
                collection: collection
            }));
        }
    });

    return CustomDashboardListItemView;
});
