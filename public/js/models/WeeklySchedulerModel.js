define([
    'Backbone'
], function (Backbone) {
    var Model = Backbone.Model.extend({
        idAttribute: '_id',
        initialize : function () {
        },

        urlRoot: function () {
            return '/weeklyScheduler';
        }
    });
    return Model;
});
