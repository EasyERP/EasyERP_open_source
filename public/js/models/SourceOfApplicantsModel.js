define([
    'Backbone',
    'constants'
], function (Backbone, CONSTANTS) {
    'use strict';

    var SourceOfApplicantsModel = Backbone.Model.extend({
        idAttribute: "_id",
        defaults   : {
            name: 'New'
        },
        urlRoot    : function () {
            return CONSTANTS.URLS.SOURCESOFAPPLICANTS;
        }
    });
    return SourceOfApplicantsModel;
});