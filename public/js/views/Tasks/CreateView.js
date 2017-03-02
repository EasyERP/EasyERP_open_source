define([
    'Backbone',
    'jQuery',
    'Underscore',
    'views/dialogViewBase',
    'text!templates/Tasks/CreateTemplate.html',
    'models/TasksModel',
    'common',
    'populate',
    'views/Notes/AttachView',
    'views/selectView/selectView',
    'constants'
], function (Backbone, $, _, ParentView, CreateTemplate, TaskModel, common, populate, AttachView, SelectView, CONSTANTS) {

    var CreateView = ParentView.extend({
        el         : '#content-holder',
        contentType: 'Tasks',
        template   : _.template(CreateTemplate),
        responseObj: {},

        events: {
            'click #deadline'      : 'showDatePicker',
            'change #workflowNames': 'changeWorkflows'
        },

        initialize: function () {
            _.bindAll(this, 'saveItem', 'render');
            this.model = new TaskModel();
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

        addAttach: function () {
            var $inputFile = this.$el.find('.input-file');
            var $attachContainer = this.$el.find('.attachContainer');
            var $inputAttach = this.$el.find('.inputAttach:last');
            var s = $inputAttach.val().split('\\')[$inputAttach.val().split('\\').length - 1];

            $attachContainer.append('<li class="attachFile">' +
                '<a href="javascript:;">' + s + '</a>' +
                '<a href="javascript:;" class="deleteAttach">Delete</a></li>'
            );

            $attachContainer.find('.attachFile:last').append($inputFile.find('.inputAttach').attr('hidden', 'hidden'));
            $inputFile.append('<input type="file" value="Choose File" class="inputAttach" name="attachfile">');
        },

        deleteAttach: function (e) {
            $(e.target).closest('.attachFile').remove();
        },

        fileSizeIsAcceptable: function (file) {
            if (!file) {
                return false;
            }
            return file.size < App.File.MAXSIZE;
        },

        getWorkflowValue: function (value) {
            var workflows = [];
            var i;

            for (i = 0; i < value.length; i++) {
                workflows.push({name: value[i].name, status: value[i].status, _id: value[i]._id});
            }

            return workflows;
        },

        showDatePicker: function () {
            var $createDatePicker = $('.createFormDatepicker');

            if ($createDatePicker.find('.arrow').length === 0) {
                $createDatePicker.append('<div class="arrow"></div>');
            }
        },

        saveItem: function () {
            var self = this;
            var mid = 39;
            var summary = $.trim(this.$el.find('#summaryTask').val());
            var project = this.$el.find('#projectDd').data('id');
            var assignedTo = this.$el.find('#assignedToDd').data('id');
            var description = $.trim(this.$el.find('#description').val());
            var StartDate = $.trim(this.$el.find('#StartDate').val());
            var workflow = this.$el.find('#workflowsDd').data('id');
            var estimated = $.trim(this.$el.find('#estimated').val());
            var logged = $.trim(this.$el.find('#logged').val());
            var priority = this.$el.find('#priorityDd').data('id');
            var type = this.$el.find('#type').data('id');

            this.model.save(
                {
                    type       : type,
                    summary    : summary,
                    assignedTo : assignedTo || '',
                    workflow   : workflow,
                    project    : project || '',
                    description: description,
                    priority   : priority,
                    StartDate  : StartDate,
                    estimated  : estimated,
                    logged     : logged
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

                    error: function (model, xhr) {
                        self.errorNotification(xhr);
                    }

                });
        },

        chooseOption: function (e) {
            var $target = $(e.target);

            $target.parents('ul').closest('.current-selected').text($target.text()).attr('data-id', $target.attr('id'));
        },

        render: function () {
            var afterPid = (window.location.hash).split('pId=')[1];
            var forKanban = (window.location.hash).split('kanban/')[1];
            var projectID = afterPid ? afterPid.split('/')[0] : forKanban;
            var formString = this.template();
            var self = this;
            var notDiv;
            var filterHash;
            var filter;

            this.$el = $(formString).dialog({
                dialogClass: 'edit-dialog task-edit-dialog',
                width      : 500,
                title      : 'Create Task',
                buttons    : {
                    save: {
                        text : 'Create',
                        class: 'btn blue',
                        click: self.saveItem
                    },

                    cancel: {
                        text : 'Cancel',
                        class: 'btn',
                        click: self.hideDialog
                    }
                }
            });

            notDiv = this.$el.find('.attach-container');

            this.attachView = new AttachView({
                model      : new TaskModel(),
                contentType: self.contentType,
                isCreate   : true
            });

            if (!projectID) {
                filterHash = window.location.hash.split('filter=');
                filter = filterHash && filterHash.length > 1 ? JSON.parse(decodeURIComponent(filterHash[1])) : null;

                if (filter && filter.project) {
                    projectID = filter.project.value[0];
                }
            }

            notDiv.append(this.attachView.render().el);

            if (projectID) {
                populate.get('#projectDd', '/projects/getForDd', {}, 'name', this, false, false, projectID);
            } else {
                populate.get('#projectDd', '/projects/getForDd', {}, 'name', this, true);
            }

            populate.getWorkflow('#workflowsDd', '#workflowNamesDd', CONSTANTS.URLS.WORKFLOWS_FORDD, {id: 'Tasks'}, 'name', this, true);
            populate.get2name('#assignedToDd', CONSTANTS.URLS.EMPLOYEES_PERSONSFORDD, {}, this, true);
            populate.getPriority('#priorityDd', this, true);

            this.$el.find('#StartDate').datepicker({
                dateFormat : 'd M, yy',
                changeMonth: true,
                changeYear : true
            });

            this.$el.find('#logged').spinner({
                min: 0,
                max: 9999
            });

            this.$el.find('#estimated').spinner({
                min: 0,
                max: 9999
            });

            this.delegateEvents(this.events);

            return this;
        }

    });

    return CreateView;
});
