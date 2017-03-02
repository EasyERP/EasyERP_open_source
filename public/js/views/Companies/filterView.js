define([
    'Backbone',
    'jQuery',
    'Underscore',
    'text!templates/Companies/filterViewList.html',
    'text!templates/Companies/filterViewContent.html',
    'views/Companies/CreateView',
    'dataService',
    'collections/Filter/filterCollection'
], function (Backbone, $, _, TagListTemplate, TagsContentTemplate, CreateView, dataService, filterCollection) {
    'use strict';

    var NoteView = Backbone.View.extend({

        template       : _.template(TagsContentTemplate),
        contentTemplate: _.template(TagListTemplate),

        initialize: function (options) {

            var self = this;

            function resetCollection() {
                self.renderContent(self.e);
            }

            dataService.getData('/Companies/', {type: 'Company'}, function (res) {
                res = _.map(res.data, function (elem) {
                    elem.name = elem.fullName;

                    return elem;
                });

                self.collection = new filterCollection(res);
                self.filteredCollection = new filterCollection(res);
                self.filteredCollection.unbind();
                self.filteredCollection.bind('reset', resetCollection);
                self.render();
            });

            this.attribute = options.attribute;
            this.saveDeal = options.saveDeal;

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

        },

        events: {
            'click li'         : 'changeSelected',
            'click #newCompany': 'createCustomer'
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
            var optionsObject = {};

            optionsObject.saveDeal = this.saveDeal;

            new CreateView(optionsObject);
        },

        changeSelected: function (e) {
            var $target = $(e.target);
            var id = $target.closest('li').attr('data-id');
            var saveObject = {};

            saveObject.company = id;
            this.saveDeal(saveObject, 'formProperty');
        },

        renderContent: function () {
            var contentHolder = this.$el.find('#companyList');
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