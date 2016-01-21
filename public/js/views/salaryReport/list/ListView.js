/**
 * Created by liliy on 20.01.2016.
 */
define([
        "Backbone",
        "jQuery",
        "Underscore",
        'text!templates/salaryReport/list/ListHeader.html',
        'views/salaryReport/list/ListItemView',
        'views/selectView/selectView',
        'collections/salaryReport/filterCollection',
        'constants',
        'async',
        'moment',
        'dataService'
    ],

    function (Backbone, $, _, listTemplate, listItemView, reportCollection, SelectView, CONSTANTS, async, moment, dataService) {
        var ListView = Backbone.View.extend({
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
            responseObj: {},

            events: {
                "click .current-selected"             : "showNewSelect",
                "click .newSelectList li:not(.miniStylePagination)": "chooseOption",
                "click"                                            : "hideNewSelect"
            },

            initialize: function (options) {
                this.startTime = options.startTime;
                this.collection = options.collection;
                _.bind(this.collection.showMore, this.collection);
                this.filter = options.filter ? options.filter : {};
                this.sort = options.sort ? options.sort : {};
                this.defaultItemsNumber = this.collection.namberToShow || 100;
                this.page = options.collection.page;

                this.year = options.year || (new Date()).getFullYear();

                this.render();

                this.contentCollection = reportCollection;
            },

            showNewSelect: function (e) {
                var $target = $(e.target);
                e.stopPropagation();

                if ($target.attr('id') === 'selectInput') {
                    return false;
                }

                if (this.selectView) {
                    this.selectView.remove();
                }

                this.selectView = new SelectView({
                    e          : e,
                    responseObj: this.responseObj
                });

                $target.append(this.selectView.render().el);

                return false;
            },

            hideNewSelect: function () {
                this.$el.find('.newSelectList').hide();

                if (this.selectView) {
                    this.selectView.remove();
                }
            },

            yearForDD: function (content) {
                var year = new Date().getFullYear();
                dataService.getData('/employee/getYears', {}, function (response, context) {
                    var result = [];
                    var startYear = parseInt(response) || year;

                    for (var i = year; i >= startYear; i--) {
                        result.push({
                            _id : i,
                            name: i
                        });
                    }
                    context.responseObj['#yearSelect'] = result;
                }, content);
            },

            render: function () {
                var self = this;
                var $currentEl = this.$el;
                var collection;
                var itemView;

                var year = this.year;
                var month = 12;

                if (year === (new Date()).getFullYear()){
                    month = (new Date()).getMonth() + 1;
                }

                $currentEl.html('');
                $currentEl.append(_.template(listTemplate, {year: year}));

                this.yearElement = $currentEl.find('#yearSelect');

                collection = this.collection.toJSON();

                this.$el.find("#listTable").html('');

                itemView = new listItemView({
                    collection: collection,
                    year: this.year,
                    month: month
                });

                $currentEl.append(itemView.render());

                this.yearForDD(this);

                $(document).on("click", function (e) {
                    self.hideNewSelect();
                });

                $currentEl.append("<div id='timeRecivingDataFromServer'>Created in " + (new Date() - this.startTime) + " ms</div>");
           return this;
            }
        });
        return ListView;
    });