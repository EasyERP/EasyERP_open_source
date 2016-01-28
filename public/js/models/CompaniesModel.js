define([
        'common',
        'Validation'
    ],
    function (common, Validation) {
        var CompanyModel = Backbone.Model.extend({
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
                Validation.checkGroupsNameField(errors, true, attrs.name.first, "Company");
                Validation.checkPhoneField(errors, false, attrs.phones.phone, "Phone");
                Validation.checkPhoneField(errors, false, attrs.phones.mobile, "Mobile");
                Validation.checkCountryCityStateField(errors, false, attrs.address.country, "Country");
                Validation.checkCountryCityStateField(errors, false, attrs.address.state, "State");
                Validation.checkCountryCityStateField(errors, false, attrs.address.city, "City");
                Validation.checkZipField(errors, false, attrs.address.zip, "Zip");
                Validation.checkStreetField(errors, false, attrs.address.street, "Street");
                Validation.checkEmailField(errors, false, attrs.email, "Email");
                if (errors.length > 0) {
                    return errors;
                }

            },
            defaults   : {
                imageSrc      : '',
                isOwn         : false,
                type          : 'Company',
                email         : '',
                name          : {
                    first: '',
                    last : ''
                },
                address       : {
                    street : '',
                    city   : '',
                    state  : '',
                    zip    : '',
                    country: ''
                },
                website       : '',
                contacts      : [],
                phones        : {
                    phone : null,
                    mobile: null,
                    fax   : null
                },
                internalNotes : '',
                salesPurchases: {
                    isCustomer : false,
                    isSupplier : false,
                    salesPerson: null,
                    salesTeam  : null,
                    active     : true,
                    reference  : '',
                    language   : 'English',
                    date       : null
                },
                social        : {
                    fb: '',
                    li: ''
                },
                history       : [],
                attachments   : [],
                notes         : []
            },
            urlRoot    : function () {
                return "/companies";
            }
        });
        return CompanyModel;
    });