/**
 * Created by lilya on 16/11/15.
 */
define([
        'text!templates/PayrollExpanses/form/FormTemplate.html'
    ],

    function (PayrollTemplate) {
        var PayrollExpanses = Backbone.View.extend({

            el: '#content-holder',
            initialize: function (options) {
                this.collection = options.collection;
                this.collection.url = "/PayrollExpenses";
            },

            render: function () {
                var collection = this.collection.toJSON();

                this.$el.html(_.template(PayrollTemplate, collection));
                return this;
            }
        });
        return PayrollExpanses;
    });