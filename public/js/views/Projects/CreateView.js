define([
        "text!templates/Projects/CreateTemplate.html",
        "models/ProjectsModel",
        "populate",
        'views/Notes/AttachView',
        'views/Assignees/AssigneesView',
        'views/Bonus/BonusView'
    ],
    function (CreateTemplate, ProjectModel, populate, attachView, AssigneesView, BonusView) {

        var CreateView = Backbone.View.extend({
            el: "#content-holder",
            contentType: "Projects",
            template: _.template(CreateTemplate),

            initialize: function () {
                _.bindAll(this, "saveItem");
                this.model = new ProjectModel();
                this.responseObj = {};
                this.render();
            },

            events: {
                'click #workflowNamesDd': 'chooseUser',
                "submit form": "formSubmitHandler",
                'keydown': 'keydownHandler',
                'click .dialog-tabs a': 'changeTab',
                "click #health a": "showHealthDd",
                "click #health ul li div": "chooseHealthDd",
                "click": "hideHealth",
                "click .newSelectList li:not(.miniStylePagination)": "chooseOption",
                "click .newSelectList li.miniStylePagination": "notHide",
                "click .newSelectList li.miniStylePagination .next:not(.disabled)": "nextSelect",
                "click .newSelectList li.miniStylePagination .prev:not(.disabled)": "prevSelect",
                "click .current-selected": "showNewSelect"

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
            hideHealth: function () {
                $(".newSelectList").hide();
                $("#health ul").hide();

            },

            chooseHealthDd: function (e) {
                $(e.target).parents("#health").find("a").attr("class", $(e.target).attr("class")).attr("data-value", $(e.target).attr("class").replace("health", "")).parent().find("ul").toggle();
            },

            showHealthDd: function (e) {
                $(e.target).parent().find("ul").toggle();
                return false;
            },

            changeTab: function (e) {
                $(e.target).closest(".dialog-tabs").find("a.active").removeClass("active");
                $(e.target).addClass("active");
                var n = $(e.target).parents(".dialog-tabs").find("li").index($(e.target).parent());
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

            formSubmitHandler: function (event) {
                event.preventDefault();
            },

            saveItem: function () {
                var self = this;
                var value;
                var mid = 39;
                var validation = true;
                var custom = this.$el.find("#customerDd").text();

                var customer = this.$el.find("#customerDd").attr("data-id");

                var projectmanager = this.$el.find("#projectManagerDD").data("id");

                var projecttype = this.$el.find("#projectTypeDD").data("id");
                var workflow = this.$el.find("#workflowsDd").data("id");

                var bonusContainer = $('#bonusTable');
                var bonusRow = bonusContainer.find('tr');
                var bonus = [];

                if (custom === 'Select'){
                    value = 'Customer';
                    return alert('Please, choose ' + value + ' first.');
                }


                bonusRow.each(function (key, val) {
                    var employeeId = $(val).find("[data-content='employee']").attr('data-id');
                    var bonusId = $(val).find("[data-content='bonus']").attr('data-id');

                    if (!employeeId || !bonusId || custom === 'Select'){
                        validation = false;
                    }

                    var startDate = $(val).find(".startDate input").val();
                    var endDate = $(val).find(".endDate input").val();
                   // var startDate = $(val).find(".startDate>div").text().trim() || $(val).find(".startDate input").val();
                   // var endDate = $(val).find(".endDate>div").text().trim() || $(val).find(".endDate input").val();

                    bonus.push({
                        employeeId: employeeId,
                        bonusId: bonusId,
                        startDate: startDate,
                        endDate: endDate
                    });
                });

                if (!validation){
                    return alert('Employee and bonus fields must not be empty.');
                }

                var description = $.trim(this.$el.find("#description").val());
                var $userNodes = this.$el.find("#usereditDd option:selected"), users = [];
                $userNodes.each(function (key, val) {
                    users.push({
                        id: val.value,
                        name: val.innerHTML
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
                var whoCanRW = this.$el.find("[name='whoCanRW']:checked").val();
                var health = this.$el.find('#health a').data('value');
                var startDate = $.trim(this.$el.find("#StartDate").val());
                var targetEndDate = $.trim(this.$el.find("#EndDateTarget").val());

                if (validation) {
                    this.model.save({
                            projectName: $.trim(this.$el.find("#projectName").val()),
                            projectShortDesc: $.trim(this.$el.find("#projectShortDesc").val()),
                            customer: customer ? customer : "",
                            projectmanager: projectmanager ? projectmanager : "",
                            workflow: workflow ? workflow : "",
                            projecttype: projecttype ? projecttype : "",
                            description: description,
                            groups: {
                                owner: $("#allUsersSelect").data("id"),
                                users: usersId,
                                group: groupsId
                            },
                            whoCanRW: whoCanRW,
                            health: health,
                            StartDate: startDate,
                            TargetEndDate: targetEndDate,
                            bonus: bonus
                        },
                        {
                            headers: {
                                mid: mid
                            },
                            wait: true,
                            success: function (model, response) {
                                self.attachView.sendToServer(null, model.changed);
                            },
                            error: function (model, xhr) {
                                self.errorNotification(xhr);
                            }
                        });
                }
            },

            hideDialog: function () {
                $(".edit-dialog").remove();
                $(".add-group-dialog").remove();
                $(".add-user-dialog").remove();
            },

            render: function () {
                var formString = this.template();
                var self = this;
                this.$el = $(formString).dialog({
                    closeOnEscape: false,
                    dialogClass: "edit-dialog",
                    width: "900",
                    title: "Create Project",
                    buttons: {
                        save: {
                            text: "Create",
                            class: "btn",
                            click: function () {
                                self.saveItem();
                            }
                        },
                        cancel: {
                            text: "Cancel",
                            class: "btn",
                            click: function () {
                                self.hideDialog();
                            }
                        }
                    }
                });
                var notDiv = this.$el.find('.attach-container');
                this.attachView = new attachView({
                    model: new ProjectModel(),
                    url: "/uploadProjectsFiles",
                    isCreate: true
                });
                notDiv.append(this.attachView.render().el);

                notDiv = this.$el.find('.assignees-container');
                notDiv.append(
                    new AssigneesView({
                        model: this.currentModel
                    }).render().el
                );
                new BonusView({
                    model: new ProjectModel()
                });
                populate.get("#projectTypeDD", "/projectType", {}, "name", this, true, true);
                populate.get2name("#projectManagerDD", "/getPersonsForDd", {}, this, true);
                populate.get2name("#customerDd", "/Customer", {}, this, true, true);
                populate.getWorkflow("#workflowsDd", "#workflowNamesDd", "/WorkflowsForDd", {id: "Projects"}, "name", this, true);

                $('#StartDate').datepicker({
                    dateFormat: "d M, yy",
                    changeMonth: true,
                    changeYear: true,
                    onSelect: function () {
                        var endDate = $('#StartDate').datepicker('getDate');
                        endDate.setDate(endDate.getDate());
                        $('#EndDateTarget').datepicker('option', 'minDate', endDate);
                    }
                });
                $('#EndDateTarget').datepicker({
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
