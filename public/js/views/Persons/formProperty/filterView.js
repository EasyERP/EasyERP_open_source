define([
    'Backbone',
    'jQuery',
    'Underscore',
    'text!templates/Persons/formProperty/filterViewList.html',
    'text!templates/Persons/formProperty/filterViewContent.html',
    'views/Persons/CreateView',
    'dataService',
    'collections/Filter/filterCollection'
], function (Backbone, $, _, TagListTemplate, TagsContentTemplate, CreateView, dataService, FilterCollection) {
    'use strict';

    var NoteView = Backbone.View.extend({

        template       : _.template(TagsContentTemplate),
        contentTemplate: _.template(TagListTemplate),

        initialize: function (options) {

            var self = this;

            function resetCollection() {
                self.renderContent(self.e);
            }

            this.attribute = options.attribute;

            this.saveDeal = options.saveDeal;

            dataService.getData('/Persons/', {type: 'Person'}, function (res) {
                res = _.map(res.data, function (elem) {
                    elem.name = elem.fullName;

                    return elem;
                });

                self.collection = new FilterCollection(res);
                self.filteredCollection = new FilterCollection(res);
                self.filteredCollection.unbind();
                self.filteredCollection.bind('reset', resetCollection);
                self.render();
            });

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
            'click li'         : 'changeSelected',
            'click #newContact': 'createCustomer'
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

            new CreateView({saveDeal: this.saveDeal, attribute: this.attribute});
        },

        changeSelected: function (e) {
            var $target = $(e.target);
            var id = $target.closest('li').attr('data-id');
            var saveObject = {};

            saveObject.customer = id;
            this.saveDeal(saveObject, 'formProperty');
        },

        renderContent: function () {
            var contentHolder = this.$el.find('#contactList');
            contentHolder.html(this.contentTemplate({
                collection: this.filteredCollection.toJSON()
            }));
        },

        hideDialog: function () {
            $('.tag-list-dialog').remove();
        },

        render: function () {
            var self = this;

            var formString = this.template();

            this.$el = $(formString).dialog({
                autoOpen: true,
                position: {
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