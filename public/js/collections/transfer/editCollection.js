define([
    'Backbone',
    './filterCollection'
], function (Backbone, ParentCollection) {
    'use strict';

    var EditableCollection = ParentCollection.extend({

        initialize: function () {
            this.on('change', this.change, this);
        },

        save: function () {
            var self = this;
            var model;
            var models = [];
            var newModel;
            var modelObject;
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

                    models.push(modelObject);
                } else if (model && !model.id) {
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
                            _model.cid = thisFunction.cid; // (in case of multi copying)
                            self.trigger('saved', _model);
                        }
                    };

                    options.success.cid = cid; // tied parameter cid with function

                    newModel = model.changed;
                    newModel._id = model.id;

                    Backbone.sync('create', saveObject, options);
                }
            }

            if (models.length) {
                Backbone.sync('patch', syncObject, updatedOptions);
            }
        }
    });

    return EditableCollection;
});