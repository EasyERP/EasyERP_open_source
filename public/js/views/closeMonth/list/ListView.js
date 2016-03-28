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

            reclose: function () {
                var dates = [];
                var checked = $("input.checkbox:checked");
                var url;

                this.url = '/journal/journalEntry/recloseMonth';

                checked.each(function (ind, el) {
                    dates.push(el.value);
                });

                $.ajax({
                    type       : 'POST',
                    url        : this.url,
                    contentType: "application/json",
                    data       : JSON.stringify(dates),

                    success: function () {
                        url = window.location.hash;

                        Backbone.history.fragment = '';
                        Backbone.history.navigate(url, {trigger: true});

                    },
                    error  : function () {
                        App.render({
                            type   : 'error',
                            message: "error"
                        });
                    }
                });
            },

            checked: function (e) {
                e.stopPropagation();
                var checkLength;
                var checkAll$;

                if (this.collection.length > 0) {

                    checkLength = $("input.checkbox:checked").length;
                    if (checkLength > 0) {
                        this.reclose.show();
                        this.close.hide();
                        checkAll$ = $('#check_all');
                        checkAll$.prop('checked', false);

                        if (checkLength === this.collection.length) {
                            checkAll$.prop('checked', true);
                        }
                    }
                    else {
                        this.reclose.hide();
                        this.close.show();
                        checkAll$ = $('#check_all');
                        checkAll$.prop('checked', false);
                    }
                }
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
                            mainTr.after("<tr data-main='" + asyncId + "' class='hidden'><td colspan='3' class='leftBorderNone'>" + entry.journal.name + "</td><td>" + common.utcDateToLocaleFullDateTime(entry.date) + "</td><td>" + (entry.debit ? helpers.currencySplitter((entry.debit / 100).toFixed(2)) : helpers.currencySplitter((entry.credit / 100).toFixed(2))) + "</td></tr>");
                        });
                    });

                });

            },

            render: function () {
                var $currentEl = this.$el;
                var collection;
                var itemView;
                var asyncKeys = [];
                var allInputs;
                var checkedInputs;
                var self = this;

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

                this.reclose = $('#top-bar-reclose');
                this.close = $('#top-bar-generate');
                this.reclose.hide();

                $('#check_all').click(function () {
                    var checkLength;

                    allInputs = $('.listCB');
                    allInputs.prop('checked', this.checked);
                    checkedInputs = $("input.listCB:checked");

                    if (self.collection.length > 0) {
                        checkLength = checkedInputs.length;

                        if (checkLength > 0) {
                            self.reclose.show();
                            self.close.hide();

                            if (checkLength === self.collection.length) {
                                $('#check_all').prop('checked', true);
                            }
                        } else {
                            self.reclose.hide();
                            self.close.show();
                            $('#check_all').prop('checked', false);
                        }
                    }
                });

                return this;
            }
        });
        return ListView;
    });