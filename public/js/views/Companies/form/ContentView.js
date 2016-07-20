define([
    'jQuery',
    'Underscore',
    'views/listViewBase',
    'text!templates/Companies/form/ContentTemplate.html',
    'text!templates/Companies/form/ListItemTemplate.html',
    'models/CompaniesModel',
    'views/Companies/form/FormView',
    'views/Companies/CreateView',
    'views/Companies/list/ListItemView',
    'views/Filter/filterView',
    'common',
    'constants',
    'dataService',
], function ($, _, ListViewBase, ContentTemplate, ListItemTemplate, CompaniesModel, FormView, CreateView, ListItemView, FilterView, common, CONSTANTS, dataService) {
    'use strict';

    var CompaniesListView = ListViewBase.extend({
        listTemplate   : _.template(ListItemTemplate),
        contentTemplate: _.template(ContentTemplate),
        CreateView     : CreateView,
        ListItemView   : ListItemView,
        FilterView     : FilterView,
        formUrl        : '#easyErp/Companies/form/',
        contentType    : 'Companies', // needs in view.prototype.changeLocationHash
        viewType       : 'list', // needs in view.prototype.changeLocationHash
        //exportToXlsxUrl: '/Customers/exportToXlsx/?type=Persons',
        //exportToCsvUrl : '/Customers/exportToCsv/?type=Persons',
        //letterKey      : 'name.first',
        hasPagination  : true,
        hasAlphabet    : false,
        formView       : null,

        events: {
            'click .compactView': 'renderFormView',
            'click #sortBy'     : 'openSortDrop'
        },

        openSortDrop: function (e) {
            var $target = $(e.target);

            e.preventDefault();

            $target.closest('.dropDown').toggleClass('open');
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

            model = new CompaniesModel();

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
            var companies = this.collection.toJSON();

            $('.ui-dialog ').remove();

            $currentEl = this.$el;

            $currentEl.html(this.contentTemplate());
            $currentEl.find('#listContent').append(this.listTemplate({
                companies: companies
            }));

        }
    });

    return CompaniesListView;
});
