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
        'async',
        'moment',
        'dataService',
    'helpers'
    ],

    function ($, _, listViewBase, listTemplate, ListItemView, FilterView, reportCollection, CONSTANTS, async, moment, dataService, helpers) {
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
                this.filter = options.filter || {};
                this.sort = options.sort || {};
                this.defaultItemsNumber = this.collection.namberToShow || 100;
                this.page = options.collection.page;

                this.startDate = options.startDate;
                this.endDate = options.endDate;

                this.render();

                this.contentCollection = reportCollection;
            },

            goSort: function (e) {
                var target = $(e.target);
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

                this.startKey = moment(this.startDate).year() * 100 + moment(this.startDate).month();
                this.endKey = moment(this.endDate).year() * 100 + moment(this.endDate).month();

                var searchObject = {
                    startDate  : this.startDate,
                    endDate: this.endDate,
                    filter: this.filter
                };

                this.collection.showMore(searchObject);
            },

            showMoreContent: function (newModels) {
                var $currentEl = this.$el;
                var collection;
                var itemView;

                $currentEl.find('#salaryReport').html('');
                $currentEl.find('#salaryReport').html(_.template(listTemplate, {weekSplitter: helpers.weekSplitter, startKey: this.startKey, endKey: this.endKey}));


                this.$el.find("#listTable").html('');

                collection = newModels.toJSON();

                itemView = new ListItemView({
                    collection: collection,
                    startDate : this.startDate,
                    endDate   : this.endDate
                });

                $currentEl.append(itemView.render());
            },

            getMinDate: function (context) {
                dataService.getData('/employee/getYears', {}, function (response, context) {
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
                $currentEl.append(_.template(listTemplate, {weekSplitter: helpers.weekSplitter, startKey: this.startKey, endKey: this.endKey}));

                this.yearElement = $currentEl.find('#yearSelect');

                collection = this.collection.toJSON();

                this.$el.find("#listTable").html('');

                itemView = new ListItemView({
                    collection: collection,
                    startDate : this.startDate,
                    endDate   : this.endDate
                });

                $currentEl.append(itemView.render());

                this.renderFilter(self);

                this.getMinDate(this);

                return this;
            }
        });
        return ListView;
    });