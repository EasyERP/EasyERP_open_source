define([
        "text!templates/Quotation/CreateTemplate.html",
        "collections/Persons/PersonsCollection",
        "collections/Departments/DepartmentsCollection",
        'views/Product/ProductItems',
        "models/QuotationModel",
        "common",
        "populate",
        'constants',
        'views/Assignees/AssigneesView'
    ],
    function (CreateTemplate, PersonsCollection, DepartmentsCollection, ProductItemView, QuotationModel, common, populate, CONSTANTS, AssigneesView) {

        var CreateView = Backbone.View.extend({
            el: "#content-holder",
            contentType: "Quotation",
            template: _.template(CreateTemplate),

            initialize: function (options) {
                if (options) {
                    this.vissible = options.vissible;
                }
                _.bindAll(this, "saveItem", "render");
                this.model = new QuotationModel();
                this.responseObj = {};
                this.render();
            },

            events: {
                'keydown': 'keydownHandler',
                'click .dialog-tabs a': 'changeTab',
                "click .details": "showDetailsBox",
                "click .current-selected": "showNewSelect",
                "click": "hideNewSelect",
                "click .newSelectList li:not(.miniStylePagination)": "chooseOption",
                "click .newSelectList li.miniStylePagination": "notHide",
                "click .newSelectList li.miniStylePagination .next:not(.disabled)": "nextSelect",
                "click .newSelectList li.miniStylePagination .prev:not(.disabled)": "prevSelect"
            },

            showNewSelect: function (e, prev, next) {
                populate.showSelect(e, prev, next, this);
                return false;

            },
            notHide: function () {
                return false;
            },
            hideNewSelect: function () {
                $(".newSelectList").hide();
            },
            chooseOption: function (e) {
                $(e.target).parents("dd").find(".current-selected").text($(e.target).text()).attr("data-id", $(e.target).attr("id"));
            },
            nextSelect: function (e) {
                this.showNewSelect(e, false, true);
            },
            prevSelect: function (e) {
                this.showNewSelect(e, true, false);
            },
            showDetailsBox: function (e) {
                $(e.target).parent().find(".details-box").toggle();
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

                var supplier = thisEl.find('#supplierDd').data('id');
                var supplierReference = thisEl.find('#supplierReference').val();
                var orderDate = thisEl.find('#orderDate').val();
                var expectedDate = thisEl.find('#expectedDate').val() || thisEl.find('#minScheduleDate').text();

                var total = $.trim(thisEl.find('#totalAmount').text());
                var unTaxed = $.trim(thisEl.find('#totalUntaxes').text());

                if (selectedLength) {
                    for (var i = selectedLength - 1; i >= 0; i--) {
                        targetEl = $(selectedProducts[i]);
                        productId = targetEl.data('id');
                        quantity = targetEl.find('[data-name="quantity"]').text();
                        price = targetEl.find('[data-name="price"]').text();

                        products.push({
                            product: productId,
                            unitPrice: price,
                            quantity: quantity
                        });
                    }
                }


                data = {
                    supplier: supplier,
                    supplierReference: supplierReference,
                    products: products,
                    orderDate: orderDate,
                    expectedDate: expectedDate,
                    paymentInfo: {
                        total: total,
                        unTaxed: unTaxed
                    }
                };

                if (supplier) {
                    this.model.save(data, {
                        headers: {
                            mid: mid
                        },
                        wait: true,
                        success: function () {
                            self.hideDialog();
                            Backbone.history.navigate("easyErp/Quotation", {trigger: true});
                        },
                        error: function (model, xhr) {
                            self.errorNotification(xhr);
                        }
                    });

                } else {
                    alert(CONSTANTS.RESPONSES.CREATE_QUOTATION);
                }
            },

            hideDialog: function () {
                $(".edit-dialog").remove();
                $(".add-group-dialog").remove();
                $(".add-user-dialog").remove();
                $(".crop-images-dialog").remove();
            },

            render: function () {
                var formString = this.template({vissible: this.vissible});
                var self = this;
                var productItemContainer;

                this.$el = $(formString).dialog({
                    closeOnEscape: false,
                    autoOpen: true,
                    resizable: true,
                    dialogClass: "edit-dialog",
                    title: "Create Quotation",
                    width: "900px",
                    buttons: [
                        {
                            id: "create-person-dialog",
                            text: "Create",
                            click: function () {
                                self.saveItem();
                            }
                        },

                        {
                            text: "Cancel",
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

                productItemContainer = this.$el.find('#productItemsHolder');
                productItemContainer.append(
                    new ProductItemView().render().el
                );

                populate.get("#destination", "/destination", {}, 'name', this, true, true);
                populate.get("#incoterm", "/incoterm", {}, 'name', this, true, true);
                populate.get("#invoicingControl", "/invoicingControl", {}, 'name', this, true, true);
                populate.get("#paymentTerm", "/paymentTerm", {}, 'name', this, true, true);
                populate.get2name("#supplierDd", "/supplier", {}, this, false, true);

                this.$el.find('#orderDate').datepicker({
                    dateFormat: "d M, yy",
                    changeMonth: true,
                    changeYear: true
                }).datepicker('setDate', new Date());

                /*this.$el.find('#bidValidUntill').datepicker({
                    dateFormat: "d M, yy",
                    changeMonth: true,
                    changeYear: true
                });*/

                this.$el.find('#expectedDate').datepicker({
                    dateFormat: "d M, yy",
                    changeMonth: true,
                    changeYear: true
                });

                this.delegateEvents(this.events);
                return this;
            }

        });

        return CreateView;
    });
