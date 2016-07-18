define([
    'jQuery',
    'Underscore',
    'views/listViewBase',
    'text!templates/Persons/form/ContentTemplate.html',
    'text!templates/Persons/form/ListItemTemplate.html',
    'views/Persons/CreateView',
    'views/Persons/list/ListItemView',
    'views/Filter/filterView',
    'common',
    'constants'
], function ($, _, ListViewBase, ContentTemplate, ListItemTemplate, CreateView, ListItemView, FilterView, common, CONSTANTS) {
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

        events: {
            'click .letter:not(.empty)': 'alpabeticalRender'
        },

        initialize: function (options) {
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
