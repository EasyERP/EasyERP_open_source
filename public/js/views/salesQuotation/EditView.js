define([
        'views/Quotation/EditView'
    ],
    function (ParrentEditView) {

        var EditView = ParrentEditView.extend({
            forSales: true,
            initialize: function(options){
                this.forSales = true;
                this.currentModel = (options.model) ? options.model : options.collection.getElement();
                this.currentModel.urlRoot = "/quotation";
                this.responseObj = {};

                this.render();
            }
        });

        return EditView;
    });
