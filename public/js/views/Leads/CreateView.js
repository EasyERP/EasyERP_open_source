define([
        "text!templates/Leads/CreateTemplate.html",
        'views/selectView/selectView',
        'views/Assignees/AssigneesView',
        "models/LeadsModel",
        "common",
        "populate",
        "dataService"
    ],
    function (CreateTemplate, selectView, AssigneesView, LeadModel, common, populate, dataService) {

        var CreateView = Backbone.View.extend({
            el         : "#content-holder",
            contentType: "Leads",
            template   : _.template(CreateTemplate),

            initialize: function () {
                _.bindAll(this, "saveItem", "render");
                this.model = new LeadModel();
                this.responseObj = {};

                this.render();
            },

            events: {
                "click #tabList a"                                                : "switchTab",
                "change #workflowNames"                                           : "changeWorkflows",
                'keydown'                                                         : 'keydownHandler',
                'click .dialog-tabs a'                                            : 'changeTab',
                "click .newSelectList li:not(.miniStylePagination)"               : "chooseOption",
                "click"                                                           : "hideNewSelect",
                "click .current-selected"                                         : "showNewSelect"
            },

            selectCustomer: function (id) {
                if (id != "") {
                    dataService.getData('/Customers', {
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

            changeWorkflows: function () {
                var name = this.$("#workflowNames option:selected").val();
                var value = this.workflowsCollection.findWhere({name: name}).toJSON().value;
                //$("#selectWorkflow").html(_.template(selectTemplate, { workflows: this.getWorkflowValue(value) }));
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

            saveItem: function () {
                var afterPage = '';                                                                 //Masalovych bag 803
                var location = window.location.hash;                                                //Masalovych bag 803
                var pageSplited = location.split('/p=')[1];                                         //Masalovych bag 803
                if (pageSplited) {                                                                  //Masalovych bag 803
                    afterPage = pageSplited.split('/')[1];                                          //Masalovych bag 803
                    location = location.split('/p=')[0] + '/p=1' + '/' + afterPage;                 //Masalovych bag 803
                }                                                                                   //Masalovych bag 803
                var self = this;
                var $company = this.$("#company");
                var mid = 39;
                var name = $.trim(this.$el.find("#name").val());
                var company = {
                    name: $company.val(),
                    id  : $company.data('id')
                };
                var idCustomer = this.$("#customerDd").data("id");
                var address = {};
                $("dd").find(".address").each(function () {
                    var el = $(this);
                    address[el.attr("name")] = $.trim(el.val());
                });

                var salesPersonId = this.$("#salesPerson").data("id");
                var salesTeamId = this.$("#salesTeam option:selected").val();
                var first = $.trim(this.$el.find("#first").val());
                var last = $.trim(this.$el.find("#last").val());
                var contactName = {
                    first: first,
                    last : last
                };
                var email = $.trim(this.$el.find("#e-mail").val());
                var func = $.trim(this.$el.find("#func").val());

                var phone = $.trim(this.$el.find("#phone").val());
                var mobile = $.trim(this.$el.find("#mobile").val());
                var fax = $.trim(this.$el.find("#fax").val());
                var phones = {
                    phone : phone,
                    mobile: mobile,
                    fax   : fax
                };
                var workflow = this.$("#workflowsDd").data('id');
                var priority = $("#priorityDd").data("id");
                var internalNotes = $.trim(this.$el.find("#internalNotes").val());
                var active = (this.$el.find("#active").is(":checked")) ? true : false;
                var optout = (this.$el.find("#optout").is(":checked")) ? true : false;
                var reffered = $.trim(this.$el.find("#reffered").val());

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
                this.model.save({
                        name         : name,
                        company      : company || null,
                        campaign     : $('#campaignDd').data("id"),
                        source       : $('#sourceDd').data("id"),
                        customer     : idCustomer || null,
                        address      : address,
                        salesPerson  : salesPersonId || null,
                        salesTeam    : salesTeamId,
                        contactName  : contactName,
                        email        : email,
                        func         : func,
                        phones       : phones,
                        fax          : fax,
                        priority     : priority,
                        internalNotes: internalNotes,
                        active       : active,
                        optout       : optout,
                        reffered     : reffered,
                        workflow     : workflow,
                        groups       : {
                            owner: $("#allUsersSelect").data("id"),
                            users: usersId,
                            group: groupsId
                        },
                        whoCanRW     : whoCanRW
                    },
                    {
                        headers: {
                            mid: mid
                        },
                        success: function () {
                            self.hideDialog();
                            Backbone.history.fragment = "";                                  //Masalovych bag 803
                            Backbone.history.navigate(location, {trigger: true});          //Masalovych bag 803
                            // Backbone.history.navigate("easyErp/Users", { trigger: true });
                        },
                        error  : function (model, xhr) {
                            self.errorNotification(xhr);
                        }

                    });
            },

            hideDialog: function () {
                $(".edit-dialog").remove();
                $(".add-group-dialog").remove();
                $(".add-user-dialog").remove();
            },

            render: function () {
                var self = this;
                var formString = this.template();
                this.$el = $(formString).dialog({
                    closeOnEscape: false,
                    autoOpen     : true,
                    resizable    : true,
                    dialogClass  : "edit-dialog",
                    title        : "Edit Company",
                    width        : "800",
                    buttons      : [
                        {
                            text : "Create",
                            click: function () {
                                self.saveItem();
                            }
                        },

                        {
                            text : "Cancel",
                            click: function () {
                                self.hideDialog();
                            }
                        }
                    ]

                });
                var notDiv = this.$el.find('.assignees-container');
                notDiv.append(
                    new AssigneesView({
                        model: this.currentModel
                    }).render().el
                );

                populate.getPriority("#priorityDd", this, true);
                populate.getWorkflow("#workflowsDd", "#workflowNamesDd", "/workflows/getWorkflowsForDd", {id: "Leads"}, "name", this, true);
                populate.get2name("#customerDd", "/Customers", {}, this, true, true);
                populate.get("#sourceDd", "/employees/sources", {}, "name", this, true, true);
                populate.get("#campaignDd", "/Campaigns", {}, "name", this, true, true);
                populate.get2name("#salesPerson", "/employees/getForDdByRelatedUser", {}, this, true, true);
                this.delegateEvents(this.events);

                return this;
            }

        });
        return CreateView;
    });
