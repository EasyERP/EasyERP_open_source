define([
    "text!templates/Quotation/EditTemplate.html",
    'views/Assignees/AssigneesView',
    "common",
    "custom",
    "dataService",
	"populate"
],
    function (EditTemplate, AssigneesView, common, Custom, dataService, populate) {

        var EditView = Backbone.View.extend({
            contentType: "Quotation",
            imageSrc: '',
            template: _.template(EditTemplate),

            initialize: function (options) {
                _.bindAll(this, "render", "saveItem");
                _.bindAll(this, "render", "deleteItem");

                this.currentModel = (options.model) ? options.model : options.collection.getElement();
				this.currentModel.urlRoot = "/quotation";
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
                    dialogClass: "edit-person-dialog",
                    title: "Edit Person",
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
 
				populate.getCompanies("#companiesDd", "/CompaniesForDd",{},this,false,true);

                common.canvasDraw({ model: this.currentModel.toJSON() }, this);
                this.$el.find('.dateBirth').datepicker({
                    dateFormat: "d M, yy",
                    changeMonth: true,
                    changeYear: true,
                    yearRange: '-100y:c+nn',
                    maxDate: '-18y'
                });
                this.delegateEvents(this.events);
                var model = this.currentModel.toJSON();
                if (model.groups)
                    if (model.groups.users.length>0||model.groups.group.length){
                        $(".groupsAndUser").show();
                        model.groups.group.forEach(function(item){
                            $(".groupsAndUser").append("<tr data-type='targetGroups' data-id='"+ item._id+"'><td>"+item.departmentName+"</td><td class='text-right'></td></tr>");
                            $("#targetGroups").append("<li id='"+item._id+"'>"+item.departmentName+"</li>");
                        });
                        model.groups.users.forEach(function(item){
                            $(".groupsAndUser").append("<tr data-type='targetUsers' data-id='"+ item._id+"'><td>"+item.login+"</td><td class='text-right'></td></tr>");
                            $("#targetUsers").append("<li id='"+item._id+"'>"+item.login+"</li>");
                        });

                    }
                return this;
            }

        });

        return EditView;
    });
