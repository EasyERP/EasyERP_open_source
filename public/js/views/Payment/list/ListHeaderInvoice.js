/**
 * Created by soundstorm on 21.05.15.
 */
define([
    "text!templates/Payment/list/ListHeaderInvoice.html",
    "text!templates/Payment/list/ListTemplateInvoice.html",
    'helpers'
], function (listHeaderTemplate, listTemplate, helpers) {
    var PaymentItemsTemplate = Backbone.View.extend({
        el: '#payments-container',

        events: {},

        initialize: function (options) {
            this.render();
        },

        template: _.template(listHeaderTemplate),

        render: function (options) {
            var thisEl = this.$el;
            var itemsContainer;

            var payments = null;

            if (options && options.model && options.model.payments) {
                payments = options.model.payments;
            }

            thisEl.html(this.template());

            itemsContainer = thisEl.find('#paymentsList');
            itemsContainer.append(_.template(listTemplate, {
                paymentCollection: payments,
                currencySplitter: helpers.currencySplitter
            }));


            return this;
        }
    });

    return PaymentItemsTemplate;
});