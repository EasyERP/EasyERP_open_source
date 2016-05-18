define([
    'common',
    'helpers'
], function (common, helpers) {
    var JournalEntryModel = Backbone.Model.extend({
        idAttribute: "_id",
        urlRoot    : function () {
            return "/journalEntry";
        },

        parse: function (response) {
            if (response) {
                if (response.date) {
                    response.date = common.utcDateToLocaleFullDateTime(response.date);
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