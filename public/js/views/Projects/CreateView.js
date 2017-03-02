define([
    'Backbone',
    'jQuery',
    'Underscore',
    'views/dialogViewBase',
    'text!templates/Projects/CreateTemplate.html',
    'models/ProjectsModel',
    'views/Notes/AttachView',
    'views/Bonus/BonusView',
    'services/projects',
    'populate',
    'custom',
    'constants'
], function (Backbone, $, _, ParentView, CreateTemplate, ProjectModel, AttachView, BonusView, projects, populate, customFile, CONSTANTS) {

    var CreateView = ParentView.extend({
        el         : '#content-holder',
        contentType: 'Projects',
        template   : _.template(CreateTemplate),

        initialize: function () {
            _.bindAll(this, 'saveItem');
            this.model = new ProjectModel();
            this.responseObj = {};
            this.url = '#easyErp/Projects/list';
            this.render();
        },

        events: {
            'click #workflowNamesDd' : 'chooseUser',
            'submit form'            : 'formSubmitHandler',
            'click #health a'        : 'showHealthDd',
            'click #health ul li div': 'chooseHealthDd'
        },

        hideHealth: projects.hideHealth,

        chooseOption: function (e) {
            $(e.target).parents('ul').closest('.current-selected').text($(e.target).text()).attr('data-id', $(e.target).attr('id'));
            this.hideHealth();
        },

        chooseHealthDd: function (e) {
            e.stopPropagation();
            $(e.target).parents('#health').find('a').attr('class', $(e.target).attr('class')).attr('data-value', $(e.target).attr('class').replace('health', '')).closest('.health-wrapper').toggleClass('open');
        },

        showHealthDd: function (e) {
            $(e.target).closest('.health-wrapper').toggleClass('open');
            return false;
        },

        formSubmitHandler: function (event) {
            event.preventDefault();
        },

        saveItem: function () {
            var self = this;
            var $thisEl = this.$el;
            var value;
            var mid = 39;
            var validation = true;
            var customer = $thisEl.find('#customerDd').attr('data-id');
            var projecttype = $thisEl.find('#projectTypeDD').data('id');
            var workflow = $thisEl.find('#workflowsDd').data('id');
            var paymentMethod = $thisEl.find('#paymentMethod').data('id');
            var paymentTerms = $thisEl.find('#paymentTerms').data('id');
            var description;
            var $userNodes;
            var users = [];
            var bonusContainer = $('#bonusTable'); // todo change it to this.$el;
            var bonusRow = bonusContainer.find('tr');
            var bonus = [];
            var usersId = [];
            var groupsId = [];
            var whoCanRW;
            var health;
            var startDate;
            var targetEndDate;

            if (!customer) {
                value = 'Customer';
                return App.render({
                    type   : 'error',
                    message: 'Please, choose ' + value + ' first.'
                });
            } else if (!paymentMethod) {
                value = 'Bank Account in Other Info tab';
                return App.render({
                    type   : 'error',
                    message: 'Please, choose ' + value + ' first.'
                });
            }

            bonusRow.each(function () {
                var $currentEl = $(this);
                var employeeId = $currentEl.find("[data-content='employee']").attr('data-id');
                var bonusId = $currentEl.find("[data-content='bonus']").attr('data-id');
                var startDate;
                var endDate;

                if (!employeeId || !bonusId || custom === 'Select') {
                    validation = false;
                }

                startDate = $currentEl.find('.startDate input').val();
                endDate = $currentEl.find('.endDate input').val();

                bonus.push({
                    employeeId: employeeId,
                    bonusId   : bonusId,
                    startDate : startDate,
                    endDate   : endDate
                });
            });

            if (!validation) {
                return App.render({
                    type   : 'error',
                    message: 'Employee and bonus fields must not be empty.'
                });
            }

            description = $.trim(this.$el.find('#description').val());
            $userNodes = this.$el.find('#usereditDd option:selected');
            $userNodes.each(function (key, val) {
                users.push({
                    id  : val.value,
                    name: val.innerHTML
                });
            });

            $thisEl.find('.groupsAndUser tr').each(function () {
                if ($(this).data('type') === 'targetUsers') {
                    usersId.push($(this).data('id'));
                }
                if ($(this).data('type') === 'targetGroups') {
                    groupsId.push($(this).data('id'));
                }

            });
            whoCanRW = this.$el.find("[name='whoCanRW']:checked").val();
            health = this.$el.find('#health a').data('value');
            startDate = $.trim(this.$el.find('#StartDate').val());
            targetEndDate = $.trim(this.$el.find('#EndDateTarget').val());

            if (validation) {
                this.model.save({
                    name            : $.trim(this.$el.find('#projectName').val()),
                    projectShortDesc: $.trim(this.$el.find('#projectShortDesc').val()),
                    customer        : customer || '',
                    workflow        : workflow || '',
                    projecttype     : projecttype || '',
                    paymentMethod   : paymentMethod,
                    paymentTerms    : paymentTerms,
                    description     : description,
                    groups          : {
                        owner: self.$el.find('#allUsersSelect').attr('data-id') || null,
                        users: usersId,
                        group: groupsId
                    },

                    whoCanRW     : whoCanRW,
                    health       : health,
                    StartDate    : startDate,
                    TargetEndDate: targetEndDate,
                    bonus        : bonus
                }, {
                    headers: {
                        mid: mid
                    },
                    wait   : true,
                    success: function (model) {
                        self.attachView.sendToServer(null, model.changed, self);
                    },

                    error: function (model, xhr) {
                        self.errorNotification(xhr);
                    }
                });
            }
        },

        render: function () {
            var formString = this.template();
            var self = this;
            var model = new ProjectModel();
            var bonusView;
            var notDiv;
            var $thisEl;

            this.$el = $(formString).dialog({
                dialogClass: 'edit-dialog',
                width      : '500',
                title      : 'Create Project',
                buttons    : {
                    save: {
                        text : 'Create',
                        class: 'btn blue',
                        click: function () {
                            self.saveItem();
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

            notDiv = this.$el.find('.attach-container');

            $thisEl = this.$el;

            this.attachView = new AttachView({
                model      : model,
                contentType: self.contentType,
                isCreate   : true
            });
            notDiv.append(this.attachView.render().el);

            this.renderAssignees(model);

            bonusView = new BonusView({
                model: model
            });

            populate.get('#projectTypeDD', CONSTANTS.URLS.PROJECT_TYPE, {}, 'name', this, true);
            populate.get('#paymentTerms', '/paymentTerm', {}, 'name', this, true, true, CONSTANTS.PAYMENT_TERMS);
            populate.get('#paymentMethod', '/paymentMethod', {}, 'name', this, true, true, CONSTANTS.PAYMENT_METHOD);
            populate.get2name('#customerDd', CONSTANTS.URLS.CUSTOMERS, {}, this, true, true);
            populate.getWorkflow('#workflowsDd', '#workflowNamesDd', CONSTANTS.URLS.WORKFLOWS_FORDD, {id: 'Projects'}, 'name', this, true);

            $thisEl.find('#StartDate').datepicker({
                dateFormat : 'd M, yy',
                changeMonth: true,
                changeYear : true,
                onSelect   : function () {
                    var endDate = $('#StartDate').datepicker('getDate');
                    endDate.setDate(endDate.getDate());
                    $('#EndDateTarget').datepicker('option', 'minDate', endDate);
                }
            });
            $thisEl.find('#EndDateTarget').datepicker({
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
