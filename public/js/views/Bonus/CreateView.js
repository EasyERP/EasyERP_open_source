define([
        "text!templates/Bonus/CreateBonus.html"
    ],
    function (CreateTemplate) {

        var CreateView = Backbone.View.extend({
            el: '#bonusTable',
            template: _.template(CreateTemplate),

            initialize: function (options) {
                this.render(options);
            },

            events: {

            },

            render: function (options) {
                this.$el.prepend(this.template({options: options}));

                return this;
            }

        });

        return CreateView;
    });
