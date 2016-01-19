define(function ($, _, Backbone) {
    var CustomerModel = Backbone.Model().extend({
        url       : function () {
            if (this.get('isCompany')) {
                return "/createAccount";
            } else {
                return "/createCompany";
            }
        },
        initialize: function () {
        }
    });

    return CustomerModel;
});