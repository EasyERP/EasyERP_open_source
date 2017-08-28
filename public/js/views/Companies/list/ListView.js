define([
    'Backbone',
    'jQuery',
    'Underscore',
    'views/listViewBase',
    'text!templates/Companies/list/ListHeader.html',
    'views/Companies/CreateView',
    'views/Companies/list/ListItemView',
    'collections/Companies/filterCollection',
    'views/guideTours/guideNotificationView',
    'common',
    'constants',
    'helpers/ga',
    'constants/googleAnalytics'
], function (Backbone, $, _, ListViewBase, listTemplate, CreateView, ListItemView, contentCollection,GuideNotify, common, CONSTANTS, ga, GA) {
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
        type             : 'Company',

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

            if (this.filter) {
                url += '/filter=' + encodeURI(JSON.stringify(this.filter));
            }

            App.ownContentType = true;
            Backbone.history.navigate(url, {trigger: true});

            ga && ga.event({
                eventCategory: GA.EVENT_CATEGORIES.USER_ACTION,
                eventAction  : GA.EVENT_ACTIONS.COMPANIES,
                eventLabel   : GA.EVENT_LABEL.LIST_EDITING,
                eventValue   : GA.EVENTS_VALUES[35],
                fieldsObject : {}
            });
        },

        render: function () {
            var $currentEl;
            var self;

            $('.ui-dialog ').remove();

            self = this;
            $currentEl = this.$el;

            $currentEl.html('');
            $currentEl.append(_.template(this.listTemplate));

            if (!this.collection.length) {
                $currentEl.append('<h2 class="notFoundItems">No companies found</h2>');
                return;
            }

            $currentEl.append(new this.ListItemView({
                collection : this.collection,
                page       : this.page,
                itemsNumber: this.collection.pageSize
            }).render());

            if (App.guide) {
                if (App.notifyView) {
                    App.notifyView.undelegateEvents();
                    App.notifyView.stopListening();
                }
                App.notifyView = new GuideNotify({e: null, data: App.guide});
            }
        }
    });

    return CompaniesListView;
});
