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
            'click .remove'      : 'removeTag',
            'click .editTags'    : 'editTags'
        },


        editTags: function (e) {
            e.preventDefault();

            new TagListView({model : this.model, contentType :  this.contentType});
        },

        removeTag: function (e) {
            $(e.target).parents('.addNote').find('#noteArea').attr('placeholder', 'Add a Note...').parents('.addNote').removeClass('active');
            $(e.target).parents('.addNote').find('#noteArea').val('');
            this.$el.find('#getNoteKey').val('');// remove id from hidden field if note editing is cancel
            this.$el.find('.title-wrapper').hide();
            this.$el.find('.addTitle').hide();
            this.$el.find('#noteArea').val('');
            this.$el.find('#noteTitleArea').val('');
            this.$el.find('#getNoteKey').attr('value', '');
        },

        render: function () {
            var modelObj = this.model.toJSON();

            this.$el.html(this.template(modelObj));

            return this;
        }
    });

    return TagView;
});
