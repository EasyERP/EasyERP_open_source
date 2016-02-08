define([
        'Backbone',
        'jQuery',
        "models/Priority",
        'constants'
    ],
    function (Backbone, $, PriorityModel, CONSTANTS) {
        var taskPriorityCollection = Backbone.Collection.extend({
            model     : PriorityModel,
            url       : function () {
                return CONSTANTS.URLS.PRIORITY;
            },
            initialize: function () {
                var mid = 39;

                this.fetch({
                    data   : $.param({
                        mid: mid
                    }),
                    type   : 'GET',
                    reset  : true,
                    success: this.fetchSuccess,
                    error  : this.fetchError
                });
            },
            parse     : function (response) {
                return response.data;
            }
        });
        return taskPriorityCollection;
    });