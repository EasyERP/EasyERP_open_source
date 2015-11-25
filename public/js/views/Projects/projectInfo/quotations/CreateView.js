define([
        "views/salesQuotation/CreateView",
        "text!templates/Projects/projectInfo/quotations/CreateTemplate.html",
        "text!templates/Projects/projectInfo/quotations/newRow.html",
        "collections/Persons/PersonsCollection",
        "collections/Departments/DepartmentsCollection",
        'views/Product/InvoiceOrder/ProductItems',
        "models/QuotationModel",
        "common",
        "populate",
        'constants',
        'views/Assignees/AssigneesView',
        'dataService'
    ],
    function (createView, CreateTemplate, newRow, PersonsCollection, DepartmentsCollection, ProductItemView, QuotationModel, common, populate, CONSTANTS, AssigneesView, dataService) {

        var CreateView = createView.extend({

            el            : "#content-holder",
            contentType: "Quotation",
            template   : _.template(CreateTemplate),
            templateNewRow: _.template(newRow),

            initialize: function (options) {

                if (options) {
                    this.visible = options.visible;
                    this.projectModel = options.projectModel;
                    this.wTrackCollection = options.wTrackCollection;
                    this.createJob = options.createJob;
                }

                this.populate = true;

                if (options.collection) {
                    this.collection = options.collection;
                }

                _.bindAll(this, "saveItem", "render");
                this.model = new QuotationModel();
                this.responseObj = {};
                this.projectId = options.projectId;
                this.customerId = options.customerId;
                this.projectManager = options.projectManager;
                this.render();
                this.getForDd(this.projectId, this.customerId);
                this.forSales = true;
            },

            saveItem: function () {
                var self = this;
                var mid = 55;
                var thisEl = this.$el;
                var selectedProducts = thisEl.find('.productItem');
                var products = [];
                var data;
                var selectedLength = selectedProducts.length;
                var targetEl;
                var productId;
                var quantity;
                var price;
                var scheduledDate;

                var forSales = this.forSales ? true : false;

                var supplier = {};
                var project = {};

                supplier._id = thisEl.find('#supplierDd').attr('data-id');
                supplier.name = thisEl.find('#supplierDd').text();


                project._id = thisEl.find('#projectDd').attr('data-id');
                project.projectName = thisEl.find('#projectDd').text();
                project.projectmanager = this.projectManager;

                var destination = $.trim(thisEl.find('#destination').attr('data-id'));
                var deliverTo = $.trim(thisEl.find('#deliveryDd').attr('data-id'));
                var incoterm = $.trim(thisEl.find('#incoterm').attr('data-id'));
                var invoiceControl = $.trim(thisEl.find('#invoicingControl').attr('data-id'));
                var paymentTerm = $.trim(thisEl.find('#paymentTerm').attr('data-id'));
                var fiscalPosition = $.trim(thisEl.find('#fiscalPosition').attr('data-id'));

                var orderDate = thisEl.find('#orderDate').val();
                var expectedDate = thisEl.find('#expectedDate').val() || thisEl.find('#minScheduleDate').text();

                var total = $.trim(thisEl.find('#totalAmount').text());
                var totalTaxes = $.trim(thisEl.find('#taxes').text());
                var taxes;
                var description;
                var unTaxed = $.trim(thisEl.find('#totalUntaxes').text());
                var subTotal;
                var jobs;

                var usersId = [];
                var groupsId = [];

                $(".groupsAndUser tr").each(function () {
                    if ($(this).data("type") == "targetUsers") {
                        usersId.push($(this).data("id"));
                    }
                    if ($(this).data("type") == "targetGroups") {
                        groupsId.push($(this).data("id"));
                    }

                });

                var whoCanRW = this.$el.find("[name='whoCanRW']:checked").val();

                if (selectedLength) {
                    for (var i = selectedLength - 1; i >= 0; i--) {
                        targetEl = $(selectedProducts[i]);
                        productId = targetEl.data('id');
                        if (productId) {
                            quantity = targetEl.find('[data-name="quantity"]').text();
                            price = targetEl.find('[data-name="price"]').text();
                            scheduledDate = targetEl.find('[data-name="scheduledDate"]').text();
                            taxes = targetEl.find('.taxes').text();
                            description = targetEl.find('[data-name="productDescr"]').text();
                            subTotal = targetEl.find('.subtotal').text();
                            jobs = targetEl.find('.current-selected.jobs').attr('data-id');

                            if (!jobs) {
                                return alert("Job field can't be empty. Please, choose or create one.");
                            }

                            products.push({
                                product      : productId,
                                unitPrice: price,
                                quantity : quantity,
                                scheduledDate: scheduledDate,
                                taxes        : taxes,
                                description  : description,
                                subTotal     : subTotal,
                                jobs         : jobs
                            });
                        } else {
                            return alert("Products can't be empty.");
                        }
                    }
                }


                data = {
                    forSales      : forSales,
                    supplier: supplier,
                    project : project,
                    deliverTo: deliverTo,
                    products : products,
                    orderDate: orderDate,
                    expectedDate: expectedDate,
                    destination : destination,
                    incoterm    : incoterm,
                    invoiceControl: invoiceControl,
                    paymentTerm   : paymentTerm,
                    fiscalPosition: fiscalPosition,
                    populate      : true, //Need Populate data from server
                    paymentInfo   : {
                        total  : total,
                        unTaxed: unTaxed,
                        taxes  : totalTaxes
                    },
                    groups        : {
                        owner: $("#allUsersSelect").data("id"),
                        users: usersId,
                        group: groupsId
                    },
                    whoCanRW      : whoCanRW,
                    workflow      : this.defaultWorkflow
                };

                if (supplier._id && selectedLength) {
                    this.model.save(data, {
                        headers: {
                            mid: mid
                        },
                        wait   : true,
                        success: function (model) {
                            self.redirectAfterSave(self, model);
                        },
                        error  : function (model, xhr) {
                            self.errorNotification(xhr);
                        }
                    });

                } else {
                    return alert('Products can not be empty.');
                }
            },

            getForDd: function (projectID, customerId) {
                populate.get("#supplierDd", "/Customer", {}, "fullName", this, false, false, customerId);

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
                    new ProductItemView({
                        canBeSold       : true,
                        service  : 'Service',
                        projectModel: this.projectModel.toJSON(),
                        wTrackCollection: this.wTrackCollection.toJSON()
                    }).render().el
                );

            },

            redirectAfterSave: function (content, model) {
                var currentEl = $('#listTableQuotation');
                var number = currentEl.find('.countNumber');
                var numberLength = number.length ? number.length : 0;
                var lastNumber = number.length ? $(number[numberLength - 1]).html() : 0;

                var currentNumber = parseInt(lastNumber) + 1;

                var products = model.get('products');

                var data = {products: JSON.stringify(products), type: "Quoted"};

                dataService.postData("/jobs/update", data, function (err, result) {
                    if (err) {
                        return console.log(err);
                    }

                });

                content.hideDialog();

                this.collection.add(model);

                currentEl.append(this.templateNewRow({
                    quotation  : model.toJSON(),
                    startNumber: currentNumber,
                    dateToLocal: common.utcDateToLocaleDate
                }));
            }
        });

        return CreateView;
    });
