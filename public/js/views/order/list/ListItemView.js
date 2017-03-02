define([
    'Backbone',
    'Underscore',
    'text!templates/order/list/ListTemplate.html',
    'helpers',
    'constants'
], function (Backbone, _, listTemplate, helpers, CONSTANTS) {
    var OrderListItemView = Backbone.View.extend({
        el: '#listTable',

        initialize: function (options) {
            this.collection = options.collection;
            this.startNumber = (parseInt(this.collection.currentPage, 10) - 1) * this.collection.pageSize; // Counting the start index of list items
        },

        render: function () {
            this.$el.append(_.template(listTemplate, {
                orderCollection   : this.collection.toJSON(),
                startNumber       : this.startNumber,
                currencySplitter  : helpers.currencySplitter,
                currencyClass     : helpers.currencyClass,
                unlinkedWorkflowId: CONSTANTS.DEFAULT_UNLINKED_WORKFLOW_ID
            }));
        }
    });

    return OrderListItemView;
});
