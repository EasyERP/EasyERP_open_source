define([
    'text!templates/salesInvoice/wTrack/wTrackRows.html'
], function (wTrackRowsHeader, wTrackRows) {
    var ProductItemTemplate = Backbone.View.extend({
        el: '#linwoiceGenerateTable',
        template: _.template(wTrackRowsHeader),

        events: {
           
        },

        initialize: function (options) {
            this.render(options);
        },

        render: function (options) {
            var totalAmountContainer;
            var thisEl = this.$el;

            thisEl.html(this.template(options));
            totalAmountContainer = thisEl.find('#totalAmountContainer');
            totalAmountContainer.append(_.template(totalAmount, {model: options.model, balanceVisible: this.visible}));

            return this;
        }
    });

    return ProductItemTemplate;
});