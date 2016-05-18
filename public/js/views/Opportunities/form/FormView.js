define([
        'text!templates/Opportunities/form/FormTemplate.html',
        'views/Opportunities/EditView'
    ],

    function (OpportunitiesFormTemplate, EditView) {
        var FormOpportunitiesView = Backbone.View.extend({
            el        : '#content-holder',
            initialize: function (options) {
                this.formModel = options.model;
            },

            render: function () {
                var formModel = this.formModel.toJSON();
                this.$el.html(_.template(OpportunitiesFormTemplate, formModel));
                return this;
            },

            editItem: function () {
                //create editView in dialog here
                new EditView({model: this.formModel});
            },

            deleteItems: function () {
                var mid = 39;

                this.formModel.destroy({
                    headers: {
                        mid: mid
                    },
                    success: function () {
                        Backbone.history.navigate("#easyErp/Opportunities/list", {trigger: true});
                    }
                });

            }
        });

        return FormOpportunitiesView;
    });