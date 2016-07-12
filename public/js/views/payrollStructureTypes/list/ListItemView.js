define([
    'Backbone',
    'Underscore',
    'text!templates/payrollStructureTypes/list/ListTemplate.html'
], function (Backbone, _, listTemplate) {
    'use strict';
    var ListItemView = Backbone.View.extend({
        el: '#listTablePayrollStructure',

        initialize: function (options) {
            this.page = parseInt(options.page, 10);

            this.collection = options.collection;
            this.page = isNaN(this.page) ? 1 : this.page;
            this.startNumber = (this.page - 1) * options.itemsNumber;
        },

        render: function (options) {
            var el = (options && options.thisEl) ? options.thisEl : this.$el;

            el.append(_.template(listTemplate, {
                payrollComponentTypes: this.collection.toJSON(),
                startNumber          : this.startNumber
            }));
        }
    });

    return ListItemView;
});
