define([
    'Backbone',
    'Validation',
    'moment',
    'constants'
], function (Backbone, Validation, moment, CONSTANTS) {
    'use strict';

    var LeadModel = Backbone.Model.extend({
        idAttribute: '_id',
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

        validate: function (attrs) {
            var errors = [];

            Validation.checkGroupsNameField(errors, true, attrs.name, 'Subject');
            // Validation.checkGroupsNameField(errors, false, attrs.company.name, 'Company'); // commented in hotFix By Liliya
            Validation.checkPhoneField(errors, false, attrs.phones.phone, 'Phone');
            Validation.checkPhoneField(errors, false, attrs.phones.mobile, 'Mobile');
            Validation.checkCountryCityStateField(errors, false, attrs.address.country, 'Country');
            Validation.checkCountryCityStateField(errors, false, attrs.address.state, 'State');
            Validation.checkCountryCityStateField(errors, false, attrs.address.city, 'City');
            Validation.checkZipField(errors, false, attrs.address.zip, 'Zip');
            Validation.checkStreetField(errors, false, attrs.address.street, 'Street');
            Validation.checkEmailField(errors, false, attrs.email, 'Email');
            Validation.checkNotesField(errors, false, attrs.internalNotes, 'Notes');
            if (errors.length > 0) {
                return errors;
            }
        },

        parse: function (response) {
            if (!response.data) {
                if (response.createdBy) {
                    response.createdBy.date = moment(response.createdBy.date).format('DD MMM, YYYY, H:mm:ss');
                }
                if (response.editedBy) {
                    response.editedBy.date = moment(response.editedBy.date).format('DD MMM, YYYY, H:mm:ss');
                }

                if (response.nextAction) {
                    response.nextAction.date = moment(response.nextAction.date).format('DD MMM, YYYY');
                }

                if (response.notes) {
                    _.map(response.notes, function (note) {
                        note.date = moment(note.date).format('DD MMM, YYYY, H:mm:ss');

                        if (note.history && (note.history.changedField === 'Close Date'|| note.history.changedField === 'Creation Date')){
                            note.history.changedValue = note.history.changedValue ? moment(new Date(note.history.changedValue)).format('DD MMM, YYYY') : '';
                            note.history.newValue = note.history.newValue ? moment(new Date(note.history.newValue)).format('DD MMM, YYYY') : '';
                            note.history.prevValue = note.history.prevValue ? moment(new Date(note.history.prevValue)).format('DD MMM, YYYY') : '';
                        }

                        return note;
                    });

                    response.notes.forEach(function(note, index) {
                        if (note.history && (note.history.changedField === 'Creation Date')){
                            response.notes.splice(index, 1);
                            response.notes.unshift(note);
                            return;
                        }
                    });
                }

                if (response.attachments) {
                    _.map(response.attachments, function (attachment) {
                        attachment.uploadDate = moment(attachment.uploadDate).format('DD MMM, YYYY, H:mm:ss');
                        return attachment;
                    });
                }
                return response;
            }
        },

        defaults: {
            isOpportunitie: false,
            createCustomer: false,
            name          : 'New Lead',
            company       : {
                id  : '',
                name: ''
            },

            customer: {
                id  : '',
                name: ''
            },

            address: {
                street : '',
                city   : '',
                state  : '',
                zip    : '',
                country: ''
            },

            salesPerson: {
                id  : '',
                name: ''
            },

            salesTeam: {
                id  : '',
                name: ''
            },

            contactName: {
                first: '',
                last : ''
            },

            email : '',
            func  : '',
            phones: {
                mobile: '',
                phone : '',
                fax   : ''
            },

            priority  : 'Trivial',
            categories: {
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
            },

            social: {
                LI: '',
                FB: ''
            },

            skype: ''
        },

        urlRoot: function () {
            return CONSTANTS.URLS.LEADS;
        }
    });

    return LeadModel;
});
