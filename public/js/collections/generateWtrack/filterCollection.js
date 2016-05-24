define([
        'Backbone',
        'models/GenerateWtrack',
        'constants'
    ],
    function (Backbone, wTrackModel, CONSTANTS) {
        'use strict';

        var wTrackCollection = Backbone.Collection.extend({
            model      : wTrackModel,
            url        : CONSTANTS.URLS.WTRACK,
            viewType   : null,
            contentType: null,

            save: function () {
                var self = this;
                var model;
                var newModel;
                var i;

                for (i = this.models.length - 1; i >= 0; i--) {
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