define([
    'Backbone',
    'Underscore',
    'text!templates/supplierPayments/CreateTemplate.html'
], function (Backbone, _, CreateTemplate) {

    var CreateView = Backbone.View.extend({
        el      : '#listTable',
        template: _.template(CreateTemplate),

        initialize: function (options) {
            var now = new Date();
            var year = now.getFullYear();
            var month = now.getMonth() + 1;

            options = options || {};

            options.month = month;
            options.year = year;

            this.render(options);
        },

        render: function (options) {
            this.$el.prepend(this.template(options));

            return this;
        }

    });

    return CreateView;
});
