define(function () {
    var SourceOfApplicantsModel = Backbone.Model.extend({
        idAttribute: "_id",
        defaults   : {
            name: 'New'
        },
        urlRoot    : function () {
            return "/SourcesOfApplicants";
        }
    });
    return SourceOfApplicantsModel;
});