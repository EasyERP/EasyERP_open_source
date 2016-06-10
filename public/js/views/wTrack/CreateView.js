define([
    'Backbone',
    'Underscore',
    'text!templates/wTrack/CreateTemplate.html',
    'dataService',
    'constants'
], function (Backbone, _, CreateTemplate, dataService, CONSTANTS) {
    var CreateView = Backbone.View.extend({
        el      : '#listTable',
        template: _.template(CreateTemplate),

        initialize: function (options) {
            var responseObj;
            
            this.render(options);

            if (options.mainWtrackView) {
                responseObj = options.mainWtrackView.responseObj;
                responseObj = responseObj || {};
                
                dataService.getData(CONSTANTS.URLS.PROJECTS_GET_FOR_WTRACK, null, function (response) {
                    responseObj['#project'] = response.data;
                });

                dataService.getData(CONSTANTS.URLS.EMPLOYEES_GETFORDD, null, function (employees) {
                    employees = _.map(employees.data, function (employee) {
                        employee.name = employee.name.first + ' ' + employee.name.last;

                        return employee;
                    });

                    responseObj['#employee'] = employees;
                });

                dataService.getData(CONSTANTS.URLS.DEPARTMENTS_FORDD, null, function (response) {
                    responseObj['#department'] = response.data;
                });
            }
        },

        events: {},

        render: function (options) {
            this.$el.prepend(this.template(options));

            return this;
        }

    });

    return CreateView;
});
