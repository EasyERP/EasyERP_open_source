define([
        "text!templates/Projects/EditTemplate.html",
        'views/Notes/NoteView',
        'views/Notes/AttachView',
        'views/Assignees/AssigneesView',
        'views/Bonus/BonusView',
        "custom",
        "common",
        "dataService",
        "populate",
        'constants'
    ],
    function (EditTemplate, noteView, attachView, AssigneesView, BonusView, custom, common, dataService, populate, CONSTANTS) {

        var EditView = Backbone.View.extend({
            contentType: "Projects",
            template   : _.template(EditTemplate),
            initialize : function (options) {
                _.bindAll(this, "render", "saveItem", "deleteItem");
                this.currentModel = options.model;
                this.currentModel.urlRoot = '/Projects/';
                this.responseObj = {};
                this.render();
            },

            events       : {
                'keydown'                                                         : 'keydownHandler',
                'click .dialog-tabs a'                                            : 'changeTab',
                "click #health a"                                                 : "showHealthDd",
                "click #health ul li div"                                         : "chooseHealthDd",
                "click .newSelectList li:not(.miniStylePagination)"               : "chooseOption",
                "click .newSelectList li.miniStylePagination"                     : "notHide",
                "click .newSelectList li.miniStylePagination .next:not(.disabled)": "nextSelect",
                "click .newSelectList li.miniStylePagination .prev:not(.disabled)": "prevSelect",
                "click"                                                           : "hideNewSelect",
                "click .current-selected"                                         : "showNewSelect"
            },
            notHide      : function () {
                return false;
            },
            showNewSelect: function (e, prev, next) {
                populate.showSelect(e, prev, next, this);
                return false;

            },
            chooseOption : function (e) {
                $(e.target).parents("dd").find(".current-selected").text($(e.target).text()).attr("data-id", $(e.target).attr("id"));
                $(".newSelectList").hide();
            },
            hideNewSelect: function () {
                $(".newSelectList").hide();
                $("#health ul").hide();

            },

            nextSelect    : function (e) {
                this.showNewSelect(e, false, true);
            },
            prevSelect    : function (e) {
                this.showNewSelect(e, true, false);
            },
            chooseHealthDd: function (e) {
                var target = $(e.target);
                target.parents("#health").find("a").attr("class", target.attr("class")).attr("data-value", target.attr("class").replace("health", "")).parent().find("ul").toggle();
            },
            showHealthDd  : function (e) {
                $(e.target).parent().find("ul").toggle();
                return false;
            },
            changeTab     : function (e) {
                var target = $(e.target);
                target.closest(".dialog-tabs").find("a.active").removeClass("active");
                target.addClass("active");
                var n = target.parents(".dialog-tabs").find("li").index(target.parent());
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

            hideDialog: function () {
                $('.edit-project-dialog').remove();
                $(".add-group-dialog").remove();
                $(".add-user-dialog").remove();
            },

            saveItem: function (event) {
                event.preventDefault();

                var validation = true;
                var self = this;
                var viewType = custom.getCurrentVT();
                var mid = 39;
                var projectName = $.trim(this.$el.find("#projectName").val());
                var projectShortDesc = $.trim(this.$el.find("#projectShortDesc").val());
                var customer = this.$el.find("#customerDd").data("id");
                var projectmanager = this.$el.find("#projectManagerDD").data("id");
                var workflow = this.$el.find("#workflowsDd").data("id");
                var projecttype = this.$el.find("#projectTypeDD").data("id");
                var $userNodes = $("#usereditDd option:selected");
                var startDate = $.trim(this.$el.find("#StartDate").val());
                var endDate = $.trim(this.$el.find("#EndDate").val());
                var users = [];
                var bonusContainer = $('#bonusTable');
                var bonusRow = bonusContainer.find('tr');
                var bonus = [];
                $userNodes.each(function (key, val) {
                    users.push({
                        id  : val.value,
                        name: val.innerHTML
                    });
                });

                bonusRow.each(function (key, val) {
                    var employeeId = $(val).find("[data-content='employee']").attr('data-id');
                    var bonusId = $(val).find("[data-content='bonus']").attr('data-id');
                    var value;

                    if (!employeeId || !bonusId) {
                        if (!employeeId) {
                            value = 'Employee';
                            App.render({
                                type   : 'error',
                                message: 'Please, choose ' + value + ' first.'
                            });
                        } else if (!bonusId) {
                            value = 'Bonus';
                            App.render({
                                type   : 'error',
                                message: 'Please, choose ' + value + ' first.'
                            });
                        }
                        validation = false;
                    }

                    var startD = $(val).find(".startDate input").val() || null;
                    var endD = $(val).find(".endDate input").val() || null;

                    bonus.push({
                        employeeId: employeeId,
                        bonusId   : bonusId,
                        startDate : startD,
                        endDate   : endD
                    });
                });

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
                var budget = this.currentModel.get('budget');
                var whoCanRW = this.$el.find("[name='whoCanRW']:checked").val();
                var health = this.$el.find('#health a').data('value');
                var _targetEndDate = $.trim(this.$el.find("#EndDateTarget").val());
                var description = $.trim(this.$el.find("#description").val());
                var currentTargetEndDate = this.currentModel.get('TargetEndDate');
                //var TargetEndDate = _targetEndDate || currentTargetEndDate;
                var data = {
                    projectName     : projectName,
                    projectShortDesc: projectShortDesc,
                    customer        : customer ? customer : null,
                    projectmanager  : projectmanager ? projectmanager : null,
                    workflow        : workflow ? workflow : null,
                    projecttype     : projecttype ? projecttype : "",
                    description     : description,
                    teams           : {
                        users: users
                    },
                    groups          : {
                        owner: $("#allUsersSelect").data("id"),
                        users: usersId,
                        group: groupsId
                    },
                    whoCanRW        : whoCanRW,
                    health          : health,
                    StartDate       : startDate,
                    EndDate         : endDate,
                    TargetEndDate   : _targetEndDate,
                    bonus           : bonus,
                    budget          : budget
                };
                var workflowStart = this.currentModel.get('workflow');

                if (validation) {
                    this.currentModel.save(data, {
                        headers: {
                            mid: mid
                        },
                        success: function (model) {
                            $('.edit-project-dialog').remove();
                            $(".add-group-dialog").remove();
                            $(".add-user-dialog").remove();
                            if (viewType == "list") {
                                var tr_holder = $("tr[data-id='" + self.currentModel.toJSON()._id + "'] td");
                                $("a[data-id='" + self.currentModel.toJSON()._id + "']").text(projectName);
                                tr_holder.eq(2).text(projectName);
                                tr_holder.eq(3).text(self.$el.find("#customerDd").text());
                                tr_holder.eq(4).text(self.$el.find("#StartDate").val());
                                tr_holder.eq(5).text(self.$el.find("#EndDate").val());
                                tr_holder.eq(6).text(self.$el.find("#EndDateTarget").val());
                                if (new Date(self.$el.find("#EndDate").val()) < new Date(self.$el.find("#EndDateTarget").val())) {
                                    tr_holder.eq(5).addClass("red-border");
                                } else {
                                    tr_holder.eq(5).removeClass("red-border");
                                }
                                tr_holder.eq(8).find(".stageSelect").text(self.$el.find("#workflowsDd").text());
                                tr_holder.eq(9).find(".health-container a").attr("class", "health" + health).attr("data-value", health);
                                tr_holder.eq(11).text(model.toJSON().editedBy.date + " (" + model.toJSON().editedBy.user.login + ")");
                            } else {
                                var currentModel_holder = $("#" + self.currentModel.toJSON()._id);
                                currentModel_holder.find(".project-text span").eq(0).text(projectName);
                                currentModel_holder.find(".project-text span").eq(1).find("a").attr("class", "health" + health).attr("data-value", health);
                                if (customer) {
                                    $("#" + self.currentModel.toJSON()._id).find(".project-text span").eq(2).text(self.$el.find("#customerDd").text());
                                }
                                currentModel_holder.find(".bottom .stageSelect").text(self.$el.find("#workflowsDd").text()).attr("class", "stageSelect " + self.$el.find("#workflowsDd").text().toLowerCase().replace(" ", ''));
                                if (projectmanager) {
                                    common.getImagesPM([projectmanager._id], "/employees/getEmployeesImages", "#" + self.currentModel.toJSON()._id);
                                }
                            }
                            if (data.workflow._id != workflowStart._id) {
                                var filter = window.location.hash.split('filter=')[1];
                                var url = "#easyErp/Projects/thumbnails";
                                if (filter) {
                                    url += '/filter=' + filter;
                                }
                                Backbone.history.fragment = "";
                                Backbone.history.navigate(url, {trigger: true});

                            }
                        },
                        error  : function (model, xhr) {
                            self.errorNotification(xhr);
                        }

                    });
                }
            },

            deleteItem: function (event) {
                var mid = 39;
                event.preventDefault();
                var self = this;
                var answer = confirm("Really DELETE items ?!");
                if (answer) {
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
                                case 'thumbnails':
                                {
                                    $("#" + model._id).remove();
                                    $('.edit-project-dialog').remove();
                                    $(".add-group-dialog").remove();
                                    $(".add-user-dialog").remove();
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

            render: function () {
                var formString = this.template({
                    model: this.currentModel.toJSON()
                });
                var self = this;
                this.$el = $(formString).dialog({
                    closeOnEscape: false,
                    autoOpen     : true,
                    resizable    : false,
                    title        : "Edit Project",
                    dialogClass  : "edit-project-dialog",
                    width        : "900px",
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
                var notDiv = this.$el.find('#divForNote');
                notDiv.append(
                    new noteView({
                        model: this.currentModel
                    }).render().el);
                notDiv.append(
                    new attachView({
                        model: this.currentModel,
                        url  : "/uploadProjectsFiles"
                    }).render().el
                );
                notDiv = this.$el.find('.assignees-container');
                notDiv.append(
                    new AssigneesView({
                        model: this.currentModel
                    }).render().el
                );
                new BonusView({
                    model: this.currentModel
                });
                populate.get("#projectTypeDD", CONSTANTS.URLS.PROJECT_TYPE, {}, "name", this, false, true);
                populate.get2name("#projectManagerDD", CONSTANTS.URLS.EMPLOYEES_PERSONSFORDD, {}, this);
                populate.get2name("#customerDd", CONSTANTS.URLS.CUSTOMERS, {}, this, false, false);
                populate.getWorkflow("#workflowsDd", "#workflowNamesDd", CONSTANTS.URLS.WORKFLOWS_FORDD, {id: "Projects"}, "name", this);
                var model = this.currentModel.toJSON();

                $('#StartDate').datepicker({
                    dateFormat : "d M, yy",
                    changeMonth: true,
                    changeYear : true,
                    onSelect   : function () {
                        //Setting minimum of endDate to picked startDate
                        var endDate = $('#StartDate').datepicker('getDate');
                        endDate.setDate(endDate.getDate());
                        $('#EndDateTarget').datepicker('option', 'minDate', endDate);
                    }
                });
                $('#EndDate').datepicker({
                    dateFormat : "d M, yy",
                    changeMonth: true,
                    changeYear : true,
                    onSelect   : function () {
                        //Setting minimum of endDate to picked startDate
                        var endDate = $('#StartDate').datepicker('getDate');
                        endDate.setDate(endDate.getDate());
                        $('#EndDateTarget').datepicker('option', 'minDate', endDate);
                    }
                });
                $('#EndDateTarget').datepicker({
                    dateFormat : "d M, yy",
                    changeMonth: true,
                    changeYear : true,
                    minDate    : (model.StartDate) ? model.StartDate : 0
                });
                this.delegateEvents(this.events);

                return this;
            }

        });

        return EditView;
    });
