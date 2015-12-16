define([
        './filterCollection'
    ],
    function (ParrantCollection) {
        var EditableColection = ParrantCollection.extend({

            initialize: function () {
                this.on("change", this.change, this);
            },

            save: function (changedValues) {
                var self = this;
                var model;
                var models = [];
                var newModel;
                var modelObject;
                var dateByWeek;
                var dateByMonth;
                var year;
                var month;
                var week;

                var syncObject = {
                    trigger: this.trigger,
                    url    : this.url,
                    toJSON : function () {
                        return models;
                    }
                };

                //var saveObject = {
                //    trigger: this.trigger,
                //    url: this.url,
                //    toJSON: function () {
                //        return newModel;
                //    }
                //};
                //
                //var options = {
                //    success: function (model, resp, xhr) {
                //        self.trigger('saved', model);
                //    }
                //};

                var updatedOptions = {
                    success: function (model, resp, xhr) {
                        self.trigger('updated');
                    }
                };

                for (var i = this.models.length - 1; i >= 0; i--) {
                    model = this.models[i];

                    if (model && model.id && model.hasChanged()) {
                        modelObject = model.changed;
                        modelObject._id = model.id;

                        year = modelObject.year || model.get('year');
                        month = modelObject.month || model.get('month');
                        week = modelObject.week || model.get('week');

                        if (year && week) {
                            dateByWeek = parseInt(year) * 100 + parseInt(week);
                            modelObject.dateByWeek = dateByWeek;
                        }
                        if (year && month) {
                            dateByMonth = parseInt(year) * 100 + parseInt(month);
                            modelObject.dateByMonth = dateByMonth;
                        }

                        models.push(modelObject);
                    } else if (model && !model.id) {

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

                        year = newModel.year || model.get('year');
                        month = newModel.month || model.get('month');
                        week = newModel.week || model.get('week');

                        if (year && week) {
                            dateByWeek = parseInt(year) * 100 + parseInt(week);
                            newModel.dateByWeek = dateByWeek;
                        }
                        if (year && month) {
                            dateByMonth = parseInt(year) * 100 + parseInt(month);
                            newModel.dateByMonth = dateByMonth;
                        }

                        Backbone.sync("create", saveObject, options);
                    }
                }

                if (models.length) {
                    Backbone.sync("patch", syncObject, updatedOptions);
                }
            }
        });

        return EditableColection;
    });