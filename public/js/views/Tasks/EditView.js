define([
    'Backbone',
    'Underscore',
    'jQuery',
    'views/dialogViewBase',
    'text!templates/Tasks/EditTemplate.html',
    'views/selectView/selectView',
    'views/Notes/NoteView',
    'views/Notes/AttachView',
    'common',
    'populate',
    'custom',
    'constants'
], function (Backbone,
             _,
             $,
             ParentView,
             EditTemplate,
             selectView,
             NoteView,
             AttachView,
             common,
             populate,
             custom,
             CONSTANTS) {

    var EditView = ParentView.extend({
        contentType: 'Tasks',
        template   : _.template(EditTemplate),
        responseObj: {},

        events: {
            'keypress #logged, #estimated': 'isNumberKey',
            'click #projectTopName'       : 'useProjectFilter'
        },

        initialize: function (options) {
            _.bindAll(this, 'render', 'saveItem', 'deleteItem');
            this.currentModel = (options.model) ? options.model : options.collection.getElement();
            this.currentModel.urlRoot = CONSTANTS.URLS.TASKS;
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

        useProjectFilter: function (e) {
            var project;
            var filter;

            e.preventDefault();
            project = this.currentModel.get('project')._id;
            filter = {
                project: {
                    key  : 'project._id',
                    type : 'ObjectId',
                    value: [project]
                }
            };

            $('.edit-dialog').remove();

            Backbone.history.navigate('#easyErp/Tasks/list/p=1/c=100/filter=' + encodeURIComponent(JSON.stringify(filter)), {trigger: true});
        },

        isNumberKey: function (evt) {
            var charCode = (evt.which) ? evt.which : event.keyCode;

            return !(charCode > 31 && (charCode < 48 || charCode > 57));
        },

        chooseOption: function (e) {
            var target = $(e.target);
            var endElem = target.parents('dd').find('.current-selected');

            endElem.text(target.text()).attr('data-id', target.attr('id'));
            endElem.attr('data-shortdesc', target.data('level'));
        },

        saveItem: function (event) {
            var self = this;
            var viewType;
            var holder;
            var mid;
            var summary;
            var project;
            var assignedTo;
            var tags;
            var sequence;
            var workflow;
            var estimated;
            var logged;
            var priority;
            var data;
            var currentWorkflow;
            var currentProject;

            event.preventDefault();

            viewType = custom.getCurrentVT();
            holder = this.$el;
            mid = 39;
            summary = $.trim(holder.find('#summaryEdit').val());
            project = holder.find('#projectDd').data('id');
            assignedTo = holder.find('#assignedToDd').data('id');
            tags = $.trim(holder.find('#tags').val()).split(',');

            if (!tags.length) {
                tags = null;
            }

            sequence = $.trim(holder.find('#sequence').val());

            if (!sequence) {
                sequence = null;
            }

            workflow = holder.find('#workflowsDd').data('id');
            estimated = parseInt($.trim(holder.find('#estimated').val()), 10);

            if ($.trim(estimated) === '') {
                estimated = 0;
            }

            logged = parseInt($.trim(holder.find('#logged').val()), 10);

            priority = holder.find('#priorityDd').data('id');

            data = {
                type         : holder.find('#type').data('id'),
                summary      : summary,
                assignedTo   : assignedTo || null,
                tags         : tags,
                description  : $.trim(holder.find('#description').val()),
                priority     : priority,
                StartDate    : $.trim(holder.find('#StartDate').val()),
                estimated    : estimated,
                logged       : logged,
                sequenceStart: this.currentModel.toJSON().sequence
            };

            currentWorkflow = this.currentModel.get('workflow');

            if (currentWorkflow && currentWorkflow._id && (currentWorkflow._id !== workflow)) {
                data.workflow = workflow;
                data.sequence = -1;
                data.workflowStart = this.currentModel.toJSON().workflow._id;
            }

            currentProject = this.currentModel.get('project');

            if (currentProject && currentProject._id && (currentProject._id !== project)) {
                data.project = project;
            }

            if (holder.find('#workflowsDd').text() === 'Done') {
                data.progress = 100;
            }

            this.currentModel.save(data, {
                headers: {
                    mid: mid
                },
                patch  : true,
                success: function (model, res) {
                    var ids = [];
                    var result;
                    var $trHolder;
                    var editHolder = self.$el;
                    var newEstimated;
                    var newLogged;
                    var progress;
                    var $kanbanHolder;
                    var counter;
                    var $workflowStart;
                    var $workflow;

                    model = model.toJSON();
                    ids.push(assignedTo);
                    ids.task_id = model._id;
                    common.getImages(ids, '/employees/getEmployeesImages');
                    result = res.result;
                    self.hideDialog();

                    switch (viewType) {
                        case 'list':
                            $trHolder = $("tr[data-id='" + model._id + "'] td");
                            $trHolder.eq(3).text(summary);
                            $trHolder.eq(4).find('a').data('id', project).text(editHolder.find('#projectDd').text());
                            $trHolder.eq(5).find('a').text(editHolder.find('#workflowsDd').text());
                            $trHolder.eq(6).text(editHolder.find('#assignedToDd').text());
                            newEstimated = parseInt(editHolder.find('#estimated').val() || 0, 10);
                            newLogged = parseInt(editHolder.find('#logged').val() || 0, 10);
                            progress = Math.round(newLogged / newEstimated * 100);

                            if ((progress === Infinity) || !progress) {
                                progress = 0;
                            }

                            $trHolder.eq(7).text(newEstimated);
                            $trHolder.eq(8).text(newLogged);
                            $trHolder.eq(9).find('a').text(editHolder.find('#type').text());
                            $trHolder.eq(10).find('progress').val(progress);

                            if (data.workflow || currentProject._id !== project) { // added condition if changed project, taskId need refresh
                                Backbone.history.fragment = '';
                                Backbone.history.navigate(window.location.hash.replace('#', ''), {trigger: true});
                            }
                            break;
                        case 'kanban':
                            $kanbanHolder = $('#' + model._id);
                            $kanbanHolder.find('#priority_' + model._id).data('id', priority).text(priority);
                            $kanbanHolder.find('#shortDesc' + model._id).text(editHolder.find('#projectDd').data('shortdesc'));
                            $kanbanHolder.find('#summary' + model._id).text(summary);
                            $kanbanHolder.find('#type_' + model._id).text(editHolder.find('#type').text());
                            $workflowStart = $('#' + data.workflowStart);
                            $workflow = $('#' + data.workflow);

                            $workflowStart.find('.item').each(function () {
                                var seq = $(this).find('.inner').data('sequence');

                                if (seq > data.sequenceStart) {
                                    $(this).find('.inner').attr('data-sequence', seq - 1);
                                }
                            });

                            if (result && result.sequence) {
                                $kanbanHolder.find('.inner').attr('data-sequence', result.sequence);
                            }

                            $workflow.find('.columnNameDiv').after($kanbanHolder);

                            if (data.workflow) {
                                $workflow.find('.columnNameDiv').after($kanbanHolder);
                                counter = $workflow.closest('.column').find('.totalCount');
                                counter.html(parseInt(counter.html(), 10) + 1);
                                counter = $workflowStart.closest('.column').find('.totalCount');
                                counter.html(parseInt(counter.html(), 10) - 1);
                            }
                    }
                },

                error: function (model, xhr) {
                    self.errorNotification(xhr);
                }
            });
        },

        deleteItem: function (event) {
            var mid;
            var self = this;
            var answer;

            event.preventDefault();

            mid = 39;
            answer = confirm('Really DELETE items ?!');

            if (answer === true) {
                this.currentModel.destroy({
                    headers: {
                        mid: mid
                    },
                    success: function (model) {
                        var viewType;
                        var wId;
                        var newTotal;
                        var $totalCount;

                        model = model.toJSON();
                        viewType = custom.getCurrentVT();

                        switch (viewType) {
                            case 'list':
                                $("tr[data-id='" + model._id + "'] td").remove();
                                break;
                            case 'kanban':
                                $('#' + model._id).remove();
                                // count kanban
                                wId = model.workflow._id;
                                $totalCount = $('td#' + wId + ' .totalCount');

                                newTotal = ($totalCount.html() - 1);
                                $totalCount.html(newTotal);
                        }
                        self.hideDialog();
                    },

                    error: function (model, xhr) {
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
            var notDiv;

            this.$el = $(formString).dialog({
                dialogClass: 'edit-dialog  task-edit-dialog',
                width      : 600,
                title      : this.currentModel.toJSON().project.projectShortDesc,
                buttons    : {
                    save: {
                        text : 'Save',
                        class: 'btn blue',
                        click: self.saveItem
                    },

                    cancel: {
                        text : 'Cancel',
                        class: 'btn',
                        click: self.hideDialog
                    },
                    delete: {
                        text : 'Delete',
                        class: 'btn',
                        click: self.deleteItem
                    }
                }
            });

            notDiv = this.$el.find('#divForNote');
            notDiv.append(
                new NoteView({
                    model      : this.currentModel,
                    contentType: 'Tasks'
                }).render().el);

            this.renderAssignees(this.currentModel);

            populate.get('#projectDd', '/projects/getForDd', {}, 'name', this);
            populate.getWorkflow('#workflowsDd', '#workflowNamesDd', CONSTANTS.URLS.WORKFLOWS_FORDD, {id: 'Tasks'}, 'name', this);
            populate.get2name('#assignedToDd', CONSTANTS.URLS.EMPLOYEES_PERSONSFORDD, {}, this);
            populate.getPriority('#priorityDd', this);

            this.delegateEvents(this.events);

            this.$el.find('#StartDate').datepicker({dateFormat: 'd M, yy', minDate: new Date()});

            // for input type number
            this.$el.find('#logged').spinner({
                min: 0,
                max: 1000
            });
            this.$el.find('#estimated').spinner({
                min: 0,
                max: 1000
            });

            return this;
        }

    });
    return EditView;
});
