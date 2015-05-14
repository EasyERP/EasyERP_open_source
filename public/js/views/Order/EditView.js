define([
        "text!templates/Order/EditTemplate.html",
        'views/Assignees/AssigneesView',
        "collections/Departments/DepartmentsCollection",
        'views/Product/ProductItemsList',
        "models/QuotationModel",
        "common",
        "custom",
        "dataService",
	    "populate"
],
    function (EditTemplate, AssigneesView, DepartmentsCollection, ProductItemView, QuotationModel, common, Custom, dataService, populate) {

        var EditView = Backbone.View.extend({
            contentType: "Order",
            template: _.template(EditTemplate),

            initialize: function (options) {
                _.bindAll(this, "render", "saveItem");
                _.bindAll(this, "render", "deleteItem");
                this.currentModel = (options.model) ? options.model : options.collection.getElement();
				this.currentModel.urlRoot = "/Order";
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
                "click .newSelectList li.miniStylePagination .prev:not(.disabled)": "prevSelect"
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

            hideDialog: function () {
                $('.edit-dialog').remove();
                $(".add-group-dialog").remove();
                $(".add-user-dialog").remove();
            },

            saveItem: function () {
                var self = this;
                var mid = 39;

                //var dateBirthSt = $.trim(this.$el.find("#dateBirth").val());
                var dateBirth = this.$el.find(".dateBirth").val();
                var company = $('#companiesDd').data("id");
                company = (company) ? company : null;

                var department = $("#departmentDd").data("id");
                department = (department) ? department : null;

                var jobPosition = $.trim(this.$el.find('#jobPositionInput').val());
                jobPosition = (jobPosition) ? jobPosition : null;

                var usersId=[];
                var groupsId=[];
                $(".groupsAndUser tr").each(function(){
                    if ($(this).data("type")=="targetUsers"){
                        usersId.push($(this).data("id"));
                    }
                    if ($(this).data("type")=="targetGroups"){
                        groupsId.push($(this).data("id"));
                    }

                });
                var whoCanRW = this.$el.find("[name='whoCanRW']:checked").val();

                var data = {
                    imageSrc: this.imageSrc,
                    name: {
                        first: $.trim(this.$el.find('#firstName').val()),
                        last: $.trim(this.$el.find('#lastName').val())
                    },
                    dateBirth: dateBirth,
                    department: department,
                    company: company,
                    address: {
                        street: $.trim(this.$el.find('#addressInput').val()),
                        city: $.trim(this.$el.find('#cityInput').val()),
                        state: $.trim(this.$el.find('#stateInput').val()),
                        zip: $.trim(this.$el.find('#zipInput').val()),
                        country: $.trim(this.$el.find('#countryInput').val())
                    },
                    website: $.trim(this.$el.find('#websiteInput').val()),
                    jobPosition: jobPosition,
                    skype: $.trim(this.$el.find('#skype').val()),
                    phones: {
                        phone: $.trim(this.$el.find('#phoneInput').val()),
                        mobile: $.trim(this.$el.find('#mobileInput').val()),
                        fax: $.trim(this.$el.find('#faxInput').val())
                    },
                    email: $.trim(this.$el.find('#emailInput').val()),
                    salesPurchases: {
                        isCustomer: $('#isCustomerInput').is(':checked'),
                        isSupplier: $('#isSupplierInput').is(':checked'),
                        active: $('#isActiveInput').is(':checked')
                    },
                    groups: {
                        owner: $("#allUsersSelect").data("id"),
                        users: usersId,
                        group: groupsId
                    },
                    whoCanRW: whoCanRW
                };

                this.currentModel.save(data, {
                    headers: {
                        mid: mid
                    },
                    //wait: true,
                    success: function (model) {
                        self.hideDialog();
                        Backbone.history.fragment = "";
                        Backbone.history.navigate("#easyErp/Persons/form/" + model.id, { trigger: true });
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
                var mid = 39;
                event.preventDefault();
                var self = this;
                    var answer = confirm("Realy DELETE items ?!");
                    if (answer == true) {
                        this.currentModel.destroy({
                            headers: {
                                mid: mid
                            },
                            success: function () {
                                $('.edit-person-dialog').remove();
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
                    dialogClass: "edit-dialog",
                    title: "Edit Order",
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
                        model: this.currentModel
                    }).render().el
                );

                var productItemContainer = this.$el.find('#productItemsHolder');
                productItemContainer.append(
                    new ProductItemView({model: this.currentModel.toJSON()}).render().el
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

        return EditView;
    });
