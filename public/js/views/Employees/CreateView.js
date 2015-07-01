define([
    "text!templates/Employees/CreateTemplate.html",
    "models/EmployeesModel",
    "common",
    "populate",
    'views/Notes/AttachView',
    'views/Assignees/AssigneesView'
],
    function (CreateTemplate, EmployeeModel, common, populate, attachView, AssigneesView) {

        var CreateView = Backbone.View.extend({
            el: "#content-holder",
            contentType: "Employees",
            template: _.template(CreateTemplate),
            imageSrc: '',
            initialize: function () {
                _.bindAll(this, "saveItem");
                this.model = new EmployeeModel();
                this.responseObj = {};
                this.render();
            },

            events: {
                "click #tabList a": "switchTab",
                "mouseenter .avatar": "showEdit",
                "mouseleave .avatar": "hideEdit",
                'keydown': 'keydownHandler',
                'click .dialog-tabs a': 'changeTab',
                "click .current-selected": "showNewSelect",
                "click .newSelectList li:not(.miniStylePagination)": "chooseOption",
                "click .newSelectList li.miniStylePagination": "notHide",
                "click .newSelectList li.miniStylePagination .next:not(.disabled)": "nextSelect",
                "click .newSelectList li.miniStylePagination .prev:not(.disabled)": "prevSelect",
                "click": "hideNewSelect"
            },
            notHide: function () {
                return false;
            },
            showNewSelect: function (e, prev, next) {
                populate.showSelect(e, prev, next, this);
                return false;
            },
            chooseOption: function (e) {
                $(e.target).parents("dd").find(".current-selected").text($(e.target).text()).attr("data-id", $(e.target).attr("id"));
                $(".newSelectList").hide();
            },
            nextSelect: function (e) {
                this.showNewSelect(e, false, true);
            },
            prevSelect: function (e) {
                this.showNewSelect(e, true, false);
            },
            hideNewSelect: function () {
                $(".newSelectList").hide();
            },
            addAttach: function (event) {
				var s= $(".inputAttach:last").val().split("\\")[$(".inputAttach:last").val().split('\\').length-1];
				$(".attachContainer").append('<li class="attachFile">'+
											 '<a href="javascript:;">'+s+'</a>'+
											 '<a href="javascript:;" class="deleteAttach">Delete</a></li>'
											 );
				$(".attachContainer .attachFile:last").append($(".input-file .inputAttach").attr("hidden","hidden"));
				$(".input-file").append('<input type="file" value="Choose File" class="inputAttach" name="attachfile">');
			},
			deleteAttach:function(e){
				$(e.target).closest(".attachFile").remove();
			},
			updateAssigneesPagination:function(el){
				var pag = el.find(".userPagination .text");
				el.find(".userPagination .nextUserList").remove();
				el.find(".userPagination .prevUserList").remove();
				el.find(".userPagination .nextGroupList").remove();
				el.find(".userPagination .prevGroupList").remove();

				var list = el.find("ul");
				var count = list.find("li").length;
				var s ="";
				var page  = parseInt(list.attr("data-page"));
				if (page>1){
					el.find(".userPagination").prepend("<a class='prevUserList' href='javascript:;'>« prev</a>");
				}
				if (count===0){
					s+="0-0 of 0";
				}else{
					if ((page)*20-1<count){
						s+=((page-1)*20+1)+"-"+((page)*20)+" of "+count;
					}else{
						s+=((page-1)*20+1)+"-"+(count)+" of "+count;
					}
				}
				
				if (page<count/20){
					el.find(".userPagination").append("<a class='nextUserList' href='javascript:;'>next »</a>");
				}
				el.find("ul li").hide();
				for (var i=(page-1)*20;i<20*page;i++){
					el.find("ul li").eq(i).show();
				}
 
				pag.text(s);
			},

            changeTab:function(e){
                var holder = $(e.target);
                holder.closest(".dialog-tabs").find("a.active").removeClass("active");
                holder.addClass("active");
                var n = holder.parents(".dialog-tabs").find("li").index(holder.parent());
                var dialog_holder = $(".dialog-tabs-items");
                dialog_holder.find(".dialog-tabs-item.active").removeClass("active");
                dialog_holder.find(".dialog-tabs-item").eq(n).addClass("active");
            },

            keydownHandler: function(e){
                switch (e.which){
                    case 27:
                        this.hideDialog();
                        break;
                    default:
                        break;
                }
            },
            hideDialog: function () {
                $(".edit-dialog").remove();
                $(".add-group-dialog").remove();
                $(".add-user-dialog").remove();
                $(".crop-images-dialog").remove();
            },
            showEdit: function () {
                $(".upload").animate({
                    height: "20px",
                    display:"block"
                }, 250);
               
            },
            hideEdit: function () {
              $(".upload").animate({
                    height: "0px",
                    display: "block"
                }, 250);

            },
            fileSizeIsAcceptable: function(file){
                if(!file){return false;}
                return file.size < App.File.MAXSIZE;
            },

            switchTab: function (e) {
                e.preventDefault();
                var link = this.$("#tabList a");
                if (link.hasClass("selected")) {
                    link.removeClass("selected");
                }
                var index = link.index($(e.target).addClass("selected"));
                this.$(".tab").hide().eq(index).show();
            },

            saveItem: function () {
                var self = this;
                var mid = 39;
                var employeeModel = new EmployeeModel();
                var name = {
                    first: $.trim(this.$el.find("#first").val()),
                    last: $.trim(this.$el.find("#last").val())
                };
				$("#createBtnDialog").attr("disabled","disabled");
                var workAddress = {};
                $("dd").find(".workAddress").each(function () {
                    var el = $(this);
                    workAddress[el.attr("name")] = $.trim(el.val());
                });
                var tags = $.trim(this.$el.find("#tags").val()).split(',');
                var workEmail = $.trim(this.$el.find("#workEmail").val());
                var personalEmail = $.trim(this.$el.find("#personalEmail").val());
                var skype = $.trim(this.$el.find("#skype").val());

                var phone = $.trim(this.$el.find("#phone").val());
                var mobile = $.trim(this.$el.find("#mobile").val());
                var workPhones = {
                    phone: phone,
                    mobile: mobile
                };


                var gender = $("#genderDd").data("id");
                var jobType = $("#jobTypeDd").data("id");
                var marital = $("#maritalDd").data("id");
                var officeLocation = $.trim($("#officeLocation").val());
                var relatedUser = $("#relatedUsersDd").data("id");
                var department = $("#departmentsDd").data("id");
                var jobPosition = $("#jobPositionDd").data("id");
                var manager = $("#projectManagerDD").data("id");
                var coach = $("#coachDd").data("id");
                var identNo = $.trim($("#identNo").val());
				var nationality =  $("#nationality").data("id");
                var passportNo = $.trim($("#passportNo").val());
                var bankAccountNo = $.trim($("#bankAccountNo").val());
                var otherId = $.trim($("#otherId").val());
                var homeAddress = {};
                $("dd").find(".homeAddress").each(function () {
                    var el = $(this);
                    homeAddress[el.attr("name")] = el.val();
                });
                // date parse 
                var dateBirthSt = $.trim(this.$el.find("#dateBirth").val());
               
                var active = ($("#active").is(":checked")) ? true : false;
                var sourceId = $("#sourceDd").data("id");
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
                var valid = employeeModel.save({
                    name: name,
                    gender: gender ? gender : "",
                    jobType: jobType ? jobType : "",
                    marital: marital ? marital : "",
                    imageSrc: this.imageSrc,
                    workAddress: workAddress,
                    workEmail: workEmail,
                    personalEmail: personalEmail,
                    skype: skype,
                    workPhones: workPhones,
                    officeLocation: officeLocation,
                    relatedUser: relatedUser ? relatedUser : "",
                    department: department,
                    jobPosition: jobPosition? jobPosition : "",
                    bankAccountNo:bankAccountNo,
                    manager: manager ? manager : "",
                    coach: coach ? coach : "",
                    identNo: identNo,
                    passportNo: passportNo,
                    otherId: otherId,
                    homeAddress: homeAddress,
                    dateBirth: dateBirthSt,
                    active: active,
                    source:sourceId,
					nationality:nationality,
                    groups: {
						owner: $("#allUsersSelect").data("id"),
                        users: usersId,
                        group: groupsId
                    },
                    whoCanRW: whoCanRW
                },
                {
                    headers: {
                        mid: mid
                    },
                    wait: true,
                    success: function (model, response) {
      					self.attachView.sendToServer(null,model.changed);      
                    },
                    error: function (model, xhr) {
    					self.errorNotification(xhr);
                    }
                });
				if (!valid){
						$("#createBtnDialog").removeAttr("disabled");
				}
            },

            render: function () {
                var formString = this.template();
                var self = this;
                this.$el = $(formString).dialog({
                    dialogClass: "edit-dialog",
                    width: 800,
                    title: "Create Employee",
                    buttons:{
                        save:{
                            text: "Create",
                            class: "btn",
							id:"createBtnDialog",
                            click: self.saveItem
                        },
                        cancel:{
                            text: "Cancel",
                            class: "btn",
                            click: function(){
                                self.hideDialog();
                            }
                        }
                    }
                });
				var notDiv = this.$el.find('.attach-container');
				this.attachView = new attachView({
                        model: new EmployeeModel(),
						url:"/uploadEmployeesFiles",
						isCreate:true
                    });
                notDiv.append(this.attachView.render().el);
				notDiv = this.$el.find('.assignees-container');
                notDiv.append(
                    new AssigneesView({
                        model: this.currentModel
                    }).render().el
                );

				populate.get("#jobTypeDd", "/jobType", {}, "name", this, true);
				populate.get("#nationality", "/nationality", {}, "_id", this, true);
                populate.get2name("#projectManagerDD", "/getPersonsForDd", {}, this, true);
				populate.get("#jobPositionDd", "/JobPositionForDd", {}, "name", this, true, true);
				populate.get("#relatedUsersDd", "/UsersForDd", {}, "login", this, true, true);
				populate.get("#departmentsDd", "/DepartmentsForDd", {}, "departmentName", this, true);

                common.canvasDraw({ model: this.model.toJSON() }, this);

                $('#dateBirth').datepicker({
                	changeMonth: true,
                    changeYear: true,
                    yearRange: '-100y:c+nn',
                    maxDate: '-18y'
                });

                this.delegateEvents(this.events);

                return this;
            }

        });

        return CreateView;
    });
