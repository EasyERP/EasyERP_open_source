define([
    'Backbone',
    './filterCollection'
], function (Backbone, ParrantCollection) {
    'use strict';

    var EditableColection = ParrantCollection.extend({

        initialize: function () {
            this.on('change', this.change, this);
        },

        save: function () {
            var self = this;
            var model;
            var models = [];
            var newModel;
            var modelObject;
            var year;
            var month;
            var week;
            var cid;
            var saveObject;
            var options;
            var i;

            var syncObject = {
                trigger: this.trigger,
                url    : this.url,
                toJSON : function () {
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

                    year = modelObject.year || model.get('year');
                    month = modelObject.month || model.get('month');
                    week = modelObject.week || model.get('week');

                    models.push(modelObject);
                } else if (model && (!model.id)) {
                    cid = model.cid;

                    saveObject = {
                        trigger: this.trigger,
                        url    : this.url,

                        toJSON: function () {
                            return newModel;
                        }
                    };

                    options = {
                        success: function thisFunction(_model) {
                            self.trigger('saved', _model[0]);
                        },

                        error: function (xhr) {
                            App.render({
                                type   : 'error',
                                message: xhr.responseJSON.error
                            });
                        }
                    };

                    newModel = model.attributes;

                    Backbone.sync('create', saveObject, options);
                }
            }

            if (models.length) {
                Backbone.sync('patch', syncObject, updatedOptions);
            }
        }
    });

    return EditableColection;
});