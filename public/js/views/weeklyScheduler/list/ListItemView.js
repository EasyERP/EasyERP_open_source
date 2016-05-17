define([
    'Backbone',
    'Underscore',
    'text!templates/weeklyScheduler/list/ListTemplate.html',
    'helpers'
], function (Backbone, _, listTemplate, helpers) {
    'use strict';
    var WeeklySchedulerListItemView = Backbone.View.extend({
        el: '#listTable',

        initialize: function (options) {
            this.page = parseInt(options.page, 10);

            this.collection = options.collection;
            this.page = isNaN(this.page) ? 1 : this.page;
            this.startNumber = (this.page - 1) * options.itemsNumber;
        },

        render: function (options) {
            var el = (options && options.thisEl) ? options.thisEl : this.$el;

            el.append(_.template(listTemplate, {
                weeklySchedulers : this.collection.toJSON(),
                startNumber      : this.startNumber
            }));
        }
    });

    return WeeklySchedulerListItemView;
});
