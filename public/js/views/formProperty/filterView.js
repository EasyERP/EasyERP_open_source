define([
    'Backbone',
    'jQuery',
    'Underscore',
    'text!templates/formProperty/filterViewList.html',
    'text!templates/formProperty/filterViewContent.html',
    'collections/Companies/filterCollection',
    'collections/Persons/filterCollection'
], function (Backbone, $, _, TagListTemplate, TagsContentTemplate, companyCollection, personCollection) {
    'use strict';

    var NoteView = Backbone.View.extend({

        template       : _.template(TagsContentTemplate),
        contentTemplate: _.template(TagListTemplate),

        initialize: function (options) {

            var self = this;
            var CurrentCollection;

            if (this.type === 'Companies') {
                CurrentCollection = companyCollection;
            } else {
                CurrentCollection = personCollection;
            }


            function resetCollection() {
                self.renderContent(self.e);
            }

            this.attribute = options.attribute;
            this.saveDeal = options.saveDeal;
            this.collection = new CurrentCollection();
            this.filteredCollection = new CurrentCollection();
            this.filteredCollection.unbind();
            this.filteredCollection.bind('reset', resetCollection);

            this.inputEvent = _.debounce(
                function (e) {
                    var target = e.target;
                    var value = target.value;
                    var newFilteredCollection;

                    if (!value) {
                        return this.filteredCollection.reset([]);
                    }
                    if (value.length < 3) {
                        return false;
                    }

                    newFilteredCollection = this.filterCollection(value);
                    this.filteredCollection.reset(newFilteredCollection);
                }, 500);

            _.bindAll(this, 'inputEvent');
            _.bindAll(this, 'renderContent');
            this.render();

        },

        filterCollection: function (value) {
            var resultCollection;
            var regex;

            regex = new RegExp(value, 'i');

            resultCollection = this.collection.filter(function (model) {
                return model.get('fullName').match(regex);
            });

            return resultCollection;
        },

        events: {
            'click #newTag'                                                   : 'createTag',
            'click li'                                                        : 'changeSelected'
        },

        changeSelected: function (e) {
            var $target = $(e.target);
            var id = $target.closest('li').attr('data-id');
            var saveObject = {};

            saveObject[this.attribute] = id;
            this.saveDeal(saveObject, 'formProperty');
        },


        renderContent: function () {
            var contentHolder = this.$el.find('#tagsList');
            contentHolder.html(this.contentTemplate({
                collection: this.filteredCollection.toJSON(),
                model     : this.model.toJSON()
            }));
        },

        hideDialog: function () {
            var selectedElements = this.$el.find('.selected').closest('li');
            var tags = selectedElements.map(function () {
                return $(this).attr('data-id');
            }).get();
            var collection = this.collection.toJSON();
            var selectedItems = collection.filter(function (elem) {
                return (tags.indexOf(elem._id) !== -1);
            });

            this.model.set({tags: selectedItems});
            $('.tag-list-dialog').remove();
        },

        showTitle: function (e) {
            $(e.target).hide().parents('.addNote').find('.title-wrapper').show().find('input').focus();
        },

        render: function () {
            var modelObj = this.model.toJSON();
            var self = this;
            var type = (this.type === 'Companies') ? 'Company' : 'Person';

            var formString = this.template({
                type : type
            });

            this.$el = $(formString).dialog({
                closeOnEscape: false,
                autoOpen     : true,
                resizable    : true,
                position     : {
                    at: "top+35%"
                },
                dialogClass  : 'tag-list-dialog ',
                title        : 'Tag List',
                width        : '300px',
                buttons      : [
                    {
                        class   : 'exitButton',
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