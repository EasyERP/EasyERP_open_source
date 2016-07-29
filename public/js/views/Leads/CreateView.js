define([
    'Backbone',
    'jQuery',
    'Underscore',
    'text!templates/Leads/CreateTemplate.html',
    'views/dialogViewBase',
    'models/LeadsModel',
    'common',
    'populate',
    'dataService',
    'views/Notes/AttachView',
    'constants'
], function (Backbone, $, _, CreateTemplate, ParentView, LeadModel, common, populate, dataService, AttachView, CONSTANTS) {

    var CreateView = ParentView.extend({
        el         : '#content-holder',
        contentType: 'Leads',
        template   : _.template(CreateTemplate),

        initialize: function (options) {
            options = options || {};

            _.bindAll(this, 'saveItem');
            this.responseObj = {};

            this.render();
        },
        events    : {
            'click .fa-paperclip': 'clickInput'
        },

        clickInput: function () {
            this.$el.find('.input-file .inputAttach').click();
        },

        chooseOption: function (e) {
            var $target = $(e.target);
            var holder = $target.parents('._modalSelect').find('.current-selected');

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
            var leadModel = new LeadModel();
            var $thisEl = this.$el;
            var name = $.trim($thisEl.find('#name').val());
            var companyId = $thisEl.find('#companyDd').attr('data-id');
            var customerId = $thisEl.find('#customerDd').attr('data-id');
            var salesPersonId =$thisEl.find('#salesPersonDd').attr('data-id');
            var salesTeamId = $thisEl.find('#salesTeamDd').attr('data-id');
            var nextActionDesc = $.trim($thisEl.find('#nextActionDescription').val());
            var nextAction = {
                desc: nextActionDesc
            };
            var expectedClosing = $.trim($thisEl.find('#expectedClosing').val());
            var priority = $.trim($thisEl.find('#priorityDd').text());
            var internalNotes = $.trim($thisEl.find('#internalNotes').val());
            var source = $('#sourceDd').data('id');
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

            leadModel.save(
                {
                    name           : name,
                    customer       : customerId || null,
                    salesTeam      : salesTeamId || null,
                    salesPerson    : salesPersonId || null,
                    nextAction     : nextAction,
                    source         : source,
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
            var formString = this.template();
            var self = this;
            var notDiv;
            var model = new LeadModel();

            this.$el = $(formString).dialog({
                closeOnEscape: false,
                dialogClass  : 'edit-dialog',
                width        : '450px',
                title        : 'Create Lead',
                buttons      : {
                    save: {
                        text : 'Create',
                        class: 'btn btnRounded btnSave',
                        click: self.saveItem
                    },

                    cancel: {
                        text : 'Cancel',
                        class: 'btn btnRounded',
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

            $('#expectedClosing').datepicker({dateFormat: 'd M, yy', minDate: new Date()});
            populate.get2name('#customerDd', CONSTANTS.URLS.CUSTOMERS, {type : 'Person'}, this, true, true);
            populate.get2name('#companyDd', CONSTANTS.URLS.CUSTOMERS, {type : 'Company'}, this, true, true);
            populate.get('#sourceDd', '/employees/sources', {}, 'name', this, true, true);
            dataService.getData('/employees/getForDD', {isEmployee: true}, function (employees) {
                employees = _.map(employees.data, function (employee) {
                    employee.name = employee.name.first + ' ' + employee.name.last;

                    return employee;
                });

                self.responseObj['#salesPersonDd'] = employees;
            });

            populate.getWorkflow('#workflowDd', '#workflowNamesDd', CONSTANTS.URLS.WORKFLOWS_FORDD, {id: 'Leads'}, 'name', this, true);
            populate.get('#salesTeamDd', CONSTANTS.URLS.DEPARTMENTS_FORDD, {}, 'name', this, true, true);
            populate.get('#sourceDd', '/employees/sources', {}, 'name', this);

            this.delegateEvents(this.events);

            return this;
        }

    });
    return CreateView;
});
