define([
        'common',
        'Validation'
    ],
    function (common, Validation) {
        var WorkflowsModel = Backbone.Model.extend({
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
                return response;
            },
            validate   : function (attrs, options) {
                var errors = [];

                if (attrs.value && !attrs.name) {
                    Validation.checkGroupsNameField(errors, true, attrs.value[0].name, "Name");
                }
                else {
                    Validation.checkGroupsNameField(errors, true, attrs.name, "Name");
                }
                if (errors.length > 0) {
                    return errors;
                }
            },
            urlRoot    : function () {
                return "/Workflows";
            }
        });
        return WorkflowsModel;
    });
