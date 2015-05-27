define([
    'models/ProductModel'
],
    function (ProductModel) {
        var ProductCollection = Backbone.Collection.extend({
            model: ProductModel,
            url: "/product/",
           
            initialize: function (options) {

                this.fetch({
                    data: options,
                    reset: true,
                    success: function () {
                    },
                    error: function (models, xhr) {
                        if (xhr.status == 401) {
                            Backbone.history.navigate('#login', { trigger: true });
                        }
                    }
                });
            },
            parse: function(response){
                return response.success;
            }
        });
        return ProductCollection;
    });