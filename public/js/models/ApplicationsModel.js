define([
        'common', 'Validation', 'moment'
    ],
    function (common, Validation, moment) {
        var ApplicationModel = Backbone.Model.extend({
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
                    if (response.creationDate) {
                        response.creationDate = moment(response.creationDate).format('DD MMM, YYYY');
                    }
                    if (response.nextAction) {
                        response.nextAction = moment(response.nextAction).format('DD MMM, YYYY');
                    }
                    if (response.dateBirth) {
                        response.dateBirth = moment(response.dateBirth).format('DD MMM, YYYY');
                    }
                    if (response.createdBy) {
                        response.createdBy.date = moment(response.createdBy.date).format('DD MMM, YYYY');
                    }

                    if (response.editedBy) {
                        response.editedBy.date = moment(response.editedBy.date).format('DD MMM, YYYY');
                    }

                    if (response.attachments) {
                        _.map(response.attachments, function (attachment) {
                            attachment.uploadDate = moment(attachment.uploadDate).format('DD MMM, YYYY');
                            return attachment;
                        });
                    }

                    if (response.hire) {
                        response.hire = _.map(response.hire, function (hire) {
                            hire.date = common.utcDateToLocaleDate(hire.date);
                            return hire;
                        });
                    }
                    if (response.fire) {
                        response.fire = _.map(response.fire, function (fire) {
                            fire.date = common.utcDateToLocaleDate(fire.date);
                            return fire;
                        });
                    }
                }
                return response;
            },
            validate   : function (attrs) {
                var errors = [];
                Validation.checkNameField(errors, true, attrs.name.first, "First name");
                Validation.checkNameField(errors, true, attrs.name.last, "Last name");
                Validation.checkEmailField(errors, false, attrs.personalEmail, "Email");
                Validation.checkGroupsNameField(errors, true, attrs.dateBirth, "Date of Birth");
                if (attrs.department) {
                    Validation.checkGroupsNameField(errors, true, attrs.department._id || attrs.department, "Department");
                }
                Validation.checkPhoneField(errors, false, attrs.workPhones.phone, "Phone");
                Validation.checkPhoneField(errors, false, attrs.workPhones.mobile, "Mobile");
                Validation.checkMoneyField(errors, false, attrs.expectedSalary, "Expected salary");
                Validation.checkMoneyField(errors, false, attrs.proposedSalary, "Proposed salary");
                if (errors.length > 0) {
                    return errors;
                }
            },
            defaults   : {
                isEmployee    : false,
                imageSrc      : "",
                subject       : '',
                name          : {
                    first: 'New',
                    last : 'Application'
                },
                tags          : [],
                personalEmail : '',
                workPhones    : {
                    mobile: '',
                    phone : ''
                },
                relatedUser   : null,
                department    : {
                    id  : '',
                    name: ''
                },
                jobPosition   : {
                    id  : '',
                    name: ''
                },
                nextAction    : null,
                source        : '',
                referredBy    : '',
                expectedSalary: 0,
                proposedSalary: 0,
                otherInfo     : '',
                workflow      : {
                    wName : 'application',
                    name  : 'Initial Qualification',
                    status: 'New'
                }
            },
            urlRoot    : function () {
                return "/applications";
            }
        });
        return ApplicationModel;
    });
