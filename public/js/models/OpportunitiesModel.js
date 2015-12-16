define([
        'common',
        'Validation'
    ],
    function (common, Validation) {
        var OpportunityModel = Backbone.Model.extend({
            idAttribute: "_id",
            initialize : function () {
                this.on('invalid', function (model, errors) {
                    if (errors.length > 0) {
                        var msg = errors.join('\n');
                        alert(msg);
                    }
                });
            },
            parse      : true,
            parse      : function (response) {
                if (!response.data) {
                    if (response.creationDate) {
                        response.creationDate = common.utcDateToLocaleDate(response.creationDate);
                    }

                    if (response.expectedClosing) {
                        response.expectedClosing = common.utcDateToLocaleDate(response.expectedClosing);
                    }

                    if (response.nextAction) {
                        response.nextAction.date = common.utcDateToLocaleDate(response.nextAction.date);
                    }

                    if (response.convertedDate) {
                        response.convertedDate = common.utcDateToLocaleDate(response.convertedDate);
                    }

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
                }
                return response;
            },
            validate   : function (attrs) {
                var errors = [];
                Validation.checkGroupsNameField(errors, true, attrs.name, "Subject");
                if (attrs.expectedClosing && attrs.nextAction) {
                    Validation.checkFirstDateIsGreater(errors, attrs.expectedClosing, "expected closing date", attrs.nextAction.date, "Next action date");
                }
                Validation.checkCountryCityStateField(errors, false, attrs.address.country, "Country");
                Validation.checkCountryCityStateField(errors, false, attrs.address.state, "State");
                Validation.checkCountryCityStateField(errors, false, attrs.address.city, "City");
                Validation.checkMoneyField(errors, false, attrs.expectedRevenue.value, "Expected revenue");
                if (errors.length > 0) {
                    return errors;
                }
            },
            defaults   : {
                isOpportunitie : true,
                name           : '',
                expectedRevenue: {
                    value   : 0,
                    currency: $,
                    progress: ''
                },
                company        : {
                    id  : '',
                    name: ''
                },
                contactName    : {
                    first: '',
                    last : ''
                },
                customer       : {
                    id  : '',
                    name: ''
                },
                address        : {
                    street : '',
                    city   : '',
                    state  : '',
                    zip    : '',
                    country: ''
                },
                email          : '',
                phones         : {
                    mobile: '',
                    phone : '',
                    fax   : ''
                },

                func           : '',
                salesPerson    : null,
                salesTeam      : null,
                internalNotes  : '',
                nextAction     : {
                    date: null,
                    desc: ''
                },
                expectedClosing: null,
                priority       : 'Trivial',
                categories     : '',
                active         : true,
                optout         : false,
                reffered       : '',
                workflow       : ''
            },
            urlRoot    : function () {
                return "/Opportunities";
            }
        });
        return OpportunityModel;
    });
