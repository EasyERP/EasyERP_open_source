define([
    'Backbone'
], function (Backbone) {
    var Model = Backbone.Model.extend({
        idAttribute: '_id',
        initialize : function () {
        },

        urlRoot: function () {
            return '/scheduledPay';
        }
    });
    return Model;
});
