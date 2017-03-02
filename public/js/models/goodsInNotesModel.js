define([
    'Backbone',
    'moment'
], function (Backbone, moment) {
    var paymentMethod = Backbone.Model.extend({
        idAttribute: '_id',
        urlRoot    : function () {
            return '/goodsInNotes/';
        },
        
        parse: function (response) {
            if (!response.data) {

                if (response.createdBy && response.createdBy.date) {
                    response.createdBy.date = moment(response.createdBy.date).format('DD MMM, YYYY, H:mm');
                }
                if (response.status) {

                    if (response.status.pickedOn) {
                        response.status.pickedOn = moment(response.status.pickedOn).format('DD MMM, YYYY, H:mm');
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
    return paymentMethod;
});
