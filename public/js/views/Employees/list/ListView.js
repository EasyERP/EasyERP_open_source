define([
    'jQuery',
    'Underscore',
    'views/listViewBase',
    'text!templates/Employees/list/ListHeader.html',
    'views/Employees/CreateView',
    'views/Employees/EditView',
    'views/Employees/list/ListItemView',
    'views/Filter/FilterView',
    'views/Employees/form/FormView',
    'collections/Employees/filterCollection',
    'models/EmployeesModel',
    'common'
], function ($, _, listViewBase, listTemplate, CreateView, EditView, ListItemView, filterView, FormView, contentCollection, CurrentModel, common) {
    'use strict';
    var EmployeesListView = listViewBase.extend({
        CreateView       : CreateView,
        listTemplate     : listTemplate,
        ListItemView     : ListItemView,
        contentCollection: contentCollection,
        filterView       : filterView,
        contentType      : 'Employees',
        formUrl          : '#easyErp/Employees/',
        formView         : FormView,
        exportToXlsxUrl  : '/employees/exportToXlsx',
        exportToCsvUrl   : '/employees/exportToCsv',
        events           : {
            click                         : 'hideItemsNumber',
            'click .letter:not(.empty)'   : 'alpabeticalRender',
            'click .list td:not(.notForm)': 'gotoEditForm'
        },

        initialize: function (options) {
            this.startTime = options.startTime;
            this.collection = options.collection;
            _.bind(this.collection.showMoreAlphabet, this.collection);
            this.allAlphabeticArray = common.buildAllAphabeticArray();
            this.filter = options.filter;
            this.defaultItemsNumber = this.collection.namberToShow || 100;
            this.deleteCounter = 0;
            this.page = options.collection.currentPage;
            this.contentCollection = contentCollection;

            this.render();
        },

        gotoEditForm: function (e) {
            var id = $(e.target).closest('tr').data('id');
            var model = new CurrentModel({validate: false});

            e.preventDefault();

            model.urlRoot = '/employees/';
            model.fetch({
                data   : {id: id},
                success: function (response) {
                    new EditView({model: response});
                },

                error: function () {
                    App.render({
                        type   : 'error',
                        message: 'Please refresh browser'
                    });
                }
            });
        },

        render: function () {
            var self;
            var $currentEl;

            $('.ui-dialog ').remove();

            self = this;
            $currentEl = this.$el;

            $currentEl.html('');
            $currentEl.append(_.template(this.listTemplate));
            $currentEl.append(new this.ListItemView({
                collection : this.collection,
                page       : this.page,
                itemsNumber: this.collection.namberToShow
            }).render());

            this.renderCheckboxes();
            this.renderAlphabeticalFilter(this);
            this.renderPagination($currentEl, this);
            this.renderFilter(self);

            $currentEl.append('<div id="timeRecivingDataFromServer">Created in ' + (new Date() - this.startTime) + ' ms</div>');

        }

    });

    return EmployeesListView;
});
