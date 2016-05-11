define([
        "text!templates/Accounting/AccountingTemplate.html",
        "async",
        "dataService",
        "collections/paymentMethod/paymentMethods",
        "views/Accounting/paymentMethodView"
    ],
    function (DashboardTemplate, async, dataService, payMethodsCollection, paymentMethodView) {
        var ContentView = Backbone.View.extend({
            contentType: "Accounts",
            actionType : "Content",
            template   : _.template(DashboardTemplate),
            el         : '#content-holder',
            initialize : function (options) {
                this.startTime = options.startTime;
                this.render();
            },

            renderPaymentMethods: function (cb) {
                var self = this;

                this.payMethodsCollection = new payMethodsCollection();

                function createView() {
                    if (cb) {
                        cb();
                    }

                    new paymentMethodView({
                        collection      : self.payMethodsCollection
                    }).render();
                }

                this.payMethodsCollection.bind('reset', createView);
            },

            render: function () {
                var self = this;
                var parallelTasks = [this.renderPaymentMethods];

                this.$el.html(this.template());
                App.startPreload();
                _.bindAll(this, 'renderPaymentMethods');

                async.parallel(parallelTasks, function (err, result) {
                    App.stopPreload();
                    self.$el.append("<div id='timeRecivingDataFromServer'>Created in " + (new Date() - self.startTime) + " ms</div>");
                });


            }

        });
        return ContentView;
    });
