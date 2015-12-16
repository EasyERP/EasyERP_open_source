/**
 * Created by ANDREY on 29.04.2015.
 */

define(['Validation', 'common'], function (Validation, common) {
    var InvoiceModel = Backbone.Model.extend({
        idAttribute: "_id",
        initialize : function () {
            this.on('invalid', function (model, errors) {
                if (errors.length > 0) {
                    if (errors.length > 0) {
                        var msg = errors.join('\n');
                        alert(msg);
                    }
                }
            });
        },
        parse      : function (response) {
            if (response) {
                var payments = response.payments;
                var balance;
                var paid;
                var total;
                var unTaxed;

                if (response.paymentInfo) {
                    balance = response.paymentInfo.balance || 0;
                    total = response.paymentInfo.total || 0;
                    unTaxed = response.paymentInfo.unTaxed || 0;
                    paid = /*response.paymentInfo.unTaxed || 0;*/total - balance
                }

                if (isNaN(paid)) {
                    paid = 0;
                }

                balance = (balance / 100).toFixed(2);
                paid = (paid / 100).toFixed(2);
                total = (total / 100).toFixed(2);
                unTaxed = (unTaxed / 100).toFixed(2);

                response.paymentInfo.balance = balance;
                response.paymentInfo.unTaxed = paid !== "0.00" ? paid : unTaxed;
                response.paymentInfo.total = total;

                if (response.invoiceDate) {
                    response.invoiceDate = common.utcDateToLocaleDate(response.invoiceDate);
                }
                if (response.dueDate) {
                    response.dueDate = common.utcDateToLocaleDate(response.dueDate);
                }
                if (response.paymentDate) {
                    response.paymentDate = common.utcDateToLocaleDate(response.paymentDate);
                }
                if (payments && payments.length) {
                    payments = _.map(payments, function (payment) {
                        if (payment.date) {
                            payment.date = common.utcDateToLocaleDate(payment.date);
                        }
                        return payment;
                    });
                }

                return response;
            }
        },
        validate   : function (attrs) {
            var errors = [];
            //Validation.checkGroupsNameField(errors, true, attrs.dateBirth, "Date of Birth");
            //Validation.checkNameField(errors, true, attrs.name.first, "First name");
            //Validation.checkNameField(errors, true, attrs.name.last, "Last name");
            //Validation.checkPhoneField(errors, false, attrs.workPhones.phone, "Phone");
            //Validation.checkPhoneField(errors, false, attrs.workPhones.mobile, "Mobile");
            //Validation.checkEmailField(errors, false, attrs.workEmail,"Work Email");
            //Validation.checkEmailField(errors, false, attrs.personalEmail,"Personal Email");
            //Validation.checkCountryCityStateField(errors, false, attrs.workAddress.country, "Country");
            //Validation.checkCountryCityStateField(errors, false, attrs.workAddress.state, "State");
            //Validation.checkCountryCityStateField(errors, false, attrs.workAddress.city, "City");
            //Validation.checkZipField(errors, false, attrs.workAddress.zip, "Zip");
            //Validation.checkStreetField(errors, false, attrs.workAddress.street, "Street");
            //Validation.checkCountryCityStateField(errors, false, attrs.homeAddress.country, "Country");
            //Validation.checkCountryCityStateField(errors, false, attrs.homeAddress.state, "State");
            //Validation.checkZipField(errors, false, attrs.homeAddress.zip, "Zip");
            //Validation.checkStreetField(errors, false, attrs.homeAddress.street, "Street");
            if (errors.length > 0) {
                return errors;
            }
        },
        defaults   : {
            supplier   : {
                id  : '',
                name: ''
            },
            salesPerson: {
                id  : '',
                name: ''
            },

            fiscalPosition       : '',
            sourceDocument       : '',
            supplierInvoiceNumber: '',
            paymentReference     : '',

            invoiceDate: '',
            dueDate    : '',
            account    : '',
            journal    : '',
            products   : [],
            paymentInfo: {
                total  : 0,
                unTaxed: 0,
                balance: 0
            }

        },
        urlRoot    : function () {
            return "/Invoice";
        }
    });
    return InvoiceModel;
});