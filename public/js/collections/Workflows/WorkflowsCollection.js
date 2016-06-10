define([
    'collections/parent',
    'models/WorkflowsModel'
], function (Parent, WorkflowsModel) {
    'use strict';

    var WorkflowsCollection = Parent.extend({
        model: WorkflowsModel,
        url  : function () {
            var mid = 39;
            var url = '/Workflows?mid=' + mid + '&id=' + this.type;

            return url;
        },

        initialize: function (options) {
            // change check options.id

            if (options && options.id) {
                this.type = options.id;
            } else {
                this.type = '';
            }

            this.fetch({
                type   : 'GET',
                reset  : true,
                success: this.fetchSuccess,
                error  : this.fetchError
            });
        }
    });

    return WorkflowsCollection;
});
