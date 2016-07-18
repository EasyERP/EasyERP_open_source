define([
    'jQuery',
    'Underscore',
    'views/listViewBase',
    'text!templates/Persons/form/ContentTemplate.html',
    'text!templates/Persons/form/ListItemTemplate.html',
    'models/PersonsModel',
    'views/Persons/form/FormView',
    'views/Persons/CreateView',
    'views/Persons/list/ListItemView',
    'views/Filter/filterView',
    'common',
    'constants',
    'dataService'
], function ($, _, ListViewBase, ContentTemplate, ListItemTemplate, PersonsModel, FormView, CreateView, ListItemView, FilterView, common, CONSTANTS, dataService) {
    'use strict';

    var PersonsListView = ListViewBase.extend({
        listTemplate   : _.template(ListItemTemplate),
        contentTemplate: _.template(ContentTemplate),
        CreateView     : CreateView,
        ListItemView   : ListItemView,
        FilterView     : FilterView,
        formUrl        : '#easyErp/Persons/form/',
        contentType    : 'Persons', // needs in view.prototype.changeLocationHash
        viewType       : 'list', // needs in view.prototype.changeLocationHash
        exportToXlsxUrl: '/Customers/exportToXlsx/?type=Persons',
        exportToCsvUrl : '/Customers/exportToCsv/?type=Persons',
        letterKey      : 'name.first',
        hasPagination  : true,
        hasAlphabet    : true,
        formView       : null,

        events: {
            'click .compactView': 'renderFormView'
        },

        initialize: function (options) {
            var modelId = options.modelId;

            this.mId = CONSTANTS.MID[this.contentType];
            this.startTime = options.startTime;
            this.collection = options.collection;
            this.filter = options.filter;
            this.sort = options.sort;
            this.defaultItemsNumber = this.collection.namberToShow || 100;
            this.newCollection = options.newCollection;
            this.deleteCounter = 0;
            this.page = options.collection.currentPage;

            ListViewBase.prototype.initialize.call(this, options);

            this.renderFormView(modelId);
        },


        renderFormView: function (e) {
            var $target;
            var modelId;
            var model;
            var self = this;

            if (e.hasOwnProperty('target')) {
                $target = $(e.target);
                modelId = $target.closest('.compactView').data('id');

            } else {
                modelId = e;
            }

            model = new PersonsModel();

            model.urlRoot = model.url() + modelId;

            model.fetch({
                success: function (model) {

                    if (self.formView) {
                        self.formView.undelegateEvents();
                    }

                    self.formView = new FormView({model: model, el: '#formContent'});
                    self.formView.render();
                },

                error: function () {

                }
            });
        },

        render: function () {
            var $currentEl;
            var persons = this.collection.toJSON();

            $('.ui-dialog ').remove();

            $currentEl = this.$el;

            $currentEl.html(this.contentTemplate());
            $currentEl.find('#listContent').append(this.listTemplate({
                persons: persons
            }));
        }
    });

    return PersonsListView;
});
