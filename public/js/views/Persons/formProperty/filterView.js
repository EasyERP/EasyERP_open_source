define([
    'Backbone',
    'jQuery',
    'Underscore',
    'text!templates/Persons/formProperty/filterViewList.html',
    'text!templates/Persons/formProperty/filterViewContent.html',
    'views/Persons/CreateView',
    'collections/Persons/filterCollection'
], function (Backbone, $, _, TagListTemplate, TagsContentTemplate, CreateView, FilterCollection) {
    'use strict';

    var NoteView = Backbone.View.extend({

        template       : _.template(TagsContentTemplate),
        contentTemplate: _.template(TagListTemplate),

        initialize: function (options) {

            var self = this;
            this.type = options.type;

            function resetCollection() {
                self.renderContent(self.e);
            }

            this.attribute = options.attribute;
            this.saveDeal = options.saveDeal;
            this.collection = new FilterCollection({type: 'Person'});
            this.filteredCollection = new FilterCollection({type: 'Person'});
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

                    newFilteredCollection = this.filterCollection(value);
                    this.filteredCollection.reset(newFilteredCollection);
                }, 500);

            _.bindAll(this, 'inputEvent');
            _.bindAll(this, 'renderContent');
            this.render();

        },

        events: {
            'click li'        : 'changeSelected',
            'click #newPerson': 'createCustomer'
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

        createCustomer: function () {
            $('.tag-list-dialog').remove();

            new CreateView();
        },

        changeSelected: function (e) {
            var $target = $(e.target);
            var id = $target.closest('li').attr('data-id');
            var saveObject = {};

            saveObject[this.attribute] = id;
            this.saveDeal(saveObject, 'formProperty');
        },

        renderContent: function () {
            var contentHolder = this.$el.find('#contactList');
            contentHolder.html(this.contentTemplate({
                collection: this.filteredCollection.toJSON(),
                model     : this.model.toJSON()
            }));
        },

        hideDialog: function () {
            $('.tag-list-dialog').remove();
        },

        render: function () {
            var self = this;

            var formString = this.template();

            this.$el = $(formString).dialog({
                closeOnEscape: false,
                autoOpen     : true,
                resizable    : true,
                position     : {
                    at: 'top+35%'
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