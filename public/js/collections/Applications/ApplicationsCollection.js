define([
    'collections/parent',
    'models/ApplicationsModel',
    'common',
    'constants'
], function (Parent, ApplicationModel, common, CONSTANTS) {
    'use strict';
    var ApplicationsCollection = Parent.extend({
        model: ApplicationModel,

        url  : function () {
            return CONSTANTS.URLS.APPLICATIONS;
        },

        parse: function (response) {
            if (response.data) {
                _.map(response.data, function (application) {

                    application.creationDate = common.utcDateToLocaleDate(application.creationDate);
                    if (application.nextAction) {
                        application.nextAction = common.utcDateToLocaleDate(application.nextAction);
                    }
                    if (application.createdBy) {
                        application.createdBy.date = common.utcDateToLocaleDateTime(application.createdBy.date);
                    }
                    if (application.editedBy) {
                        application.editedBy.date = common.utcDateToLocaleDateTime(application.editedBy.date);
                    }
                    return application;
                });
            }

            return Parent.prototype.parse.apply(this, arguments);
        }
    });

    return ApplicationsCollection;
});
