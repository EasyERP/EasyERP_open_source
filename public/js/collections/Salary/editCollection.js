/**
 * Created by soundstorm on 19.06.15.
 */
define([
        './filterCollection'
    ],
    function (ParentCollection) {
        var EditableCollection = ParentCollection.extend({

            initialize: function(){
                this.on( "change", this.change, this);
            },

            save: function(){
                var self = this;
                var model;
                var models = [];
                var modelObject;
                var syncObject = {
                    url: this.url,
                    toJSON: function () {
                        return models;
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
                        modelObject = model.changedAttributes();
                        modelObject._id = model.id;
                        models.push(modelObject);
                    } else if (model && !model.id){
                        Backbone.sync("create", model, options);
                    }
                }

                if(models.length) {
                    Backbone.sync("patch", syncObject, updatedOptions);
                }
            }
        });

        return EditableCollection;
    });