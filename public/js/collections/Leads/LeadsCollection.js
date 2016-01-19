define([
        'models/LeadsModel',
        'common'
    ],
    function (LeadModel, common) {
        var LeadsCollection = Backbone.Collection.extend({
            model     : LeadModel,
            url       : function () {
                return "/Leads";
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
            parse     : true,

            parse: function (response) {
                return response.data;
            },
        });
        return LeadsCollection;
    });