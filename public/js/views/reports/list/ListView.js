define([
    'Backbone',
    'jQuery',
    'Underscore',
    'models/CustomReportsModel',
    'views/listViewBase',
    'text!templates/reports/list/ListHeader.html',
    'views/reports/list/ListItemView',
    'views/reports/EditView',
    'helpers/exportToPdf',
    'constants/customReports',
    'dataService'
], function (Backbone,
             $,
             _,
             CustomReportsModel,
             ListViewBase,
             listTemplate,
             ListItemView,
             EditView,
             exportToPdf,
             constants,
             dataService) {
    'use strict';

    var ContentView = ListViewBase.extend({
        listTemplate: _.template(listTemplate),

        viewType       : 'list',
        contentType    : 'reports',
        ListItemView   : ListItemView,
        exportToXlsxUrl: '/reports/exportToXLS/',
        exportToCsvUrl : '/reports/exportToCsv/',

        initialize: function (options) {
            this.collection = options.collection;
            this.sort = options.sort;
            this.page = options.collection.currentPage;
            this.modelId = options.modelId;

            ListViewBase.prototype.initialize.call(this, options);
        },

        exportToXlsx: function () {
            var tempExportToXlsxUrl = '';

            if (this.exportToXlsxUrl) {
                tempExportToXlsxUrl = this.exportToXlsxUrl + this.modelId;

                if (this.sort) {
                    tempExportToXlsxUrl += '?sort=' + encodeURIComponent(JSON.stringify(this.sort));
                }

                if (this.filter) {
                    tempExportToXlsxUrl += '&filter=' + encodeURIComponent(JSON.stringify(this.filter));
                }

                window.location = tempExportToXlsxUrl;
            }
        },

        exportToCsv: function () {
            var tempExportToCsvUrl = '';

            if (this.exportToCsvUrl) {
                tempExportToCsvUrl = this.exportToCsvUrl + this.modelId;

                if (this.sort) {
                    tempExportToCsvUrl += '?sort=' + encodeURIComponent(JSON.stringify(this.sort));
                }

                if (this.filter) {
                    tempExportToCsvUrl += '&filter=' + encodeURIComponent(JSON.stringify(this.filter));
                }

                window.location = tempExportToCsvUrl;
            }
        },

        editItem: function () {
            var self = this;
            var model = new CustomReportsModel({id: this.modelId});
            var currentModel;

            model.fetch({
                success: function (result) {
                    result = result.toJSON()['0'];
                    currentModel = _.find(result.all, function (item) {
                        return item._id === self.modelId;
                    });

                    return new EditView({model: currentModel || {}});
                },
                error  : function (xhr) {
                    self.errorNotification(xhr);
                }
            });

        },

        exportToPdf: function () {
            var template = this.$el.find('#toPdf').html();
            var typeReport = this.collection.reportType;
            var constantsTypesReport = constants.typesReports;

            exportToPdf.takeFile({
                file: template,
                name: constantsTypesReport[typeReport]
            });
        },

        goSort: function (e) {
            var $targetEl;
            var newRows = this.$el.find('#false').length ? this.$el.find('#false') : this.$el.find('.false');
            var filter = this.filter || {};
            var target$;
            var currentParrentSortClass;
            var sortClass;
            var sortConst;
            var sortBy;
            var sortObject;
            var data;
            var el = 'div';

            this.startTime = new Date();

            if ((this.changed && this.changedModels && Object.keys(this.changedModels).length) ||
                (this.isNewRow ? this.isNewRow() : newRows.length)) {
                return App.render({
                    type   : 'notify',
                    message: 'Please, save previous changes or cancel them!'
                });
            }

            // target$ = $(e.target).closest('th');

            if ($(e.target).closest('th') && $(e.target).closest('th').length) {
                target$ = $(e.target).closest('th').find('.oe_sortable');
            } else {
                target$ = $(e.target).closest('li');
                el = 'li';
            }

            currentParrentSortClass = target$.attr('class');
            sortClass = currentParrentSortClass.split(' ')[2];
            sortConst = 1;
            sortBy = target$.data('sort').split(' ');
            sortObject = {};

            if (!sortClass) {
                target$.addClass('sortUp');
                sortClass = 'sortUp';
            }

            switch (sortClass) {
                case 'sortDn':
                    target$.closest('th').closest('table').find(el).removeClass('sortDn').removeClass('sortUp');
                    target$.removeClass('sortDn').addClass('sortUp');
                    sortConst = 1;
                    break;
                case 'sortUp':
                    target$.closest('th').closest('table').find(el).removeClass('sortDn').removeClass('sortUp');
                    target$.removeClass('sortUp').addClass('sortDn');
                    sortConst = -1;
                    break;
                // skip default case
            }

            sortBy.forEach(function (sortField) {
                sortObject[sortField] = sortConst;
            });

            this.sort = sortObject;

            data = {
                sort: sortObject
            };

            data.filter = filter;

            if (this.viewType) {
                data.viewType = this.viewType;
            }

            if (this.parrentContentId) {
                data.parrentContentId = this.parrentContentId;
            }

            data.contentType = this.contentType || 'reports';
            data.modelId = this.modelId;

            this.collection.getFirstPage(data);
        },

        showMoreContent: function (newModels) {
            var $holder = this.$el;
            var constantsDataType = constants.dataType;
            var typeReport = this.collection.reportType;
            var categoryReport = this.collection.reportCategory;
            var headers = this.collection.reportHeaderMapper;
            var constantsReports = constants.reports;
            var itemView;
            var pagenation;

            $holder.find('#listTable').empty();

            itemView = new this.ListItemView({
                collection: this.collection,
                dataTypes : constantsDataType[categoryReport][typeReport],
                headers   : headers,
                page      : this.collection.currentPage,
                groupBy   : constantsReports[categoryReport] && constantsReports[categoryReport][typeReport] && constantsReports[categoryReport][typeReport][0] ? constantsReports[categoryReport][typeReport][0].groupBy : ''
            });

            $holder.append(itemView.render());

            itemView.undelegateEvents();

            $holder.find('#timeRecivingDataFromServer').remove();
            $holder.append('<div id="timeRecivingDataFromServer">Created in ' + (new Date() - this.startTime) + ' ms</div>');
        },

        render: function () {
            var $thisEl = this.$el;
            var self = this;
            var itemView;
            var collection = this.collection.toJSON();
            var typeReport = this.collection.reportType;
            var categoryReport = this.collection.reportCategory;
            var headers = this.collection.reportHeaderMapper;
            var constantsReports = constants.reports;
            var constantsDataType = constants.dataType;
            var constantsTypesReport = constants.typesReports;

            $thisEl.html('');
            $thisEl.append(this.listTemplate({
                constants : constantsReports[categoryReport] && constantsReports[categoryReport][typeReport] && constantsReports[categoryReport][typeReport][0],
                headers   : headers,
                collection: collection,
                type      : typeReport
            }));

            itemView = new ListItemView({
                headers   : headers,
                dataTypes : constantsDataType[categoryReport][typeReport],
                page      : this.page,
                collection: this.collection,
                groupBy   : constantsReports[categoryReport] && constantsReports[categoryReport][typeReport] && constantsReports[categoryReport][typeReport][0] ? constantsReports[categoryReport][typeReport][0].groupBy : ''
            });

            $('#top-bar-edit').removeClass('hidden');
            $('#top-bar-back').removeClass('hidden');
            $('#top-bar-createBtn').hide();
            $('#topBarHead').text(constantsTypesReport[typeReport]);

            $thisEl.append(itemView.render(typeReport));

            this.$el.find('table').dragtable({
                persistState: function (table) {
                    var rows = [];

                    table.el.find('th').each(function () {
                        rows.push($(this).attr('data-name'));
                    });

                    dataService.patchData('/reports/' + self.modelId, {rows: rows}, function () {
                        App.stopPreload();
                    });
                },
                dragHandle  : '.dragHandle'
            });

        }
    });

    return ContentView;
});
