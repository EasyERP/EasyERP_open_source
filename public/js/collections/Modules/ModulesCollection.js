define(function () {
    var MenuItems = Backbone.Collection.extend({
        url       : function () {
            return "/getModules"
        },
        initialize: function () {
            this.fetch({
                reset: true
            });
        },
        parse     : true,
        parse     : function (response) {
            return response.data;
        }
    });
    return MenuItems;
});