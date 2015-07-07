define([
        './filterCollection'
    ],
    function (ParentCollection) {
        var EditableCollection = ParentCollection.extend({

            initialize: function(){
                this.on( "change", this.change, this);
            },

            save: function(changedValues){
                var self = this;
                var model;
                var models = [];
                var modelsForCreate = [];
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
                        var vacArray = model.changed.vacArray;

                        newModel = model.changed;

                        if (vacArray) {
                            var index = 0;
                            var month = model.changed.month ? model.changed.month : model.month;
                            var year = model.changed.year ? model.changed.year : model.year;
                            var momentDate = moment([year, month]);
                            var element = {};
                            var prevElement;
                            var startDate;
                            var endDate;

                            while(index<=vacArray.length) {
                                if (vacArray[index]) {
                                    element = {
                                        index: index,
                                        type: vacArray[index]
                                    }
                                    if (prevElement) {
                                        if (element.index - 1 !== prevElement.index ) {
                                            momentDate.date(prevElement.index + 1);
                                            endDate = new Date(momentDate);

                                            newModel.startDate = startDate;
                                            newModel.endDate = endDate;

                                            newModel._id = model.id;

                                            modelsForCreate.push(modelObject);

                                        }
                                    } else {
                                        momentDate.date(index+1);
                                        startDate = new Date(momentDate);
                                    }

                                }
                            }
                            Backbone.sync("create", saveObject, options);
                        }
                    }
                }

                if(models.length) {
                    Backbone.sync("patch", syncObject, updatedOptions);
                }
            }
        });

        return EditableCollection;
    });