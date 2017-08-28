define([
    'Backbone',
    'Underscore',
    'models/CustomChartModel'
], function (Backbone, _, CustomChartModel) {
    'use strict';

    var CustomChartCollection = Backbone.Collection.extend({
        model: CustomChartModel,
        url  : '/customChart',

        /*  save: function () {

         Backbone.sync('create', this);
         */
        save: function () {
            var self = this;
            var model;
            var models = [];
            var modelObject;
            var newModel;
            var saveObject;
            var options;
            var i;

            var syncObject = {
                trigger: this.trigger,
                url    : this.url,

                toJSON: function () {
                    return models;
                }
            };

            var updatedOptions = {
                success: function () {
                    self.trigger('updated');
                }
            };

            for (i = this.models.length - 1; i >= 0; i--) {
                model = this.models[i];

                if (model && model.id && model.hasChanged()) {
                    modelObject = model.changed;
                    modelObject._id = model.id;
                    models.push(modelObject);
                } else if (model && !model.id) {
                    saveObject = {
                        trigger: this.trigger,
                        url    : this.url,

                        toJSON: function () {
                            return newModel;
                        }
                    };

                    options = {
                        success: function (model) {
                            self.trigger('saved', model);
                        }
                    };

                    newModel = model.changed;
                    newModel._id = model.id;

                    Backbone.sync('create', saveObject, options);
                }

                if (models.length) {
                    Backbone.sync('patch', syncObject, updatedOptions);
                }
            }
        },

       /* remove: function (options) {
            Backbone.sync('delete', this, {
                data : options
            });
        }*/
    });

    return CustomChartCollection;
});
