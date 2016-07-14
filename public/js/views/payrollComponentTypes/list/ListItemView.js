define([
    'Backbone',
    'Underscore',
    'text!templates/payrollComponentTypes/list/ListTemplate.html'
], function (Backbone, _, listTemplate) {
    'use strict';

    var WeeklySchedulerListItemView = Backbone.View.extend({
        el: '#listTable',

        initialize: function (options) {
            this.type = options.type;
            this.collection = options.collection;
            this.page = isNaN(this.page) ? 1 : this.page;
            this.startNumber = (this.page - 1) * options.itemsNumber;
        },

        render: function (options) {
            var el = (options && options.thisEl) ? options.thisEl : this.$el;

            el.append(_.template(listTemplate, {
                payrollComponentTypes: this.collection.toJSON(),
                startNumber          : this.startNumber,
                type                 : this.type
            }));
        }
    });

    return WeeklySchedulerListItemView;
});
