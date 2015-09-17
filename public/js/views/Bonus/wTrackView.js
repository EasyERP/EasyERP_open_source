/**
 * Created by liliya on 17.09.15.
 */
define([
    'text!templates/Bonus/wTrackTemplate.html'

], function (wTrackTemplate) {
    var wTrackView = Backbone.View.extend({

        el: '.weTracks',

        initialize: function (options) {
            this.model = options.model;

            this.render();
        },

        template: _.template(wTrackTemplate),

        events: {

        },

        render: function () {
            var self = this;
            var wTracks = this.model;

            self.$el.html(this.template({
                wTracks: wTracks,
                startNumber: 0
            }));

            return this;
        }
    });

    return wTrackView;
});