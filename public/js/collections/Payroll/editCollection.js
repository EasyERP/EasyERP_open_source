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
                var ModelsForCreate = Backbone.Collection.extend({
                    url: this.url
                });
                var ModelsForUpdate = Backbone.Collection.extend({
                    url: this.url
                });
                var modelsForUpdate;
                var modelsForCreate;


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

                modelsForUpdate = this.filter(function(model) {
                    return model.hasChanged();
                });

                modelsForCreate = new ModelsForCreate(modelsForCreate);
                modelsForUpdate = new ModelsForUpdate(modelsForUpdate);

                if(modelsForCreate.length) {
                    modelsForCreate.sync("create", modelsForCreate, options);
                };


                if(modelsForUpdate.length) {
                    Backbone.sync("patch", modelsForUpdate, updatedOptions);
                };
            }
        });

        return EditableCollection;
    });