define([
    'Backbone',
    'jQuery',
    'Underscore',
    'views/listViewBase',
    'text!templates/Persons/list/ListHeader.html',
    'views/Persons/CreateView',
    'views/Persons/list/ListItemView',
    'collections/Persons/filterCollection',
    'views/Filter/filterView',
    'common',
    'constants'
], function (Backbone, $, _, ListViewBase, listTemplate, CreateView, ListItemView, contentCollection, FilterView, common, CONSTANTS) {
    'use strict';

    var PersonsListView = ListViewBase.extend({
        CreateView       : CreateView,
        listTemplate     : listTemplate,
        ListItemView     : ListItemView,
        contentCollection: contentCollection,
        FilterView       : FilterView,
        formUrl          : '#easyErp/Persons/tform/',
        contentType      : 'Persons', // needs in view.prototype.changeLocationHash
        viewType         : 'list', // needs in view.prototype.changeLocationHash
        exportToXlsxUrl  : '/Customers/exportToXlsx/?type=Persons',
        exportToCsvUrl   : '/Customers/exportToCsv/?type=Persons',
        letterKey        : 'name.first',
        hasPagination    : true,
        hasAlphabet      : true,
        type             : 'Person',

        events: {
            'click .letter:not(.empty)': 'alpabeticalRender'
        },

        initialize: function (options) {
            this.mId = CONSTANTS.MID[this.contentType];
            this.startTime = options.startTime;
            this.collection = options.collection;
            // _.bind(this.collection.showMore, this.collection);
            _.bind(this.collection.showMoreAlphabet, this.collection);
            this.allAlphabeticArray = common.buildAllAphabeticArray();
            this.filter = options.filter;
            this.sort = options.sort;
            this.defaultItemsNumber = this.collection.namberToShow || 100;
            this.newCollection = options.newCollection;
            this.deleteCounter = 0;
            this.page = options.collection.currentPage;

            ListViewBase.prototype.initialize.call(this, options);
        },

        exportToXlsx: function () {
            var tempExportToXlsxUrl = '';

            if (this.exportToXlsxUrl) {
                tempExportToXlsxUrl = this.exportToXlsxUrl;
                if (this.filter) {
                    tempExportToXlsxUrl += '&filter=' + encodeURIComponent(JSON.stringify(this.filter));
                }
                window.location = tempExportToXlsxUrl;
            }
        },

        exportToCsv: function () {
            var tempExportToCsvUrl = '';

            if (this.exportToCsvUrl) {
                tempExportToCsvUrl = this.exportToCsvUrl;
                if (this.filter) {
                    tempExportToCsvUrl += '&filter=' + encodeURIComponent(JSON.stringify(this.filter));
                }
                window.location = tempExportToCsvUrl;
            }
        },

        gotoForm: function (e) {
            var id = $(e.target).closest('tr').data('id');
            var page = this.collection.currentPage;
            var countPerPage = this.collection.pageSize;
            var url = this.formUrl + id + '/p=' + page + '/c=' + countPerPage;

            if (this.filter) {
                url += '/filter=' + encodeURI(JSON.stringify(this.filter));
            }

            App.ownContentType = true;
            Backbone.history.navigate(url, {trigger: true});
        },

        render: function () {
            // var self = this;
            var $currentEl;

            $('.ui-dialog ').remove();

            $currentEl = this.$el;

            $currentEl.html('');
            $currentEl.append(_.template(this.listTemplate));

            if (!this.collection.length) {
                $currentEl.append('<h2 class="notFoundItems">No persons found</h2>');
                return;
            }

            $currentEl.append(new this.ListItemView({
                collection : this.collection,
                page       : this.page,
                itemsNumber: this.collection.pageSize
            }).render());
        }
    });

    return PersonsListView;
});
