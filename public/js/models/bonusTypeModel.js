define([
    'Backbone',
    'constants'
], function (Backbone, CONSTANTS) {

    var bonusTypeModel = Backbone.Model.extend({
        idAttribute: '_id',

        urlRoot: function () {
            return CONSTANTS.URLS.BONUSTYPE;
        },

        defaults: {
            bonusType: ''
        }
    });
    return bonusTypeModel;

});
