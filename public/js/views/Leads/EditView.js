define([
        "text!templates/Leads/EditTemplate.html",
        'views/Assignees/AssigneesView',
        "custom",
        'common',
        'dataService',
        "populate"
    ],
    function (EditTemplate, AssigneesView, Custom, common, dataService, populate) {

        var EditView = Backbone.View.extend({
            el         : "#content-holder",
            contentType: "Leads",
            template   : _.template(EditTemplate),
            initialize : function (options) {
                _.bindAll(this, "render", "saveItem");
                _.bindAll(this, "render", "deleteItem");
                this.currentModel = (options.model) ? options.model : options.collection.getElement();
                this.currentModel.urlRoot = "/Leads";
                this.responseObj = {};
                this.render();
            },

            events    : {
                "click #convertToOpportunity"                                     : "openDialog",
                "click #tabList a"                                                : "switchTab",
                "click .breadcrumb a, #cancelCase, #reset"                        : "changeWorkflow",
                "change #customer"                                                : "selectCustomer",
                "change #workflowNames"                                           : "changeWorkflows",
                "click .current-selected"                                         : "showNewSelect",
                "click"                                                           : "hideNewSelect",
                'keydown'                                                         : 'keydownHandler',
                'click .dialog-tabs a'                                            : 'changeTab',
                "click .newSelectList li:not(.miniStylePagination)"               : "chooseOption",
                "click .newSelectList li.miniStylePagination"                     : "notHide",
                "click .newSelectList li.miniStylePagination .next:not(.disabled)": "nextSelect",
                "click .newSelectList li.miniStylePagination .prev:not(.disabled)": "prevSelect"

            },
            openDialog: function (e) {
                e.preventDefault();
                $("#convert-dialog-form").dialog("open");
            },

            notHide: function () {
                return false;
            },

            nextSelect: function (e) {
                this.showNewSelect(e, false, true);
            },
            prevSelect: function (e) {
                this.showNewSelect(e, true, false);
            },
            changeTab : function (e) {
                $(e.target).closest(".dialog-tabs").find("a.active").removeClass("active");
                $(e.target).addClass("active");
                var n = $(e.target).parents(".dialog-tabs").find("li").index($(e.target).parent());
                var dialog_holder = $(".dialog-tabs-items");
                dialog_holder.find(".dialog-tabs-item.active").removeClass("active");
                dialog_holder.find(".dialog-tabs-item").eq(n).addClass("active");
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

            hideDialog: function () {
                $(".edit-dialog").remove();
                $(".add-group-dialog").remove();
                $(".add-user-dialog").remove();
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

            getWorkflowValue: function (value) {
                var workflows = [];
                for (var i = 0; i < value.length; i++) {
                    workflows.push({name: value[i].name, status: value[i].status});
                }
                return workflows;
            },

            saveItem: function () {
                var mid = 39;
                var self = this;
                var name = $.trim(this.$el.find("#name").val());
                var company = $.trim(this.$el.find("#company").val());
                var idCustomer = $("#customerDd").data("id");
                //idCustomer = idCustomer ? idCustomer : null;
                var currentCustomer = this.currentModel.get('customer');
                var address = {};
                $("dd").find(".address").each(function () {
                    var el = $(this);
                    address[el.attr("name")] = $.trim(el.val());
                });
                var salesPersonId = this.$("#salesPerson").data("id");
                var currentSalesPerson = this.currentModel.get('salesPerson');
                //salesPersonId = salesPersonId ? salesPersonId : null;
                var salesTeamId = this.$("#salesTeam option:selected").val();
                var currentSalesTeam = this.currentModel.get('salesTeam');
                //salesTeamId = salesTeamId ? salesTeamId : null;
                var first = $.trim(this.$el.find("#first").val());
                var last = $.trim(this.$el.find("#last").val());
                var contactName = {
                    first: first,
                    last : last
                };
                var email = $.trim(this.$el.find("#email_person").val());
                var phone = $.trim(this.$el.find("#phone").val());
                var mobile = $.trim(this.$el.find("#mobile").val());
                var fax = $.trim(this.$el.find("#fax").val());
                var phones = {
                    phone : phone,
                    mobile: mobile,
                    fax   : fax
                };
                var currentWorkflow = this.currentModel.get('workflow');
                var workflow = this.$("#workflowsDd").data('id');
                var priority = this.$el.find("#priorityDd").attr("data-id");

                var internalNotes = $.trim($("#internalNotes").val());

                var active;
                if ($("#active").is(":checked")) {
                    active = true;
                } else {
                    active = false;
                }

                var optout;
                if ($("#optout").is(":checked")) {
                    optout = true;
                } else {
                    optout = false;
                }

                var reffered = $.trim($("#reffered").val());

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
                var data = {
                    name         : name,
                    company      : company,
                    campaign     : this.$el.find('#campaignDd').data("id"),
                    source       : this.$el.find('#sourceDd').data("id"),
                    address      : address,
                    contactName  : contactName,
                    email        : email,
                    phones       : phones,
                    fax          : fax,
                    priority     : priority,
                    internalNotes: internalNotes,
                    reffered     : reffered,
                    groups       : {
                        owner: $("#allUsersSelect").data("id"),
                        users: usersId,
                        group: groupsId
                    },
                    whoCanRW     : whoCanRW
                };
                if (currentWorkflow && currentWorkflow._id && workflow && (currentWorkflow._id !== workflow)) {
                    data['workflow'] = workflow;
                }
                ;
                if (currentCustomer && currentCustomer._id && idCustomer && (currentCustomer._id !== idCustomer)) {
                    data['customer'] = idCustomer;
                } else if (!currentCustomer && idCustomer) {
                    data['customer'] = idCustomer;
                }
                ;
                if (currentSalesPerson && currentSalesPerson._id && salesPersonId && (currentSalesPerson._id !== salesPersonId)) {
                    data['salesPerson'] = salesPersonId;
                } else if (!currentSalesPerson && salesPersonId) {
                    data['salesPerson'] = salesPersonId;
                }
                ;
                if (currentSalesTeam && currentSalesTeam._id && salesTeamId && (currentSalesTeam._id !== salesTeamId)) {
                    data['salesTeam'] = salesTeamId;
                } else if (!currentSalesTeam && salesTeamId) {
                    data['salesTeam'] = salesTeamId;
                }
                ;
                this.currentModel.set(data);
                this.currentModel.save(this.currentModel.changed, {
                    headers: {
                        mid: mid
                    },
                    patch  : true,
                    success: function () {
                        self.hideDialog();
                        Backbone.history.navigate("easyErp/Leads", {trigger: true});
                    },
                    error  : function (model, xhr) {
                        self.errorNotification(xhr);
                    }

                });
            },

            deleteItem   : function (event) {
                var mid = 39;
                event.preventDefault();
                var self = this;
                var answer = confirm("Really DELETE items ?!");
                if (answer == true) {
                    this.currentModel.urlRoot = "/Leads";
                    this.currentModel.destroy({
                        headers: {
                            mid: mid
                        },
                        success: function () {
                            Backbone.history.navigate("easyErp/" + self.contentType, {trigger: true});
                        },
                        error  : function (model, xhr) {
                            self.errorNotification(xhr);
                        }
                    });
                }
            },
            showNewSelect: function (e, prev, next) {
                populate.showSelect(e, prev, next, this);
                return false;

            },

            hideNewSelect: function () {
                $(".newSelectList").hide();
            },

            chooseOption: function (e) {
                var holder = $(e.target).parents("dd").find(".current-selected");
                holder.text($(e.target).text()).attr("data-id", $(e.target).attr("id"));
                if (holder.attr("id") == 'customerDd') {
                    this.selectCustomer($(e.target).attr("id"));
                }
            },

            selectCustomer: function (id) {
                if (id != "") {
                    dataService.getData('/Customer', {
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

            render: function () {
                var formString = this.template({
                    model: this.currentModel.toJSON()
                });
                var self = this;
                this.$el = $(formString).dialog({
                    closeOnEscape: false,
                    dialogClass  : "edit-dialog",
                    width        : 800,
                    buttons      : {
                        save  : {
                            text : "Save",
                            class: "btn",
                            click: self.saveItem
                        },
                        cancel: {
                            text : "Cancel",
                            class: "btn",
                            click: self.hideDialog
                        },
                        delete: {
                            text : "Delete",
                            class: "btn",
                            click: self.deleteItem
                        }
                    }
                });
                var notDiv = this.$el.find('.assignees-container');
                notDiv.append(
                    new AssigneesView({
                        model: this.currentModel
                    }).render().el
                );
                populate.getPriority("#priorityDd", this);
                populate.getWorkflow("#workflowsDd", "", "/WorkflowsForDd", {id: "Leads"}, "name", this);
                populate.get2name("#customerDd", "/Customer", {}, this, null, true);
                populate.get2name("#salesPerson", "/getForDdByRelatedUser", {}, this);
                populate.get("#campaignDd", "/Campaigns", {}, "name", this);
                populate.get("#sourceDd", "/sources", {}, "name", this);

                this.delegateEvents(this.events);

                var model = this.currentModel.toJSON();
                var that = this;
                $("#convert-dialog-form").dialog({
                    autoOpen: false,
                    height  : 150,
                    width   : 350,
                    modal   : true,
                    title   : "Convert to opportunity",
                    buttons : {
                        "Create opportunity": function () {
                            var self = this;
                            var createCustomer = ($("select#createCustomerOrNot option:selected").val()) ? true : false;
                            that.currentModel.set({
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
                                    mid: 39
                                },
                                patch   : true,
                                success : function (model) {
                                    $(self).dialog("close");
                                    //that.opportunitiesCollection.add(model);
                                    Backbone.history.navigate("easyErp/Opportunities", {trigger: true});
                                },
                                error   : function (model, xhr) {
                                    that.errorNotification(xhr);
                                }

                            });

                        },
                        Cancel              : function () {
                            $(this).dialog('close');
                        }
                    },

                    close: function () {
                        $(this).dialog('close');
                    }
                }, this);

                if (model.groups) {
                    if (model.groups.users.length > 0 || model.groups.group.length) {
                        $(".groupsAndUser").show();
                        model.groups.group.forEach(function (item) {
                            $(".groupsAndUser").append("<tr data-type='targetGroups' data-id='" + item._id + "'><td>" + item.departmentName + "</td><td class='text-right'></td></tr>");
                            $("#targetGroups").append("<li id='" + item._id + "'>" + item.departmentName + "</li>");
                        });
                        model.groups.users.forEach(function (item) {
                            $(".groupsAndUser").append("<tr data-type='targetUsers' data-id='" + item._id + "'><td>" + item.login + "</td><td class='text-right'></td></tr>");
                            $("#targetUsers").append("<li id='" + item._id + "'>" + item.login + "</li>");
                        });

                    }
                }
                return this;
            }

        });

        return EditView;
    });
