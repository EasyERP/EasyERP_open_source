/**
 * Created by liliy on 21.03.2016.
 */
"use strict";
define([
        "jQuery",
        "Underscore",
        'views/listViewBase',
        'views/PayrollExpenses/generate/GenerateView',
        'text!templates/closeMonth/list/ListHeader.html',
        'views/closeMonth/list/ListItemView',
        'views/Filter/FilterView',
        'collections/closeMonth/filterCollection',
        'constants',
        'dataService',
        'helpers',
        'custom',
        'async',
        'common',
        'moment'
    ],

    function ($, _, listViewBase, GenerateView, listTemplate, ListItemView, FilterView, reportCollection, CONSTANTS, dataService, helpers, custom, async, common, moment) {
        var ListView = listViewBase.extend({
            el                : '#content-holder',
            defaultItemsNumber: null,
            listLength        : null,
            filter            : null,
            sort              : null,
            newCollection     : null,
            page              : null,
            contentType       : CONSTANTS.CLOSEMONTH,//needs in view.prototype.changeLocationHash
            viewType          : 'list',//needs in view.prototype.changeLocationHash
            yearElement       : null,
            filterView        : FilterView,

            events: {
                'click .mainTr': 'showHidden'
            },

            initialize: function (options) {
                this.startTime = options.startTime;
                this.collection = options.collection;

                this.render();
            },

            generate: function (e) {
                var keys = [];

                this.collection.toJSON().forEach(function (el) {
                    var month = moment(el._id).month() + 1;
                    var year = moment(el._id).isoWeekYear();
                    var key = year * 100 + month;
                    keys.push(key.toString());
                });

                new GenerateView({keys: keys, url: '/journal/journalEntry/closeMonth'});
            },

            showHidden: function (e) {
                var $target = $(e.target);
                var $tr = $target.closest('tr');
                var dataId = $tr.attr('data-id');
                var $body = this.$el;
                var childTr = $body.find("[data-main='" + dataId + "']");
                var sign = $.trim($tr.find('.expand').text());

                if (sign === '+') {
                    $tr.find('.expand').text('-');
                } else {
                    $tr.find('.expand').text('+');
                }

                childTr.toggleClass();
            },

            asyncRenderInfo: function (asyncKeys) {
                var body = this.$el;

                async.each(asyncKeys, function (asyncId) {
                    dataService.getData('/journal/journalEntry/getAsyncCloseMonth', {
                        _id: asyncId
                    }, function (result) {
                        var journalEntries = result.journalEntries;
                        var mainTr = body.find("[data-id='" + asyncId + "']");
                        journalEntries.forEach(function (entry) {
                            mainTr.after("<tr data-main='" + asyncId + "' class='hidden'><td colspan='2' class='leftBorderNone'>" + entry.journal.name +"</td><td>" + common.utcDateToLocaleFullDateTime(entry.date) + "</td><td>" + (entry.debit ? helpers.currencySplitter((entry.debit / 100).toFixed(2)) : helpers.currencySplitter((entry.credit / 100).toFixed(2))) + "</td></tr>");
                        });
                    });

                });

            },

            render: function () {
                var $currentEl = this.$el;
                var collection;
                var itemView;
                var asyncKeys = [];

                $currentEl.html('');
                $currentEl.append(_.template(listTemplate));

                collection = this.collection.toJSON();

                itemView = new ListItemView({
                    collection: collection,
                    moment    : moment
                });

                collection.forEach(function (el) {
                    asyncKeys.push(el._id);
                });

                $currentEl.append(itemView.render());

                this.asyncRenderInfo(asyncKeys);

                return this;
            }
        });
        return ListView;
    });