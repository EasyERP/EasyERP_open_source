define([
    'Backbone',
    'Underscore',
    'text!templates/Import/ListTemplate.html',
    'helpers'
], function (Backbone, _, listTemplate, helpers) {
    'use strict';

    var InvoiceListItemView = Backbone.View.extend({
        el: '#listTable',

        initialize: function (options) {
            this.collection = options.collection;
            this.keys = [
                'date',
                'user',
                'type',
                'status',
                'fileName',
                'filePath',
                'reportFile',
                'reportFileName'
            ];
            this.startNumber = (parseInt(this.collection.currentPage, 10) - 1) * this.collection.pageSize; // Counting the start index of list items
        },

        render: function () {

            this.$el.append(_.template(listTemplate, {
                history: this.collection.toJSON(),
                startNumber: this.startNumber,
                keys: this.keys
            }));
        }
    });

    return InvoiceListItemView;
});
