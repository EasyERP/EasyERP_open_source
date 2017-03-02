define([
    'Backbone',
    'constants',
    'moment'
], function (Backbone, CONSTANTS, moment) {

    var stockTransactionModel = Backbone.Model.extend({
        idAttribute: '_id',

        urlRoot: function () {
            return CONSTANTS.URLS.STOCKINVENTORY;
        },

        parse: function (response) {
            if (!response.data) {

                if (response.createdBy && response.createdBy.date) {
                    response.createdBy.date = moment(new Date(response.createdBy.date)).format('DD MMM, YYYY, H:mm');
                }
                if (response.cost) {
                    response.cost = (response.cost / 100).toFixed(2);
                }

                if (response.value) {
                    response.value = (response.value / 100).toFixed(2);
                }

                if (response.createdBy && response.createdBy.date) {
                    response.createdBy.date = moment(new Date(response.createdBy.date)).format('DD MMM, YYYY, H:mm');
                }
                if (response.status) {

                    if (response.status.receivedOn) {
                        response.status.receivedOn = moment(new Date(response.status.receivedOn)).format('DD MMM, YYYY, H:mm');
                    }
                    if (response.status.packedOn) {
                        response.status.packedOn = moment(new Date(response.status.packedOn)).format('DD MMM, YYYY, H:mm');
                    }
                    if (response.status.printedOn) {
                        response.status.printedOn = moment(new Date(response.status.printedOn)).format('DD MMM, YYYY, H:mm');
                    }
                    if (response.status.shippedOn) {
                        response.status.shippedOn = moment(new Date(response.status.shippedOn)).format('DD MMM, YYYY, H:mm');
                    }

                }

                return response;
            }
        }
    });
    return stockTransactionModel;

});
