define([
        "text!templates/Salary/subSalary/CreateTemplate.html",
    ],
    function (CreateTemplate) {

        var CreateView = Backbone.View.extend({
            template: _.template(CreateTemplate),

            initialize: function (options) {
                this.model = options.model;
                this.render();
            },

            events: {

            },

            render: function () {
                this.$el.prepend(this.template(this.model));

                return this;
            }

        });

        return CreateView;
    });
