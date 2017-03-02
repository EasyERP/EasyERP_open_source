define([
    'Backbone',
    'moment'
], function (Backbone, moment) {
    var stockReturnsModel = Backbone.Model.extend({
        idAttribute: '_id',
        urlRoot    : function () {
            return '/stockReturns/';
        },

        parse: function (response) {
            if (!response.data) {

                if (response.status && response.status.receivedOn) {
                    response.status.receivedOn = moment(response.status.receivedOn).format('DD MMM, YYYY, H:mm');
                }

                return response;
            }
        }
    });
    return stockReturnsModel;
});
