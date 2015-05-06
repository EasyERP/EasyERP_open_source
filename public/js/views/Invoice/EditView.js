define([
    "text!templates/Invoice/EditTemplate.html",
    'views/Assignees/AssigneesView',
    "common",
    "custom",
    "dataService",
	"populate"
],
    function (EditTemplate, AssigneesView, common, Custom, dataService, populate) {

        var EditView = Backbone.View.extend({
            contentType: "Invoice",
            imageSrc: '',
            template: _.template(EditTemplate),

            initialize: function (options) {
                _.bindAll(this, "render", "saveItem");
                _.bindAll(this, "render", "deleteItem");
                this.currentModel = (options.model) ? options.model : options.collection.getElement();
				this.currentModel.urlRoot = "/Persons";
				this.responseObj = {};
                this.render();
            },

            events: {
                "click #saveBtn": "saveItem",
                "click #cancelBtn": "hideDialog",
                "click .current-selected": "showNewSelect",
                "click": "hideNewSelect",
                'click .dialog-tabs a': 'changeTab',
                "click .newSelectList li:not(.miniStylePagination)": "chooseOption",
                "click .newSelectList li.miniStylePagination": "notHide",
                "click .newSelectList li.miniStylePagination .next:not(.disabled)": "nextSelect",
                "click .newSelectList li.miniStylePagination .prev:not(.disabled)": "prevSelect",
				"click .details":"showDetailsBox"
            },

			showDetailsBox:function(e){
				$(e.target).parent().find(".details-box").toggle();
			},
            notHide: function () {
				return false;
            },
			nextSelect:function(e){
				this.showNewSelect(e,false,true);
			},
			prevSelect:function(e){
				this.showNewSelect(e,true,false);
			},

            changeTab:function(e){
                var holder = $(e.target);
                holder.closest(".dialog-tabs").find("a.active").removeClass("active");
                holder.addClass("active");
                var n= holder.parents(".dialog-tabs").find("li").index(holder.parent());
                var dialog_holder = $(".dialog-tabs-items");
                dialog_holder.find(".dialog-tabs-item.active").removeClass("active");
                dialog_holder.find(".dialog-tabs-item").eq(n).addClass("active");
            },

            chooseUser: function(e){
                $(e.target).toggleClass("choosen");
            },
            hideDialog: function () {
                $('.edit-person-dialog').remove();
                $(".add-group-dialog").remove();
                $(".add-user-dialog").remove();
                $(".crop-images-dialog").remove();
            },

            saveItem: function () {
                var self = this;
                //var mid = 39;

                var invoiceDate = this.$el.find("#invoiceDate").val();
                var dueDate = this.$el.find("#dueDate").val();

                var customerInvoice = $('#customerInvoice').data("id");
                customerInvoice = (customerInvoice) ? customerInvoice : null;

                var data = {

                    customerInvoice: customerInvoice,
                    fiscalPosition: null,
                    sourceDocument: $.trim(this.$el.find('#source_document').val()),
                    customerInvoiceNumber: $.trim(this.$el.find('#customer_invoice_num').val()),
                    paymentReference: $.trim(this.$el.find('#payment_reference').val()),
                    invoiceDate: invoiceDate,
                    dueDate: dueDate,
                    account: null,
                    journal: null

                };

                this.currentModel.save(data, {
                    //wait: true,
                    success: function (model) {
                        self.hideDialog();
                        Backbone.history.fragment = "";
                        Backbone.history.navigate("#easyErp/Invoice/form/" + model.id, { trigger: true });
                    },
                    error: function (model, xhr) {
						self.errorNotification(xhr);
                    }
                });
            },
            
            showNewSelect:function(e,prev,next){
                populate.showSelect(e,prev,next,this);
                return false;
                
            },
    
            hideNewSelect: function () {
                $(".newSelectList").hide();
            },
            chooseOption: function (e) {
                $(e.target).parents("dd").find(".current-selected").text($(e.target).text()).attr("data-id",$(e.target).attr("id"));
            },
            deleteItem: function(event) {

                event.preventDefault();
                var self = this;
                    var answer = confirm("Realy DELETE items ?!");
                    if (answer == true) {
                        this.currentModel.destroy({
                            success: function () {
                                $('.edit-invoice-dialog').remove();
                                Backbone.history.navigate("easyErp/" + self.contentType, { trigger: true });
                            },
                            error: function (model, err) {
								if (err.status===403){
									alert("You do not have permission to perform this action");
								}
							}
						});
					}

            },

            render: function () {
                var self = this;
                var formString = this.template({
                    model: this.currentModel.toJSON()
                });
                this.$el = $(formString).dialog({
					closeOnEscape: false,
                    autoOpen: true,
                    resizable: true,
                    dialogClass: "edit-person-dialog",
                    title: "Edit Invoice",
                    width: "900",
                    buttons: [
                        {
                            text: "Save",
                            click: function () { self.saveItem(); }
                        },

						{
							text: "Cancel",
							click: function () { self.hideDialog();  }
						},
						{
							text: "Delete",
							click: self.deleteItem }
						]

                });

 				var notDiv = this.$el.find('.assignees-container');
                notDiv.append(
                    new AssigneesView({
                        model: this.currentModel,
                    }).render().el
                );

                populate.get2name("#customerInvoice", "/Customer", {}, this, true, true);

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

        return EditView;
    });
