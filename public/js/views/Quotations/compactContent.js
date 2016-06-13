define([
    'Backbone',
    'jQuery',
    'Underscore',
    'text!templates/Persons/compactContentTemplate.html'
], function (Backbone, $, _, compactContentTemplate) {
    var compactContentView = Backbone.View.extend({

        className: 'form',

        events: {
            'click #persons p > a': 'gotoPersonsForm'
        },

        initialize: function (options) {

        },

        template: _.template(compactContentTemplate),

        gotoPersonsForm: function (e) {
            var itemIndex;

            e.preventDefault();
            itemIndex = $(e.target).closest('a').attr('id');

            Backbone.history.navigate('#easyErp/Persons/form/' + itemIndex, {trigger: true});
        },

        render: function (options) {
            this.$el.html(this.template({
                collection: this.collection,
                options   : options
            }));
            return this;
        }
    });

    return compactContentView;
});
