define([
    'Backbone',
    'jQuery',
    'Underscore',
    'views/dialogViewBase',
    'text!templates/Opportunities/EditTemplate.html',
    'text!templates/Opportunities/editSelectTemplate.html',
    'text!templates/history.html',
    'views/Notes/NoteView',
    'views/Tags/TagView',
    'common',
    'custom',
    'populate',
    'dataService',
    'constants',
    'helpers'
], function (Backbone,
             $,
             _,
             ParentView,
             EditTemplate,
             editSelectTemplate,
             historyTemplate,
             noteView,
             TagView,
             common,
             custom,
             populate,
             dataService,
             CONSTANTS,
             helpers) {
    'use strict';

    var EditView = ParentView.extend({
        el             : '#content-holder',
        contentType    : 'Opportunities',
        template       : _.template(EditTemplate),
        historyTemplate: _.template(historyTemplate),

        events: {
            'click .breadcrumb a, #lost, #won': 'changeWorkflow'
        },

        initialize: function (options) {
            options = options || {};

            _.bindAll(this, 'render', 'saveItem', 'deleteItem');
            this.currentModel = options.model;
            this.currentModel.on('change:tags', this.renderTags, this);
            this.currentModel.urlRoot = CONSTANTS.URLS.OPPORTUNITIES;
            this.responseObj = {};
            this.elementId = options.elementId || null;

            this.render();
        },

        chooseOption: function (e) {
            var $target = $(e.target);
            var holder = $target.parents('dd').find('.current-selected');

            holder.text($target.text()).attr('data-id', $target.attr('id'));

            if (holder.attr('id') === 'customerDd') {
                this.selectCustomer($target.attr('id'));
            }
        },

        changeTab: function (e) {
            var holder = $(e.target);
            var n;
            var dialogHolder;

            holder.closest('.dialog-tabs').find('a.active').removeClass('active');
            holder.addClass('active');
            n = holder.parents('.dialog-tabs').find('li').index(holder.parent());
            dialogHolder = this.$el.find('.dialog-tabs-items');
            dialogHolder.find('.dialog-tabs-item.active').removeClass('active');
            dialogHolder.find('.dialog-tabs-item').eq(n).addClass('active');
        },

        getWorkflowValue: function (value) {
            var workflows = [];
            var i;
            var max;

            for (i = 0, max = value.length; i < max; i++) {
                workflows.push({name: value[i].name, status: value[i].status});
            }

            return workflows;
        },

        selectCustomer: function (id) {
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

        },

        saveItem: function () {
            var self = this;
            var mid = 39;
            var name = $.trim(this.$el.find('#name').val());
            var viewType = custom.getCurrentVT();
            var expectedRevenueValue = $.trim(this.$el.find('#expectedRevenueValue').val());
            var expectedRevenueProgress = $.trim(this.$el.find('#expectedRevenueProgress').val());
            var expectedRevenue;
            var customerId = this.$el.find('#customerDd').data('id') || null;
            var email = $.trim(this.$el.find('#email').val());
            var salesPersonId = this.$el.find('#salesPersonDd').data('id') || null;
            var currentSalesPerson = this.currentModel.get('salesPerson');
            var nextActionDate = $.trim(this.$el.find('#nextActionDate').val());
            var nextActionDescription = $.trim(this.$el.find('#nextActionDescription').val());
            var nextAction = {
                date: nextActionDate,
                desc: nextActionDescription
            };
            var expectedClosing = $.trim(this.$el.find('#expectedClosing').val());
            var priority = this.$el.find('#priorityDd').text();
            /*    var internalNotes = $.trim(this.$el.find('#internalNotes').val());*/
            var address = {};
            var first = $.trim(this.$el.find('#first').val());
            var last = $.trim(this.$el.find('#last').val());
            var contactName = {
                first: first,
                last : last
            };
            var func = $.trim(this.$el.find('#func').val());
            var phone = $.trim(this.$el.find('#phone').val());
            var mobile = $.trim(this.$el.find('#mobile').val());
            var fax = $.trim(this.$el.find('#fax').val());
            var phones = {
                phone : phone,
                mobile: mobile,
                fax   : fax
            };
            var workflow = this.$el.find('#workflowDd').data('id') || null;
            var active = $('#active').is(':checked');
            var optout = $('#optout').is(':checked');
            var reffered = $.trim(this.$el.find('#reffered').val());
            var usersId = [];
            var groupsId = [];
            var whoCanRW = this.$el.find('[name="whoCanRW"]:checked').val();
            var data;
            var currentWorkflow = this.currentModel.get('workflow');
            var source = this.$el.find('#sourceDd').data('id');
            this.$el.find('dd .address').each(function () {
                var el = $(this);

                address[el.attr('name')] = el.val();
            });
            var objectTags = this.currentModel.get('tags');
            var tags = objectTags.map(function (elem) {
                return elem._id;
            });

            this.$el.find('.groupsAndUser tr').each(function () {
                if ($(this).data('type') === 'targetUsers') {
                    usersId.push($(this).data('id'));
                }
                if ($(this).data('type') === 'targetGroups') {
                    groupsId.push($(this).data('id'));
                }

            });

            data = {
                name           : name,
                customer       : customerId,
                email          : email,
                nextAction     : nextAction,
                expectedClosing: expectedClosing,
                priority       : priority,
                /*  internalNotes  : internalNotes,*/
                address        : address,
                contactName    : contactName,
                func           : func,
                phones         : phones,
                active         : active,
                optout         : optout,
                reffered       : reffered,
                source         : source,
                whoCanRW       : whoCanRW,
                groups         : {
                    owner: this.$el.find('#allUsersSelect').attr('data-id') || null,
                    users: usersId,
                    group: groupsId
                }
            };

            if (expectedRevenueValue !== (this.currentModel.get('expectedRevenue')).value.toString()) {
                expectedRevenue = {
                    value   : expectedRevenueValue,
                    currency: '$',
                    progress: expectedRevenueProgress
                };
            }

            if (expectedRevenue) {
                data.expectedRevenue = expectedRevenue;
            }

            if (currentWorkflow && currentWorkflow._id && (currentWorkflow._id !== workflow)) {
                data.workflow = workflow;
                data.sequence = -1;
                data.sequenceStart = this.currentModel.toJSON().sequence;
                data.workflowStart = currentWorkflow._id;
            }

            if (currentSalesPerson && currentSalesPerson._id && salesPersonId && (currentSalesPerson._id !== salesPersonId)) {
                data.salesPerson = salesPersonId;
            } else if (!currentSalesPerson && salesPersonId) {
                data.salesPerson = salesPersonId;
            }

            this.currentModel.set(data);
            this.currentModel.changed.tags = tags;
            this.currentModel.save(this.currentModel.changed, {
                headers: {
                    mid: mid
                },
                patch  : true,
                success: function (model, result) {
                    var editHolder;
                    var trHolder;
                    var kanbanHolder;
                    var kanbanHolderOpportunityLeft;
                    var columnDataWorkflow;
                    var expectedRevenueHolder;
                    var counter;
                    var holder;

                    model = model.toJSON();
                    result = result.result;

                    switch (viewType) {
                        case 'list':
                            trHolder = $("tr[data-id='" + model._id + "'] td");
                            trHolder.parent().attr('class', 'stage-' + self.$('#workflowDd').text().toLowerCase());
                            trHolder.eq(3).text(name);
                            trHolder.eq(4).text(parseInt(expectedRevenueValue, 10));
                            if (customerId) {
                                trHolder.eq(5).text(self.$('#customerDd').text());
                            } else {
                                trHolder.eq(5).text('');
                            }
                            trHolder.eq(6).text(nextAction.date);
                            trHolder.eq(7).text(nextAction.desc);
                            trHolder.eq(8).find('a').text(self.$('#workflowDd').text());
                            if (salesPersonId) {
                                trHolder.eq(9).text(self.$('#salesPersonDd').text());
                            } else {
                                trHolder.eq(9).text('');
                            }
                            Backbone.history.fragment = '';
                            Backbone.history.navigate(window.location.hash.replace('#', ''), {trigger: true});

                            break;
                        case 'kanban':
                            kanbanHolder = $('#' + model._id);
                            expectedRevenueHolder = kanbanHolder.find('.opportunity-header h3');
                            kanbanHolder.find('.opportunity-header h4').text(name);
                            kanbanHolderOpportunityLeft = kanbanHolder.find('.opportunity-content p.left');
                            columnDataWorkflow = $(".column[data-id='" + data.workflow + "']");

                            if (parseFloat(expectedRevenueValue) !== 0) {
                                expectedRevenueHolder.text(helpers.currencySplitter(expectedRevenueValue));
                                expectedRevenueHolder.addClass('dollar');
                            } else {
                                expectedRevenueHolder.text('');
                                expectedRevenueHolder.removeClass('dollar');
                            }

                            kanbanHolder.find('.tags').empty();
                            if (objectTags.length) {
                                objectTags.forEach(function (elem) {
                                    kanbanHolder.find('.tags').append('<span class="left" data-id="' + elem._id + '" data-color="' + elem.color + '">' + elem.name + '</span>')
                                });
                            }
                            kanbanHolder.find('.opportunity-content p.right').text(nextAction.date);

                            if (customerId) {
                                kanbanHolderOpportunityLeft.eq(0).text(self.$('#customerDd').text());
                            } else {
                                kanbanHolderOpportunityLeft.eq(0).text('');
                            }

                            if (salesPersonId) {
                                kanbanHolderOpportunityLeft.eq(1).text(self.$('#salesPersonDd').text());
                            } else {
                                kanbanHolderOpportunityLeft.eq(1).text('');
                            }

                            if (result && result.sequence) {
                                $('#' + data.workflowStart).find('.item').each(function () {
                                    var seq = $(this).find('.inner').data('sequence');
                                    if (seq > data.sequenceStart) {
                                        $(this).find('.inner').attr('data-sequence', seq - 1);
                                    }
                                });
                                kanbanHolder.find('.inner').attr('data-sequence', result.sequence);
                            }

                            if (data.workflow) {
                                columnDataWorkflow.find('#forContent').append(kanbanHolder);
                                counter = columnDataWorkflow.closest('.column').find('.totalCount');
                                counter.html(parseInt(counter.html(), 10) + 1);
                                counter = $(".column[data-id='" + data.workflowStart + "']").closest('.column').find('.totalCount');
                                counter.html(parseInt(counter.html(), 10) - 1);

                                self.countTotalAmountForWorkflow(data.workflowStart);
                                self.countTotalAmountForWorkflow(data.workflow);
                            } else {
                                self.countTotalAmountForWorkflow(currentWorkflow._id);
                            }
                            break;
                        case 'form':
                            holder = $('#opportunities .compactList');
                            holder.find('p a#' + model._id).text(name);
                            holder.find('div').eq(0).find('p').eq(1).text('$' + expectedRevenueValue);
                            holder.find('div').eq(1).find('p').eq(0).text(nextAction.date);
                            holder.find('div').eq(1).find('p').eq(1).text(self.$('#workflowDd').text());
                            break;
                    }
                    self.hideDialog();
                },

                error: function (model, xhr) {
                    self.errorNotification(xhr);
                }
            });
        },

        countTotalAmountForWorkflow: function (workflowId) {
            var column = $('td[data-id="' + workflowId + '"]');
            var oldColumnContainer = $('td[data-id="' + workflowId + '"] #forContent h3');
            var sum = 0;

            oldColumnContainer.each(function (item) {
                var value = $(this).text().replace(/\s/g, '');

                sum += parseFloat(value) || 0;
            });
            column.find('.totalAmount').text(helpers.currencySplitter(sum.toString()));
        },

        deleteItem: function (event) {
            var mid = 25;
            var self = this;
            var answer = confirm('Really DELETE items ?!');

            event.preventDefault();

            if (answer === true) {
                this.currentModel.urlRoot = '/Opportunities';
                this.currentModel.destroy({
                    headers: {
                        mid: mid
                    },
                    success: function (model) {
                        var viewType = custom.getCurrentVT();
                        var wId;
                        var newTotal;
                        var holderTdTotalCount;

                        model = model.toJSON();

                        switch (viewType) {
                            case 'list':
                                $("tr[data-id='" + model._id + "'] td").remove();

                                break;
                            case 'form':
                                $('a#' + model._id).parents('li').remove();

                                break;
                            case 'kanban':
                                $('#' + model._id).remove();
                                wId = model.workflow._id;
                                holderTdTotalCount = $("td[data-id='" + wId + "'] .totalCount");
                                newTotal = (holderTdTotalCount.html() - 1);
                                holderTdTotalCount.html(newTotal);

                                self.countTotalAmountForWorkflow(wId);
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

        renderTags: function () {
            var notDiv = this.$el.find('.tags-container');
            notDiv.empty();

            notDiv.append(
                new TagView({
                    model      : this.currentModel,
                    contentType: 'Opportunities'
                }).render().el
            );
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

            this.$el = $(formString).dialog({
                dialogClass: 'edit-dialog',
                width      : 900,
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

            this.renderTags();

            notDiv = this.$el.find('.attach-container');

            notDiv.append(
                new noteView({
                    model      : this.currentModel,
                    contentType: 'Opportunities'
                }).render().el
            );

            this.renderAssignees(this.currentModel);

            self.renderHistory();

            $('#nextActionDate').datepicker({dateFormat: 'd M, yy', minDate: new Date()});
            $('#expectedClosing').datepicker({dateFormat: 'd M, yy', minDate: new Date()});

            dataService.getData('/opportunities/priority', {}, function (priorities) {
                priorities = _.map(priorities.data, function (priority) {
                    priority.name = priority.priority;

                    return priority;
                });
                self.responseObj['#priorityDd'] = priorities;
            });
            populate.get2name('#customerDd', CONSTANTS.URLS.CUSTOMERS, {}, this, false, true);
            dataService.getData('/employees/getForDD', {isEmployee: true}, function (employees) {
                employees = _.map(employees.data, function (employee) {
                    employee.name = employee.name.first + ' ' + employee.name.last;

                    return employee;
                });

                self.responseObj['#salesPersonDd'] = employees;
            });

            populate.getWorkflow('#workflowDd', '#workflowNamesDd', CONSTANTS.URLS.WORKFLOWS_FORDD, {id: 'Opportunities'}, 'name', this);
            populate.get('#salesTeamDd', CONSTANTS.URLS.DEPARTMENTS_FORDD, {}, 'name', this, false, true);
            populate.get('#sourceDd', '/employees/sources', {}, 'name', this);
            return this;
        }

    });
    return EditView;
});
