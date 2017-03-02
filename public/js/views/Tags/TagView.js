define([
    'Backbone',
    'jQuery',
    'Underscore',
    'text!templates/Tags/tagTemplate.html',
    'views/Tags/TagListView'

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

            new TagListView({model: this.model, contentType: this.contentType});
        },

        render: function () {
            var modelObj = this.model.toJSON();

            this.$el.html(this.template(modelObj));

            return this;
        }
    });

    return TagView;
});
