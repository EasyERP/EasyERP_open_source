define([
        "text!templates/Quotation/CreateTemplate.html",
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
    function (CreateTemplate, PersonsCollection, DepartmentsCollection, ProductItemView, QuotationModel, common, populate, CONSTANTS, AssigneesView, dataService) {

        var CreateView = Backbone.View.extend({
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
                this.forSales = false;

                this.render();
            },

            events: {
                'keydown'                                                         : 'keydownHandler',
                'click .dialog-tabs a'                                            : 'changeTab',
                "click #projectDd"                                                : "showNewSelect",
                "click a.current-selected:not(#projectDd,.jobs)"                  : "showNewSelect",
                "click .newSelectList li:not(.miniStylePagination,#generateJobs)" : "chooseOption",
                "click .newSelectList li.miniStylePagination"                     : "notHide",
                "click .newSelectList li.miniStylePagination .next:not(.disabled)": "nextSelect",
                "click .newSelectList li.miniStylePagination .prev:not(.disabled)": "prevSelect"
            },

            showNewSelect: function (e, prev, next) {
                e.preventDefault();

                populate.showSelect(e, prev, next, this);
                return false;

            },
            notHide      : function () {
                return false;
            },
            hideNewSelect: function () {
                $(".newSelectList").hide();
            },
            chooseOption : function (e) {
                var target = $(e.target);
                var id = target.attr("id");
                var type = target.attr('data-level');

                var element = _.find(this.responseObj['#project'], function (el) {
                    return el._id === id;
                });

                if (type === 'emptyProject') {
                    this.projectManager = element.projectmanager;

                    this.$el.find('#supplierDd').text(element.customer.name);
                    this.$el.find('#supplierDd').attr('data-id', element.customer._id);
                }

                $(e.target).parents("dd").find(".current-selected").text($(e.target).text()).attr("data-id", $(e.target).attr("id"));

                this.hideNewSelect();

                return false;
            },
            nextSelect   : function (e) {
                this.showNewSelect(e, false, true);
            },
            prevSelect   : function (e) {
                this.showNewSelect(e, true, false);
            },

            keydownHandler: function (e) {
                switch (e.which) {
                    case 27:
                        this.hideDialog();
                        break;
                    default:
                        break;
                }
            },

            changeTab: function (e) {
                var holder = $(e.target);
                var n;
                var dialog_holder;
                var closestEl = holder.closest('.dialog-tabs');
                var dataClass = closestEl.data('class');
                var selector = '.dialog-tabs-items.' + dataClass;
                var itemActiveSelector = '.dialog-tabs-item.' + dataClass + '.active';
                var itemSelector = '.dialog-tabs-item.' + dataClass;

                closestEl.find("a.active").removeClass("active");
                holder.addClass("active");

                n = holder.parents(".dialog-tabs").find("li").index(holder.parent());
                dialog_holder = $(selector);

                dialog_holder.find(itemActiveSelector).removeClass("active");
                dialog_holder.find(itemSelector).eq(n).addClass("active");
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
                var forSales = (this.forSales) ? true : false;
                var supplier = thisEl.find('#supplierDd').attr('data-id');
                var project = thisEl.find('#projectDd').attr('data-id');
                var destination = $.trim(thisEl.find('#destination').attr('data-id'));
                var deliverTo = $.trim(thisEl.find('#deliveryDd').attr('data-id'));
                var incoterm = $.trim(thisEl.find('#incoterm').attr('data-id'));
                var invoiceControl = $.trim(thisEl.find('#invoicingControl').attr('data-id'));
                var paymentTerm = $.trim(thisEl.find('#paymentTerm').attr('data-id'));
                var fiscalPosition = $.trim(thisEl.find('#fiscalPosition').attr('data-id'));
                var orderDate = thisEl.find('#orderDate').val();
                var expectedDate = thisEl.find('#expectedDate').val() || thisEl.find('#minScheduleDate').text();
                var whoCanRW = this.$el.find("[name='whoCanRW']:checked").val();
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

                            if (jobs === "jobs" && this.forSales) {
                                return App.render({
                                    type   : 'notify',
                                    message: "Job field can't be empty. Please, choose or create one."
                                });
                            }

                            products.push({
                                product      : productId,
                                unitPrice    : price,
                                quantity     : quantity,
                                scheduledDate: scheduledDate,
                                taxes        : taxes,
                                description  : description,
                                subTotal     : subTotal,
                                jobs         : jobs
                            });
                        } else {
                            return App.render({
                                type   : 'notify',
                                message: "Products can't be empty."
                            });
                        }
                    }
                }

                data = {
                    forSales      : forSales,
                    supplier      : supplier,
                    project       : project,
                    deliverTo     : deliverTo,
                    products      : products,
                    orderDate     : orderDate,
                    expectedDate  : expectedDate,
                    destination   : destination,
                    incoterm      : incoterm,
                    invoiceControl: invoiceControl,
                    paymentTerm   : paymentTerm,
                    fiscalPosition: fiscalPosition,
                    populate      : true,
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

                if (supplier && selectedLength) {
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
                    return App.render({
                        type   : 'notify',
                        message: CONSTANTS.RESPONSES.CREATE_QUOTATION
                    });

                }
            },

            redirectAfterSave: function (content, model) {
                var redirectUrl = content.forSales ? "easyErp/salesQuotation" : "easyErp/Quotation";

                content.hideDialog();
                Backbone.history.navigate(redirectUrl, {trigger: true});
            },

            hideDialog: function () {
                $(".edit-dialog").remove();
                $(".add-group-dialog").remove();
                $(".add-user-dialog").remove();
                $(".crop-images-dialog").remove();
            },

            createProductView: function () {
                var productItemContainer;

                productItemContainer = this.$el.find('#productItemsHolder');
                if (App.weTrack && this.forSales) {
                    productItemContainer.append(
                        new ProductItemView({canBeSold: true, service: 'Service'}).render().el
                    );
                } else {
                    productItemContainer.append(
                        new ProductItemView({canBeSold: this.forSales}).render().el
                    );
                }
            },

            render: function () {
                var formString = this.template({visible: this.visible, forSales: this.forSales});
                var self = this;
                var curDate = new Date();

                this.$el = $(formString).dialog({
                    closeOnEscape: false,
                    autoOpen     : true,
                    resizable    : true,
                    dialogClass  : "edit-dialog",
                    title        : "Create Quotation",
                    width        : "900px",
                    buttons      : [
                        {
                            id   : "create-person-dialog",
                            text : "Create",
                            click: function () {
                                self.saveItem();
                            }
                        },

                        {
                            text : "Cancel",
                            click: function () {
                                self.hideDialog();
                            }
                        }]

                });

                var notDiv = this.$el.find('.assignees-container');
                notDiv.append(
                    new AssigneesView({
                        model: this.currentModel
                    }).render().el
                );

                this.createProductView();

                populate.get("#destination", "/destination", {}, 'name', this, true, true);
                populate.get("#incoterm", "/incoterm", {}, 'name', this, true, true);
                populate.get("#invoicingControl", "/invoicingControl", {}, 'name', this, true, true);
                populate.get("#paymentTerm", "/paymentTerm", {}, 'name', this, true, true);
                populate.get("#deliveryDd", "/deliverTo", {}, 'name', this, true);

                populate.get("#currencyDd", "/currency/getForDd", {}, 'name', this, true);

                if (App.weTrack && this.forSales) {
                    this.$el.find('#supplierDd').removeClass('current-selected');
                    populate.get("#projectDd", "/getProjectsForDd", {}, "projectName", this, false, false);
                    //populate.get2name("#supplierDd", "/supplier", {}, this, false, true);
                } else {
                    populate.get2name("#supplierDd", "/supplier", {}, this, false, true);
                }

                dataService.getData("/project/getForWtrack", null, function (projects) {
                    projects = _.map(projects.data, function (project) {
                        project.name = project.projectName;

                        return project
                    });

                    self.responseObj['#project'] = projects;
                });

                populate.fetchWorkflow({
                    wId         : 'Purchase Order',
                    source      : 'purchase',
                    targetSource: 'quotation'
                }, function (response) {
                    if (!response.error) {
                        self.defaultWorkflow = response._id;
                    }
                });

                this.$el.find('#orderDate').datepicker({
                    dateFormat : "d M, yy",
                    changeMonth: true,
                    changeYear : true,
                    maxDate    : "+0D"
                }).datepicker('setDate', curDate);

                this.$el.find('#expectedDate').datepicker({
                    dateFormat : "d M, yy",
                    changeMonth: true,
                    changeYear : true
                });

                this.delegateEvents(this.events);
                return this;
            }

        });

        return CreateView;
    });
