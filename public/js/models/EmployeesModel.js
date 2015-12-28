define(['Validation', 'common'], function (Validation, common) {
    var EmployeeModel = Backbone.Model.extend({
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
                if (response.attachments) {
                    _.map(response.attachments, function (attachment) {
                        attachment.uploadDate = common.utcDateToLocaleDate(attachment.uploadDate);
                        return attachment;
                    });
                }
                if (response.hire) {
                    response.hire = _.map(response.hire, function (hire) {
                        hire = common.utcDateToLocaleDate(hire);
                        return hire;
                    });
                }
                if (response.fire) {
                    response.fire = _.map(response.fire, function (fire) {
                        fire = common.utcDateToLocaleDate(fire);
                        return fire;
                    });
                }
                if (response.transferred) {
                    response.transferred = _.map(response.transferred, function (obj) {
                        var date = common.utcDateToLocaleDate(obj.date);
                        var dep = obj.department;
                        var result = {
                            department: dep,
                            date      : date
                        };
                        return result;
                    });
                }
            }
            return response;
        },
        validate   : function (attrs) {
            var errors = [];
            Validation.checkGroupsNameField(errors, true, attrs.dateBirth, "Date of Birth");
            Validation.checkNameField(errors, true, attrs.name.first, "First name");
            Validation.checkNameField(errors, true, attrs.name.last, "Last name");
            Validation.checkPhoneField(errors, false, attrs.workPhones.phone, "Phone");
            Validation.checkPhoneField(errors, false, attrs.workPhones.mobile, "Mobile");
            Validation.checkEmailField(errors, false, attrs.workEmail, "Work Email");
            Validation.checkEmailField(errors, false, attrs.personalEmail, "Personal Email");
            Validation.checkCountryCityStateField(errors, false, attrs.workAddress.country, "Country");
            Validation.checkCountryCityStateField(errors, false, attrs.workAddress.state, "State");
            Validation.checkCountryCityStateField(errors, false, attrs.workAddress.city, "City");
            Validation.checkZipField(errors, false, attrs.workAddress.zip, "Zip");
            Validation.checkStreetField(errors, false, attrs.workAddress.street, "Street");
            Validation.checkCountryCityStateField(errors, false, attrs.homeAddress.country, "Country");
            Validation.checkCountryCityStateField(errors, false, attrs.homeAddress.state, "State");
            Validation.checkZipField(errors, false, attrs.homeAddress.zip, "Zip");
            Validation.checkStreetField(errors, false, attrs.homeAddress.street, "Street");
            Validation.checkJobPositionField(errors, true, attrs.jobPosition, "Job Position");
            if (errors.length > 0) {
                return errors;
            }
        },
        defaults   : {
            isEmployee    : true,
            imageSrc      : "",
            name          : {
                first: '',
                last : ''
            },
            gender        : '',
            marital       : '',
            tags          : [],
            workAddress   : {
                street : '',
                city   : '',
                state  : '',
                zip    : '',
                country: ''
            },
            workEmail     : '',
            personalEmail : '',
            workPhones    : {
                mobile: '',
                phone : ''
            },
            skype         : '',
            officeLocation: '',
            relatedUser   : null,
            visibility    : 'Public',
            department    : '',
            jobPosition   : null,
            nationality   : '',
            identNo       : '',
            passportNo    : '',
            bankAccountNo : '',
            otherId       : '',
            homeAddress   : {
                street : '',
                city   : '',
                state  : '',
                zip    : '',
                country: ''
            },
            source        : {
                id  : '',
                name: ''
            },
            dateBirth     : null,
            active        : true,
            hire          : [],
            fire          : []
        },
        urlRoot    : function () {
            return "/Employees";
        }
    });
    return EmployeeModel;
});