define([
        "views/Quotation/CreateView",
        "text!templates/Projects/projectInfo/quotations/CreateTemplate.html",
        "text!templates/Projects/projectInfo/quotations/newRow.html",
        "collections/Persons/PersonsCollection",
        "collections/Departments/DepartmentsCollection",
        'views/Product/InvoiceOrder/ProductItems',
        "models/QuotationModel",
        "common",
        "populate",
        'constants',
        'views/Assignees/AssigneesView'
    ],
    function (createView, CreateTemplate, newRow, PersonsCollection, DepartmentsCollection, ProductItemView, QuotationModel, common, populate, CONSTANTS, AssigneesView) {

        var CreateView = createView.extend({

            el         : "#content-holder",
            contentType: "Quotation",
            template   : _.template(CreateTemplate),
            templateNewRow: _.template(newRow),

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

            redirectAfterSave: function (content, model) {
                var currentEl = $('#listTableQuotation');

                var number = currentEl.find('.countNumber');

                currentEl.append(this.templateNewRow({
                    quotation: model.toJSON()
                }))

                content.hideDialog();
            }
        });

        return CreateView;
    });
