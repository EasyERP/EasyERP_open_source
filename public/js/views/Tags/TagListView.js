define([
    'Backbone',
    'jQuery',
    'Underscore',
    'text!templates/Tags/TagsListTemplate.html',
    'text!templates/Tags/TagsContentTemplate.html',
    'collections/Tags/TagsCollection',
    'views/Tags/createView',
    'views/Tags/editView',
    'moment'

], function (Backbone, $, _, TagListTemplate, TagsContentTemplate, TagsCollection, CreateView, EditView, moment) {
    var NoteView = Backbone.View.extend({

        template: _.template(TagListTemplate),
        contentTemplate: _.template(TagsContentTemplate),

        initialize: function (options) {

            var self = this;

            function resetCollection() {
                self.renderContent(self.e);
            }
            this.contentType = options.contentType;
            this.collection = new TagsCollection();
            this.filteredCollection = new TagsCollection();
            this.filteredCollection.unbind();
            this.filteredCollection.bind('reset', resetCollection);
            this.collection.on('sync add destroy', this.changeFilter, this);

            this.inputEvent = _.debounce(
                function (e) {
                    var target = e.target;
                    var value = target.value;
                    var newFilteredCollection;

                    if (!value) {
                        return this.filteredCollection.reset(this.collection.toJSON());
                    }

                    newFilteredCollection = this.filterCollection(value);
                    this.filteredCollection.reset(newFilteredCollection);
                }, 500);

            _.bindAll(this, 'inputEvent');
            _.bindAll(this, 'renderContent');
            this.render();

        },

        changeFilter : function (){
            this.searchInput.val('');
            return this.filteredCollection.reset(this.collection.toJSON());
        },


        filterCollection: function (value) {
            var resultCollection;
            var regex;

            regex = new RegExp(value, 'i');

            resultCollection = this.collection.filter(function (model) {
                return model.get('name').match(regex);
            });

            return resultCollection;
        },

        events: {
            'click'                                                            : "click",
            'click .newSelectList li.miniStylePagination'                     : 'notHide',
            'click .newSelectList li.miniStylePagination .next:not(.disabled)': 'nextSelect',
            'click .newSelectList li.miniStylePagination .prev:not(.disabled)': 'prevSelect',
            'click .editTag'                                                  : 'editTag',
            'click #newTag'                                                   : 'createTag',
            'click li'                                                        : 'changeSelected'
        },

        changeSelected : function (e){
            var $target = $(e.target);
            $target.toggleClass('selected');
        },


        renderContent: function () {
            var contentHolder = this.$el.find('#tagsList');
            contentHolder.html(this.contentTemplate( {
                collection: this.filteredCollection.toJSON(),
                model : this.model.toJSON()
            }));
        },

        click: function () {
            this.$el.find('.input-file .inputAttach').click();
        },

        clickInput: function () {
            this.$el.find('.input-file .inputAttach').click();
        },

        createTag: function (e) {
            e.preventDefault();

            return new CreateView({collection : this.collection});
        },

        editTag: function (e) {
            var li = $(e.target).closest('li');
            var id = li.attr('data-id');
            var model = this.collection.get(id);

            e.preventDefault();

            if (model) {
                return new EditView({model: model, collection : this.collection});
            }
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

            this.renderContent();

            this.searchInput = this.$el.find('#selectInput');

            this.searchInput.keyup(function (e) {
                e.stopPropagation();
                self.inputEvent(e);
            });

            this.delegateEvents(this.events);

            return this;

        }
    });

    return NoteView;
});
