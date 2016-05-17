define([
    'Backbone',
    'models/Capacity',
    'constants'
], function (Backbone, CapacityModel, CONSTANTS) {
    'use strict';

    var CapacityCollection = Backbone.Collection.extend({
        model      : CapacityModel,
        url        : CONSTANTS.URLS.CAPACITY,
        viewType   : null,
        contentType: null,

        comparator: function (modelA, modelB) {
            var nameA = getEmployeeName(modelA);
            var nameB = getEmployeeName(modelB);

            function getEmployeeName(model) {
                var employeeAttr = model.get('employee');

                if (employeeAttr) {
                    return model.get('employee').name;
                }

                return false;
            }

            if (nameA && nameB) {
                if (nameA > nameB) {
                    return this.sortOrder;
                }

                if (nameA < nameB) {
                    return this.sortOrder * (-1);
                }

                return 0;

            }
        },

        sortByOrder: function (order) {
            this.sortOrder = order;
            this.sort();
        },

        initialize: function () {
            this.sortOrder = 1;
            this.startTime = new Date();
        }
    });
    return CapacityCollection;
});