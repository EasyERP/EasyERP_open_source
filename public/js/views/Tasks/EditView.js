define([
        "text!templates/Tasks/EditTemplate.html",
        'views/selectView/selectView',
        'views/Notes/NoteView',
        'views/Notes/AttachView',
        "common",
        "populate",
        "custom",
        'constants'
    ],
    function (EditTemplate, selectView, noteView, attachView, common, populate, custom, CONSTANTS) {

        var EditView = Backbone.View.extend({
            contentType: "Tasks",
            template   : _.template(EditTemplate),
            responseObj: {},

            initialize: function (options) {
                _.bindAll(this, "render", "saveItem", "deleteItem");
                this.currentModel = (options.model) ? options.model : options.collection.getElement();
                this.currentModel.urlRoot = '/Tasks';
                this.responseObj['#type'] = [
                    {
                        _id : 'Task',
                        name: 'Task'
                    }, {
                        _id : 'Bug',
                        name: 'Bug'
                    }, {
                        _id : 'Feature',
                        name: 'Feature'
                    }
                ];

                this.render();
            },

            events: {
                "click #tabList a"                                 : "switchTab",
                'keydown'                                          : 'keydownHandler',
                "click .current-selected"                          : "showNewSelect",
                "click .newSelectList li:not(.miniStylePagination)": "chooseOption",
                "click"                                            : "hideNewSelect",
                // "click #projectTopName"                            : "hideDialog",
                "keypress #logged, #estimated"                     : "isNumberKey",
                "click #projectTopName"                            : "useProjectFilter"
            },

            useProjectFilter: function (e) {
                e.preventDefault();
                var project = this.currentModel.get('project')._id;
                var filter = {
                    project: {
                        key  : 'project._id',
                        value: [project]
                    }
                };

                $(".edit-dialog").remove();

                Backbone.history.navigate('#easyErp/Tasks/list/p=1/c=100/filter=' + encodeURIComponent(JSON.stringify(filter)), {trigger: true});
            },

            isNumberKey: function (evt) {
                var charCode = (evt.which) ? evt.which : event.keyCode;
                if (charCode > 31 && (charCode < 48 || charCode > 57)) {
                    return false;
                }
                return true;
            },

            hideNewSelect: function (e) {
                $(".newSelectList").hide();

                if (this.selectView) {
                    this.selectView.remove();
                }
            },

            chooseOption: function (e) {
                var target = $(e.target);
                var endElem = target.parents("dd").find(".current-selected");
                endElem.text(target.text()).attr("data-id", target.attr("id"));
                endElem.attr("data-shortdesc", target.data("level"));
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
                $(".edit-dialog").remove();
            },

            /*switchTab: function (e) {
                e.preventDefault();
                var link = this.$("#tabList a");
                if (link.hasClass("selected")) {
                    link.removeClass("selected");
                }
                var index = link.index($(e.target).addClass("selected"));
                this.$(".tab").hide().eq(index).show();
            },*/

            saveItem: function (event) {
                event.preventDefault();
                var self = this;
                var viewType = custom.getCurrentVT();
                var holder = this.$el;
                var mid = 39;
                var summary = $.trim(holder.find("#summaryEdit").val());
                var project = holder.find("#projectDd").data("id");
                var assignedTo = holder.find("#assignedToDd").data("id");

                var tags = $.trim(holder.find("#tags").val()).split(',');
                if (tags.length == 0) {
                    tags = null;
                }

                var sequence = $.trim(holder.find("#sequence").val());
                if (!sequence) {
                    sequence = null;
                }
                var workflow = holder.find("#workflowsDd").data("id");
                var estimated = parseInt($.trim(holder.find("#estimated").val()));
                if ($.trim(estimated) == "") {
                    estimated = 0;
                }

                var logged = parseInt($.trim(holder.find("#logged").val()));

                var priority = holder.find("#priorityDd").data("id");

                var data = {
                    type         : holder.find("#type").data("id"),
                    summary      : summary,
                    assignedTo   : assignedTo ? assignedTo : null,
                    tags         : tags,
                    description  : $.trim(holder.find("#description").val()),
                    priority     : priority,
                    StartDate    : $.trim(holder.find("#StartDate").val()),
                    estimated    : estimated,
                    logged       : logged,
                    sequenceStart: this.currentModel.toJSON().sequence
                };
                var currentWorkflow = this.currentModel.get('workflow');
                if (currentWorkflow && currentWorkflow._id && (currentWorkflow._id != workflow)) {
                    data['workflow'] = workflow;
                    data['sequence'] = -1;
                    data['workflowStart'] = this.currentModel.toJSON().workflow._id
                }
                ;
                var currentProject = this.currentModel.get('project');
                if (currentProject && currentProject._id && (currentProject._id != project)) {
                    data['project'] = project;
                }
                ;

                if (holder.find("#workflowsDd").text() === 'Done') {
                    data['progress'] = 100;
                }

                this.currentModel.save(data, {
                    headers: {
                        mid: mid
                    },
                    patch  : true,
                    success: function (model, res) {
                        model = model.toJSON();
                        var ids = [];
                        ids.push(assignedTo);
                        ids['task_id'] = model._id;
                        common.getImages(ids, "/employees/getEmployeesImages");
                        var result = res.result;
                        self.hideDialog();
                        switch (viewType) {
                            case 'list':
                            {
                                var tr_holder = $("tr[data-id='" + model._id + "'] td");
                                var editHolder = self.$el;
                                tr_holder.eq(3).text(summary);
                                tr_holder.eq(4).find('a').data('id', project).text(editHolder.find("#projectDd").text());
                                tr_holder.eq(5).find('a').text(editHolder.find("#workflowsDd").text());
                                tr_holder.eq(6).text(editHolder.find("#assignedToDd").text());
                                var estimated = parseInt(editHolder.find("#estimated").val() || 0);
                                var logged = parseInt(editHolder.find("#logged").val() || 0);
                                var progress = Math.round(logged / estimated * 100);
                                if ((progress === Infinity) || !progress) {
                                    progress = 0;
                                }
                                tr_holder.eq(7).text(estimated);
                                tr_holder.eq(8).text(logged);
                                tr_holder.eq(9).find('a').text(editHolder.find("#type").text());
                                tr_holder.eq(10).find('progress').val(progress);
                                if (data.workflow || currentProject._id !== project) { // added condition if changed project, taskId need refresh
                                    Backbone.history.fragment = "";
                                    Backbone.history.navigate(window.location.hash.replace("#", ""), {trigger: true});
                                }
                            }
                                break;
                            case 'kanban':
                            {
                                var kanban_holder = $("#" + model._id);
                                var editHolder = self.$el;
                                kanban_holder.find("#priority_" + model._id).data("id", priority).text(priority);
                                kanban_holder.find("#shortDesc" + model._id).text(editHolder.find('#projectDd').data("shortdesc"));
                                kanban_holder.find("#summary" + model._id).text(summary);
                                kanban_holder.find("#type_" + model._id).text(editHolder.find("#type").text());
                                $("#" + data.workflowStart).find(".item").each(function () {
                                    var seq = $(this).find(".inner").data("sequence");
                                    if (seq > data.sequenceStart) {
                                        $(this).find(".inner").attr("data-sequence", seq - 1);
                                    }
                                });
                                if (result && result.sequence) {
                                    kanban_holder.find(".inner").attr("data-sequence", result.sequence);
                                }

                                $("#" + data.workflow).find(".columnNameDiv").after(kanban_holder);
                                if (data.workflow) {
                                    $("#" + data.workflow).find(".columnNameDiv").after(kanban_holder);
                                    var counter = $("#" + data.workflow).closest(".column").find(".totalCount");
                                    counter.html(parseInt(counter.html()) + 1);
                                    counter = $("#" + data.workflowStart).closest(".column").find(".totalCount");
                                    counter.html(parseInt(counter.html()) - 1);

                                }

                            }
                        }
                    },
                    error  : function (model, xhr) {
                        self.errorNotification(xhr);
                    }
                });
            },

            showNewSelect: function (e, prev, next) {
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

            deleteItem: function (event) {
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
                                    //count kanban
                                    var wId = model.workflow._id;
                                    var newTotal = ($("td#" + wId + " .totalCount").html() - 1);
                                    $("td#" + wId + " .totalCount").html(newTotal);
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
            render    : function () {
                var formString = this.template({
                    model: this.currentModel.toJSON()
                });
                var self = this;
                this.$el = $(formString).dialog({
                    dialogClass: "edit-dialog  task-edit-dialog",
                    width      : 600,
                    title      : this.currentModel.toJSON().project.projectShortDesc,
                    buttons    : {
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
                        url  : "/uploadTasksFiles"
                    }).render().el
                );
                populate.get("#projectDd", "/getProjectsForDd", {}, "projectName", this);
                populate.getWorkflow("#workflowsDd", "#workflowNamesDd", CONSTANTS.URLS.WORKFLOWS_FORDD, {id: "Tasks"}, "name", this);
                populate.get2name("#assignedToDd", CONSTANTS.URLS.EMPLOYEES_PERSONSFORDD, {}, this);
                populate.getPriority("#priorityDd", this);
                this.delegateEvents(this.events);
                $('#StartDate').datepicker({dateFormat: "d M, yy", minDate: new Date()});
                $('#deadline').datepicker({
                    dateFormat : "d M, yy",
                    changeMonth: true,
                    changeYear : true,
                    minDate    : new Date()
                });
                //for input type number
                this.$el.find("#logged").spinner({
                    min: 0,
                    max: 1000
                });
                this.$el.find("#estimated").spinner({
                    min: 0,
                    max: 1000
                });
                return this;
            }

        });
        return EditView;
    });
