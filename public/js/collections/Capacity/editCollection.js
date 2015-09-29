define([
        './filterCollection'
    ],
    function (ParentCollection) {
        var EditableColection = ParentCollection.extend({

            initialize: function(){
                this.on( "change", this.change, this);
            },

            save: function(changedValues){
                var self = this;
                var model;
                var models = [];
                var modelObject;
                var newModel;
                var syncObject = {
                    trigger: this.trigger,
                    url: this.url,
                    toJSON: function () {
                        return models;
                    }
                };

                var saveObject = {
                    trigger: this.trigger,
                    url: this.url,
                    toJSON: function () {
                        return newModel;
                    }
                };

                var options = {
                    success: function (model, resp, xhr) {
                        self.trigger('saved', model);
                    }
                };
                var updatedOptions = {
                    success: function (model, resp, xhr) {
                        self.trigger('updated');
                    }
                };

                for (var i = this.models.length - 1; i >=0; i--){
                    model = this.models[i];

                    if(model && model.id && model.hasChanged()){
                        modelObject = model.changed;
                        modelObject._id = model.id;
                        models.push(modelObject);
                    } else if (model && !model.id) {
                        newModel = model.changed;
                        newModel._id =  model.id;
                        Backbone.sync("create", saveObject, options);
                    }
                }

                if(models.length) {
                    Backbone.sync("patch", syncObject, updatedOptions);
                }
            }
        });

        return EditableColection;
    });