/**
 * Created by ANDREY on 29.04.2015.
 */

define(['Validation','common'],function (Validation,common) {
    var InvoiceModel = Backbone.Model.extend({
        idAttribute: "_id",
        initialize: function(){
            this.on('invalid', function(model, errors){
                if(errors.length > 0){
                    if(errors.length > 0){
                        var msg = errors.join('\n');
                        alert(msg);
                    }
                }
            });
        },
        parse: true,
        parse: function (response) {
            if (!response.data) {
                //if (response.createdBy)
                //    response.createdBy.date = common.utcDateToLocaleDateTime(response.createdBy.date);
                //if (response.editedBy)
                //    response.editedBy.date = common.utcDateToLocaleDateTime(response.editedBy.date);
                if (response.invoiceDate)
                    response.invoiceDate = common.utcDateToLocaleDate(response.invoiceDate);
                if (response.dueDate)
                    response.dueDate = common.utcDateToLocaleDate(response.dueDate);
                //if (response.dateBirth)
                //    response.dateBirth = common.utcDateToLocaleDate(response.dateBirth);
                //if (response.attachments) {
                //    _.map(response.attachments, function (attachment) {
                //        attachment.uploadDate = common.utcDateToLocaleDate(attachment.uploadDate);
                //        return attachment;
                //    });
                return response;
                }
        },
        validate: function(attrs){
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
            if(errors.length > 0)
                return errors;
        },
        defaults: {
            supplierId: {
                id: '',
                name: ''
            },
            salesPerson: {
                name: ''
            },

            fiscalPosition: '',
            sourceDocument: '',
            supplierInvoiceNumber: '',
            paymentReference: '',

            invoiceDate: '',
            dueDate: '',
            account: '',
            journal: '',
            products: []

        },
        urlRoot: function () {
            return "/Invoice";
        }
    });
    return InvoiceModel;
});