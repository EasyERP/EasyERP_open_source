define([
    'Backbone',
    'common',
    'constants'
], function (Backbone, common, CONSTANTS) {
    'use strict';

    var JournalEntryModel = Backbone.Model.extend({
        idAttribute: "_id",
        urlRoot    : function () {
            return CONSTANTS.URLS.JOURNALENTRY;
        },

        parse: function (response) {
            if (response) {
                if (response.date) {
                    response.date = common.utcDateToLocaleDate(response.date);
                }

                if (response.debit) {
                    response.debit = response.debit / 100;
                }
                if (response.credit) {
                    response.credit = response.credit / 100;
                }
            }

            return response;
        }
    });
    return JournalEntryModel;
});