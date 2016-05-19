define([
        "text!templates/Accounting/PaymentMethodList.html",
        "async",
        'models/paymentMethod',
        'views/Accounting/paymentMethod/paymentMethodEdit',
        'views/Accounting/paymentMethod/paymentMethodCreate'

    ],
    function (PaymentMethodList, async, currentModel, editView, createView) {
        var ContentView = Backbone.View.extend({
            template   : _.template(PaymentMethodList),
            el         : '#paymentmethods-holder',
            initialize : function (options) {
                this.startTime = options.startTime;
                this.collection  = options.collection;
                this.render();
            },

            events: {
                "click .fa-pencil-square-o": "goToEditDialog",
                "click .fa-trash-o"        : "deleteItem",
                "click #top-bar-createBtn" : "createPaymentMethod",
                "click .fa-angle-down"     : "toggleList"

            },

            deleteItem: function (e) {
                e.preventDefault();
                var self = this;
                var tr = $(e.target).closest('tr');

                var id = tr.attr("data-id");
                var model = this.collection.get(id);

                var answer = confirm("Really DELETE items ?!");

                e.preventDefault();

                if (answer === true && model) {

                    model.destroy({
                        success: function (model) {
                            self.$el.find('tr[data-id="' + model.id + '"]').remove();
                        },
                        error  : function (model, err) {
                            if (err.status === 403) {
                                App.render({
                                    type   : 'error',
                                    message: "You do not have permission to perform this action"
                                });
                            }
                        }
                    });
                }

            },

            toggleList : function (e) {
                e.preventDefault();
                this.$el.find(".forToggle").toggle();
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
                this.$el.html(this.template({collection : this.collection.toJSON()}));
            }

        });
        return ContentView;
    });
