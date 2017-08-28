define([
    'Backbone',
    'Underscore',
    'jQuery',
    'views/dialogViewBase',
    'text!templates/DealTasks/EditTemplate.html',
    'text!templates/selectView/showSelectTemplate.html',
    'views/Notes/NoteView',
    'views/Category/TagView',
    'common',
    'populate',
    'custom',
    'constants',
    'moment',
    'helpers/keyValidator'
], function (Backbone, _, $, ParentView, EditTemplate, showSelectTemplate, NoteView, CategoryView, common, populate, custom, CONSTANTS, moment, keyValidator) {

    var EditView = ParentView.extend({
        contentType: 'DealTasks',
        template   : _.template(EditTemplate),
        responseObj: {},

        events: {
            'keypress .time'       : 'keypress',
            'click #projectTopName': 'useProjectFilter',
            'click .removeSelect'  : 'removeSelect',
            'keyup .time'          : 'validateInput',
            'change .time'         : 'changeInput'
        },

        initialize: function (options) {
            _.bindAll(this, 'render', 'saveItem', 'deleteItem');
            this.currentModel = (options.model) || options.collection.getElement();
            this.currentModel.urlRoot = CONSTANTS.URLS.DEALTASKS;
            this.currentModel.on('change:category', this.renderCategory, this);

            this.render();
        },

        keypress: function (e) {
            return keyValidator(e);
        },

        changeInput: function (e) {
            var $target = $(e.target);

            e.preventDefault();

            if ($target.val().length === 1) {
                $target.val('0' + $target.val());
            }
        },

        validateInput: function (e) {
            var $target = $(e.target);
            var maxVal = ($target.attr('id') === 'dueDateHours') ? 23 : 59;

            e.preventDefault();

            if ($target.val() > maxVal) {
                $target.val('' + maxVal);
            }

        },

        removeSelect: function (e) {
            var $target = $(e.target);
            var $div = $target.closest('.selectType');
            $div.find('.showSelect').remove();
            $div.find('a').show();
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

        chooseOption: function (e) {
            var $target = $(e.target);
            var $div = $target.closest('div.selectType');
            var $img = $div.find('.dataImg');

            if ($div.length) {
                $img.attr('src', $target.attr('data-img'));
                $div.attr('id', $target.attr('id'));
                $div.find('.current-selected').html($target.text());
            } else {
                $target.parents('.dataField').find('.current-selected').text($target.text()).attr('data-id', $target.attr('id'));
            }
        },

        saveItem: function (event) {
            var self = this;
            var viewType;
            var holder;
            var assignedTo;
            var sequence;
            var workflow;
            var data;
            var currentWorkflow;
            var currentAssigned;
            var modelJSON = this.currentModel.toJSON();
            var deal = this.$el.find('#dealItem .selectType').attr('data-id');
            var company = this.$el.find('#companyItem .selectType').attr('data-id');
            var contact = this.$el.find('#contactItem .selectType').attr('data-id');
            var time = moment($.trim(this.$el.find('#timepickerOne').wickedpicker('time')).split(' '), 'hh:mm:ss A');
            var description = $.trim(this.$el.find('#description').val());
            var dueDate = $.trim(this.$el.find('#dueDate').val());
            var hours = time.get('hours');
            var minutes = time.get('minutes');
            var seconds = time.get('seconds');
            var category = modelJSON.category ? modelJSON.category._id : null;

            event.preventDefault();

            viewType = custom.getCurrentVT();

            holder = this.$el;
            assignedTo = holder.find('#assignedToDd').data('id');

            sequence = $.trim(holder.find('#sequence').val());

            if (!sequence) {
                sequence = null;
            }

            if (dueDate) {
                dueDate = moment(dueDate).hours(hours).minutes(minutes).seconds(seconds).toDate();
            }

            if (!description) {
                return App.render({
                    type   : 'error',
                    message: 'Please add Description'
                });
            }

            workflow = holder.find('#workflowsDd').data('id');

            data = {
                description  : description,
                dueDate      : dueDate,
                sequenceStart: modelJSON.sequence,
                company      : company || null,
                category     : category || null,
                contact      : contact || null,
                contactDate  : contact ? new Date() : null,
                deal         : deal || null,
                dealDate     : deal ? new Date() : null
            };

            currentWorkflow = modelJSON.workflow;
            currentAssigned = modelJSON.assignedTo;

            if (currentWorkflow && currentWorkflow._id && (currentWorkflow._id !== workflow)) {
                data.workflow = workflow;
                data.sequence = -1;
                data.workflowStart = modelJSON.workflow._id;
            }

            if (currentAssigned && currentAssigned._id && (currentAssigned._id !== assignedTo)) {
                data.assignedTo = assignedTo;
            }

            this.currentModel.set(data);

            if (this.currentModel.changed.company) {
                data.companyDate = new Date();
            }
            if (this.currentModel.changed.contact) {
                data.contactDate = new Date();
            }
            if (this.currentModel.changed.deal) {
                data.dealDate = new Date();
            }

            this.currentModel.save(this.currentModel.changed, {
                patch  : true,
                success: function (model, res) {
                    var redirectUrl = window.location.hash;
                    self.hideDialog();

                    Backbone.history.fragment = '';
                    Backbone.history.navigate(redirectUrl, {trigger: true});
                },

                error: function (model, xhr) {
                    self.errorNotification(xhr);
                }
            });
        },

        renderCategory: function () {
            var notDiv = this.$el.find('#categoryHolder');
            notDiv.empty();

            notDiv.append(
                new CategoryView({
                    model      : this.currentModel,
                    contentType: 'DealTasks',
                    el         : '#categoryHolder'
                }).render().el
            );
        },

        deleteItem: function (event) {
            var self = this;
            var answer;

            event.preventDefault();

            answer = confirm('Really DELETE items ?!');

            if (answer === true) {
                this.currentModel.destroy({
                    success: function (model) {
                        var viewType;
                        var wId;
                        var newTotal;
                        var $totalCount;
                        var redirectUrl = window.location.hash;

                        model = model.toJSON();
                        viewType = custom.getCurrentVT();

                        switch (viewType) {

                            case 'kanban':
                                $('#' + model._id).remove();
                                wId = model.workflow._id;
                                $totalCount = $('td#' + wId + ' .totalCount');

                                newTotal = ($totalCount.html() - 1);
                                $totalCount.html(newTotal);
                                break;

                            default:

                                self.hideDialog();

                                Backbone.history.fragment = '';
                                Backbone.history.navigate(redirectUrl, {trigger: true});
                                break;
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
                model : this.currentModel.toJSON(),
                moment: moment
            });
            var dueDate = this.currentModel.get('dueDate');
            var time = moment(dueDate).format('H:mm:ss');
            var self = this;
            var notDiv;

            this.$el = $(formString).dialog({
                dialogClass: 'edit-dialog task-dialog task-edit-dialog',
                width      : 800,
                title      : this.currentModel.toJSON().description,
                buttons    : {
                    save: {
                        text : 'Save',
                        class: 'btn blue',
                        click: function (e) {
                            self.saveItem(e);
                            self.gaTrackingEditConfirm();
                        }
                    },

                    cancel: {
                        text : 'Cancel',
                        class: 'btn',
                        click: self.hideDialog
                    },
                    delete: {
                        text : 'Delete',
                        class: 'btn',
                        click: function (e) {
                            self.deleteItem(e);
                            self.gaTrackingDelete();
                        }
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

            this.renderCategory();

            populate.getWorkflow('#workflowsDd', '#workflowNamesDd', CONSTANTS.URLS.WORKFLOWS_FORDD, {id: 'DealTasks'}, 'name', this);
            populate.get2name('#assignedToDd', CONSTANTS.URLS.EMPLOYEES_PERSONSFORDD, {}, this);
            populate.get('#contactDd', CONSTANTS.URLS.COMPANIES, {type: 'Person'}, 'fullName', this, false);
            populate.get('#companyDd', CONSTANTS.URLS.COMPANIES, {type: 'Company'}, 'fullName', this, false);
            populate.get('#dealDd', 'opportunities/getForDd', {}, 'name', this, false);

            this.delegateEvents(this.events);

            this.$el.find('#dueDate').datepicker({dateFormat: 'd M, yy', minDate: new Date()});
            this.$el.find('#timepickerOne').wickedpicker({
                now            : time,
                showSeconds    : true, //Whether or not to show seconds,
                secondsInterval: 1, //Change interval for seconds, defaults to 1,
                minutesInterval: 1
            });

            return this;
        }

    });
    return EditView;
});
