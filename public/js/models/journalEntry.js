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
                    response.date = common.utcDateToLocaleDate(response.date);
                }

                if(response.debit){
                    response.debit = response.debit / 100;
                    response.debit = helpers.currencySplitter(response.debit.toFixed(2));
                }
                if(response.credit){
                    response.credit = response.credit / 100;
                    response.credit = helpers.currencySplitter(response.credit.toFixed(2));
                }
            }

            return response;
        }
    });
    return JournalEntryModel;
});