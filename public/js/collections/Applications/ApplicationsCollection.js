define([
        'models/ApplicationsModel',
        'common'
    ],
    function (ApplicationModel, common) {
        var ApplicationsCollection = Backbone.Collection.extend({
            model: ApplicationModel,
            url  : function () {
                return "/Applications";
            },

            initialize: function () {
            },

            parse: true,
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
                return response.data;
            },
        });
        return ApplicationsCollection;
    });
