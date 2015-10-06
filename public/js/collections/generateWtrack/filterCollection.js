define([
        'models/GenerateWtrack'
    ],
    function (wTrackModel) {
        var wTrackCollection = Backbone.Collection.extend({
            model: wTrackModel,
            url: "/wTrack/",
            viewType: null,
            contentType: null,

            initialize: function (options) {
            }
        });
        return wTrackCollection;
    });