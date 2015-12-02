define(['common'], function (common) {
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
            }

            return response;
        }
    });
    return JournalEntryModel;
});