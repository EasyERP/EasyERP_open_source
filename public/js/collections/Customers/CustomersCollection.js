define(function () {
    var CustomerModel = Backbone.Model.extend({
        idAttribute: '_id'
    });
    var CustomersCollection = Backbone.Collection.extend({
        model     : CustomerModel,
        url       : function () {
            return "/Customer";
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

        parse: true,

        parse: function (response) {
            return response.data;
        }
    });
    return CustomersCollection;
});