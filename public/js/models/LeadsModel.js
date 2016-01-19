define(['Validation', 'common'], function (Validation, common) {
    var LeadModel = Backbone.Model.extend({
        idAttribute: "_id",
        initialize : function () {
            this.on('invalid', function (model, errors) {
                var msg;

                if (errors.length > 0) {
                    msg = errors.join('\n');

                    App.render({
                        type   : 'error',
                        message: msg
                    });
                }
            });
        },
        validate   : function (attrs) {
            var errors = [];

            Validation.checkGroupsNameField(errors, true, attrs.name, "Subject");
            Validation.checkNameField(errors, false, attrs.contactName.first, "Contact first name");
            Validation.checkNameField(errors, false, attrs.contactName.last, "Contact last name");
            Validation.checkGroupsNameField(errors, false, attrs.company.name, "Company");
            Validation.checkPhoneField(errors, false, attrs.phones.phone, "Phone");
            Validation.checkPhoneField(errors, false, attrs.phones.mobile, "Mobile");
            Validation.checkCountryCityStateField(errors, false, attrs.address.country, "Country");
            Validation.checkCountryCityStateField(errors, false, attrs.address.state, "State");
            Validation.checkCountryCityStateField(errors, false, attrs.address.city, "City");
            Validation.checkZipField(errors, false, attrs.address.zip, "Zip");
            Validation.checkStreetField(errors, false, attrs.address.street, "Street");
            Validation.checkEmailField(errors, false, attrs.email, "Email");
            Validation.checkNotesField(errors, false, attrs.internalNotes, "Notes");
            if (errors.length > 0) {
                return errors;
            }
        },
        parse      : function (response) {
            if (!response.data) {
                if (response.createdBy) {
                    response.createdBy.date = common.utcDateToLocaleDateTime(response.createdBy.date);
                }
                if (response.editedBy) {
                    response.editedBy.date = common.utcDateToLocaleDateTime(response.editedBy.date);
                }
                return response;
            }
        },
        defaults   : {
            isOpportunitie: false,
            createCustomer: false,
            name          : 'New Lead',
            company       : {
                id  : '',
                name: ''
            },
            customer      : {
                id  : '',
                name: ''
            },
            address       : {
                street : '',
                city   : '',
                state  : '',
                zip    : '',
                country: ''
            },
            salesPerson   : {
                id  : '',
                name: ''
            },
            salesTeam     : {
                id  : '',
                name: ''
            },
            contactName   : {
                first: '',
                last : ''
            },
            email         : '',
            func          : '',
            phones        : {
                mobile: '',
                phone : '',
                fax   : ''
            },

            priority     : 'Trivial',
            categories   : {
                id  : '',
                name: ''
            },
            internalNotes: '',
            active       : true,
            optout       : false,
            reffered     : '',
            workflow     : {
                wName : 'lead',
                name  : 'New',
                status: 'New'
            }
        },
        urlRoot    : function () {
            return "/Leads";
        }
    });

    return LeadModel;
});
