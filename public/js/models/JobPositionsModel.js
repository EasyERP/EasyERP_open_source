define(['Validation'], function (Validation) {
    var JobPositionsModel = Backbone.Model.extend({
        idAttribute: "_id",
        initialize : function () {
            this.on('invalid', function (model, errors) {
                if (errors.length > 0) {
                    var msg = errors.join('\n');
                    alert(msg);
                }
            });
        },
        validate   : function (attrs) {
            var errors = [];
            Validation.checkGroupsNameField(errors, true, attrs.name, "Job name");
            Validation.checkNumberField(errors, true, attrs.expectedRecruitment, "Expected in Recruitment");
            if (errors.length > 0) {
                return errors;
            }
        },
        defaults   : {
            name               : "New Job Position",
            expectedRecruitment: 0,
            interviewForm      : {
                id  : "",
                name: ""
            },
            department         : {
                id  : "",
                name: ""
            },
            description        : "",
            requirements       : "",
            workflow           : {
                wName : 'jobposition',
                name  : 'No Recruitment',
                status: 'New'
            }
        },
        urlRoot    : function () {
            return "/JobPositions";
        }
    });
    return JobPositionsModel;
});