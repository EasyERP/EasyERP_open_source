define([
        'models/WorkflowsModel',
    ],
    function (WorkflowsModel) {
        var WorkflowsCollection = Backbone.Collection.extend({
            model     : WorkflowsModel,
            url       : function () {
                var mid = 39,
                    url = "/Workflows?mid=" + mid + "&id=" + this.type;
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
            parse     : true,
            parse     : function (response) {
                return response.data;
            },
        });
        return WorkflowsCollection;
    });
