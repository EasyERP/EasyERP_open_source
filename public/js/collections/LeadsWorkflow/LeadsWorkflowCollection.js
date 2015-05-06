define(function () {
    var WorkflowModel = Backbone.Model.extend({
        idAttribute: '_id'
    });

    var WorkflowsCollection = Backbone.Collection.extend({
        model: WorkflowModel,
        url: function () {
            var mid = 39,
                url = "/Workflows";
            return url;
        },
        initialize: function () {
            var mid = 39;

            this.fetch({
                data: $.param({
                    mid: mid,
                    id: 'lead'
                }),
                type: 'GET',
                reset: true,
                success: this.fetchSuccess,
                error: this.fetchError
            });
        },

        parse: true,

        parse: function (response) {
            return response.data;
        },
    });
    return WorkflowsCollection;
});