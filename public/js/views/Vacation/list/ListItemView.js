define([
        'Backbone',
        'Underscore',
        'text!templates/Vacation/list/ListTemplate.html'
    ],

    function (Backbone, _, listTemplate) {
        var VacationListItemView = Backbone.View.extend({
            el: '#listTable',

            initialize: function (options) {
                this.collection = options.collection;
            },

            render: function () {
                this.$el.append(_.template(listTemplate, {vacationCollection: this.collection}));
            }
        });

        return VacationListItemView;
    });
