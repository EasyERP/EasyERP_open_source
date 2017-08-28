define([
    'Backbone',
    'jQuery',
    'Underscore',
    'text!templates/Leads/EditTemplate.html',
    'text!templates/history.html',
    'views/dialogViewBase',
    'views/Notes/NoteView',
    'custom',
    'common',
    'dataService',
    'populate',
    'constants'
], function (Backbone, $, _, EditTemplate, historyTemplate, ParentView, noteView, Custom, common, dataService, populate, CONSTANTS) {

    var EditView = ParentView.extend({
        el             : '#content-holder',
        contentType    : 'Leads',
        template       : _.template(EditTemplate),
        historyTemplate: _.template(historyTemplate),

        initialize: function (options) {
            _.bindAll(this, 'render', 'saveItem');
            _.bindAll(this, 'render', 'deleteItem');
            this.currentModel = options.model || options.collection.getElement();
            this.currentModel.urlRoot = '/Leads';
            this.responseObj = {};

            this.render();
        },

        events: {
            'click #convertToOpportunity'             : 'openDialog',
            'click .breadcrumb a, #cancelCase, #reset': 'changeWorkflow',
            'change #customer'                        : 'selectCustomer',
            'change #workflowNames'                   : 'changeWorkflows'
        },

        openDialog: function (e) {
            e.preventDefault();
            $('#convert-dialog-form').dialog('open');
        },

        getWorkflowValue: function (value) {
            var workflows = [];
            var i;

            for (i = 0; i < value.length; i++) {
                workflows.push({name: value[i].name, status: value[i].status});
            }
            return workflows;
        },

        saveItem: function () {
            var mid = 39;
            var self = this;
            var name = $.trim(this.$el.find('#name').val());
            var company = $.trim(this.$el.find('#company').val());
            var idCustomer = $('#customerDd').attr('data-id');
            var currentCustomer = this.currentModel.get('customer');
            var address = {};
            var salesPersonId = this.$('#salesPerson').data('id');
            var currentSalesPerson = this.currentModel.get('salesPerson');
            var salesTeamId = this.$('#salesTeam option:selected').val();
            var currentSalesTeam = this.currentModel.get('salesTeam');
            var first = $.trim(this.$el.find('#first').val());
            var last = $.trim(this.$el.find('#last').val());
            var contactName = {
                first: first,
                last : last
            };
            var email = $.trim(this.$el.find('#email_person').val());
            var phone = $.trim(this.$el.find('#phone').val());
            var mobile = $.trim(this.$el.find('#mobile').val());
            var fax = $.trim(this.$el.find('#fax').val());
            var phones = {
                phone : phone,
                mobile: mobile,
                fax   : fax
            };
            var currentWorkflow = this.currentModel.get('workflow');
            var workflow = this.$('#workflowsDd').data('id');
            var priority = this.$el.find('#priorityDd').attr('data-id');
            var skype = $.trim(this.$el.find('#skype').val());
            var LI = $.trim(this.$el.find('#LI').val());
            var FB = $.trim(this.$el.find('#FB').val());

            var internalNotes = $.trim($('#internalNotes').val());

            var active;
            var optout;
            var reffered = $.trim($('#reffered').val());
            var usersId = [];
            var groupsId = [];
            var whoCanRW = this.$el.find("[name='whoCanRW']:checked").val();
            var data = {
                name : name,
                skype: skype,

                social: {
                    LI: this.currentModel.changed['social.LI'] || LI,
                    FB: this.currentModel.changed['social.FB'] || FB
                },

                company      : company,
                campaign     : this.$el.find('#campaignDd').data('id'),
                source       : this.$el.find('#sourceDd').data('id'),
                address      : address,
                contactName  : contactName,
                email        : email,
                phones       : phones,
                fax          : fax,
                priority     : priority,
                internalNotes: internalNotes,
                reffered     : reffered,
                groups       : {
                    owner: this.$el.find('#allUsersSelect').attr('data-id') || null,
                    users: usersId,
                    group: groupsId
                },

                whoCanRW: whoCanRW
            };

            if ($('#active').is(':checked')) {
                active = true;
            } else {
                active = false;
            }

            if ($('#optout').is(':checked')) {
                optout = true;
            } else {
                optout = false;
            }

            $('.groupsAndUser tr').each(function () {
                if ($(this).data('type') === 'targetUsers') {
                    usersId.push($(this).data('id'));
                }
                if ($(this).data('type') === 'targetGroups') {
                    groupsId.push($(this).data('id'));
                }

            });

            $('dd').find('.address').each(function () {
                var el = $(this);
                address[el.attr('name')] = $.trim(el.val());
            });

            if (currentWorkflow && currentWorkflow._id && workflow && (currentWorkflow._id !== workflow)) {
                data.workflow = workflow;
            }
            if (currentCustomer && currentCustomer._id && idCustomer && (currentCustomer._id !== idCustomer)) {
                data.customer = idCustomer;
            } else if (!currentCustomer && idCustomer) {
                data.customer = idCustomer;
            }
            if (currentSalesPerson && currentSalesPerson._id && salesPersonId && (currentSalesPerson._id !== salesPersonId)) {
                data.salesPerson = salesPersonId;
            } else if (!currentSalesPerson && salesPersonId) {
                data.salesPerson = salesPersonId;
            }
            if (currentSalesTeam && currentSalesTeam._id && salesTeamId && (currentSalesTeam._id !== salesTeamId)) {
                data.salesTeam = salesTeamId;
            } else if (!currentSalesTeam && salesTeamId) {
                data.salesTeam = salesTeamId;
            }
            this.currentModel.set(data);
            this.currentModel.save(this.currentModel.changed, {
                headers: {
                    mid: mid
                },
                patch  : true,
                success: function () {
                    self.hideDialog();
                    Backbone.history.navigate('easyErp/Leads', {trigger: true});
                },

                error: function (model, xhr) {
                    self.errorNotification(xhr);
                }

            });
        },

        deleteItem: function (event) {
            var mid = 39;
            var self = this;
            var answer;

            event.preventDefault();
            answer = confirm('Really DELETE items ?!');
            if (answer) {
                this.currentModel.urlRoot = '/Leads';
                this.currentModel.destroy({
                    headers: {
                        mid: mid
                    },
                    success: function () {
                        Backbone.history.navigate('easyErp/' + self.contentType, {trigger: true});
                    },

                    error: function (model, xhr) {
                        self.errorNotification(xhr);
                    }
                });
            }
        },

        chooseOption: function (e) {
            var holder = $(e.target).parents('dd').find('.current-selected');

            holder.text($(e.target).text()).attr('data-id', $(e.target).attr('id'));
            if (holder.attr('id') === 'customerDd') {
                this.selectCustomer($(e.target).attr('id'));
            }
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

                        context.$el.find('#company').val('');
                    } else {
                        context.$el.find('#company').val(customer.name.first);

                        context.$el.find('#first').val('');
                        context.$el.find('#last').val('');

                    }
                    context.$el.find('#email').val(customer.email);
                    context.$el.find('#phone').val(customer.phones.phone);
                    context.$el.find('#mobile').val(customer.phones.mobile);
                    context.$el.find('#street').val(customer.address.street);
                    context.$el.find('#city').val(customer.address.city);
                    context.$el.find('#state').val(customer.address.state);
                    context.$el.find('#zip').val(customer.address.zip);
                    context.$el.find('#country').attr('data-id', customer.address.country);
                    context.$el.find('#country').text(customer.address.country);
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

        renderHistory: function () {
            var self = this;
            var historyString;

            historyString = self.historyTemplate({history: self.model.get('history')});
            self.$el.find('.history-container').html(historyString);
        },

        render: function () {
            var formString = this.template({
                model: this.currentModel.toJSON()
            });
            var self = this;
            var model = this.currentModel.toJSON();
            var notDiv;

            var that = this; // DO NOT confuse with "self" below! it's other context!

            this.$el = $(formString).dialog({
                dialogClass: 'edit-dialog',
                width      : 800,
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

            self.renderHistory();

            this.renderAssignees(this.currentModel);

            notDiv = this.$el.find('.attach-container');

            notDiv.append(
                new noteView({
                    model      : this.currentModel,
                    contentType: 'Leads'
                }).render().el
            );

            dataService.getData('/leads/priority', {}, function (priorities) {
                priorities = _.map(priorities.data, function (priority) {
                    priority.name = priority.priority;

                    return priority;
                });
                self.responseObj['#priorityDd'] = priorities;
            });
            populate.getWorkflow('#workflowsDd', '#workflowNamesDd', CONSTANTS.URLS.WORKFLOWS_FORDD, {id: 'Leads'}, 'name', this, null);
            populate.get2name('#customerDd', CONSTANTS.URLS.CUSTOMERS, {}, this, null, true);
            populate.get('#country', CONSTANTS.URLS.COUNTRIES, {}, 'name', true, true);
            dataService.getData('/employees/getForDD', {isEmployee: true}, function (employees) {
                employees = _.map(employees.data, function (employee) {
                    employee.name = employee.name.first + ' ' + employee.name.last;

                    return employee;
                });

                self.responseObj['#salesPerson'] = employees;
            });
            populate.get('#campaignDd', '/Campaigns', {}, 'name', this);
            populate.get('#sourceDd', '/employees/sources', {}, 'name', this);

            this.delegateEvents(this.events);

            $('#convert-dialog-form').dialog({
                autoOpen: false,
                height  : 150,
                width   : 350,
                modal   : true,
                title   : 'Convert to opportunity',
                buttons : {
                    'Create opportunity': function () {
                        var self = this;
                        var createCustomer = ($('select#createCustomerOrNot option:selected').val()) ? true : false;
                        that.currentModel.set({
                            salesPerson    : $('a#salesPerson').attr('data-id') || '',
                            isOpportunitie : true,
                            isConverted    : true,
                            convertedDate  : new Date(),
                            createCustomer : createCustomer,
                            expectedRevenue: {
                                currency: null,
                                progress: 0,
                                value   : 0
                            }
                        });
                        that.currentModel.save(that.currentModel.changed, {
                            validate: false,
                            headers : {
                                mid: 24
                            },

                            patch: true,

                            success: function () {
                                $(self).dialog('close');
                                // that.opportunitiesCollection.add(model);
                                Backbone.history.navigate('easyErp/Opportunities', {trigger: true});
                            },

                            error: function (model, xhr) {
                                that.errorNotification(xhr);
                            }

                        });

                    },

                    Cancel: function () {
                        $(this).dialog('close');
                    }
                },

                close: function () {
                    $(this).dialog('close');
                }
            }, this);
            /*
             if (model.groups) {
             if (model.groups.users.length > 0 || model.groups.group.length) {
             $('.groupsAndUser').show();
             model.groups.group.forEach(function (item) {
             $('.groupsAndUser').append("<tr data-type='targetGroups' data-id='" + item._id + "'><td>" + item.name + "</td><td class='text-right'></td></tr>");
             $('#targetGroups').append("<li id='" + item._id + "'>" + item.name + '</li>');
             });
             model.groups.users.forEach(function (item) {
             $('.groupsAndUser').append("<tr data-type='targetUsers' data-id='" + item._id + "'><td>" + item.login + "</td><td class='text-right'></td></tr>");
             $('#targetUsers').append("<li id='" + item._id + "'>" + item.login + '</li>');
             });

             }
             }*/
            return this;
        }

    });

    return EditView;
});
