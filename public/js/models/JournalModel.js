define(['Validation','common'],function () {
    var JournalModel = Backbone.Model.extend({
        idAttribute: "_id",
        urlRoot: function () {
            return "/journal";
        }
    });
    return JournalModel;
});