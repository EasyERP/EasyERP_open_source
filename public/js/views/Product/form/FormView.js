/**
 * Created by soundstorm on 07.05.15.
 */
define([
        'text!templates/Product/form/FormTemplate.html',
        'views/Product/EditView',
        "jqueryBarcode"
    ],

    function (ProductFormTemplate, EditView) {
        var FormProductView = Backbone.View.extend({
            el: '#content-holder',

            initialize: function (options) {
                this.formModel = options.model;
            },

            render: function () {
                var formModel = this.formModel.toJSON();
                var el = this.$el;
                el.html(_.template(ProductFormTemplate, formModel));
                el.find("#bcTarget").barcode(formModel.info.barcode, "code128");
                return this;
            },

            editItem: function () {
                //create editView in dialog here
                new EditView({model: this.formModel});
            },

            deleteItems: function () {
                var mid = 58;
                this.formModel.urlRoot = "/Product";
                this.formModel.destroy({
                    headers: {
                        mid: mid
                    },
                    success: function () {
                        Backbone.history.navigate("#easyErp/Product/thumbnails", {trigger: true});
                    }
                });

            }
        });
        return FormProductView;
    });
