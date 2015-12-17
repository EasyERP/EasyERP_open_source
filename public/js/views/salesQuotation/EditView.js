define([
        'views/Quotation/EditView'
    ],
    function (ParrentEditView) {

        var EditView = ParrentEditView.extend({
            forSales   : true,
            contentType: "salesQuotation",

            initialize: function (options) {
                this.forSales = true;
                this.currentModel = (options.model) ? options.model : options.collection.getElement();
                this.currentModel.urlRoot = "/quotation";
                this.responseObj = {};
                this.projectManager = this.currentModel.toJSON().project.projectmanager;
                this.customerId = options.customerId;
                this.pId = options.pId;
                this.redirect = options.redirect;
                this.collection = options.collection;
                this.hidePrAndCust = options.hidePrAndCust || false;

                _.bindAll(this, "render", "saveItem");
                _.bindAll(this, "render", "deleteItem");

                this.render();
            }
        });

        return EditView;
    });
