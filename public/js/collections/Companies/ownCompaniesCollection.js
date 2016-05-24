define([
        'Backbone',
        'jQuery',
        'models/CompaniesModel'
    ],
    function (Backbone, $, CompanyModel) {
        var CompaniesCollection = Backbone.Collection.extend({
            model: CompanyModel,
            url  : function () {
                return "/ownCompanies";
            },

            initialize: function () {
                console.log("Companies Collection Init");
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

            parse: function (response) {
                return response.data;
            },

            fetchSuccess: function () {
                console.log("OwnCompanies fetchSuccess");
            },
            fetchError  : function (error) {

            }
        });

        return CompaniesCollection;
    });