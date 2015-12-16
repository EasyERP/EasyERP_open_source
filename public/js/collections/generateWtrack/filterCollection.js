define([
        'models/GenerateWtrack'
    ],
    function (wTrackModel) {
        var wTrackCollection = Backbone.Collection.extend({
            model      : wTrackModel,
            url        : "/wTrack/",
            viewType   : null,
            contentType: null,

            initialize: function (options) {
            },

            save: function () {
                var self = this;
                var model;
                var newModel;
                var dateByWeek;
                var dateByMonth;
                var year;
                var month;
                var week;

                for (var i = this.models.length - 1; i >= 0; i--) {
                    model = this.models[i];

                    var saveObject = {
                        trigger: this.trigger,
                        url    : this.url,
                        toJSON : function () {
                            return newModel;
                        }
                    };

                    var options = {
                        success: function (model, resp, xhr) {
                            self.trigger('saved', model);
                        }
                    };

                    newModel = model.changed;
                    newModel._id = model.id;

                    Backbone.sync("create", saveObject, options);
                }

            }
        });
        return wTrackCollection;
    });