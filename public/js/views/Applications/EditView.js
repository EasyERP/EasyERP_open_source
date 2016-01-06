define([
    "text!templates/Applications/EditTemplate.html",
    'views/Notes/AttachView',
    'views/Assignees/AssigneesView',
    "common",
    "populate",
    "custom"
], function (EditTemplate, attachView, AssigneesView, common, populate, custom) {
    'use strict';
    var EditView = Backbone.View.extend({
        el         : "#content-holder",
        contentType: "Applications",
        imageSrc   : '',
        template   : _.template(EditTemplate),
        initialize : function (options) {
            _.bindAll(this, "saveItem");
            _.bindAll(this, "render", "deleteItem");
            this.employeesCollection = options.collection;
            this.currentModel = options.model || options.collection.getElement();
            this.currentModel.urlRoot = "/Applications";
            this.responseObj = {};
            this.refuseId = 0;

            this.render();
        },

        events: {
            "click #tabList a"                                                : "switchTab",
            "click .breadcrumb a, #refuse"                                    : "changeWorkflow",
            "change #workflowNames"                                           : "changeWorkflows",
            'keydown'                                                         : 'keydownHandler',
            "mouseenter .avatar"                                              : "showEdit",
            "mouseleave .avatar"                                              : "hideEdit",
            "click .current-selected"                                         : "showNewSelect",
            "click"                                                           : "hideNewSelect",
            'click .dialog-tabs a'                                            : 'changeTab',
            "click .newSelectList li:not(.miniStylePagination)"               : "chooseOption",
            "click .newSelectList li.miniStylePagination"                     : "notHide",
            "click .newSelectList li.miniStylePagination .next:not(.disabled)": "nextSelect",
            "click .newSelectList li.miniStylePagination .prev:not(.disabled)": "prevSelect",
            "click .hireEmployee"                                             : "isEmployee",
            "click .refuseEmployee"                                           : "refuseEmployee",
            "click td.editable"                                               : "editDate"
        },

        editDate: function (e) {
            var self = this;
            var $target = $(e.target);
            var tempContainer;

            tempContainer = ($target.text()).trim();
            $target.html('<input class="editing" type="text" value="' + tempContainer + '">');
            $target.find('.editing').datepicker({
                dateFormat : "d M, yy",
                changeMonth: true,
                changeYear : true,
                onSelect   : function () {
                    var editingDates = self.$el.find('.editing');

                    editingDates.each(function () {
                        $(this).parent().text($(this).val());
                        $(this).remove();
                    });
                }
            }).addClass('datepicker');

            return false;
        },

        refuseEmployee: function (e) {
            e.preventDefault();
            var self = this;
            var workflowStart = this.currentModel.get("workflow") && this.currentModel.get("workflow")._id ? this.currentModel.get("workflow")._id : this.currentModel.get("workflow");

            this.currentModel.save({
                workflow: self.refuseId
            }, {
                patch  : true,
                success: function (model) {
                    model = model.toJSON();
                    var viewType = custom.getCurrentVT();
                    switch (viewType) {
                        case 'list':
                        {
                            $("tr[data-id='" + model._id + "'] td").eq(6).find("a").text("Refused");
                        }
                            break;
                        case 'kanban':
                        {
                            $(".column[data-id='" + self.refuseId + "']").find(".columnNameDiv").after($("#" + model._id));
                            if (self.refuseId) {
                                var counter = $(".column[data-id='" + self.refuseId + "']").closest(".column").find(".totalCount");
                                counter.html(parseInt(counter.html()) + 1);
                                counter = $(".column[data-id='" + workflowStart + "']").closest(".column").find(".totalCount");
                                counter.html(parseInt(counter.html()) - 1);

                            }

                        }
                    }
                    self.hideDialog();
                },
                error  : function (model, xhr, options) {
                    self.errorNotification(xhr);
                }
            });
            return false;

        },
        isEmployee    : function (e) {
            e.preventDefault();
            var hired = {};

            hired.date = new Date();
            hired.department = this.$el.find("#departmentsDd").attr("data-id") ? this.$el.find("#departmentsDd").attr("data-id") : null;
            hired.jobPosition = this.$el.find("#jobPositionDd").attr("data-id") ? this.$el.find("#jobPositionDd").attr("data-id") : null;

            this.currentModel.save({
                isEmployee: true,
                hired     : hired
            }, {
                headers: {
                    mid: 39
                },
                patch  : true,
                success: function () {
                    Backbone.history.navigate("easyErp/Employees", {trigger: true});
                }
            });
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

        changeTab     : function (e) {
            var holder = $(e.target);
            holder.closest(".dialog-tabs").find("a.active").removeClass("active");
            holder.addClass("active");
            var n = holder.parents(".dialog-tabs").find("li").index(holder.parent());
            var dialog_holder = $(".dialog-tabs-items");
            dialog_holder.find(".dialog-tabs-item.active").removeClass("active");
            dialog_holder.find(".dialog-tabs-item").eq(n).addClass("active");
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

        getWorkflowValue: function (value) {
            var workflows = [];
            for (var i = 0;
                 i < value.length;
                 i++) {
                workflows.push({name: value[i].name, status: value[i].status});
            }
            return workflows;
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

        hideDialog: function () {
            $(".edit-dialog").remove();
            $(".add-group-dialog").remove();
            $(".add-user-dialog").remove();
            $(".crop-images-dialog").remove();
        },
        showEdit  : function () {
            $(".upload").animate({
                height : "20px",
                display: "block"
            }, 250);

        },
        hideEdit  : function () {
            $(".upload").animate({
                height : "0px",
                display: "block"
            }, 250);

        },

        saveItem     : function () {
            var self = this;
            var mid = 39;

            var el = this.$el;
            var name = {
                first: $.trim(this.$el.find("#first").val()),
                last : $.trim(this.$el.find("#last").val())
            };

            var gender = $("#genderDd").data("id");
            gender = gender ? gender : null;

            var jobType = $("#jobTypeDd").data("id");
            jobType = jobType ? jobType : null;

            var marital = $("#maritalDd").data("id");
            marital = marital ? marital : null;

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

            var relatedUser = el.find("#relatedUsersDd").data("id");
            relatedUser = relatedUser ? relatedUser : null;

            var departmentDd = el.find("#departmentDd");
            var departmentId = departmentDd.attr("data-id");

            var department = departmentId ? departmentId : null;

            var jobPositionDd = el.find("#jobPositionDd");
            var jobPositionId = jobPositionDd.data("id");
            var jobPosition = jobPositionId ? jobPositionId : null;

            var projectManagerDD = el.find("#projectManagerDD");
            var projectManagerId = projectManagerDD.data("id");
            var manager = projectManagerId ? projectManagerId : null;

            var identNo = $.trim($("#identNo").val());

            var passportNo = $.trim(el.find("#passportNo").val());

            var otherId = $.trim(el.find("#otherId").val());

            var homeAddress = {};
            $("dd").find(".homeAddress").each(function () {
                var el = $(this);
                homeAddress[el.attr("name")] = $.trim(el.val());
            });

            var dateBirthSt = $.trim(el.find("#dateBirth").val());

            var sourceId = $("#sourceDd").data("id");

            var nationality = $("#nationality").data("id");

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

            var groups = {
                owner: $("#allUsersSelect").data("id"),
                users: usersId,
                group: groupsId
            };

            var whoCanRW = el.find("[name='whoCanRW']:checked").val();

            var hireArray = this.currentModel.get('hire');
            var newHireArray = [];

            _.each(hireArray, function (hire, key) {
                var date = new Date($.trim(self.$el.find("#hire" + key).text()));
                newHireArray.push({
                    date       : date,
                    department : department,
                    jobPosition: jobPosition
                });
                return newHireArray;
            });

            var fireArray = this.currentModel.get('fire');
            var newFireArray = [];

            _.each(fireArray, function (hire, key) {
                var date = new Date($.trim(el.find("#fire" + key).text()));
                newFireArray.push({
                    date       : date,
                    department : department,
                    jobPosition: jobPosition
                });
                return newFireArray;
            });

            var transferArray = this.currentModel.get('transferred');
            var newTransfer = [];

            _.each(transferArray, function (obj, key) {
                var date = $.trim(el.find("#date" + key).val());
                var dep = obj.department;
                var result = {};

                result.department = dep;
                result.date = new Date(date);

                newTransfer.push(result);
                return newTransfer;
            });

            var referredBy = $.trim(el.find("#referredBy").val());

            var expectedSalary = $.trim(el.find("#expectedSalary").val());

            var proposedSalary = parseInt($.trim(el.find("#proposedSalary").val()), 10);

            var viewType = custom.getCurrentVT();

            var nextAction = $.trim(this.$el.find("#nextAction").val());

            var data = {

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

                whoCanRW   : whoCanRW,
                hire       : newHireArray,
                fire       : newFireArray,
                transferred: newTransfer,
                //degree: this.$el.find("#degreesDd option:selected").val(),
                nextAction : nextAction,

                referredBy    : referredBy,
                expectedSalary: expectedSalary,
                proposedSalary: proposedSalary,
//                  otherInfo: this.$el.find("#otherInfo").val(),

            };

            var depForTransfer = this.currentModel.get('department');

            //if (department._id !== depForTransfer._id) {
            //    data.depForTransfer = depForTransfer.name;
            //}

            var workflowId = el.find("#workflowsDd").data("id");
            var workflow = workflowId ? workflowId : null;

            var currentWorkflow = this.currentModel.get('workflow');
            if (currentWorkflow && currentWorkflow._id && (currentWorkflow._id != workflow)) {
                data['workflow'] = workflow;
                data['sequence'] = -1;
                data['sequenceStart'] = this.currentModel.toJSON().sequence;
                data['workflowStart'] = currentWorkflow._id;
            }
            ;
            this.currentModel.save(data, {
                headers: {
                    mid: mid
                },
                patch  : true,
                success: function (model, result) {
                    model = model.toJSON();
                    result = result.result;
                    var editHolder = self.$el;
                    switch (viewType) {
                        case 'list':
                        {
                            var tr_holder = $("tr[data-id='" + model._id + "'] td");
                            tr_holder.eq(2).text(data.name.first + " " + data.name.last);
                            tr_holder.eq(3).text(data.personalEmail);
                            tr_holder.eq(4).find("a").text(data.workPhones.phone).attr("href", "skype:" + data.workPhones.phone + "?call");
                            tr_holder.eq(5).text(self.$el.find("#jobPositionDd").text());
                            tr_holder.eq(6).find("a").text(self.$el.find("#workflowsDd").text());
                            tr_holder.eq(7).text(data.jobType);
                            if (data.workflow) {
                                Backbone.history.fragment = "";
                                Backbone.history.navigate(window.location.hash.replace("#", ""), {trigger: true});
                            }
                        }
                            break;
                        case 'kanban':
                        {
                            var kanban_holder = $("#" + model._id);
                            kanban_holder.find(".application-header .left").html(data.name.first + "<br/>" + data.name.last);
                            if (parseInt(data.proposedSalary)) {
                                kanban_holder.find(".application-header .right").text(data.proposedSalary + "$");
                            }
                            kanban_holder.find(".application-content p.center").text(self.$el.find("#jobPositionDd").text());
                            kanban_holder.find(".application-content p.right").text(nextAction);
                            if (new Date() > new Date(nextAction)) {
                                kanban_holder.find(".application-content p.right").addClass("red");
                            } else {
                                kanban_holder.find(".application-content p.right").removeClass("red");
                            }

                            if (result && result.sequence) {
                                $("#" + data.workflowStart).find(".item").each(function () {
                                    var seq = $(this).find(".inner").data("sequence");
                                    if (seq > data.sequenceStart) {
                                        $(this).find(".inner").attr("data-sequence", seq - 1);
                                    }
                                });
                                kanban_holder.find(".inner").attr("data-sequence", result.sequence);
                            }
                            if (data.workflow) {
                                $(".column[data-id='" + data.workflow + "']").find(".columnNameDiv").after(kanban_holder);
                                var counter = $(".column[data-id='" + data.workflow + "']").closest(".column").find(".totalCount");
                                counter.html(parseInt(counter.html()) + 1);
                                counter = $(".column[data-id='" + data.workflowStart + "']").closest(".column").find(".totalCount");
                                counter.html(parseInt(counter.html()) - 1);

                            }
                            $(".column[data-id='" + data.workflow + "']").find(".columnNameDiv").after(kanban_holder);

                        }
                    }
                    self.hideDialog();
                },
                error  : function (model, xhr) {
                    self.errorNotification(xhr);
                }
            });
        },
        deleteItem   : function (event) {
            var mid = 39;
            event.preventDefault();
            var self = this;
            var answer = confirm("Really DELETE items ?!");
            if (answer == true) {
                this.currentModel.destroy({
                    headers: {
                        mid: mid
                    },
                    success: function (model) {
                        model = model.toJSON();
                        var viewType = custom.getCurrentVT();
                        switch (viewType) {
                            case 'list':
                            {
                                $("tr[data-id='" + model._id + "'] td").remove();
                            }
                                break;
                            case 'kanban':
                            {
                                $("#" + model._id).remove();
                                var wId = model.workflow._id;
                                var total$ = $("td[data-id='" + wId + "'] .totalCount");
                                var newTotal = total$.html() - 1;
                                total$.html(newTotal);
                            }
                        }
                        self.hideDialog();
                    },
                    error  : function (model, xhr) {
                        self.errorNotification(xhr);
                    }
                });
            }
        },
        hideNewSelect: function (e) {
            var editingDates = this.$el.find('.editing');

            editingDates.each(function () {
                $(this).parent().text($(this).val());
                $(this).remove();
            });

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
            var id = null;
            var self = this;
            var formString = this.template({
                model: this.currentModel.toJSON()
            });
            this.$el = $(formString).dialog({
                closeOnEscape: false,
                dialogClass  : "edit-dialog",
                width        : 1000,
                title        : "Edit Application",
                buttons      : {
                    save  : {
                        text : "Save",
                        class: "btn",
                        click: self.saveItem
                    },
                    cancel: {
                        text : "Cancel",
                        class: "btn",
                        click: self.hideDialog
                    },
                    delete: {
                        text : "Delete",
                        class: "btn",
                        click: self.deleteItem
                    }
                }
            });
            var notDiv = this.$el.find('.attach-container');
            notDiv.append(
                new attachView({
                    model: this.currentModel,
                    url  : "/uploadApplicationFiles"
                }).render().el
            );
            notDiv = this.$el.find('.assignees-container');
            notDiv.append(
                new AssigneesView({
                    model: this.currentModel
                }).render().el
            );
            populate.getWorkflow("#workflowsDd", "#workflowNamesDd", "/WorkflowsForDd", {id: "Applications"}, "name", this, false, function (data) {
                var id;
                for (var i = 0;
                     i < data.length;
                     i++) {
                    if (data[i].name == "Refused") {
                        self.refuseId = data[i]._id;
                        if (self.currentModel && self.currentModel.toJSON().workflow && self.currentModel.toJSON().workflow._id == data[i]._id) {
                            $(".refuseEmployee").hide();
                        }
                        break;
                    }
                }
            });
            populate.get("#departmentDd", "/DepartmentsForDd", {}, "departmentName", this);
            populate.get("#jobPositionDd", "/JobPositionForDd", {}, "name", this);
            populate.get("#jobTypeDd", "/jobType", {}, "_id", this);
            populate.get("#nationality", "/nationality", {}, "_id", this);
            populate.get2name("#projectManagerDD", "/getPersonsForDd", {}, this);
            populate.get("#relatedUsersDd", "/UsersForDd", {}, "login", this, false, true);

            common.canvasDraw({model: this.currentModel.toJSON()}, this);
            $('#nextAction').datepicker({
                dateFormat : "d M, yy",
                changeMonth: true,
                changeYear : true,
                minDate    : this.currentModel.toJSON().creationDate
            });
            $('#dateBirth').datepicker({
                dateFormat : "d M, yy",
                changeMonth: true,
                changeYear : true,
                yearRange  : '-100y:c+nn',
                maxDate    : '-18y'
            });

            $('.date').datepicker({
                dateFormat : "d M, yy",
                changeMonth: true,
                changeYear : true
            });

            var model = this.currentModel.toJSON();
            if (model.groups) {
                if (model.groups.users.length > 0 || model.groups.group.length) {
                    $(".groupsAndUser").show();
                    model.groups.group.forEach(function (item) {
                        $(".groupsAndUser").append("<tr data-type='targetGroups' data-id='" + item._id + "'><td>" + item.departmentName + "</td><td class='text-right'></td></tr>");
                        $("#targetGroups").append("<li id='" + item._id + "'>" + item.departmentName + "</li>");
                    });
                    model.groups.users.forEach(function (item) {
                        $(".groupsAndUser").append("<tr data-type='targetUsers' data-id='" + item._id + "'><td>" + item.login + "</td><td class='text-right'></td></tr>");
                        $("#targetUsers").append("<li id='" + item._id + "'>" + item.login + "</li>");
                    });

                }
            }
            return this;
        }
    });
    return EditView;
});
