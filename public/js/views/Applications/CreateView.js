define([
        'Backbone',
        'jQuery',
        'Underscore',
        "text!templates/Applications/CreateTemplate.html",
        "models/ApplicationsModel",
        "common",
        "populate",
        'views/Notes/AttachView',
        'views/Assignees/AssigneesView'
    ],
    function (Backbone, $, _, CreateTemplate, ApplicationModel, common, populate, AttachView, AssigneesView) {
        'use strict';
        var CreateView = Backbone.View.extend({
            el         : "#content-holder",
            contentType: "Applications",
            template   : _.template(CreateTemplate),
            imageSrc   : '',

            initialize: function () {
                _.bindAll(this, "saveItem", "render");
                this.model = new ApplicationModel();
                this.responseObj = {};
                this.render();
            },

            events: {
                "click #tabList a"                                                : "switchTab",
                "change #workflowNames"                                           : "changeWorkflows",
                "mouseenter .avatar"                                              : "showEdit",
                "mouseleave .avatar"                                              : "hideEdit",
                "click .current-selected"                                         : "showNewSelect",
                "click"                                                           : "hideNewSelect",
                'keydown'                                                         : 'keydownHandler',
                'click .dialog-tabs a'                                            : 'changeTab',
                "click .newSelectList li:not(.miniStylePagination)"               : "chooseOption",
                "click .newSelectList li.miniStylePagination"                     : "notHide",
                "click .newSelectList li.miniStylePagination .next:not(.disabled)": "nextSelect",
                "click .newSelectList li.miniStylePagination .prev:not(.disabled)": "prevSelect"
            },

            notHide: function () {
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

            hideDialog      : function () {
                $(".edit-dialog").remove();
                $(".add-group-dialog").remove();
                $(".add-user-dialog").remove();
                $(".crop-images-dialog").remove();
            },
            getWorkflowValue: function (value) {
                var workflows = [];
                var i;

                for (i = 0; i < value.length; i++) {
                    workflows.push({name: value[i].name, status: value[i].status});
                }
                return workflows;
            },

            changeWorkflows: function () {
                var name = this.$("#workflowNames option:selected").val();
                var value = this.workflowsCollection.findWhere({name: name}).toJSON().value;
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
                    height : "20px",
                    display: "block"
                }, 250);

            },

            hideEdit: function () {
                $(".upload").animate({
                    height : "0px",
                    display: "block"
                }, 250);

            },

            saveItem: function () {
                var self = this;
                var mid = this.mId;
                var el = this.$el;
                var name = {
                    first: $.trim(this.$el.find("#first").val()),
                    last : $.trim(this.$el.find("#last").val())
                };

                var gender = $("#genderDd").data("id");
                gender = gender || null;

                var jobType = $("#jobTypeDd").data("id");
                jobType = jobType || null;

                var marital = $("#maritalDd").data("id");
                marital = marital || null;

                var workAddress = {
                    street : $.trim(el.find('#street').val()),
                    city   : $.trim(el.find('#city').val()),
                    state  : $.trim(el.find('#state').val()),
                    zip    : $.trim(el.find('#zip').val()),
                    country: $.trim(el.find('#country').val())
                };

                var social = {
                    LI: $.trim(el.find('#LI').val()),
                    FB: $.trim(el.find('#FB').val())
                };

                var tags = $.trim(el.find("#tags").val()).split(',');

                var workEmail = $.trim(el.find("#workEmail").val());

                var personalEmail = $.trim(el.find("#personalEmail").val());

                var skype = $.trim(el.find("#skype").val());

                var workPhones = {
                    phone : $.trim(el.find("#phone").val()),
                    mobile: $.trim(el.find("#mobile").val())
                };

                var bankAccountNo = $.trim($("#bankAccountNo").val());

                var relatedUser = this.$el.find("#relatedUsersDd").data("id");
                relatedUser = relatedUser || null;

                var departmentDd = this.$el.find("#departmentDd");
                var departmentId = departmentDd.data("id");

                var department = departmentId || null;

                var jobPositionDd = this.$el.find("#jobPositionDd");
                var jobPositionId = jobPositionDd.data("id");
                var jobPosition = jobPositionId || null;

                var projectManagerDD = this.$el.find("#projectManagerDD");
                var projectManagerId = projectManagerDD.data("id");
                var manager = projectManagerId || null;

                var identNo = $.trim($("#identNo").val());

                var passportNo = $.trim(el.find("#passportNo").val());

                var otherId = $.trim(el.find("#otherId").val());

                var homeAddress = {};
                $("dd").find(".homeAddress").each(function () {
                    var elem = $(this);
                    homeAddress[elem.attr("name")] = $.trim(elem.val());
                });

                var dateBirthSt = $.trim(this.$el.find("#dateBirth").val());

                var sourceId = $("#sourceDd").data("id");

                var nationality = $("#nationality").data("id");

                var usersId = [];
                var groupsId = [];
                $(".groupsAndUser tr").each(function () {
                    if ($(this).data("type") === "targetUsers") {
                        usersId.push($(this).data("id"));
                    }
                    if ($(this).data("type") === "targetGroups") {
                        groupsId.push($(this).data("id"));
                    }

                });

                var groups = {
                    owner: $("#allUsersSelect").data("id"),
                    users: usersId,
                    group: groupsId
                };

                var whoCanRW = el.find("[name='whoCanRW']:checked").val();

                var referredBy = $.trim(el.find("#referredBy").val());

                var expectedSalary = $.trim(el.find("#expectedSalary").val());

                var proposedSalary = parseInt($.trim(el.find("#proposedSalary").val()), 10);

                var workflowId = this.$el.find("#workflowsDd").data("id");
                var workflow = workflowId || null;

                var nextAction = $.trim($("#nextAction").val());

                this.model.save({
                        name       : name,
                        gender     : gender,
                        jobType    : jobType,
                        marital    : marital,
                        workAddress: workAddress,
                        social     : social,

                        tags         : tags,
                        workEmail    : workEmail,
                        personalEmail: personalEmail,
                        skype        : skype,
                        workPhones   : workPhones,
                        bankAccountNo: bankAccountNo,

                        relatedUser: relatedUser,
                        department : department,
                        jobPosition: jobPosition,
                        manager    : manager,
                        identNo    : identNo,
                        passportNo : passportNo,
                        otherId    : otherId,

                        homeAddress: homeAddress,
                        dateBirth  : dateBirthSt,
                        source     : sourceId,
                        imageSrc   : this.imageSrc,
                        nationality: nationality,
                        groups     : groups,

                        whoCanRW  : whoCanRW,
                        nextAction: nextAction,

                        referredBy    : referredBy,
                        expectedSalary: expectedSalary,
                        proposedSalary: proposedSalary,

                        workflow: workflow

                    },
                    {
                        headers: {
                            mid: mid
                        },
                        wait   : true,
                        success: function (model) {
                            var currentModel = model.changed;
                            self.attachView.sendToServer(null, currentModel);
                        },
                        error  : function (model, xhr) {
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
                    dialogClass  : "edit-dialog create-app-dialog",
                    width        : 1000,
                    title        : "Create Application",
                    buttons      : {
                        save  : {
                            text : "Create",
                            class: "btn",
                            click: self.saveItem
                        },
                        cancel: {
                            text : "Cancel",
                            class: "btn",
                            click: self.hideDialog
                        }
                    }
                });
                var notDiv = this.$el.find('.attach-container');
                this.attachView = new AttachView({
                    model   : new ApplicationModel(),
                    url     : "/uploadApplicationFiles",
                    isCreate: true
                });
                notDiv.append(this.attachView.render().el);
                notDiv = this.$el.find('.assignees-container');
                notDiv.append(
                    new AssigneesView({
                        model: this.currentModel
                    }).render().el
                );
                populate.getWorkflow("#workflowsDd", "#workflowNamesDd", "/WorkflowsForDd", {id: "Applications"}, "name", this, false, function (data) {
                    var i;

                    for (i = 0; i < data.length; i++) {
                        if (data[i].name === "Refused") {
                            self.refuseId = data[i]._id;
                            if (self.currentModel && self.currentModel.toJSON().workflow && self.currentModel.toJSON().workflow._id === data[i]._id) {
                                $(".refuseEmployee").hide();
                            }
                            break;
                        }
                    }
                });
                populate.get("#departmentDd", "/department/getForDD", {}, "departmentName", this);
                populate.get("#jobPositionDd", "/JobPositionForDd", {}, "name", this);
                populate.get("#jobTypeDd", "/jobType", {}, "_id", this);
                populate.get("#nationality", "/nationality", {}, "_id", this);
                populate.get2name("#projectManagerDD", "/employee/getPersonsForDd", {}, this);
                populate.get("#relatedUsersDd", "/UsersForDd", {}, "login", this, false, true);

                common.canvasDraw({model: this.model.toJSON()}, this);
                $('#nextAction').datepicker({
                    dateFormat : "d M, yy",
                    changeMonth: true,
                    changeYear : true,
                    minDate    : new Date()
                });

                $('#dateBirth').datepicker({
                    changeMonth: true,
                    changeYear : true,
                    yearRange  : '-100y:c+nn',
                    maxDate    : '-18y'
                });
                this.delegateEvents(this.events);
                return this;
            }
        });
        return CreateView;
    });