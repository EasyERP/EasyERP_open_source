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

        initialize: function () {
            _.bindAll(this, 'saveItem', 'render');
            this.model = new LeadModel();
            this.responseObj = {};

            this.render();
        },

        events: {
            'change #workflowNames': 'changeWorkflows',
            'click .fa-paperclip'  : 'clickInput'
        },

        clickInput: function () {
            this.$el.find('.input-file .inputAttach').click();
        },

        selectCustomer: function (id) {
            if (id !== '') {
                dataService.getData(CONSTANTS.URLS.CUSTOMERS, {
                    id: id
                }, function (response, context) {
                    var customer = response;
                    if (customer.type === 'Person') {
                        context.$el.find('#first').val(customer.name.first);
                        context.$el.find('#last').val(customer.name.last);
                        context.$el.find('#email').val(customer.email);
                        context.$el.find('#phone').val(customer.phones.phone);
                        context.$el.find('#LI').val(customer.social.LI.replace('[]', 'linkedin'))

                        context.$el.find('#street').val('');
                        context.$el.find('#city').val('');
                        context.$el.find('#state').val('');
                        context.$el.find('#zip').val('');
                        context.$el.find('#country').val('');

                        context.$el.find('#company').val('');
                    } else {
                        context.$el.find('#company').val(customer.name.first);

                        context.$el.find('#first').val('');
                        context.$el.find('#last').val('');
                        context.$el.find('#email').val('');
                        context.$el.find('#phone').val('');
                        context.$el.find('#mobile').val('');
                        context.$el.find('#LI').val('');
                        context.$el.find('#street').val(customer.address.street);
                        context.$el.find('#city').val(customer.address.city);
                        context.$el.find('#state').val(customer.address.state);
                        context.$el.find('#zip').val(customer.address.zip);
                        context.$el.find('#country').val(customer.address.country);

                    }

                }, this);
            } else {
                this.$el.find('#email').val('');
                this.$el.find('#phone').val('');
                this.$el.find('#mobile').val('');
                this.$el.find('#street').val('');
                this.$el.find('#city').val('');
                this.$el.find('#state').val('');
                this.$el.find('#zip').val('');
                this.$el.find('#country').val('');
                this.$el.find('#company').val('');
                this.$el.find('#first').val('');
                this.$el.find('#last').val('');
            }

        },

        chooseOption: function (e) {
            var holder = $(e.target).parents('._modalSelect').find('.current-selected');
            holder.text($(e.target).text()).attr('data-id', $(e.target).attr('id'));
            if (holder.attr('id') === 'customerDd') {
                this.selectCustomer($(e.target).attr('id'));
            }
        },

        changeTab: function (e) {
            var n;
            var dialogHolder;
            var holder = $(e.target);

            holder.closest('.dialog-tabs').find('a.active').removeClass('active');
            holder.addClass('active');
            n = holder.parents('.dialog-tabs').find('li').index(holder.parent());
            dialogHolder = $('.dialog-tabs-items');
            dialogHolder.find('.dialog-tabs-item.active').removeClass('active');
            dialogHolder.find('.dialog-tabs-item').eq(n).addClass('active');
        },

        changeWorkflows: function () {
            var name = this.$('#workflowNames option:selected').val();
            var value = this.workflowsCollection.findWhere({name: name}).toJSON().value;
            // $('#selectWorkflow').html(_.template(selectTemplate, { workflows: this.getWorkflowValue(value) }));
        },

        saveItem: function () {
            var afterPage = '';
            var location = window.location.hash;
            var pageSplited = location.split('/p=')[1];
            var self = this;
            var mid = 24;
            var name = $.trim(this.$el.find('#name').val());
            var idCustomer = this.$el.find('#customerDd').attr('data-id');
            var address = {};
            var salesPersonId = this.$el.find('#salesPerson').attr('data-id');
            var expectedClosing = this.$el.find('#expectedClosingDate').val();
            var salesTeamId = this.$el.find('#salesTeam option:selected').val();
            var first = $.trim(this.$el.find('#first').val());
            var last = $.trim(this.$el.find('#last').val());
            var tempCompany = $.trim(this.$el.find('#company').val())
            var contactName = {
                first: first,
                last : last
            };
            var email = $.trim(this.$el.find('#email').val());
            var func = $.trim(this.$el.find('#func').val());
            var phone = $.trim(this.$el.find('#phone').val());
            var mobile = $.trim(this.$el.find('#mobile').val());

            var fax = $.trim(this.$el.find('#fax').val());
            var phones = {
                phone : phone,
                mobile: mobile,
                fax   : fax
            };
            var workflow = this.$el.find('#workflowsDd').attr('data-id');
            var priority = this.$el.find('#priorityDd').attr('data-id');
            var internalNotes = $.trim(this.$el.find('#internalNotes').val());
            var active = (this.$el.find('#active').is(':checked'));
            var optout = (this.$el.find('#optout').is(':checked'));
            var reffered = $.trim(this.$el.find('#reffered').val());
            var skype = $.trim(this.$el.find('#skype').val());
            var LI = $.trim(this.$el.find('#LI').val());
            var FB = $.trim(this.$el.find('#FB').val());

            var source = this.$el.find('#sourceDd').attr('data-id');

            var usersId = [];
            var groupsId = [];
            var notes = [];
            var note;

            var whoCanRW = this.$el.find("[name='whoCanRW']:checked").val();
            if (internalNotes) {
                note = {
                    title: '',
                    note : internalNotes
                };
                notes.push(note);
            }

            if (pageSplited) {
                afterPage = pageSplited.split('/')[1];
                location = location.split('/p=')[0] + '/p=1' + '/' + afterPage;
            }
            this.$el.find('._modalSelect').find('.address').each(function () {
                var el = $(this);
                address[el.attr('name')] = $.trim(el.val());
            });
            this.$el.find('.groupsAndUser tr').each(function () {
                if ($(this).data('type') === 'targetUsers') {
                    usersId.push($(this).attr('data-id'));
                }
                if ($(this).data('type') === 'targetGroups') {
                    groupsId.push($(this).attr('data-id'));
                }

            });
            this.model.save({
                name            : name,
                skype           : skype,
                social          : {
                    LI: LI.replace('linkedin', '[]'),
                    FB: FB
                },
                tempCompanyField: tempCompany,
                campaign        : $('#campaignDd').attr('data-id'),
                source          : source,
                customer        : idCustomer || null,
                address         : address,
                salesPerson     : salesPersonId || null,
                expectedClosing : expectedClosing,
                salesTeam       : salesTeamId,
                contactName     : contactName,
                email           : email,
                func            : func,
                phones          : phones,
                fax             : fax,
                priority        : priority,
                notes           : notes,
                active          : active,
                optout          : optout,
                reffered        : reffered,
                workflow        : workflow,
                groups          : {
                    owner: self.$el.find('#allUsersSelect').attr('data-id') || null,
                    users: usersId,
                    group: groupsId
                },

                whoCanRW: whoCanRW
            }, {
                headers: {
                    mid: mid
                },

                success: function (model) {
                    var currentModel = model.changed;

                    self.attachView.sendToServer(null, currentModel);
                    /*self.hideDialog();
                     Backbone.history.fragment = '';
                     Backbone.history.navigate(location, {trigger: true});*/
                    // Backbone.history.navigate('easyErp/users', { trigger: true });
                },

                error: function (model, xhr) {
                    self.errorNotification(xhr);
                }

            });
        },

        render: function () {
            var self = this;
            var formString = this.template();
            var notDiv;

            this.$el = $(formString).dialog({
                closeOnEscape: false,
                autoOpen     : true,
                resizable    : true,
                dialogClass  : 'edit-dialog',
                title        : 'Edit Company',
                width        : '1000',
                buttons      : [
                    {
                        text : 'Create',
                        click: function () {
                            self.saveItem();
                        }
                    },

                    {
                        text : 'Cancel',
                        click: function () {
                            self.hideDialog();
                        }
                    }
                ]

            });

            this.renderAssignees(this.model);

            notDiv = this.$el.find('.attach-container');

            this.attachView = new AttachView({
                model      : this.model,
                contentType: self.contentType,
                isCreate   : true
            });
            notDiv.append(this.attachView.render().el);

            dataService.getData('/leads/priority', {}, function (priorities) {
                priorities = _.map(priorities.data, function (priority) {
                    priority.name = priority.priority;

                    return priority;
                });
                self.responseObj['#priorityDd'] = priorities;
            });
            populate.getWorkflow('#workflowsDd', '#workflowNamesDd', CONSTANTS.URLS.WORKFLOWS_FORDD, {id: 'Leads'}, 'name', this, true);
            populate.get2name('#customerDd', CONSTANTS.URLS.CUSTOMERS, {}, this, true, true);
            populate.get('#sourceDd', '/employees/sources', {}, 'name', this, true, true);
            populate.get('#campaignDd', '/Campaigns', {}, 'name', this, true, true);
            dataService.getData('/employees/getForDD', {isEmployee: true}, function (employees) {
                employees = _.map(employees.data, function (employee) {
                    employee.name = employee.name.first + ' ' + employee.name.last;

                    return employee;
                });

                self.responseObj['#salesPerson'] = employees;
            });
            this.$el.find('#expectedClosingDate').datepicker({
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
