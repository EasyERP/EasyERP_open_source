define([
        "text!templates/Bonus/CreateTemplate.html",
        'models/BonusModel'
    ],
    function (CreateTemplate, currentModel) {

        var CreateView = Backbone.View.extend({
            el: '#bonusTable',
            template: _.template(CreateTemplate),

            initialize: function (options) {
                var model = new currentModel();
                model = model.toJSON();
                model.startDate.date = options.StartDate;
                model.endDate.date = options.EndDate;
                this.render(model);
            },

            events: {},

            render: function (options) {
                this.$el.prepend(this.template(options));

                return this;
            }

        });

        return CreateView;
    });
