define(['Validation'], function (Validation) {
    var DepartmentsModel = Backbone.Model.extend({
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
            Validation.checkGroupsNameField(errors, true, attrs.departmentName, "Department name");
            if (errors.length > 0) {
                return errors;
            }
        },
        defaults   : {
            departmentName   : '',
            parentDepartment : "",
            departmentManager: ""
        },
        urlRoot    : function () {
            return "/Departments";
        }
    });
    return DepartmentsModel;
});
