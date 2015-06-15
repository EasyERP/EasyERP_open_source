/**
 * Created by Roman on 04.05.2015.
 */
define(['Validation', 'common'], function (Validation, common) {
    var wTrackModel = Backbone.Model.extend({
        idAttribute: "_id",
        initialize: function () {

        },
        defaults: {
            worked: 40,
            1: 8,
            2: 8,
            3: 8,
            4: 8,
            5: 8,
            revenue: 120,
            cost: 0,
            amount: 0
        },
        urlRoot: function () {
            return "/wTrack/";
        },
        parse: function(model){

            return model;
        }
    });

    return wTrackModel;
});