define([
    'Backbone',
    'jQuery',
    'Underscore',
    'text!templates/Opportunities/compactContentTemplate.html',
    'views/Opportunities/EditView',
    'models/OpportunitiesModel'
], function (Backbone, $, _, compactContentTemplate, editView, currentModel) {
    var compactContentView = Backbone.View.extend({
        className: 'form',
        template : _.template(compactContentTemplate),

        events: {
            'click p > a': 'goToEditDialog'
        },

        initialize: function (options) {
            this.personsCollection = (options && options.personsCollection) ? options.personsCollection : null;
        },

        goToEditDialog: function (e) {
            var id = $(e.target).closest('a').attr('id');
            var model = new currentModel({validate: false});

            e.preventDefault();

            model.urlRoot = '/Opportunities/form';
            model.fetch({
                data   : {id: id},
                success: function (model) {
                    return new editView({
                        model    : model,
                        elementId: 'personAttach'
                    });
                },

                error: function () {
                    App.render({
                        type   : 'error',
                        message: 'Please refresh browser'
                    });
                }
            });
        },

        gotoOpportunitieForm: function (e) {
            var itemIndex = $(e.target).closest('a').attr('id');

            e.preventDefault();

            window.location.hash = '#easyErp/Opportunities/form/' + itemIndex;
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
