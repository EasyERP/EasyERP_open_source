define([
    'Backbone',
    'models/DepartmentsModel',
    'common',
    'collections/parent',
    'constants'
], function (Backbone, DepartmentsModel, common, Parent, CONSTANTS) {
    'use strict';

    var departmentsCollection = Parent.extend({
        model     : DepartmentsModel,
        url       : CONSTANTS.URLS.DEPARTMENTS,
        page      : 1,
        initialize: function (options) {
            this.startTime = new Date();
            var filterObject = {};
            var that = this;
            var i;
            /*if (options && options.viewType) {
             this.url += options.viewType;
             delete options.viewType;
             }*/

            for (i in options) {
                filterObject[i] = options[i];
            }

            this.fetch({
                data   : null,
                reset  : true,
                success: function () {
                    that.page += 1;
                },
                error  : this.fetchError
            });
        },

        parse: function (response) {
            if (response.data) {
                _.map(response.data, function (lead) {
                    lead.creationDate = common.utcDateToLocaleDate(lead.creationDate);
                    return lead;
                });
            }
            return Parent.prototype.parse.apply(this, arguments);
        }
    });
    return departmentsCollection;
});
