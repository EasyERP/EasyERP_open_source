/**
 * Created by German on 03.07.2015.
 */
define([
    'text!templates/vacationDashboard/rowTemplate.html'
], function (mainTemplate) {
    var View = Backbone.View.extend({
        el: '#dashboardBody',

        template: _.template(mainTemplate),

        events: {

        },

        initialize: function (inputData) {
            this.render(inputData);
        },

        render: function (inputData) {
            var self = this;

            this.$el.html(this.template(inputData));

            this.rendered = true;

            return this;
        }
    });

    return View;
});