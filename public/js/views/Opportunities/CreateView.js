define([
    'Backbone',
    'Underscore',
    'jQuery',
    'views/dialogViewBase',
    'text!templates/Opportunities/CreateTemplate.html',
    'models/OpportunitiesModel',
    'common',
    'populate',
    'dataService',
    'views/Notes/AttachView',
    'constants'
], function (Backbone, _, $, ParentView, CreateTemplate, OpportunityModel, common, populate, dataService, AttachView, CONSTANTS) {
    var CreateView = ParentView.extend({
        el         : '#content-holder',
        contentType: 'Opportunities',
        template   : _.template(CreateTemplate),

        initialize: function (options) {
            options = options || {};

            _.bindAll(this, 'saveItem');

            this.parentModel = options.parentModel;
            this.responseObj = {};
            this.elementId = options.elementId || null;

            this.render();
        },
        events    : {
            'click .icon-attach': 'clickInput'
        },

        clickInput: function () {
            this.$el.find('.input-file .inputAttach').click();
        },

        chooseOption: function (e) {
            var $target = $(e.target);
            var holder = $target.parents('._newSelectListWrap').find('.current-selected');

            holder.text($target.text()).attr('data-id', $target.attr('id'));
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

        saveItem: function () {
            var mid = 25;
            var opportunityModel = new OpportunityModel();
            var $thisEl = this.$el;
            var name = $.trim($thisEl.find('#name').val());
            var expectedRevenueValue = $.trim($thisEl.find('#expectedRevenueValue').val()) || '0';
            var expectedRevenue;
            var companyId = $thisEl.find('#companyDd').attr('data-id');
            var customerId = $thisEl.find('#customerDd').attr('data-id');
            var salesPersonId = $thisEl.find('#salesPersonDd').attr('data-id');
            var expectedClosing = $.trim($thisEl.find('#expectedClosing').val());
            var priority = $.trim($thisEl.find('#priorityDd').text());
            var internalNotes = $.trim($thisEl.find('#internalNotes').val());
            var address = {};
            var workflow = $thisEl.find('#workflowDd').data('id');
            var self = this;
            var usersId = [];
            var groupsId = [];
            var whoCanRW = $thisEl.find("[name='whoCanRW']:checked").val();

            $('dd').find('.address').each(function () {
                var el = $(this);

                address[el.attr('name')] = el.val();
            });

            $('.groupsAndUser tr').each(function () {
                if ($(this).data('type') === 'targetUsers') {
                    usersId.push($(this).data('id'));
                }
                if ($(this).data('type') === 'targetGroups') {
                    groupsId.push($(this).data('id'));
                }

            });

            if (expectedRevenueValue) {
                expectedRevenue = {
                    value   : expectedRevenueValue,
                    currency: '$'
                };
            }

            opportunityModel.save(
                {
                    name           : name,
                    expectedRevenue: expectedRevenue,
                    customer       : customerId || null,
                    salesPerson    : salesPersonId || null,
                    expectedClosing: expectedClosing,
                    priority       : priority,
                    company        : companyId,
                    workflow       : workflow,
                    internalNotes  : internalNotes,
                    address        : address,
                    whoCanRW       : whoCanRW,
                    groups         : {
                        owner: self.$el.find('#allUsersSelect').attr('data-id') || null,
                        users: usersId,
                        group: groupsId
                    }
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
                }
            );
        },

        render: function () {
            var parentModel = this.parentModel ? this.parentModel.toJSON() : '';
            var formString = this.template({parentModel: parentModel});
            var self = this;
            var notDiv;
            var model = new OpportunityModel();

            this.$el = $(formString).dialog({
                dialogClass: 'edit-dialog',
                width      : '500px',
                title      : 'Create Opportunity',
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

            notDiv = this.$el.find('.attach-container');

            this.attachView = new AttachView({
                model      : model,
                contentType: self.contentType,
                isCreate   : true
            });

            notDiv.append(this.attachView.render().el);
            /* this.renderAssignees(model);*/

            this.$el.find('#expectedClosing').datepicker({dateFormat: 'd M, yy', minDate: new Date()});
            dataService.getData('/opportunities/priority', {}, function (priorities) {
                priorities = _.map(priorities.data, function (priority) {
                    priority.name = priority.priority;

                    return priority;
                });
                self.responseObj['#priorityDd'] = priorities;
            });
            populate.get2name('#customerDd', CONSTANTS.URLS.CUSTOMERS, {type: 'Person'}, this);
            populate.get2name('#companyDd', CONSTANTS.URLS.CUSTOMERS, {type: 'Company'}, this);
            dataService.getData('/employees/getForDD', {isEmployee: true}, function (employees) {
                employees = _.map(employees.data, function (employee) {
                    employee.name = employee.name.first + ' ' + employee.name.last;

                    return employee;
                });

                self.responseObj['#salesPersonDd'] = employees;
            });

            populate.getWorkflow('#workflowDd', '#workflowNamesDd', CONSTANTS.URLS.WORKFLOWS_FORDD, {id: 'Opportunities'}, 'name', this, true);
            populate.get('#salesTeamDd', CONSTANTS.URLS.DEPARTMENTS_FORDD, {}, 'name', this, true, true);
            populate.get('#sourceDd', '/employees/sources', {}, 'name', this);

            this.delegateEvents(this.events);
            return this;
        }

    });

    return CreateView;
});
