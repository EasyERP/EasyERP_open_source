define([
    'Backbone',
    'constants',
    'moment'
], function (Backbone, CONSTANTS, moment) {

    var stockCorrectionModel = Backbone.Model.extend({
        idAttribute: '_id',

        urlRoot: function () {
            return CONSTANTS.URLS.STOCKCORRECTIONS;
        },

        parse: function (response) {
            if (!response.data) {
                if (response.createdBy) {
                    response.createdBy.date = moment(response.createdBy.date).format('DD MMM, YYYY, H:mm:ss');
                }

                return response;
            }
        }
    });
    return stockCorrectionModel;

});
