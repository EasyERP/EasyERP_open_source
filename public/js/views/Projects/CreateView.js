define([
    'Backbone',
    'jQuery',
    'Underscore',
    'views/dialogViewBase',
    'text!templates/Projects/CreateTemplate.html',
    'models/ProjectsModel',
    'views/Notes/AttachView',
    'views/Bonus/BonusView',
    'populate',
    'custom',
    'constants'
], function (Backbone, $, _, ParentView, CreateTemplate, ProjectModel, AttachView, BonusView, populate, customFile, CONSTANTS) {

    var CreateView = ParentView.extend({
        el         : '#content-holder',
        contentType: 'Projects',
        template   : _.template(CreateTemplate),

        initialize: function () {
            _.bindAll(this, 'saveItem');
            this.model = new ProjectModel();
            this.responseObj = {};
            this.render();
        },

        events: {
            'click #workflowNamesDd' : 'chooseUser',
            'submit form'            : 'formSubmitHandler',
            'click #health a'        : 'showHealthDd',
            'click #health ul li div': 'chooseHealthDd'
        },

        chooseOption: function (e) {
            $(e.target).parents('dd').find('.current-selected').text($(e.target).text()).attr('data-id', $(e.target).attr('id'));
            this.hideHealth();
        },

        chooseHealthDd: function (e) {
            $(e.target).parents('#health').find('a').attr('class', $(e.target).attr('class')).attr('data-value', $(e.target).attr('class').replace('health', '')).parent().find('ul').toggle();
        },

        showHealthDd: function (e) {
            $(e.target).parent().find('ul').toggle();
            return false;
        },

        formSubmitHandler: function (event) {
            event.preventDefault();
        },

        saveItem: function () {
            var self = this;
            var value;
            var mid = 39;
            var validation = true;
            var custom = this.$el.find('#customerDd').text();

            var customer = this.$el.find('#customerDd').attr('data-id');
            var projecttype = this.$el.find('#projectTypeDD').data('id');
            var workflow = this.$el.find('#workflowsDd').data('id');
            var paymentMethod = this.$el.find('#paymentMethod').data('id');
            var paymentTerms = this.$el.find('#paymentTerms').data('id');
            var description;
            var $userNodes;
            var users = [];
            var bonusContainer = $('#bonusTable');
            var bonusRow = bonusContainer.find('tr');
            var bonus = [];
            var usersId = [];
            var groupsId = [];
            var whoCanRW;
            var health;
            var startDate;
            var targetEndDate;

            if (custom === 'Select') {
                value = 'Customer';
                return App.render({
                    type   : 'error',
                    message: 'Please, choose ' + value + ' first.'
                });
            }

            bonusRow.each(function (key, val) {
                var employeeId = $(val).find("[data-content='employee']").attr('data-id');
                var bonusId = $(val).find("[data-content='bonus']").attr('data-id');
                var startDate;
                var endDate;

                if (!employeeId || !bonusId || custom === 'Select') {
                    validation = false;
                }

                startDate = $(val).find('.startDate input').val();
                endDate = $(val).find('.endDate input').val();

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

            $('.groupsAndUser tr').each(function () {
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
                        owner: $('#allUsersSelect').data('id'),
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

                        customFile.getFiltersValues(true); // added for refreshing filters after creating

                        self.attachView.sendToServer(null, model.changed);
                    },

                    error: function (model, xhr) {
                        self.errorNotification(xhr);
                    }
                });
            }
        },

        render: function () {
            var notDiv;
            var formString = this.template();
            var self = this;
            var model = new ProjectModel();

            this.$el = $(formString).dialog({
                closeOnEscape: false,
                dialogClass  : 'edit-dialog',
                width        : '900',
                title        : 'Create Project',
                buttons      : {
                    save: {
                        text : 'Create',
                        class: 'btn',
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
            this.attachView = new AttachView({
                model   : model,
                url     : '/uploadProjectsFiles',
                isCreate: true
            });
            notDiv.append(this.attachView.render().el);

            this.renderAssignees(model);

            new BonusView({
                model: model
            });

            populate.get('#projectTypeDD', CONSTANTS.URLS.PROJECT_TYPE, {}, 'name', this, true, true);
            populate.get('#paymentTerms', '/paymentTerm', {}, 'name', this, true, true, CONSTANTS.PAYMENT_TERMS);
            populate.get('#paymentMethod', '/paymentMethod', {}, 'name', this, true, true, CONSTANTS.PAYMENT_METHOD);
            populate.get2name('#customerDd', CONSTANTS.URLS.CUSTOMERS, {}, this, true, true);
            populate.getWorkflow('#workflowsDd', '#workflowNamesDd', CONSTANTS.URLS.WORKFLOWS_FORDD, {id: 'Projects'}, 'name', this, true);

            $('#StartDate').datepicker({
                dateFormat : 'd M, yy',
                changeMonth: true,
                changeYear : true,
                onSelect   : function () {
                    var endDate = $('#StartDate').datepicker('getDate');
                    endDate.setDate(endDate.getDate());
                    $('#EndDateTarget').datepicker('option', 'minDate', endDate);
                }
            });
            $('#EndDateTarget').datepicker({
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
