define([
    'common', 'Validation'
],
function (common, Validation) {
    var ApplicationModel = Backbone.Model.extend({
        idAttribute: "_id",
        initialize: function(){
            this.on('invalid', function(model, errors){
                if(errors.length > 0){
                    var msg = errors.join('\n');
                    alert(msg);
                }
            });
        },
        parse: true,
        parse: function (response) {
            if (!response.data) {
            	if(response.creationDate){
            		response.creationDate = common.utcDateToLocaleDate(response.creationDate);
            	}
            	if(response.nextAction) {
            		response.nextAction = common.utcDateToLocaleDate(response.nextAction);
            	}
	            if (response.dateBirth)
	                response.dateBirth = common.utcDateToLocaleDate(response.dateBirth);
            	if (response.createdBy)
            		response.createdBy.date = common.utcDateToLocaleDateTime(response.createdBy.date);
				
            	if (response.editedBy)
					response.editedBy.date = common.utcDateToLocaleDateTime(response.editedBy.date);

                if (response.attachments) {
                    _.map(response.attachments, function (attachment) {
                        attachment.uploadDate = common.utcDateToLocaleDate(attachment.uploadDate);
                        return attachment;
                    });
                }
            }
            return response;
        },
        validate: function(attrs){
            var errors = [];
            Validation.checkNameField(errors, true, attrs.name.first, "First name");
            Validation.checkNameField(errors, true, attrs.name.last, "Last name");
            Validation.checkEmailField(errors, false, attrs.personalEmail, "Email");
            Validation.checkGroupsNameField(errors, true, attrs.dateBirth, "Date of Birth");
			if (attrs.department)
            Validation.checkGroupsNameField(errors, true, attrs.department._id || attrs.department, "Department");
            Validation.checkPhoneField(errors, false, attrs.workPhones.phone, "Phone");
            Validation.checkPhoneField(errors, false, attrs.workPhones.mobile, "Mobile");
            Validation.checkMoneyField(errors, false, attrs.expectedSalary, "Expected salary");
            Validation.checkMoneyField(errors, false, attrs.proposedSalary, "Proposed salary");
            if(errors.length > 0)
                return errors;
        },
        defaults: {
            isEmployee: false,
            imageSrc: "",
            subject: '',
            name: {
                first: 'New',
                last: 'Application'
            },
            tags: [],
            personalEmail: '',
            workPhones: {
                mobile: '',
                phone: ''
            },
            relatedUser: null,
            department: {
                id: '',
                name: ''
            },
            jobPosition: {
                id: '',
                name: ''
            },
            nextAction: null,
            source: '',
            referredBy: '',
            expectedSalary: 0,
            proposedSalary: 0,
            otherInfo: '',
            workflow: {
                wName: 'application',
                name: 'Initial Qualification',
                status: 'New'
            }
        },
        urlRoot: function () {
            return "/Applications";
        }
    });
    return ApplicationModel;
});
