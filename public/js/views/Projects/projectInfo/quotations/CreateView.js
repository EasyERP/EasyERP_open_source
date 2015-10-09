define([
        "views/Quotation/CreateView",
        "text!templates/Projects/projectInfo/quotations/CreateTemplate.html",
        "collections/Persons/PersonsCollection",
        "collections/Departments/DepartmentsCollection",
        'views/Product/InvoiceOrder/ProductItems',
        "models/QuotationModel",
        "common",
        "populate",
        'constants',
        'views/Assignees/AssigneesView'
    ],
    function (createView, CreateTemplate, PersonsCollection, DepartmentsCollection, ProductItemView, QuotationModel, common, populate, CONSTANTS, AssigneesView) {

        var CreateView = createView.extend({

            el         : "#content-holder",
            contentType: "Quotation",
            template   : _.template(CreateTemplate),

            initialize: function (options) {
                if (options) {
                    this.visible = options.visible;
                }
                _.bindAll(this, "saveItem", "render");
                this.model = new QuotationModel();
                this.responseObj = {};
                this.projectId = options.projectId;
                this.render();
                this.getForDd(this.projectId);
            },

            getForDd: function (projectID) {
                if (projectID) {
                    populate.get("#projectDd", "/getProjectsForDd", {}, "projectName", this, false, false, projectID);
                } else {
                    populate.get("#projectDd", "/getProjectsForDd", {}, "projectName", this, true, true);
                }
            },

            createProductView: function () {
                var productItemContainer;

                productItemContainer = this.$el.find('#productItemsHolder');
                productItemContainer.append(
                    new ProductItemView({canBeSold: true}).render().el
                );

            },

            redirectAfterSave: function (content) {
                content.hideDialog();
                content.rerenderTable();
            },

            rerenderTable: function () {
                var currentEl = this.$el.find('#quotationTable');

                currentEl.html('');
                currentEl.append(_.template(this.listTemplate));
                currentEl.append(new this.listItemView({
                    collection : this.collection,
                    page       : 1,
                    itemsNumber: 100
                }).render());
            }

        });

        return CreateView;
    });
