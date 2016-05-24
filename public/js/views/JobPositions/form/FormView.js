define([
        'Backbone',
        'jQuery',
        'Underscore',
        'text!templates/JobPositions/form/FormTemplate.html',
        'views/JobPositions/EditView'
    ],
    function (Backbone, $, _, FormTemplate, EditView) {
        'use strict';

        var FormView = Backbone.View.extend({
            el        : '#content-holder',
            initialize: function (options) {
                this.formModel = options.model;
                this.formModel.urlRoot = '/JobPositions/';
            },

            render: function () {
                var formModel = this.formModel.toJSON();
                this.$el.html(_.template(FormTemplate, formModel));
                return this;
            },

            editItem   : function () {
                new EditView({model: this.formModel});
            },

            deleteItems: function () {
                var mid = 39;

                this.formModel.destroy({
                    headers: {
                        mid: mid
                    },
                    success: function () {
                        Backbone.history.navigate("#easyErp/JobPositions/list", {trigger: true});
                    }
                });
            }
        });
        return FormView;
    });
