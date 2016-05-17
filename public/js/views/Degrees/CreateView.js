define([
        'Backbone',
        'jQuery',
        'Underscore',
        "text!templates/Degrees/CreateTemplate.html",
        "models/DegreeModel"
    ],
    function (Backbone, $, _, CreateTemplate, DegreeModel) {
        'use strict';

        var CreateView = Backbone.View.extend({
            el         : "#content-holder",
            contentType: "Degrees",
            template   : _.template(CreateTemplate),

            initialize: function (options) {
                this.bind('reset', _.bind(this.render, this));
                this.degreesCollection = options.collection;
                this.render();
            },

            close: function () {
                this._modelBinder.unbind();
            },

            saveItem: function () {
                var mid = 39;
                var degreeModel = new DegreeModel();
                var name = $.trim($("#name").val());
                degreeModel.save({
                        name: name
                    },
                    {
                        headers: {
                            mid: mid
                        }
                    });
                Backbone.history.navigate("home/content-" + this.contentType, {trigger: true});

            },
            render  : function () {
                this.$el.html(this.template());
                return this;
            }
        });
        return CreateView;
    });