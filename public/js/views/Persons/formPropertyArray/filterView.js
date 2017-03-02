define([
    'Backbone',
    'jQuery',
    'Underscore',
    'text!templates/Persons/formPropertyArray/filterViewList.html',
    'text!templates/Persons/formPropertyArray/filterViewContent.html',
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
            this.isLead = options.isLead;

            function resetCollection() {
                self.renderContent(self.e);
            }

            this.company = options.company;
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

            new CreateView({company: this.company});
        },

        changeSelected: function (e) {
            var $target = $(e.target);
            var id = $target.closest('li').attr('data-id');

            e.preventDefault();

            this.model.set({_id: id});
            this.model.save({company: this.company}, {
                validate: false,
                patch   : true,
                success : function (err, res) {
                    Backbone.history.fragment = '';
                    Backbone.history.navigate(window.location.hash, {trigger: true});
                }
            });
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