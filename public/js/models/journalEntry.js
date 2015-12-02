define([], function () {
    var JournalEntryModel = Backbone.Model.extend({
        idAttribute: "_id",
        urlRoot    : function () {
            return "/journalEntry";
        }
    });
    return JournalEntryModel;
});