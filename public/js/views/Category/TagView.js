define([
    'Backbone',
    'jQuery',
    'Underscore',
    'text!templates/Category/categoryTemplate.html',
    'views/Category/TagListView'

], function (Backbone, $, _, tagTemplate, TagListView) {
    var TagView = Backbone.View.extend({

        template: _.template(tagTemplate),

        initialize: function (options) {
            this.contentType = options.contentType;
            this.needNotes = options.hasOwnProperty('needNotes') ? options.needNotes : true;
        },

        events: {
            'click .editTags': 'editTags'
        },

        editTags: function (e) {
            e.preventDefault();

            new TagListView({model: this.model, contentType: this.contentType, type: 'Category'});
        },

        render: function () {
            var category = this.model.get('category');

            this.$el.html(this.template({category: category}));

            return this;
        }
    });

    return TagView;
});
