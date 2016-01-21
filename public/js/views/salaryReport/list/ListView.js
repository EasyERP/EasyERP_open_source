/**
 * Created by liliy on 20.01.2016.
 */
define([
        "Backbone",
        "jQuery",
        "Underscore",
        'views/listViewBase',
        'text!templates/salaryReport/list/ListHeader.html',
        'views/salaryReport/list/ListItemView',
        'views/selectView/selectView',
        'views/Filter/FilterView',
        'collections/salaryReport/filterCollection',
        'constants',
        'async',
        'moment',
        'dataService'
    ],

    function (Backbone, $, _, listViewBase, listTemplate, listItemView, selectView, FilterView, reportCollection, CONSTANTS, async, moment, dataService) {
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

            events: {
                "click .current-selected"                          : "showNewSelect",
                "click .newSelectList li:not(.miniStylePagination)": "chooseOption",
                "click"                                            : "hideNewSelect",
                "click .oe_sortable"                                              : "goSort"
            },

            initialize: function (options) {
                this.startTime = options.startTime;
                this.collection = options.collection;
                _.bind(this.collection.showMore, this.collection);
                this.filter = options.filter || {};
                this.sort = options.sort || {};
                this.defaultItemsNumber = this.collection.namberToShow || 100;
                this.page = options.collection.page;

                this.year = options.year || (new Date()).getFullYear();

                this.render();

                this.contentCollection = reportCollection;
            },

            goSort: function (e) {
                var target = $(e.target);
                var currentParrentSortClass = target.attr('class');
                var sortClass = currentParrentSortClass.split(' ')[1];
                var dataSort = target.attr('data-sort').split('.');
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

                this.collection.sortByOrder(dataSort[0], dataSort[1], sortConst);

                this.$el.find("#listTable").html('');

                collection = this.collection.toJSON();

                itemView = new listItemView({
                    collection: collection,
                    year      : this.year,
                    month     : this.month
                });

                this.$el.append(itemView.render());
            },

            chooseOption: function (e) {
                this.hideNewSelect();

                var $target = $(e.target);
                var year = parseInt($target.text());

                this.yearElement.attr('data-content', year);
                this.yearElement.text(year);

                if (year !== (new Date()).getFullYear()) {
                    this.month = 12;
                } else {
                    this.month = (new Date()).getMonth() + 1;
                }

                this.year = year;

                var searchObject = {
                    year: year,
                    filter: this.filter
                };

                this.collection.showMore(searchObject);
            },

            showMoreContent: function (newModels) {
                var $currentEl = this.$el;
                var collection;
                var itemView;
                var self = this;

                this.$el.find("#listTable").html('');

                collection = newModels.toJSON();

                itemView = new listItemView({
                    collection: collection,
                    year      : this.year,
                    month     : this.month
                });

                $currentEl.append(itemView.render());

                $(document).on("click", function (e) {
                    self.hideNewSelect();
                });
            },

            showNewSelect: function (e) {
                var $target = $(e.target);
                e.stopPropagation();

                if ($target.attr('id') === 'selectInput') {
                    return false;
                }
                $target.append(this.ul);

                return false;
            },

            hideNewSelect: function () {
                this.$el.find('.newSelectList').remove();
            },

            yearForDD: function (context) {
                var year = new Date().getFullYear();
                dataService.getData('/employee/getYears', {}, function (response, context) {
                    var startYear = parseInt(response.min) || year;

                    context.ul = '<ul class="newSelectList">';

                    for (var i = year; i >= startYear; i--) {
                        context.ul = context.ul + '<li>' + i.toString() + '</li>';
                    }

                    context.ul = context.ul + '</ul>';
                }, context);
            },

            render: function () {
                var self = this;
                var $currentEl = this.$el;
                var collection;
                var itemView;

                var year = this.year;

                this.month = 12;

                if (year === (new Date()).getFullYear()) {
                    this.month = (new Date()).getMonth() + 1;
                }

                $currentEl.html('');
                $currentEl.append(_.template(listTemplate, {year: year}));

                this.yearElement = $currentEl.find('#yearSelect');

                collection = this.collection.toJSON();

                this.$el.find("#listTable").html('');

                itemView = new listItemView({
                    collection: collection,
                    year      : this.year,
                    month     : this.month
                });

                $currentEl.append(itemView.render());

                this.renderFilter(self);

                this.yearForDD(this);

                $(document).on("click", function (e) {
                    self.hideNewSelect();
                });

                return this;
            }
        });
        return ListView;
    });