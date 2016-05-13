define([
        "text!templates/Accounting/PaymentMethodList.html",
        "async",
        "views/Accounting/paymentMethodView",
        'models/paymentMethod',
        'views/Accounting/paymentMethodEdit',
        'views/Accounting/paymentMethodCreate'

    ],
    function (PaymentMethodList, async, paymentMethodView, currentModel, editView, createView) {
        var ContentView = Backbone.View.extend({
            template   : _.template(PaymentMethodList),
            el         : '#paymentmethods-holder',
            initialize : function (options) {
                this.startTime = options.startTime;
                this.collection  = options.collection;
                this.render();
            },

            events: {
                "click tr" : "goToEditDialog",
                "click #top-bar-createBtn" : "createPaymentMethod"
            },

            goToEditDialog: function (e) {
                e.preventDefault();
                var tr = $(e.target).closest('tr');

                var id = tr.attr("data-id");
                var model = this.collection.get(id);
                if (model) {
                    new editView({model: model});
                }
            },

            createPaymentMethod : function (e) {
                e.preventDefault();

                new createView();
            },

            render: function () {
                var self = this;

                this.$el.html(this.template({collection : this.collection.toJSON()}));
            }

        });
        return ContentView;
    });
