define([
    'Backbone',
    'constants',
    'moment'
], function (Backbone, CONSTANTS, moment) {

    var stockTransactionModel = Backbone.Model.extend({
        idAttribute: '_id',

        urlRoot: function () {
            return CONSTANTS.URLS.STOCKTRANSACTIONS;
        },

        parse: function (response) {
            if (!response.data) {

                if (response.createdBy && response.createdBy.date) {
                    response.createdBy.date = moment(response.createdBy.date).format('DD MMM, YYYY, H:mm');
                }
                if (response.status) {

                    if (response.status.receivedOn) {
                        response.status.receivedOn = moment(response.status.receivedOn).format('DD MMM, YYYY, H:mm');
                    }
                    if (response.status.packedOn) {
                        response.status.packedOn = moment(response.status.packedOn).format('DD MMM, YYYY, H:mm');
                    }
                    if (response.status.printedOn) {
                        response.status.printedOn = moment(response.status.printedOn).format('DD MMM, YYYY, H:mm');
                    }
                    if (response.status.shippedOn) {
                        response.status.shippedOn = moment(response.status.shippedOn).format('DD MMM, YYYY, H:mm');
                    }

                }

                return response;
            }
        }
    });
    return stockTransactionModel;

});
