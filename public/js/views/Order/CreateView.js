define([
        "text!templates/Order/CreateTemplate.html",
        "collections/Persons/PersonsCollection",
        "collections/Departments/DepartmentsCollection",
        'views/Assignees/AssigneesView',
        'views/Product/CreateProductItem',
        "models/PersonsModel",
        "common",
        "populate"
],
    function (CreateTemplate, PersonsCollection, DepartmentsCollection, AssigneesView, CreateProductItem, PersonModel, common, populate) {

        var CreateView = Backbone.View.extend({
            el: "#content-holder",
            contentType: "Order",
            template: _.template(CreateTemplate),
            imageSrc: '',

            initialize: function (options) {
                _.bindAll(this, "saveItem", "render");
                this.model = new PersonModel();
                this.models = (options && options.model) ? options.model : null;
				this.responseObj = {};
                this.render();
            },

            events: {
                //"mouseenter .avatar": "showEdit",
                //"mouseleave .avatar": "hideEdit",
                'click #addItem': 'showAddItemForm',
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

            showAddItemForm: function (e) {
                new CreateProductItem();
            },

            chooseOption: function (e) {
                var holder = $(e.target).parents("dd").find(".current-selected");
                holder.text($(e.target).text()).attr("data-id", $(e.target).attr("id"));
                if (holder.attr("id") == 'partner')
                    this.selectCustomer($(e.target).attr("id"));
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
                $(e.target).parents("dd").find(".current-selected").text($(e.target).text()).attr("data-id",$(e.target).attr("id"));
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

            showEdit: function () {
                $(".upload").animate({
                    height: "20px",
                    display: "block"
                }, 250);

            },

            hideEdit: function () {
                $(".upload").animate({
                    height: "0px",
                    display: "block"
                }, 250);

            },

            saveItem: function () {
                var self = this;
                var mid = 39;

                var company = $('#companiesDd').data("id");
                var dateBirth = $(".dateBirth").val();
                var department = $("#departmentDd option:selected").val();

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
                var data = {
                    name: {
                        first: $.trim(this.$el.find('#firstName').val()),
                        last: $.trim(this.$el.find('#lastName').val())
                    },
                    imageSrc: this.imageSrc,
                    dateBirth: dateBirth,
                    company: company,
                    department: department,
                    address: {
                        street: $.trim($('#addressInput').val()),
                        city: $.trim($('#cityInput').val()),
                        state: $.trim($('#stateInput').val()),
                        zip: $.trim($('#zipInput').val()),
                        country: $.trim($('#countryInput').val())
                    },
                    website: $.trim($('#websiteInput').val()),
                    jobPosition: $.trim($('#jobPositionInput').val()),
                    skype: $.trim($('#skype').val()),
                    phones: {
                        phone: $.trim($('#phoneInput').val()),
                        mobile: $.trim($('#mobileInput').val()),
                        fax: $.trim($('#faxInput').val())
                    },
                    email: $.trim($('#emailInput').val()),
                    salesPurchases: {
                        isCustomer: $('#isCustomerInput').is(':checked'),
                        isSupplier: $('#isSupplierInput').is(':checked'),
                        active: $('#isActiveInput').is('checked')
                    },
                    groups: {
                        owner: $("#allUsersSelect").data("id"),
                        users: usersId,
                        group: groupsId
                    },
                    whoCanRW: whoCanRW

                };

                var model = new PersonModel();
                model.save(data, {
                    headers: {
                        mid: mid
                    },
                    wait: true,
                    success: function () {
                        self.hideDialog();
                        Backbone.history.navigate("easyErp/Persons", { trigger: true });
                    },
                    error: function (model, xhr) {
						self.errorNotification(xhr);
                    }
                });

            },

            hideDialog: function () {
                $(".edit-dialog").remove();
                $(".add-group-dialog").remove();
                $(".add-user-dialog").remove();
                $(".crop-images-dialog").remove();
            },

            render: function () {
                var formString = this.template();
                var self = this;
                this.$el = $(formString).dialog({
					closeOnEscape: false,
                    autoOpen: true,
                    resizable: true,
                    dialogClass: "edit-dialog",
                    title: "Edit Person",
                    width: "900px",
					position:{within:$("#wrapper")},
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
                        model: null
					}).render().el
                );
                var personModel = new PersonModel();
				populate.getCompanies("#companiesDd", "/CompaniesForDd",{},this,false,true, (this.models)?this.models._id:null);
                common.canvasDraw({ model: personModel.toJSON() }, this);
                this.$el.find('.dateBirth').datepicker({
                    dateFormat: "d M, yy",
                    changeMonth: true,
                    changeYear: true,
                    yearRange: '-100y:c+nn',
                    maxDate: '-18y'
                });

                populate.get2name("#partner", "/Customer", {}, this, true, true);

                this.$el.find('#creationDate').datepicker({
                    dateFormat: "d M, yy",
                    changeMonth: true,
                    changeYear: true
                });

                this.$el.find('#scheduledDate').datepicker({
                    dateFormat: "d M, yy",
                    changeMonth: true,
                    changeYear: true
                });

                this.$el.find('#dateOfTransfer').datepicker({
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
