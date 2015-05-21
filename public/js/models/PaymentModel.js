/**
 * Created by Roman on 20.05.2015.
 */
/**
 * Created by Roman on 04.05.2015.
 */
define(['Validation', 'common'], function (Validation, common) {
    var PaymentModel = Backbone.Model.extend({
        idAttribute: "_id",
        initialize: function () {

        },
        defaults: {
            supplier: null,
            paidAmount: 0,
            paymentMethod: null,
            date: new Date(),
            name: 'PP',
            period: null,
            paymentRef: null,
            differenceAmount: 0,
            invoice: null
        },
        urlRoot: function () {
            return "/payment";
        },
        parse: function (model) {
            if (model.date) {
                model.date = common.utcDateToLocaleDate(model.date);
            }
            return model;
        }
    });

    return PaymentModel;
});