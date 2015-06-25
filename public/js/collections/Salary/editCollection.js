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
                var modelsForUpdate;
                var modelsForCreate;
                var modelObject;
                var syncObjectUpdate = {
                    trigger: this.trigger,
                    url: this.url,
                    toJSON: function () {
                        return modelsForUpdate;
                    }
                };

                var syncObjectCreate = {
                    trigger: this.trigger,
                    url: this.url,
                    toJSON: function () {
                        return modelsForCreate;
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

                modelsForCreate = this.filter(function(model) {
                   return !model.id;
                });

                var ModelsForCreate = Backbone.Collection.extend({
                    url: this.url
                });

                /*for (var i = this.models.length - 1; i >=0; i--){
                    model = this.models[i];

                    if(model && model.id && model.hasChanged()){
                        modelObject = model.changedAttributes();
                        modelObject._id = model.id;
                        modelsForUpdate.push(modelObject);
                    } else if (model && !model.id){
                        modelsForCreate.push(model);
                    }
                }*/

                modelsForCreate = new ModelsForCreate(modelsForCreate);

                if(modelsForCreate.length) {
                    modelsForCreate.sync("create", modelsForCreate, options);
                };


                /*if(modelsForUpdate.length) {
                    Backbone.sync("patch", syncObjectUpdate, updatedOptions);
                };*/
            }
        });

        return EditableCollection;
    });