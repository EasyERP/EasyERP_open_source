define([
    'models/ProductModel',
    'common'
],
    function (ProductModel, common) {
        var ProductCollection = Backbone.Collection.extend({
            model: ProductModel,
            url: function () {
                return "/Product";
            },

            initialize: function () {
                var mid = 58;
                this.fetch({
                    data: $.param({
                        mid: mid
                    }),
                    type: 'GET',
                    reset: true,
                    success: this.fetchSuccess,
                    error: this.fetchError
                });
            },
            filterByLetter: function(letter){
                var filtered = this.filter(function(data){
                    return data.get("name").toUpperCase().startsWith(letter);
                });
                return new ProductCollection(filtered);
            },

            parse: true,

            parse: function (response) {
                return response.data;
            }
        });
        return ProductCollection;
    });
