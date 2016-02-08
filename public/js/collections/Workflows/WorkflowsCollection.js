define([
        'Backbone',
        'models/WorkflowsModel'
    ],
    function (Backbone, WorkflowsModel) {
        'use strict';
        var WorkflowsCollection = Backbone.Collection.extend({
            model     : WorkflowsModel,
            url       : function () {
                var mid = 39;
                var url = "/Workflows?mid=" + mid + "&id=" + this.type;
                return url;
            },
            initialize: function (options) {
                if (!options) {
                    this.type = "";
                } else {
                    this.type = options.id;
                }
                this.fetch({
                    type   : 'GET',
                    reset  : true,
                    success: this.fetchSuccess,
                    error  : this.fetchError
                });
            },
            parse     : function (response) {
                return response.data;
            },
        });
        return WorkflowsCollection;
    });
