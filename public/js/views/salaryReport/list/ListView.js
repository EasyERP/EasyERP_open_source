/**
 * Created by liliy on 20.01.2016.
 */
"use strict";
define([
        "jQuery",
        "Underscore",
        'views/listViewBase',
        'text!templates/salaryReport/list/ListHeader.html',
        'views/salaryReport/list/ListItemView',
        'views/Filter/FilterView',
        'collections/salaryReport/filterCollection',
        'constants',
        'moment',
        'dataService',
        'helpers',
        'custom'
    ],

    function ($, _, listViewBase, listTemplate, ListItemView, FilterView, reportCollection, CONSTANTS, moment, dataService, helpers, custom) {
        var ListView = listViewBase.extend({
            el                : '#content-holder',
            defaultItemsNumber: null,
            listLength        : null,
            filter            : null,
            sort              : null,
            newCollection     : null,
            page              : null,
            contentType       : CONSTANTS.SALARYREPORT,//needs in view.prototype.changeLocationHash
            viewType          : 'list',//needs in view.prototype.changeLocationHash
            yearElement       : null,
            filterView        : FilterView,

            initialize: function (options) {
                this.startTime = options.startTime;
                this.collection = options.collection;
                _.bind(this.collection.showMore, this.collection);
                this.sort = options.sort || {};
                this.defaultItemsNumber = this.collection.namberToShow || 100;
                this.page = options.collection.page;
                var dateRange = custom.retriveFromCash('salaryReportDateRange');

                this.filter = options.filter || custom.retriveFromCash('salaryReport.filter');

                if (!this.filter) {
                    this.filter = {};
                }

                if (!this.filter.startDate) {
                    this.filter.startDate = {
                        key  : 'startDate',
                        value: new Date(dateRange.startDate)
                    };
                    this.filter.endDate = {
                        key  : 'endDate',
                        value: new Date(dateRange.endDate)
                    };
                }

                this.startDate = new Date(this.filter.startDate.value);
                this.endDate = new Date(this.filter.endDate.value);

                this.render();

                this.contentCollection = reportCollection;
                custom.cacheToApp('salaryReport.filter', this.filter);
            },

            goSort: function (e) {
                var target = $(e.target).closest('th');
                var currentParrentSortClass = target.attr('class');
                var sortClass = currentParrentSortClass.split(' ')[1];
                var dataSort = target.attr('data-sort');
                var sortConst = 1;
                var collection;
                var itemView;

                if (!sortClass) {
                    target.addClass('sortDn');
                    sortClass = "sortDn";
                }
                switch (sortClass) {
                    case "sortDn":
                    {
                        target.parent().find("th").removeClass('sortDn').removeClass('sortUp');
                        target.removeClass('sortDn').addClass('sortUp');
                        sortConst = -1;
                    }
                        break;
                    case "sortUp":
                    {
                        target.parent().find("th").removeClass('sortDn').removeClass('sortUp');
                        target.removeClass('sortUp').addClass('sortDn');
                        sortConst = 1;
                    }
                        break;
                }

                this.collection.sortByOrder(dataSort, sortConst);

                this.$el.find("#listTable").html('');

                collection = this.collection.toJSON();

                itemView = new ListItemView({
                    collection: collection,
                    startDate : this.startDate,
                    endDate   : this.endDate
                });

                this.$el.append(itemView.render());
            },

            changeDateRange: function () {
                var stDate = $('#startDate').val();
                var enDate = $('#endDate').val();

                this.startDate = new Date(stDate);
                this.endDate = new Date(enDate);

                if (!this.filter) {
                    this.filter = {};
                }

                this.filter.startDate = {
                    key  : 'startDate',
                    value: stDate
                };

                this.filter.endDate = {
                    key  : 'endDate',
                    value: enDate
                };

                this.startKey = moment(this.startDate).year() * 100 + moment(this.startDate).month();
                this.endKey = moment(this.endDate).year() * 100 + moment(this.endDate).month();

                var searchObject = {
                    startDate: this.startDate,
                    endDate  : this.endDate,
                    filter   : this.filter
                };

                this.collection.showMore(searchObject);

                App.filter = this.filter;

                custom.cacheToApp('salaryReport.filter', this.filter);
            },

            showMoreContent: function (newModels) {
                var $currentEl = this.$el;
                var collection;
                var itemView;

                $currentEl.find('#salaryReport').html('');
                $currentEl.find('#salaryReport').html(_.template(listTemplate, {
                    weekSplitter: helpers.weekSplitter,
                    startKey: this.startKey,
                    endKey: this.endKey
                }));

                this.$el.find("#listTable").html('');

                collection = newModels.toJSON();

                itemView = new ListItemView({
                    collection: collection,
                    startDate : this.startDate,
                    endDate   : this.endDate
                });

                $currentEl.append(itemView.render());
            },

            showFilteredPage: function (filter, context) {
                var itemsNumber = $("#itemsNumber").text();

                context.startTime = new Date();
                context.newCollection = false;

                this.filter = Object.keys(filter).length === 0 ? {} : filter;

                context.changeLocationHash(1, itemsNumber, filter);
                context.collection.showMore({
                    count: itemsNumber,
                    page: 1,
                    filter: filter,
                    startDate: this.startDate,
                    endDate: this.endDate
                });
            },

            getMinDate: function (context) {
                dataService.getData('/employee/getYears', {}, function (response) {
                    var minDate = new Date(response.min);

                    $('#startDate').datepicker('option', 'minDate', minDate);
                }, context);
            },

            render: function () {
                var self = this;
                var $currentEl = this.$el;
                var collection;
                var itemView;

                this.startKey = moment(this.startDate).year() * 100 + moment(this.startDate).month();
                this.endKey = moment(this.endDate).year() * 100 + moment(this.endDate).month();

                $currentEl.html('');
                $currentEl.append(_.template(listTemplate, {
                    weekSplitter: helpers.weekSplitter,
                    startKey: this.startKey,
                    endKey: this.endKey
                }));

                this.yearElement = $currentEl.find('#yearSelect');

                collection = this.collection.toJSON();

                this.$el.find("#listTable").html('');

                itemView = new ListItemView({
                    collection: collection,
                    startDate : this.startDate,
                    endDate   : this.endDate
                });

                $currentEl.append(itemView.render());

                App.filter = this.filter;

                this.renderFilter(self);

                this.getMinDate(this);

                return this;
            }
        });
        return ListView;
    });