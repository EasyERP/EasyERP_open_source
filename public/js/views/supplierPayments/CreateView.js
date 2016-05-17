/**
 * Created by soundstorm on 27.08.15.
 */
define([
        'Backbone',
        'Underscore',
        "text!templates/supplierPayments/CreateTemplate.html",
    ],
    function (Backbone, _, CreateTemplate) {

        var CreateView = Backbone.View.extend({
            el      : '#listTable',
            template: _.template(CreateTemplate),

            initialize: function (options) {
                this.render(options);
            },

            events: {},

            render: function (options) {
                this.$el.prepend(this.template(options));

                return this;
            }

        });

        return CreateView;
    });
