define([
    'Backbone',
    'jQuery',
    'Underscore',
    'views/topBarViewBase',
    'text!templates/syncLogs/lastLogTemplate.html',
    'text!templates/syncLogs/logStatsTemplate.html',
    'dataService',
    'constants'
], function (Backbone, $, _, BaseView, LastLogTemplate, logStatsTemplate, dataService, CONSTANTS) {
    'use strict';

    var View = BaseView.extend({
        el              : '#content-holder',
        lastLogTemplate : _.template(LastLogTemplate),
        logStatsTemplate: _.template(logStatsTemplate),

        initialize: function (options) {
            var self = this;

            dataService.getData(CONSTANTS.URLS.LAST_SYNC_LOG, null, function (response) {
                self.render(response.data);
            }, this);
        },

        render: function (data) {
            var channelId = data.channel && data.channel._id;
            var $elem = this.$el.find('div.app[data-id="' + channelId + '"]');

            this.lastSync = data;

            $elem.append(this.logStatsTemplate({
                _id                : data._id,
                status             : data.status,
                errorsCount        : data.errorsCount,
                criticalErrorsCount: data.criticalErrorsCount
            }));
        }
    });

    return View;
});
