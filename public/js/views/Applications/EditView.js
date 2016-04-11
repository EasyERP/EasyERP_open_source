define([
    "Backbone",
    "jQuery",
    "Underscore",
    "text!templates/Applications/EditTemplate.html",
    'views/selectView/selectView',
    'views/Notes/AttachView',
    'views/Assignees/AssigneesView',
    "common",
    "populate",
    "custom",
    "moment",
    "constants"
], function (Backbone, $, _, EditTemplate, selectView, attachView, AssigneesView, common, populate, custom, moment, constants) {
    'use strict';
    var EditView = Backbone.View.extend({
        el         : "#content-holder",
        contentType: "Applications",
        imageSrc   : '',
        template   : _.template(EditTemplate),
        initialize : function (options) {
            var isSalary;

            _.bindAll(this, "saveItem");
            _.bindAll(this, "render", "deleteItem");

            this.employeesCollection = options.collection;
            this.currentModel = options.model || options.collection.getElement();
            this.currentModel.urlRoot = "/Applications";
            this.responseObj = {};
            this.refuseId = 0;

            isSalary = this.currentModel.get('transfer')[0] || null;
            isSalary = isSalary && isSalary.salary;
            isSalary = !!(isSalary || isSalary === 0);
            this.isSalary = isSalary;

            this.responseObj['#sourceDd'] = [
                {
                    _id : 'www.rabota.ua',
                    name: 'www.rabota.ua'
                }, {
                    _id : 'www.work.ua',
                    name: 'www.work.ua'
                }, {
                    _id : 'www.ain.net',
                    name: 'www.ain.net'
                }, {
                    _id : 'other',
                    name: 'other'
                }
            ];

            this.responseObj['#genderDd'] = [
                {
                    _id : 'male',
                    name: 'male'
                }, {
                    _id : 'female',
                    name: 'female'
                }
            ];
            this.responseObj['#maritalDd'] = [
                {
                    _id : 'married',
                    name: 'married'
                }, {
                    _id : 'unmarried',
                    name: 'unmarried'
                }
            ];

            this.render();
        },

        events: {
            "click #tabList a"                                 : "switchTab",
            "click .breadcrumb a, #refuse"                     : "changeWorkflow",
            "change #workflowNames"                            : "changeWorkflows",
            'keydown'                                          : 'keydownHandler',
            "mouseenter .avatar"                               : "showEdit",
            "mouseleave .avatar"                               : "hideEdit",
            "click .current-selected"                          : "showNewSelect",
            "click"                                            : "hideNewSelect",
            'click .dialog-tabs a'                             : 'changeTab',
            "click .newSelectList li:not(.miniStylePagination)": "chooseOption",
            "click .hireEmployee"                              : "isEmployee",
            "click .refuseEmployee"                            : "refuseEmployee",
            "click td.editable"                                : "editJob",
            "click #update"                                    : "addNewRow",
            "click #jobPosition,#department,#manager,#jobType" : "showNotification",
            "click .fa-trash"                                  : "deleteRow"
        },

        showNotification: function (e) {
            var msg = 'You can edit ';

            e.preventDefault();
            msg += e.currentTarget.id;
            msg += ' at "Job" tab';

            App.render({
                type   : 'notify',
                message: msg
            });
        },

        deleteRow: function (e) {
            var target = $(e.target);
            var tr = target.closest('tr');

            tr.remove();

            this.$el.find('#update').show();

            this.renderRemoveBtn();
        },

        addNewRow: function (e) {
            var table = this.$el.find('#hireFireTable');
            var lastTr = table.find('tr').last();
            var newTr = lastTr.clone();
            var trId = newTr.attr('data-id');
            var now = moment();

            now = common.utcDateToLocaleDate(now);


            newTr.attr('data-id', ++trId);
            newTr.find('td').eq(2).text(now);
            newTr.attr('data-content', 'hired');
            newTr.find('td').eq(1).text('hired');
            newTr.find('td').last().text('');

            table.append(newTr);

            this.$el.find('#update').hide();

            this.renderRemoveBtn();
        },


        renderRemoveBtn: function () {
            var table = this.$el.find('#hireFireTable');
            var trs = table.find('tr');
            var removeBtn = constants.TRASH_BIN;

            trs.find('td:first-child').text('');
            trs.last().find('td').first().html(removeBtn);
        },

        editJob: function (e) {
            var self = this;
            var $target = $(e.target);
            var dataId = $target.attr('data-id');
            var tr = $target.closest('tr');
            var tempContainer;
            var maxDate = null;

            tempContainer = ($target.text()).trim();
            $target.html('<input class="editing statusInfo" type="text" value="' + tempContainer + '">');

            if (dataId === 'salary') {
                return false;
            }

            if (tr.attr('data-content') !== 'fire') {
                maxDate = this.fireDate;
            }

            $target.find('.editing').datepicker({
                dateFormat : "d M, yy",
                changeMonth: true,
                changeYear : true,
                minDate    : self.hireDate,
                maxDate    : maxDate,
                onSelect   : function () {
                    var editingDates = self.$el.find('.editing');

                    editingDates.each(function () {
                        $(this).parent().text($(this).val());
                        $(this).remove();
                    });
                }
            }).removeClass('datepicker');

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

        isEmployee: function (e) {
            e.preventDefault();
            /*
             var hired = {};
             transfer.date = new Date();
             hired.department = this.$el.find("#department").attr("data-id") || null;
             hired.jobPosition = this.$el.find("#jobPosition").attr("data-id") || null;
             hired.manager = this.$el.find("#manager").attr("data-id") || null;
             hired.jobType = this.$el.find("#jobType").attr("data-id") || null;

             if (this.isSalary) {
             hired.salary = this.$el.find('[data-id="salary"]').text();
             }

             this.currentModel.save({
             isEmployee: true,
             transfer: transfer
             }, {
             headers: {
             mid: 39
             },
             patch: true,
             success: function () {
             Backbone.history.navigate("easyErp/Employees", {trigger: true});
             }
             });
             */

            this.addNewRow();
            this.saveItem(null, true);
        },

        changeTab: function (e) {
            var holder = $(e.target);
            var n;
            var dialog_holder;

            holder.closest(".dialog-tabs").find("a.active").removeClass("active");
            holder.addClass("active");
            n = holder.parents(".dialog-tabs").find("li").index(holder.parent());
            dialog_holder = $(".dialog-tabs-items");
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
            for (var i = 0; i < value.length; i++) {
                workflows.push({name: value[i].name, status: value[i].status});
            }
            return workflows;
        },

        switchTab: function (e) {
            e.preventDefault();

            var link = this.$("#tabList a");
            var index;

            if (link.hasClass("selected")) {
                link.removeClass("selected");
            }

            index = link.index($(e.target).addClass("selected"));
            this.$(".tab").hide().eq(index).show();
        },

        hideDialog: function () {
            $(".edit-dialog").remove();
            $(".add-group-dialog").remove();
            $(".add-user-dialog").remove();
            $(".crop-images-dialog").remove();
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

        saveItem: function (e, toEmployyes) {
            var currentWorkflow;
            var proposedSalary;
            var expectedSalary;
            var transferArray;
            var self = this;
            var previousDep;
            var relatedUser;
            var dateBirthSt;
            var nationality;
            var homeAddress;
            var jobPosition;
            var nextAction;
            var isEmployee;
            var department;
            var workflowId;
            var $jobTable;
            var fireArray;
            var hireArray;
            var lastFire;
            var sourceId;
            var viewType;
            var workflow;
            var position;
            var whoCanRW;
            var groupsId;
            var usersId;
            var marital;
            var jobType;
            var manager;
            var $jobTrs;
            var gender;
            var salary;
            var coach;
            var event;
            var quit;
            var data;
            var date;
            var info;
            var flag;
            var el;

            $('.required').each(function () {
                if (!$(this).attr('data-id')) {
                    App.render({
                        type: 'error',
                        message: 'Please fill ' + $(this).attr('id')
                    });
                    flag = true;
                    return false;
                }
            });

            if (flag) {
                return;
            }

            self.hideNewSelect();

            relatedUser = this.$el.find("#relatedUsersDd").data("id") || null;
            coach = $.trim(this.$el.find("#coachDd").data("id")) || null;
            whoCanRW = this.$el.find("[name='whoCanRW']:checked").val();
            dateBirthSt = $.trim(this.$el.find("#dateBirth").val());
            nextAction = $.trim(this.$el.find("#nextAction").val());
            $jobTable = this.$el.find('#hireFireTable');
            marital = $("#maritalDd").data("id") || null;
            gender = $("#genderDd").data("id") || null;
            nationality = $("#nationality").data("id");
            $jobTrs = $jobTable.find('tr.transfer');
            sourceId = $("#sourceDd").data("id");
            viewType = custom.getCurrentVT();
            transferArray = [];
            homeAddress = {};
            fireArray = [];
            hireArray = [];
            groupsId = [];
            usersId = [];

            $("dd").find(".homeAddress").each(function (index, addressLine) {
                el = $(addressLine);
                homeAddress[el.attr("name")] = $.trim(el.val());
            });

            $.each($jobTrs, function (i, $tr) {
                var $previousTr;

                $tr = $($tr);
                event = $tr.attr('data-content');
                date = new Date($.trim($tr.find("td").eq(2).text()));
                jobPosition = $tr.find('#jobPositionDd').attr('data-id');
                department = $tr.find('#departmentsDd').attr('data-id');
                manager = $tr.find('#projectManagerDD').attr('data-id') || null;
                info = $tr.find('#statusInfoDd').val();
                jobType = $.trim($tr.find('#jobTypeDd').text());
                salary = self.isSalary ? parseInt($tr.find('[data-id="salary"]').text()) : null;

                if (!previousDep) {
                    previousDep = department;
                }

                if (previousDep !== department) {
                    $previousTr = $jobTrs[i - 1];

                    transferArray.push({
                        status     : 'transfer',
                        date       : date,
                        department : previousDep,
                        jobPosition: $previousTr.find('#jobPositionDd').attr('data-id') || null,
                        manager    : $previousTr.find('#projectManagerDD').attr('data-id') || null,
                        jobType    : $.trim($previousTr.find('#jobTypeDd').text()),
                        salary     : salary,
                        info       : $previousTr.find('#statusInfoDd').val()
                    });

                    previousDep = department;
                }

                transferArray.push({
                    status     : event,
                    date       : date,
                    department : department,
                    jobPosition: jobPosition,
                    manager    : manager,
                    jobType    : jobType,
                    salary     : salary,
                    info       : info
                });

                if (!salary) {
                    App.render({
                        type: 'error',
                        message: 'Salary can`t be empty'
                    });
                    quit = true;
                    return false;
                }

                if (event === 'fired') {
                    date = moment(date);
                    fireArray.push(date);
                    lastFire = date.year() * 100 + date.isoWeek();
                }

                if (event === 'hired') {
                    hireArray.push(date);
                }
            });

            if (quit) {
                return;
            }

            if (!transferArray.length) {
                el = $('.edit-employee-info');
                position = $.trim(el.find('#jobPositionDd').text());
                jobType = $.trim(el.find('#jobTypeDd').text());
                jobPosition = el.find('#jobPositionDd').attr('data-id');
                department = el.find('#departmentsDd').attr('data-id');
                manager = el.find('#projectManagerDD').attr('data-id');
                expectedSalary = parseInt($.trim(el.find("#expectedSalary").val()), 10) || 0;
                salary = parseInt($.trim(el.find("#proposedSalary").val()), 10) || 0;
                proposedSalary = salary;

                if (toEmployyes) {
                    event = 'hired';
                    transferArray.push({
                        status     : 'hired',
                        date       : moment(),
                        department : department,
                        jobPosition: jobPosition,
                        manager    : manager,
                        jobType    : jobType,
                        salary     : salary,
                        info       : ''
                    });
                }
            } else {
                position = $.trim($jobTrs.last().find('#jobPositionDd').text());
            }

            isEmployee = (event === 'hired') || (event === 'updated');

            $(".groupsAndUser tr").each(function () {
                if ($(this).data("type") === "targetUsers") {
                    usersId.push($(this).data("id"));
                }
                if ($(this).data("type") === "targetGroups") {
                    groupsId.push($(this).data("id"));
                }

            });

            data = {
                name          : {
                    first: $.trim(this.$el.find("#first").val()),
                    last : $.trim(this.$el.find("#last").val())
                },
                gender        : gender,
                jobType       : jobType,
                marital       : marital,
                workAddress   : {
                    street : $.trim(this.$el.find('#street').val()),
                    city   : $.trim(this.$el.find('#city').val()),
                    state  : $.trim(this.$el.find('#state').val()),
                    zip    : $.trim(this.$el.find('#zip').val()),
                    country: $.trim(this.$el.find('#country').val())
                },
                social        : {
                    LI: $.trim(this.$el.find('#LI').val()),
                    FB: $.trim(this.$el.find('#FB').val())
                },
                tags          : $.trim(this.$el.find("#tags").val()).split(','),
                workEmail     : $.trim(this.$el.find("#workEmail").val()),
                personalEmail : $.trim(this.$el.find("#personalEmail").val()),
                skype         : $.trim(this.$el.find("#skype").val()),
                workPhones    : {
                    phone : $.trim(this.$el.find("#phone").val()),
                    mobile: $.trim(this.$el.find("#mobile").val())
                },
                officeLocation: $.trim(this.$el.find("#officeLocation").val()),
                bankAccountNo : $.trim($("#bankAccountNo").val()),
                relatedUser   : relatedUser,
                department    : department,
                jobPosition   : jobPosition,
                manager       : manager,
                coach         : coach,
                identNo       : $.trim($("#identNo").val()),
                passportNo    : $.trim(this.$el.find("#passportNo").val()),
                otherId       : $.trim(this.$el.find("#otherId").val()),
                homeAddress   : homeAddress,
                dateBirth     : dateBirthSt,
                source        : sourceId,
                imageSrc      : this.imageSrc,
                nationality   : nationality,
                isEmployee    : isEmployee,
                lastFire      : lastFire,

                groups        : {
                    owner: $("#allUsersSelect").data("id"),
                    users: usersId,
                    group: groupsId
                },
                whoCanRW      : whoCanRW,
                hire          : hireArray,
                fire          : fireArray,
                nextAction    : nextAction,
                transfer      : transferArray,
                expectedSalary: expectedSalary,
                proposedSalary: proposedSalary
            };

            el = this.$el;
            workflowId = el.find("#workflowsDd").data("id");
            workflow = workflowId ? workflowId : null;
            currentWorkflow = this.currentModel.get('workflow');
            if (currentWorkflow && currentWorkflow._id && (currentWorkflow._id != workflow)) {
                data['workflow'] = workflow;
                data['sequence'] = -1;
                data['sequenceStart'] = this.currentModel.toJSON().sequence;
                data['workflowStart'] = currentWorkflow._id;
            }

            if (!currentWorkflow && workflow) {
                data['workflow'] = workflow;
                data['sequence'] = -1;
            }

            this.currentModel.save(data, {
                headers: {
                    mid: 39
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
                            kanban_holder.find(".application-content p.center").text(position);
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

                    if (event === 'hired') {
                        Backbone.history.navigate("easyErp/Employees", {trigger: true});
                    }
                },
                error  : function (model, xhr) {
                    self.errorNotification(xhr);
                }
            });


        },

        deleteItem: function (event) {
            event.preventDefault();

            var mid = 39;
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

            this.$el.find('.newSelectList').hide();

            if (this.selectView) {
                this.selectView.remove();
            }
        },

        showNewSelect: function (e) {
            var $target = $(e.target);
            e.stopPropagation();

            if ($target.attr('id') === 'selectInput') {
                return false;
            }

            if (this.selectView) {
                this.selectView.remove();
            }

            this.selectView = new selectView({
                e          : e,
                responseObj: this.responseObj
            });

            $target.append(this.selectView.render().el);

            return false;
        },

        chooseOption: function (e) {
            var $target = $(e.target);
            var $td = $target.closest('td');
            var parentUl = $target.parent();
            var element = $target.closest('a') || parentUl.closest('a');
            var id = element.attr('id') || parentUl.attr('id');
            var valueId = $target.attr('id');
            var managersIds = this.responseObj['#departmentManagers'];
            var managers = this.responseObj['#projectManagerDD'];
            var managerId;
            var manager;

            if (id === 'jobPositionDd' || 'departmentsDd' || 'projectManagerDD' || 'jobTypeDd' || 'hireFireDd') {
                element.text($target.text());
                element.attr('data-id', valueId);

                if (id === 'departmentsDd') {

                    managersIds.forEach(function (managerObj) {
                        if (managerObj._id === valueId) {
                            managerId = managerObj.name;
                        }
                    });

                    managers.forEach(function (managerObj) {
                        if (managerObj._id === managerId) {
                            manager = managerObj.name;
                        }
                    });

                    if (manager) {
                        element = element.closest('tr').find('a#projectManagerDD').lenth ?
                            element.closest('tr').find('a#projectManagerDD') :
                            element.parent().parent().find('a#projectManagerDD');

                        element.text(manager);
                        element.attr('data-id', managerId);
                    }
                }
            } else {
                $(e.target).parents("dd").find(".current-selected").text($(e.target).text()).attr("data-id", $(e.target).attr("id"));
            }
        },

        render: function () {
            var id = null;
            var self = this;
            var notDiv;
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

            notDiv = this.$el.find('.attach-container');
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
                for (var i = 0; i < data.length; i++) {
                    if (data[i].name == "Refused") {
                        self.refuseId = data[i]._id;
                        if (self.currentModel && self.currentModel.toJSON().workflow && self.currentModel.toJSON().workflow._id == data[i]._id) {
                            $(".refuseEmployee").hide();
                        }
                        break;
                    }
                }
            });

            populate.get("#departmentsDd", "/DepartmentsForDd", {}, "departmentName", this);
            populate.get("#departmentManagers", "/DepartmentsForDd", {}, "departmentManager", this);
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

            this.removeIcon = this.$el.find('.fa-trash');
            this.hireDate = this.currentModel.get('hire')[0];
            this.fireDate = this.$el.find("[data-content='fire']").last().find('.fireDate').text();

            this.renderRemoveBtn();

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
