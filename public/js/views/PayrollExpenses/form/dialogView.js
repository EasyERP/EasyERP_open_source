/**
 * Created by liliy on 19.02.2016.
 */
define([
        "Backbone",
        'Underscore',
        'jQuery',
        "text!templates/Projects/projectInfo/journalEntriesForJob.html",
        'dataService',
        'helpers',
        'common',
        'async'
    ],
    function (Backbone, _, $, template, dataService, helpers, common, async) {
        "use strict";
        var CreateView = Backbone.View.extend({
                el           : '#content-holder',
                template   : _.template(template),
                responseObj: {},

                events: {
                    'click .mainTr': 'showHidden'
                },

                initialize: function (options) {
                    var self = this;
                    this._id = options._id;

                    dataService.getData('journal/journalEntry/getPayrollForReport', {_id: self._id}, function (result) {
                        self.render(result);
                    });
                },

                showHidden: function (e) {
                    var $target = $(e.target);
                    var $tr = $target.closest('tr');
                    var dataId = $tr.attr('data-id');
                    var $body = this.$el.find('#report-TableBody');
                    var childTr = $body.find("[data-main='" + dataId + "']");
                    var sign = $.trim($tr.find('.expand').text());

                    if (sign === '+'){
                        $tr.find('.expand').text('-');
                    } else {
                        $tr.find('.expand').text('+');
                    }

                    childTr.toggleClass();
                },

                hideDialog: function () {
                    $(".reportDialog").remove();
                },

                asyncRenderInfo: function (asyncKeys) {
                    var self = this;
                    var body = this.$el.find('#report-TableBody');

                    async.each(asyncKeys, function (asyncDate) {
                        dataService.getData('/journal/journalEntry/getAsyncData', {
                            date: asyncDate,
                            _id : self._id
                        }, function (result) {
                            var journalEntries = result.journalEntries;
                            var mainTr = body.find("[data-id='" + asyncDate + "']");
                            journalEntries.forEach(function (entry) {
                                mainTr.after("<tr data-main='" + asyncDate + "' class='hidden'><td colspan='2'>" + common.utcDateToLocaleFullDateTime(entry.date) + "</td><td>" + entry.journalName + "</td><td>" + entry.journal.debitAccount + "</td><td>" + entry.journal.creditAccount + "</td><td>" + entry.employee + "</td><td>" + helpers.currencySplitter((entry.debit / 100).toFixed(2)) + "</td></tr>");
                            });
                        });

                    });

                },

                render: function (options) {
                    var self = this;
                    this.data = options.data;
                    var asyncKeys = [];
                    var wagesPayable = this.data.wagesPayable;
                    var dialog = this.template({
                        wagesPayable    : wagesPayable,
                        currencySplitter: helpers.currencySplitter,
                        dateFormat      : common.utcDateToLocaleFullDateTime
                    });

                    wagesPayable.forEach(function (el) {
                        asyncKeys.push(el._id);
                    });

                    this.$el = $(dialog).dialog({
                        dialogClass: "reportDialog",
                        width      : 1200,
                        title      : "Report",
                        buttons    : {
                            cancel: {
                                text : "Close",
                                class: "btn",
                                click: function () {
                                    self.hideDialog();
                                }
                            }
                        }
                    });

                    this.delegateEvents(this.events);
                    this.asyncRenderInfo(asyncKeys);

                    App.stopPreload();

                    return this;
                }
            })
            ;
        return CreateView;
    })