define([
    'Backbone',
    'models/ProjectMemberModel'
], function (Backbone, ProjectMemberModel) {
    'use strict';

    var ProjectMembersCollection = Backbone.Collection.extend({

        model: ProjectMemberModel,
        url  : '/projectMember/',

        initialize: function (options) {
            this.fetch({
                data   : options,
                reset  : true,
                error  : function (err, xhr) {
                    console.log(xhr);
                    if (xhr.status === 403) {
                        App.render({
                            type: 'error',
                            message: 'No access'
                        });
                    }
                }
            });
            //this.on('change', this.change, this);
        },

        save: function (changes) {
            var self = this;
            var model;
            var models = [];
            var newModel;
            var modelObject;
            var options;
            var saveObject;
            var updatedOptions;
            var syncObject;

            syncObject = {
                trigger: this.trigger,
                url    : this.url,
                toJSON : function () {
                    return models;
                }
            };

            saveObject = {
                trigger: this.trigger,
                url    : this.url,
                toJSON : function () {
                    return newModel;
                }
            };

            options = {
                success: function (model) {
                    self.trigger('saved', model);
                }
            };

            updatedOptions = {
                success: function (model, resp, xhr) {
                    self.trigger('updated');
                }
            };

            for (var i = this.models.length - 1; i >= 0; i--) {
                model = this.models[i];

                if (model && model.id && (model.id.length == 24) && model.hasChanged()) {
                    modelObject = model.changed;
                    modelObject._id = model.id;
                    models.push(modelObject);
                } else if (model && !model.id) {
                    newModel = model.changed;
                    newModel._id = model.id;
                    Backbone.sync("create", saveObject, options);
                }
            }
            ;

            if (models.length) {
                Backbone.sync("patch", syncObject, updatedOptions);
            }
        }
    });

    return ProjectMembersCollection;
});