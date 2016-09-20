define([
    'jQuery',
    'Underscore',
    'views/listViewBase',
    'views/PayrollExpenses/generate/GenerateView',
    'text!templates/closeMonth/list/ListHeader.html',
    'views/closeMonth/list/ListItemView',
    'views/Filter/filterView',
    'collections/closeMonth/filterCollection',
    'constants',
    'dataService',
    'helpers',
    'custom',
    'async',
    'common',
    'moment'
], function ($, _, listViewBase, GenerateView, listTemplate, ListItemView, FilterView, reportCollection, CONSTANTS, dataService, helpers, custom, async, common, moment) {
    'use strict';

    var ListView = listViewBase.extend({
        el                : '#content-holder',
        defaultItemsNumber: null,
        listLength        : null,
        filter            : null,
        sort              : null,
        newCollection     : null,
        page              : null,
        contentType       : CONSTANTS.CLOSEMONTH, // needs in view.prototype.changeLocationHash
        viewType          : 'list', // needs in view.prototype.changeLocationHash
        yearElement       : null,
        FilterView        : FilterView,

        events: {
            'click .mainTr': 'showHidden'
        },

        initialize: function (options) {
            this.startTime = options.startTime;
            this.collection = options.collection;

            this.render();
        },

        generate: function () {
            var keys = [];

            this.collection.toJSON().forEach(function (el) {
                var month = moment(el._id).month() + 1;
                var year = moment(el._id).year();
                var key = year * 100 + month;
                keys.push(key.toString());
            });

            return new GenerateView({keys: keys, url: 'journalEntries/closeMonth'});
        },

        checked: function (e) {
            var checkLength;
            var checkAll$;

            e.stopPropagation();

            if (this.collection.length > 0) {

                checkLength = $('input.checkbox:checked').length;
                if (checkLength > 0) {
                    this.reclose.show();
                    this.close.hide();
                    checkAll$ = $('#checkAll');
                    checkAll$.prop('checked', false);

                    if (checkLength === this.collection.length) {
                        checkAll$.prop('checked', true);
                    }
                } else {
                    this.reclose.hide();
                    this.close.show();
                    checkAll$ = $('#checkAll');
                    checkAll$.prop('checked', false);
                }
            }
        },

        showHidden: function (e) {
            var $target = $(e.target);
            var $tr = $target.closest('tr');
            var dataId = $tr.attr('data-id');
            var $body = this.$el;
            var childTr = $body.find('[data-main="' + dataId + '"]');
            var span = $tr.find('.expand').find('span');
            var sign = $.trim(span.attr('class'));

            if (sign === 'icon-caret-right') {
                span.removeClass('icon-caret-right');
                span.addClass('icon-caret-down');
            } else {
                span.removeClass('icon-caret-down');
                span.addClass('icon-caret-right');
            }

            childTr.toggleClass('hidden');
        },

        asyncRenderInfo: function (asyncKeys) {
            var body = this.$el;

            async.each(asyncKeys, function (asyncId) {
                dataService.getData('journalEntries/getAsyncCloseMonth', {
                    _id: asyncId
                }, function (result) {
                    var journalEntries = result.journalEntries;
                    var mainTr = body.find('[data-id="' + asyncId + '"]');
                    journalEntries.forEach(function (entry) {
                        mainTr.after("<tr data-main='" + asyncId + "' class='hidden childRow'><td></td><td class='leftBorderNone'>" + entry.journal.name + '</td><td>' + common.utcDateToLocaleFullDateTime(entry.date) + "</td><td class='money'>" + (entry.debit ? helpers.currencySplitter((entry.debit / 100).toFixed(2)) : helpers.currencySplitter((entry.credit / 100).toFixed(2))) + '</td></tr>');
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

            $('#checkAll').click(function () {
                var checkLength;

                allInputs = $('.listCB');
                allInputs.prop('checked', this.checked);
                checkedInputs = $('input.listCB:checked');

                if (self.collection.length > 0) {
                    checkLength = checkedInputs.length;

                    if (checkLength > 0) {
                        self.reclose.show();
                        self.close.hide();

                        if (checkLength === self.collection.length) {
                            $('#checkAll').prop('checked', true);
                        }
                    } else {
                        self.reclose.hide();
                        self.close.show();
                        $('#checkAll').prop('checked', false);
                    }
                }
            });

            this.reclose = $('#top-bar-reclose');
            this.close = $('#top-bar-generate');
            this.reclose.hide();

            return this;
        }
    });
    return ListView;
});
