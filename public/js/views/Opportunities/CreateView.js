define([
        "text!templates/Opportunities/CreateTemplate.html",
        'views/selectView/selectView',
        'views/Assignees/AssigneesView',
        "models/OpportunitiesModel",
        "common",
        "populate",
        "dataService",
        'views/Notes/AttachView',
    'constants'
    ],
    function (CreateTemplate, selectView, AssigneesView, OpportunityModel, common, populate, dataService, attachView, CONSTANTS) {
        var CreateView = Backbone.View.extend({
            el         : "#content-holder",
            contentType: "Opportunities",
            template   : _.template(CreateTemplate),

            initialize: function (options) {
                _.bindAll(this, "saveItem");
                this.responseObj = {};
                this.elementId = options ? options.elementId : null;

                this.render();
            },

            events: {
                "click #tabList a"                                                : "switchTab",
                "change #workflowNames"                                           : "changeWorkflows",
                'keydown'                                                         : 'keydownHandler',
                'click .dialog-tabs a'                                            : 'changeTab',
                "click .newSelectList li:not(.miniStylePagination)"               : "chooseOption",
                "click .current-selected"                                         : "showNewSelect",
                "click"                                                           : "hideNewSelect"
            },

            hideNewSelect: function () {
                $(".newSelectList").hide();

                if (this.selectView) {
                    this.selectView.remove();
                }
            },

            showNewSelect: function (e) {
                var $target = $(e.target);
                e.stopPropagation();

                if ($target.attr('id') === 'selectInput') {
                    return false;
                }

                if (this.selectView) {
                    this.selectView.remove();
                }

                this.selectView = new selectView({
                    e          : e,
                    responseObj: this.responseObj
                });

                $target.append(this.selectView.render().el);

                return false;
            },

            chooseOption : function (e) {
                var holder = $(e.target).parents("dd").find(".current-selected");
                holder.text($(e.target).text()).attr("data-id", $(e.target).attr("id"));
                if (holder.attr("id") == 'customerDd') {
                    this.selectCustomer($(e.target).attr("id"));
                }
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

            changeTab: function (e) {
                var holder = $(e.target);
                holder.closest(".dialog-tabs").find("a.active").removeClass("active");
                holder.addClass("active");
                var n = holder.parents(".dialog-tabs").find("li").index(holder.parent());
                var dialog_holder = $(".dialog-tabs-items");
                dialog_holder.find(".dialog-tabs-item.active").removeClass("active");
                dialog_holder.find(".dialog-tabs-item").eq(n).addClass("active");
            },

            getWorkflowValue: function (value) {
                var workflows = [];
                for (var i = 0; i < value.length; i++) {
                    workflows.push({name: value[i].name, status: value[i].status});
                }
                return workflows;
            },

            changeWorkflows: function () {
                var name = this.$("#workflowNames option:selected").val();
                var value = this.workflowsCollection.findWhere({name: name}).toJSON().value;
                $("#selectWorkflow").html(_.template(selectTemplate, {workflows: this.getWorkflowValue(value)}));
            },

            selectCustomer: function (id) {
                dataService.getData(CONSTANTS.URLS.CUSTOMERS, {
                    id: id
                }, function (response, context) {
                    var customer = response.data[0];
                    if (customer.type == 'Person') {
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
                    context.$el.find('#country').val(customer.address.country);
                }, this);

            },

            switchTab: function (e) {
                e.preventDefault();
                var link = this.$("#tabList a");
                if (link.hasClass("selected")) {
                    link.removeClass("selected");
                }
                var index = link.index($(e.target).addClass("selected"));
                this.$(".tab").hide().eq(index).show();
            },

            hideDialog: function () {
                $(".edit-dialog").remove();
                $(".add-group-dialog").remove();
                $(".add-user-dialog").remove();
            },

            saveItem: function () {
                var mid = 39;

                var opportunityModel = new OpportunityModel();

                var name = $.trim($("#name").val());

                var expectedRevenueValue = $.trim($("#expectedRevenueValue").val()) || "0";
                var expectedRevenueProgress = $.trim($("#expectedRevenueProgress").val());
                var expectedRevenue;
                if (expectedRevenueValue || expectedRevenueProgress) {
                    expectedRevenue = {
                        value   : expectedRevenueValue,
                        currency: '$',
                        progress: expectedRevenueProgress
                    };
                }

                var customerId = this.$("#customerDd").data("id");
                var email = $.trim($("#email").val());

                var salesPersonId = this.$("#salesPersonDd").data("id");

                var salesTeamId = this.$("#salesTeamDd").data("id");

                var nextAct = $.trim(this.$el.find("#nextActionDate").val());
                var nextActionDesc = $.trim(this.$el.find("#nextActionDescription").val());
                var nextAction = {
                    date: nextAct,
                    desc: nextActionDesc
                };

                var expectedClosing = $.trim($("#expectedClosing").val());

                var priority = $("#priorityDd").text();

                var company = $.trim($("#company").val());

                var internalNotes = $.trim($("#internalNotes").val());

                var address = {};
                $("dd").find(".address").each(function () {
                    var el = $(this);
                    address[el.attr("name")] = el.val();
                });

                var first = $.trim($("#first").val());
                var last = $.trim($("#last").val());
                var contactName = {
                    first: first,
                    last : last
                };

                var func = $.trim($("#func").val());

                var phone = $.trim($("#phone").val());
                var mobile = $.trim($("#mobile").val());
                var fax = $.trim($("#fax").val());
                var phones = {
                    phone : phone,
                    mobile: mobile,
                    fax   : fax
                };

                var workflow = this.$("#workflowDd").data('id');

                var active = ($("#active").is(":checked")) ? true : false;

                var optout = ($("#optout").is(":checked")) ? true : false;

                var reffered = $.trim($("#reffered").val());
                var self = this;

                var usersId = [];
                var groupsId = [];
                $(".groupsAndUser tr").each(function () {
                    if ($(this).data("type") == "targetUsers") {
                        usersId.push($(this).data("id"));
                    }
                    if ($(this).data("type") == "targetGroups") {
                        groupsId.push($(this).data("id"));
                    }

                });
                var whoCanRW = this.$el.find("[name='whoCanRW']:checked").val();
                opportunityModel.save({
                        name           : name,
                        expectedRevenue: expectedRevenue,
                        customer       : customerId || null,
                        email          : email,
                        salesPerson    : salesPersonId || null,
                        salesTeam      : salesTeamId,
                        nextAction     : nextAction,
                        expectedClosing: expectedClosing,
                        priority       : priority,
                        workflow       : workflow,
                        internalNotes  : internalNotes,
                        company        : company || null,
                        address        : address,
                        contactName    : contactName,
                        func           : func,
                        phones         : phones,
                        active         : active,
                        optout         : optout,
                        reffered       : reffered,
                        groups         : {
                            owner: $("#allUsersSelect").data("id"),
                            users: usersId,
                            group: groupsId
                        },
                        whoCanRW       : whoCanRW
                    },
                    {
                        headers: {
                            mid: mid
                        },
                        wait   : true,
                        success: function (model) {
                            var currentModel = model.changed.success;
                            self.attachView.sendToServer(null, currentModel);
                        },
                        error  : function (model, xhr) {
                            self.errorNotification(xhr);
                        }
                    });
            },

            render: function () {
                var formString = this.template();
                var self = this;
                var notDiv;

                this.$el = $(formString).dialog({
                    closeOnEscape: false,
                    dialogClass  : "edit-dialog",
                    width        : "900",
                    title        : "Create Opportunity",
                    buttons      : {
                        save  : {
                            text : "Create",
                            class: "btn",
                            click: self.saveItem
                        },
                        cancel: {
                            text : "Cancel",
                            class: "btn",
                            click: function () {
                                self.hideDialog();
                            }
                        }
                    }
                });

                notDiv = this.$el.find('.attach-container');

                this.attachView = new attachView({
                    model    : new OpportunityModel(),
                    url      : "/uploadOpportunitiesFiles",
                    isCreate : true,
                    elementId: this.elementId
                });

                notDiv.append(this.attachView.render().el);
                notDiv = this.$el.find('.assignees-container');
                notDiv.append(
                    new AssigneesView({
                        model: this.currentModel,
                    }).render().el
                );

                $('#nextActionDate').datepicker({dateFormat: "d M, yy", minDate: new Date()});
                $('#expectedClosing').datepicker({dateFormat: "d M, yy", minDate: new Date()});
                populate.getPriority("#priorityDd", this, true);
                populate.get2name("#customerDd", CONSTANTS.URLS.CUSTOMERS, {}, this, true, true, (this.model) ? this.model._id : null);
                populate.get2name("#salesPersonDd", CONSTANTS.URLS.EMPLOYEES_RELATEDUSER, {}, this, true, true);
                populate.getWorkflow("#workflowDd", "#workflowNamesDd", CONSTANTS.URLS.WORKFLOWS_FORDD, {id: "Opportunities"}, "name", this, true);
                populate.get("#salesTeamDd",  CONSTANTS.URLS.DEPARTMENTS_FORDD, {}, "departmentName", this, true, true);

                /*                common.populateCustomers("#customerDd", "/Customers",this.model);
                 //common.populateEmployeesDd("#salesPerson"Dd, "/employee/getPersonsForDd");
                 common.populateEmployeesDd("#salesPersonDd", "/getForDdByRelatedUser", this.model);
                 common.populateDepartments("#salesTeamDd", "/DepartmentsForDd");
                 common.populatePriority("#priorityDd", "/Priority");
                 common.populateWorkflows('Opportunities', '#workflowDd', "#workflowNamesDd", '/WorkflowsForDd');*/

                this.delegateEvents(this.events);
                return this;
            }

        });

        return CreateView;
    });
