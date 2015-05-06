/**
 * Created by ANDREY on 28.04.2015.
 */

define(['text!templates/Invoice/InvoiceItems.html!'], function(invoiceItemTemplate){
    var InvoiceItemTemplate = Backbone.View.extend({
        el: '#invoiceItemsHolder',
        events: {
        },

        initialize: function () {
            this.render();
        },

        template: _.template(invoiceItemTemplate),

        //gotoPersonsForm: function (e) {
        //    e.preventDefault();
        //    var itemIndex = $(e.target).closest("a").attr("id");
        //    Backbone.history.navigate("#easyErp/Invoice/form/" + itemIndex, { trigger: true });
        //},

        render: function (options) {
            this.$el.html(this.template({
                collection: this.collection,
                options: options
            }));
            return this;
        }
    });

    return InvoiceItemTemplate;
});