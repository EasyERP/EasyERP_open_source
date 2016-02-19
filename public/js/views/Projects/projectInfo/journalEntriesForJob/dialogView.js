/**
 * Created by liliy on 19.02.2016.
 */
define([
    "Backbone",
    'Underscore',
    'jQuery',
    "text!templates/Projects/projectInfo/journalEntriesForJob.html",
    'dataService'
    ],
    function (Backbone, _, $, template, dataService) {
        "use strict";
        var CreateView = Backbone.View.extend({
                template   : _.template(template),
                responseObj: {},

                events: {},

                initialize: function (options) {
                    var self = this;
                    this._id = options._id;

                    dataService.getData('journal/journalEntry/getForReport', {_id: self._id}, function (result) {
                        self.render(result);
                    });
                },

                hideDialog: function () {
                    $(".reportDialog").remove();
                },

                render: function (options) {
                    var self = this;
                    this.data = options.data;
                    var wagesPayable = this.data.wagesPayable;
                    var jobInProgress = this.data.jobInProgress;
                    var dialog = this.template({
                        wagesPayable  : wagesPayable,
                        jobInProgress: jobInProgress
                    });

                    this.$el = $(dialog).dialog({
                        dialogClass: "reportDialog",
                        width      : 900,
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

                    return this;
                }
            })
            ;
        return CreateView;
    })
;