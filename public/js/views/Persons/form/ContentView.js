define([
    'Backbone',
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
], function (Backbone, $, _, ListViewBase, ContentTemplate, ListItemTemplate, PersonsModel, FormView, CreateView, ListItemView, FilterView, common, CONSTANTS, dataService) {
    'use strict';

    var PersonsListView = ListViewBase.extend({
        listTemplate   : _.template(ListItemTemplate),
        contentTemplate: _.template(ContentTemplate),
        CreateView     : CreateView,
        ListItemView   : ListItemView,
        FilterView     : FilterView,
        listUrl        : 'easyErp/Persons/list/',
        contentType    : 'Persons', // needs in view.prototype.changeLocationHash
        viewType       : 'tform', // needs in view.prototype.changeLocationHash
        exportToXlsxUrl: '/Customers/exportToXlsx/?type=Persons',
        exportToCsvUrl : '/Customers/exportToCsv/?type=Persons',
        letterKey      : 'name.first',
        hasPagination  : true,
        hasAlphabet    : false,
        formView       : null,
        paginationEl   : '#listPagination',
        selectedId     : null,

        events: {
            'click .compactView': 'renderFormView',
            'click .closeBtn'   : 'returnToList'
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

        returnToList: function (e) {
            var url;
            var currentPage = this.collection.currentPage;
            var count = this.collection.pageSize;
            e.preventDefault();

            url = this.listUrl + 'p=' + currentPage + '/c=' + count;

            Backbone.history.navigate(url, {trigger: true});
        },

        renderFormView: function (e) {
            var $thisEl = this.$el;
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

                    $thisEl.find('#listContent .selected').removeClass('selected');
                    $thisEl.find('tr[data-id="' + modelId + '"]').addClass('selected');
                    self.selectedId = model.id;

                    self.changeLocationHash(self.page, self.count, self.filter);
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
