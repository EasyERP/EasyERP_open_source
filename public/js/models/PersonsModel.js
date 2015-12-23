define([
        'common',
        'Validation'
    ],
    function (common, Validation) {
        var PersonModel = Backbone.Model.extend({
            idAttribute: "_id",
            initialize : function () {
                this.on('invalid', function (model, errors) {
                    var msg;

                    if (errors.length > 0) {
                        msg = errors.join('\n');

                        App.render({
                            type: 'error',
                            message: msg
                        });
                    }
                });
            },

            parse      : function (response) {
                if (!response.data) {
                    if (response.createdBy) {
                        response.createdBy.date = common.utcDateToLocaleDateTime(response.createdBy.date);
                    }
                    if (response.editedBy) {
                        response.editedBy.date = common.utcDateToLocaleDateTime(response.editedBy.date);
                    }
                    if (response.dateBirth) {
                        response.dateBirth = common.utcDateToLocaleDate(response.dateBirth);
                    }
                    if (response.notes) {
                        _.map(response.notes, function (note) {
                            note.date = common.utcDateToLocaleDate(note.date);
                            return note;
                        });
                    }

                    if (response.attachments) {
                        _.map(response.attachments, function (attachment) {
                            attachment.uploadDate = common.utcDateToLocaleDate(attachment.uploadDate);
                            return attachment;
                        });
                    }
                    return response;
                }
            },
            validate   : function (attrs) {
                var errors = [];
                Validation.checkNameField(errors, true, attrs.name.first, "First name");
                Validation.checkNameField(errors, true, attrs.name.last, "Last name");
                Validation.checkPhoneField(errors, false, attrs.phones.phone, "Phone");
                Validation.checkPhoneField(errors, false, attrs.phones.mobile, "Mobile");
                Validation.checkPhoneField(errors, false, attrs.phones.fax, "Fax");
                Validation.checkCountryCityStateField(errors, false, attrs.address.country, "Country");
                Validation.checkCountryCityStateField(errors, false, attrs.address.state, "State");
                Validation.checkCountryCityStateField(errors, false, attrs.address.city, "City");
                Validation.checkCountryCityStateField(errors, false, attrs.jobPosition, "Job position");
                Validation.checkSkypeField(errors, false, attrs.skype, "Skype");
                Validation.checkZipField(errors, false, attrs.address.zip, "Zip");
                Validation.checkStreetField(errors, false, attrs.address.street, "Street");
                Validation.checkEmailField(errors, false, attrs.email, "Email");

                if (errors.length > 0) {
                    return errors;
                }
            },
            defaults   : {
                id            : null,
                imageSrc      : '',
                type          : 'Person',
                name          : {
                    first: "",
                    last : ""
                },
                email         : "",
                address       : {
                    street1: "",
                    street2: "",
                    city   : "",
                    zip    : "",
                    country: "",
                    state  : ""
                },
                website       : "",
                jobPosition   : "",
                skype         : "",
                phones        : {
                    phone : "",
                    mobile: "",
                    fax   : ""
                },
                salesPurchases: {
                    isCustomer: true
                },
                department    : null,
                dateBirth     : null,
                attachments   : [],
                notes         : []
            },
            urlRoot    : function () {
                return "/Persons";
            }
        });
        return PersonModel;
    });
