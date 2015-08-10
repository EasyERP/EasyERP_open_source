define([
    "text!templates/Applications/CreateTemplate.html",
    "models/ApplicationsModel",
    "common",
	"populate",
    'views/Notes/AttachView',
    'views/Assignees/AssigneesView'
],
    function (CreateTemplate, ApplicationModel, common, populate, attachView, AssigneesView) {
        var CreateView = Backbone.View.extend({
            el: "#content-holder",
            contentType: "Applications",
            template: _.template(CreateTemplate),
            imageSrc: '',

            initialize: function () {
                _.bindAll(this, "saveItem", "render");
                this.model = new ApplicationModel();
				this.responseObj = {};
                this.render();
            },
            events: {
                "click #tabList a": "switchTab",
                "click #hire": "isEmployee",
                "change #workflowNames": "changeWorkflows",
                "mouseenter .avatar": "showEdit",
                "mouseleave .avatar": "hideEdit",
                "click .current-selected": "showNewSelect",
                "click": "hideNewSelect",
                'keydown': 'keydownHandler',
                'click .dialog-tabs a': 'changeTab',
                "click .newSelectList li:not(.miniStylePagination)": "chooseOption",
                "click .newSelectList li.miniStylePagination": "notHide",
                "click .newSelectList li.miniStylePagination .next:not(.disabled)": "nextSelect",
                "click .newSelectList li.miniStylePagination .prev:not(.disabled)": "prevSelect"
            },
            notHide: function (e) {
				return false;
            },

            nextSelect: function (e) {
                this.showNewSelect(e, false, true);
			},
            prevSelect: function (e) {
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
                holder.closest(".dialog-tabs").find("a.active").removeClass("active");
                holder.addClass("active");
                var n = holder.parents(".dialog-tabs").find("li").index(holder.parent());
                var dialog_holder = $(".dialog-tabs-items");
                dialog_holder.find(".dialog-tabs-item.active").removeClass("active");
                dialog_holder.find(".dialog-tabs-item").eq(n).addClass("active");
            },

            hideDialog: function () {
                $(".edit-dialog").remove();
                $(".add-group-dialog").remove();
                $(".add-user-dialog").remove();
                $(".crop-images-dialog").remove();
            },
            getWorkflowValue: function (value) {
                var workflows = [];
                for (var i = 0; i < value.length; i++) {
                    workflows.push({ name: value[i].name, status: value[i].status });
                }
                return workflows;
            },

            changeWorkflows: function () {
                var name = this.$("#workflowNames option:selected").val();
                var value = this.workflowsCollection.findWhere({ name: name }).toJSON().value;
            },

            isEmployee: function (e) {
                $(e.target).addClass("pressed");
                this.saveItem();
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

                var isEmployee = false;
                if (this.$("#hire>span").hasClass("pressed")) {
                    isEmployee = true;
                    self.contentType = "Employees";
                }
                var first = $.trim($("#first").val());
                var last = $.trim($("#last").val());
                var name = {
                    first: first,
                    last: last
                };
                var pemail = $.trim($("#pemail").val());
                var phone = $.trim($("#phone").val());
                var mobile = $.trim($("#mobile").val());
                var wphones = {
                    phone: phone,
                    mobile: mobile
                };
                var dateBirthSt = $.trim(this.$el.find("#dateBirth").val());
                var workflow = $("#workflowsDd").data("id");
                var relatedUserId = $("#relatedUsersDd option:selected").val();
                var nextAction = $.trim($("#nextAction").val());
                var sourceId = $("#sourceDd").data("id");
                var referredBy = $.trim($("#referredBy").val());
                var departmentId = {
                    _id: $("#departmentsDd").data("id"),
                    name: $("#departmentsDd").text()
                };
                var jobPositionId = {
                    _id: $("#jobPositionDd").data("id"),
                    name: $("#jobPositionDd").text()
                };
                var jobType = this.$el.find("#jobTypeDd").data("id");
                var expectedSalary = $.trim($("#expectedSalary").val())
                var proposedSalary = $.trim($("#proposedSalary").val());
                var tags = $.trim($("#tags").val()).split(',');
                var otherInfo = $("#otherInfo").val();
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
                this.model.save({
                    isEmployee: isEmployee,
                    imageSrc: this.imageSrc,
                    name: name,
                    personalEmail: pemail,
                    workPhones: wphones,
                    relatedUser: relatedUserId,
                    nextAction: nextAction,
                    source: sourceId,
                    referredBy: referredBy,
                    department: departmentId,
                    jobPosition: jobPositionId,
                    expectedSalary: expectedSalary,
                    proposedSalary: proposedSalary,
                    tags: tags,
                    jobType: jobType,
                    otherInfo: otherInfo,
                    workflow: workflow,
                    dateBirth: dateBirthSt,
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
                        var currentModel = model.changed;
                        self.attachView.sendToServer(null, currentModel);
                    },
                    error: function (model, xhr) {
    					self.errorNotification(xhr);
                    }
                });
            },
            hideNewSelect: function () {
				$(".newSelectList").hide();
			},
            showNewSelect: function (e, prev, next) {
                populate.showSelect(e, prev, next, this);
                return false;
            },

            chooseOption: function (e) {
                $(e.target).parents("dd").find(".current-selected").text($(e.target).text()).attr("data-id", $(e.target).attr("id"));
			},

            render: function () {
                var formString = this.template();
                var self = this;
                this.$el = $(formString).dialog({
					closeOnEscape: false,
                    dialogClass: "edit-dialog create-app-dialog",
                    width: 690,
                    title: "Create Application",
                    buttons:{
                        save:{
                            text: "Create",
                            class: "btn",
                            click: self.saveItem
                        },
                        cancel: {
                            text: "Cancel",
                            class: "btn",
                            click: self.hideDialog
                        }
                    }
                });
				var notDiv = this.$el.find('.attach-container');
				this.attachView = new attachView({
                    model: new ApplicationModel(),
                    url: "/uploadApplicationFiles",
                    isCreate: true
                });
                notDiv.append(this.attachView.render().el);
				notDiv = this.$el.find('.assignees-container');
                notDiv.append(
                    new AssigneesView({
                        model: this.currentModel,
                    }).render().el
                );
                populate.getWorkflow("#workflowsDd", "#workflowNamesDd", "/WorkflowsForDd", { id: "Applications" }, "name", this, true);
                populate.get("#departmentDd", "/DepartmentsForDd", {}, "departmentName", this, true);
                populate.get("#jobPositionDd", "/JobPositionForDd", {}, "name", this, true);
                populate.get("#jobTypeDd", "/jobType", {}, "_id", this, true);
                common.canvasDraw({ model: this.model.toJSON() }, this);
                $('#nextAction').datepicker({
                    dateFormat: "d M, yy",
                    changeMonth: true,
                    changeYear: true,
                    minDate: new Date()
                });
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