define([
	"text!templates/Invoice/CreateTemplate.html",
    "models/InvoiceModel",
    "common",
	"populate",
    "views/Invoice/InvoiceItems",
    "dataService"
    ],
    function (CreateTemplate, InvoiceModel, common, populate, InvoiceItemView, dataService ) {

        var CreateView = Backbone.View.extend({
            el: "#content-holder",
            contentType: "Invoice",
            template: _.template(CreateTemplate),
            //imageSrc: '',

            initialize: function (options) {
                _.bindAll(this, "saveItem", "render");
                this.model = new InvoiceModel();
				this.responseObj = {};
                this.render();
            },

            events: {
                'keydown': 'keydownHandler',
                'click .dialog-tabs a': 'changeTab',
				"click .details":"showDetailsBox",
                "click .current-selected": "showNewSelect",
                "click": "hideNewSelect",
				"click .newSelectList li:not(.miniStylePagination)": "chooseOption",
                "click .newSelectList li.miniStylePagination": "notHide",
                "click .newSelectList li.miniStylePagination .next:not(.disabled)": "nextSelect",
                "click .newSelectList li.miniStylePagination .prev:not(.disabled)": "prevSelect"
            },
            showNewSelect:function(e,prev,next){
                populate.showSelect(e,prev,next,this);
                return false;
                
            },
            notHide: function () {
				return false;
            },
            hideNewSelect: function () {
                $(".newSelectList").hide();
            },
            chooseOption: function (e) {
                var holder = $(e.target).parents("dd").find(".current-selected");
                holder.text($(e.target).text()).attr("data-id", $(e.target).attr("id"));
            },

			nextSelect:function(e){
				this.showNewSelect(e,false,true);
			},
			prevSelect:function(e){
				this.showNewSelect(e,true,false);
			},
			showDetailsBox:function(e){
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
                holder.closest(".dialog-tabs").find("a.active").removeClass("active");
                holder.addClass("active");
                var n = holder.parents(".dialog-tabs").find("li").index(holder.parent());
                var dialog_holder = $(".dialog-tabs-items");
                dialog_holder.find(".dialog-tabs-item.active").removeClass("active");
                dialog_holder.find(".dialog-tabs-item").eq(n).addClass("active");
            },

            saveItem: function () {
                var self = this;
                //var mid = 39;

                var supplierId = this.$("#supplierId").data("id");
                var invoiceDate = this.$("#invoice_date").val();
                var dueDate = this.$("#due_date").val();


                //var whoCanRW = this.$el.find("[name='whoCanRW']:checked").val();
                var data = {

                    supplier: supplierId,
                    fiscalPosition: null,
                    sourceDocument: $.trim($('#source_document').val()),
                    supplierInvoiceNumber: $.trim($('#supplier_invoice_num').val()),
                    paymentReference: $.trim($('#payment_reference').val()),
                    invoiceDate: invoiceDate,
                    dueDate: dueDate,
                    account: null,
                    journal: null

                    //whoCanRW: whoCanRW

                };

                var model = new InvoiceModel();
                model.save(data, {
                    //headers: {
                    //    mid: mid
                    //},
                    wait: true,
                    success: function () {
                        self.hideDialog();
                        Backbone.history.navigate("easyErp/Invoice", { trigger: true });
                    },
                    error: function (model, xhr) {
						self.errorNotification(xhr);
                    }
                });

            },

            hideDialog: function() {
                $(".edit-dialog").remove();
                $(".add-group-dialog").remove();
                $(".add-user-dialog").remove();
                $(".crop-images-dialog").remove();
            },

            render: function () {
                var formString = this.template();
                var self = this;
                var invoiceItemContainer;

                this.$el = $(formString).dialog({
					closeOnEscape: false,
                    autoOpen: true,
                    resizable: true,
                    dialogClass: "edit-dialog",
                    title: "Create Invoice",
                    width: "900px",
					position:{within:$("#wrapper")},
                    buttons: [
                        {
                            id: "create-invoice-dialog",
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


                invoiceItemContainer = this.$el.find('#invoiceItemsHolder');
                invoiceItemContainer.append(
                    new InvoiceItemView().render().el
                );

                populate.getCompanies("#supplierId", "/supplier", {}, this, false, true);

                this.$el.find('#invoice_date').datepicker({
                    dateFormat: "d M, yy",
                    changeMonth: true,
                    changeYear: true
                });

                this.$el.find('#due_date').datepicker({
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
