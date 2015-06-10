/**
 * Created by Roman on 04.05.2015.
 */
define(['Validation', 'common'], function (Validation, common) {
    var wTrackModel = Backbone.Model.extend({
        idAttribute: "_id",
        initialize: function () {

        },
        defaults: {

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