define([
        'models/CompaniesModel',
        'common'
    ],
    function (CompanyModel, common) {
        var CompaniesCollection = Backbone.Collection.extend({
            model: CompanyModel,
            url  : function () {
                return "/Companies";
            },

            initialize    : function () {
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
            filterByLetter: function (letter) {
                var filtered = this.filter(function (data) {
                    return data.get("name").first.toUpperCase().startsWith(letter);
                });
                return new CompaniesCollection(filtered);
            },

            parse: true,

            parse: function (response) {
                return response.data;
            },
        });
        return CompaniesCollection;
    });
