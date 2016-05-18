define([
    'models/PayRollModel'
], function (PayRollModel) {
    var payRollCollection = Backbone.Collection.extend({
        model      : PayRollModel,
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
                } else if (nameA < nameB) {
                    return this.sortOrder * (-1);
                } else {
                    return 0;
                }
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
    return payRollCollection;
});