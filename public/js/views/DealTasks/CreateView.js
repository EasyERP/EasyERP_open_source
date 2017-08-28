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
    'views/Category/TagView',
    'constants',
    'moment',
    'helpers/keyValidator',
    'helpers/ga',
    'constants/googleAnalytics'
], function (Backbone, $, _, ParentView, CreateTemplate, showSelectTemplate, TaskModel, common, populate, AttachView, CategoryView, CONSTANTS, moment, keyValidator, ga, GA) {

    var CreateView = ParentView.extend({
        el         : '#content-holder',
        contentType: 'Tasks',
        template   : _.template(CreateTemplate),
        responseObj: {},

        events: {
            'click .removeSelect'       : 'removeSelect',
            'click textarea.withCounter': 'checkCount'
        },

        initialize: function () {
            _.bindAll(this, 'saveItem', 'render');
            this.model = new TaskModel();
            this.render();
            this.responseObj = {};
            this.model.on('change:category', this.renderCategory, this);
        },

        removeSelect: function (e) {
            var $target = $(e.target);
            var $div = $target.closest('.selectType');
            $div.find('.showSelect').remove();
            $div.find('a').show();
        },

        saveItem: function () {
            var self = this;
            var deal = this.$el.find('#dealItem .selectType').attr('data-id');
            var assignedTo = this.$el.find('#assignedToDd').attr('data-id');
            var company = this.$el.find('#companyItem .selectType').attr('data-id');
            var workflow = this.$el.find('#workflowsDd').attr('data-id');
            var contact = this.$el.find('#contactItem .selectType').attr('data-id');
            var description = $.trim(this.$el.find('#description').val());
            var dueDate = $.trim(this.$el.find('#dueDate').val());
            var time = moment($.trim(this.$el.find('#timepickerOne').wickedpicker('time')).split(' '), 'hh:mm:ss A');
            var hours = time.get('hours');
            var minutes = time.get('minutes');
            var seconds = time.get('seconds');
            var category = this.model.get('category');
            var saveObject;

            if (dueDate) {
                dueDate = moment(dueDate).hours(hours).minutes(minutes).seconds(seconds).toDate();
            }

            if (!description) {
                return App.render({
                    type   : 'error',
                    message: 'Please add Description'
                });
            }

            saveObject = {
                assignedTo: assignedTo || '',

                description: description,
                dueDate    : dueDate || new Date(),
                workflow   : workflow,
                category   : category ? category._id : null
            };

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

            this.model.save(saveObject, {
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

        renderCategory: function () {
            var notDiv = this.$el.find('#categoryHolder');
            notDiv.empty();

            notDiv.append(
                new CategoryView({
                    model      : this.model,
                    contentType: 'DealTasks',
                    el         : '#categoryHolder'
                }).render().el
            );
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

        render: function () {
            var formString = this.template();
            var self = this;

            this.$el = $(formString).dialog({
                dialogClass: 'edit-dialog task-edit-dialog',
                width      : 800,
                title      : 'Create Task',
                buttons    : {
                    save: {
                        text : 'Create',
                        class: 'btn blue',
                        click: function () {
                            self.saveItem();
                            self.gaTrackingConfirmEvents();
                        }

                    },

                    cancel: {
                        text : 'Cancel',
                        class: 'btn',
                        click: function () {
                            self.hideDialog();
                        }
                    }
                }
            });

            this.attachView = new AttachView({
                model      : new TaskModel(),
                contentType: self.contentType,
                isCreate   : true
            });

            populate.getWorkflow('#workflowsDd', '#workflowNamesDd', CONSTANTS.URLS.WORKFLOWS_FORDD, {id: 'DealTasks'}, 'name', this, true);
            populate.get2name('#assignedToDd', CONSTANTS.URLS.EMPLOYEES_PERSONSFORDD, {}, this, false);
            populate.get('#dealDd', 'opportunities/getForDd', {}, 'name', this, false);
            populate.get('#contactDd', CONSTANTS.URLS.COMPANIES, {type: 'Person'}, 'fullName', this, false);
            populate.get('#companyDd', CONSTANTS.URLS.COMPANIES, {type: 'Company'}, 'fullName', this, false);

            this.renderCategory();

            this.$el.find('#dueDate').datepicker({
                dateFormat : 'd M, yy',
                changeMonth: true,
                changeYear : true
            });
            this.$el.find('#timepickerOne').wickedpicker({
                showSeconds    : true,
                secondsInterval: 1,
                minutesInterval: 1
            });

            this.delegateEvents(this.events);

            return this;
        }

    });

    return CreateView;
});
