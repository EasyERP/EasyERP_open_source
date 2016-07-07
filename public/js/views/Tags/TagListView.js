define([
    'Backbone',
    'jQuery',
    'Underscore',
    'text!templates/Tags/TagsListTemplate.html',
    'collections/Tags/TagsCollection',
    'views/Tags/createView',
    'views/Tags/editView',
    'moment'

], function (Backbone, $, _, TagListTemplate, TagsCollection, CreateView, EditView, moment) {
    var NoteView = Backbone.View.extend({

        template: _.template(TagListTemplate),

        initialize: function (options) {
            this.contentType = options.contentType;
            this.collection = new TagsCollection();
            this.collection.bind('reset', this.render, this);
        },

        events: {
            'click'                                                            : "click",
            'click .newSelectList li.miniStylePagination'                     : 'notHide',
            'click .newSelectList li.miniStylePagination .next:not(.disabled)': 'nextSelect',
            'click .newSelectList li.miniStylePagination .prev:not(.disabled)': 'prevSelect',
            'click #newTag'                                                   : 'createTag'
        },
        click: function () {
            this.$el.find('.input-file .inputAttach').click();
        },

        clickInput: function () {
            this.$el.find('.input-file .inputAttach').click();
        },

        createTag: function (e) {
            e.preventDefault();

            return new CreateView();
        },

        hideDialog: function () {
            $('.tag-list-dialog').remove();
        },

        showTitle: function (e) {
            $(e.target).hide().parents('.addNote').find('.title-wrapper').show().find('input').focus();
        },

        render: function () {
            var modelObj = this.model.toJSON();
            var self = this;

            var formString = this.template({
                model     : modelObj,
                collection: this.collection.toJSON()
            });

            this.$el = $(formString).dialog({
                closeOnEscape: false,
                autoOpen     : true,
                resizable    : true,
                dialogClass  : 'tag-list-dialog',
                title        : 'Tag List',
                width        : '300px',
                buttons      : [
                    {
                        text : 'OK',
                        click: function () {
                            self.hideDialog();
                        }
                    }
                ]

            });

            this.delegateEvents(this.events);

            return this;

        }
    });

    return NoteView;
});
