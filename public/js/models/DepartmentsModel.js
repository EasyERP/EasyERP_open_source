define([
    'Backbone',
    'Validation',
    'constants'
], function (Backbone, Validation, CONSTANTS) {
    'use strict';
    var DepartmentsModel = Backbone.Model.extend({
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
            return CONSTANTS.URLS.DEPARTMENTS;
        }
    });
    return DepartmentsModel;
});
