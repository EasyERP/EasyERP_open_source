define([
        'models/JobPositionsModel'
    ],
    function (JobPositionsModel) {
        var JobPositionsCollection = Backbone.Collection.extend({
            model     : JobPositionsModel,
            url       : function () {
                return "/JobPositions";
            },
            initialize: function () {
                console.log("JobPosition Collection Init");
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
            parse     : true,
            parse     : function (response) {
                return response.data;
            }
        });
        return JobPositionsCollection;
    });