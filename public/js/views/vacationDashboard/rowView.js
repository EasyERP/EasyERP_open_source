define([
    'Backbone',
    'Underscore',
    'text!templates/vacationDashboard/rowTemplate.html'
], function (Backbone, _, mainTemplate) {
    var View = Backbone.View.extend({
        el: '#dashboardBody',

        template: _.template(mainTemplate),

        events: {},

        initialize: function (inputData) {
            this.render(inputData);
        },

        render: function (inputData) {
            this.$el.html(this.template(inputData));

            this.rendered = true;

            return this;
        }
    });

    return View;
});
