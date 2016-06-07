define([
    'Backbone',
    'collections/parent',
    'models/EmployeesModel',
    'constants'
], function (Backbone, Parent, EmployeeModel, CONSTANTS) {
    'use strict';

    var EmployeesCollection = Parent.extend({
        model   : EmployeeModel,
        url     : CONSTANTS.URLS.EMPLOYEES,
        pageSize: CONSTANTS.DEFAULT_THUMBNAILS_PER_PAGE,

        initialize: function (options) {
            var page;

            function _errHandler(models, xhr) {
                if (xhr.status === 401) {
                    Backbone.history.navigate('#login', {trigger: true});
                }
            }

            options = options || {};
            options.error = options.error || _errHandler;
            page = options.page;

            this.startTime = new Date();

            if (page) {
                return this.getPage(page, options);
            }

            this.getFirstPage(options);
        },

        filterByLetter: function (letter) {
            var filtered = this.filter(function (data) {
                return data.get('name').last.toUpperCase().startsWith(letter);
            });

            return new EmployeesCollection(filtered);
        }
    });
    return EmployeesCollection;
});
