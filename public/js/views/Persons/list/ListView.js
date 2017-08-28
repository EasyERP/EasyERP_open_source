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
    'views/guideTours/guideNotificationView',
    'dataService',
    'common',
    'constants'
], function (Backbone, $, _, ListViewBase, listTemplate, CreateView, ListItemView, contentCollection, FilterView, GuideNotify, dataService, common, CONSTANTS) {
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
        letterKey        : 'name.last',
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
            this.allAlphabeticArray = common.buildAllAphabeticArray(this.contentType);
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

        importFromMagento: function () {
            var url = '/integration/customers';
            var self = this;

            dataService.getData(url, {}, function (err, result) {
                if (err) {
                    return self.errorNotification(err);
                }

                self.render();
            });
        },

        exportToMagento: function () {
            var url = '/integration/customers';
            var data = {};
            var self = this;
            var $thisEl = this.$el;
            var $table = $thisEl.find('#listTable');
            var temportaryArr = [];
            var customers = [];
            var $checkedInputs;
            var $el;

            $checkedInputs = $table.find('input:checked');

            $.each($checkedInputs, function () {
                $el = $(this);

                //temportaryArr = _.where(self.collection.toJSON(), {_id: $el.val()});
                //customers = customers.concat(temportaryArr);
                customers.push($el.val());
            });

            data = {
                customers: customers
            };

            dataService.postData(url, data, function (err, result) {
                if (err) {
                    return self.errorNotification(err);
                }
                alert(result.success);
            });
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

            if (App.guide) {
                if (App.notifyView) {
                    App.notifyView.undelegateEvents();
                    App.notifyView.stopListening();
                }
                App.notifyView = new GuideNotify({e: null, data: App.guide});
            }
        }
    });

    return PersonsListView;
});
