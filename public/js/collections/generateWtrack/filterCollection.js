define([
        'models/generateWtrack'
    ],
    function (wTrackModel) {
        var wTrackCollection = Backbone.Collection.extend({
            model: wTrackModel,
            url: "/wTrack/",
            viewType: null,
            contentType: null,

            initialize: function (options) {
                this.startTime = new Date();

                if (options && options.viewType) {
                    this.viewType = options.viewType || 'wTrack';
                    this.url += this.viewType;
                }

                this.contentType = options.contentType || 'list';

                this.fetch({
                    data: options,
                    reset: true,
                    success: function () {
                    },
                    error: function (models, xhr) {
                        if (xhr.status == 401) {
                            Backbone.history.navigate('#login', {trigger: true});
                        }
                    }
                });
            }
        });
        return wTrackCollection;
    });