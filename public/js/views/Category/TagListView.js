define([
    'Backbone',
    'jQuery',
    'Underscore',
    'text!templates/Category/TagsListTemplate.html',
    'text!templates/Category/TagsContentTemplate.html',
    'collections/Tags/TagsCollection',
    'views/Tags/createView',
    'views/Tags/editView'
], function (Backbone, $, _, TagListTemplate, TagsContentTemplate, TagsCollection, CreateView, EditView) {
    'use strict';

    var NoteView = Backbone.View.extend({

        template       : _.template(TagListTemplate),
        contentTemplate: _.template(TagsContentTemplate),

        initialize: function (options) {

            var self = this;

            function resetCollection() {
                self.renderContent(self.e);
            }

            this.type = options.type;
            this.contentType = options.contentType;
            this.collection = new TagsCollection({type: 'Category'});
            this.filteredCollection = new TagsCollection({type: 'Category'});
            this.filteredCollection.unbind();
            this.filteredCollection.bind('reset', resetCollection);
            this.collection.on('change add destroy', this.changeFilter, this);

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

        changeFilter: function () {
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
            'click .editTag'             : 'editTag',
            'click #newTag'              : 'createTag',
            'click li span:not(.editTag)': 'changeSelected'
        },

        changeSelected: function (e) {
            var $target = $(e.target);
            var id = $target.closest('li').attr('data-id');
            var color = $target.attr('data-color');
            var text = $target.text();

            this.model.set({
                category: {
                    _id  : id,
                    color: color,
                    name : text
                }
            });
            $('.tag-list-dialog').remove();
        },

        renderContent: function () {
            var contentHolder = this.$el.find('#tagsList');
            contentHolder.html(this.contentTemplate({
                collection: this.filteredCollection.toJSON(),
                model     : this.model.toJSON()
            }));
        },

        createTag: function (e) {
            e.preventDefault();
            $('.tag-list-dialog').hide();
            return new CreateView({collection: this.collection, type: 'Category'});
        },

        editTag: function (e) {
            var li = $(e.target).closest('li');
            var id = li.attr('data-id');
            var model = this.collection.get(id);

            $('.tag-list-dialog').hide();

            e.preventDefault();

            if (model) {
                return new EditView({model: model, collection: this.collection, type: 'Category'});
            }
        },

        hideDialog: function () {
            /* var selectedElements = this.$el.find('.selected').closest('li');
             var tags = selectedElements.map(function () {
             return $(this).attr('data-id');
             }).get();
             var collection = this.collection.toJSON();
             var selectedItems = collection.filter(function (elem) {
             return (tags.indexOf(elem._id) !== -1);
             });

             this.model.set({tags: selectedItems});*/
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
                autoOpen   : true,
                position   : {
                    at: "top+35%"
                },
                dialogClass: 'tag-list-dialog',
                title      : 'Tag List',
                width      : '300px',
                buttons    : [
                    {
                        class: 'exitButton',
                        click: function () {
                            self.hideDialog();
                        }
                    }
                ]

            });

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
