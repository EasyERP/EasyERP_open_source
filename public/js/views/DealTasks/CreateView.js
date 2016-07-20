define([
    'Backbone',
    'jQuery',
    'Underscore',
    'views/dialogViewBase',
    'text!templates/DealTasks/CreateTemplate.html',
    'text!templates/selectView/showSelectTemplate.html',
    'models/DealTasksModel',
    'common',
    'populate',
    'views/Notes/AttachView',
    'views/selectView/selectView',
    'constants'
], function (Backbone, $, _, ParentView, CreateTemplate, showSelectTemplate, TaskModel, common, populate, AttachView, SelectView, CONSTANTS) {

    var CreateView = ParentView.extend({
        el         : '#content-holder',
        contentType: 'Tasks',
        template   : _.template(CreateTemplate),
        responseObj: {},

        events: {
            'click #deadline'      : 'showDatePicker',
            'change #workflowNames': 'changeWorkflows',
            'click .removeSelect'  : 'removeSelect'
        },

        initialize: function () {
            _.bindAll(this, 'saveItem', 'render');
            this.model = new TaskModel();
            this.render();
            this.responseObj = {};
        },

        removeSelect : function (e){
            var $target = $(e.target);
            var $div =  $target.closest('.selectType');
            $div.find('.showSelect').remove();
            $div.find('a').show();
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
            var deal = this.$el.find('#dealDd').data('id');
            var assignedTo = this.$el.find('#assignedToDd').data('id');
            var company = this.$el.find('#companyDd').data('id');
            var workflow = this.$el.find('#workflowsDd').data('id');
            var contact = this.$el.find('#contactDd').data('id');
            var description = $.trim(this.$el.find('#description').val());
            var dueDate = $.trim(this.$el.find('#dueDate').val());
            var saveObject;

            if (!description) {
                return App.render({
                    type   : 'error',
                    message: 'Please add Description'
                });
            }

            saveObject = {
                assignedTo: assignedTo || '',

                description: description,
                dueDate    : dueDate,
                workflow   : workflow
            }
            if (company) {
                saveObject.company = company;
                saveObject.companyDate = new Date();
            }
            if (contact) {
                saveObject.contact = contact;
                saveObject.contactDate = new Date();
            }
            if (deal) {
                saveObject.deal = deal;
                saveObject.dealDate = new Date();
            }

            this.model.save(saveObject
                , {
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
            var $div =  $target.closest('div.selectType');

            if ($div.length){

                $div.append(_.template(showSelectTemplate, {id : $target.attr('id'), name : $target.text(), imageSrc:  $target.attr('data-img')}));
                $div.find('a').hide();
            } else {
                $target.parents('.dataField').find('.current-selected').text($target.text()).attr('data-id', $target.attr('id'));
            }

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
                closeOnEscape: false,
                dialogClass  : 'edit-dialog task-edit-dialog',
                width        : 600,
                title        : 'Create Task',
                buttons      : {
                    save: {
                        text : 'Create',
                        class: 'btn',
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

            notDiv.append(this.attachView.render().el);

            populate.getWorkflow('#workflowsDd', '#workflowNamesDd', CONSTANTS.URLS.WORKFLOWS_FORDD, {id: 'DealTasks'}, 'name', this, true);
            populate.get2name('#assignedToDd', CONSTANTS.URLS.EMPLOYEES_PERSONSFORDD, {}, this, false);
            populate.get('#dealDd', 'opportunities/getForDd', {isOpportunitie: true}, 'name', this, false);
            populate.get('#contactDd', CONSTANTS.URLS.COMPANIES, {type: 'Person'},'fullName', this, false);
            populate.get('#companyDd', CONSTANTS.URLS.COMPANIES, {type: 'Company'},'fullName', this, false);
            this.$el.find('#dueDate').datepicker({
                dateFormat : 'd M, yy',
                changeMonth: true,
                changeYear : true
            });

            this.delegateEvents(this.events);

            return this;
        }

    });

    return CreateView;
});
