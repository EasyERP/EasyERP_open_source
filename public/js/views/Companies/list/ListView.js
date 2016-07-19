define([
    'Backbone',
    'jQuery',
    'Underscore',
    'views/listViewBase',
    'text!templates/Companies/list/ListHeader.html',
    'views/Companies/CreateView',
    'views/Companies/list/ListItemView',
    'collections/Companies/filterCollection',
    'common',
    'constants'
], function (Backbone, $, _, ListViewBase, listTemplate, CreateView, ListItemView, contentCollection, common, CONSTANTS) {
    'use strict';

    var CompaniesListView = ListViewBase.extend({

        CreateView       : CreateView,
        listTemplate     : listTemplate,
        ListItemView     : ListItemView,
        contentCollection: contentCollection,
        contentType      : 'Companies',
        formUrl          : '#easyErp/Companies/tform/',
        exportToXlsxUrl  : '/Customers/exportToXlsx/?type=Companies',
        exportToCsvUrl   : '/Customers/exportToCsv/?type=Companies',
        letterKey        : 'name.first',
        hasPagination    : true,
        hasAlphabet      : true,

        events: {
            'click .letter:not(.empty)': 'alpabeticalRender'
        },

        initialize: function (options) {
            this.mId = CONSTANTS.MID[this.contentType];
            this.startTime = options.startTime;
            this.collection = options.collection;
            _.bind(this.collection.showMoreAlphabet, this.collection);
            this.allAlphabeticArray = common.buildAllAphabeticArray();
            this.filter = options.filter;
            this.defaultItemsNumber = this.collection.namberToShow || 100;
            this.newCollection = options.newCollection;

            this.deleteCounter = 0;
            this.page = options.collection.currentPage;

            ListViewBase.prototype.initialize.call(this, options);

            this.contentCollection = contentCollection;
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

            /*if(this.filter) {
             url += '/filter=' + this
             }*/

            App.ownContentType = true;
            Backbone.history.navigate(url, {trigger: true});
        },

        render: function () {
            var $currentEl;
            var self;

            $('.ui-dialog ').remove();

            self = this;
            $currentEl = this.$el;

            $currentEl.html('');
            $currentEl.append(_.template(this.listTemplate));
            $currentEl.append(new this.ListItemView({
                collection : this.collection,
                page       : this.page,
                itemsNumber: this.collection.pageSize
            }).render());

            //this.renderAlphabeticalFilter(this);
            //this.renderPagination($currentEl, this);
            //
            //$currentEl.append('<div id="timeRecivingDataFromServer">Created in ' + (new Date() - this.startTime) + ' ms</div>');
            //
            //this.renderFilter();
        }
    });

    return CompaniesListView;
});
