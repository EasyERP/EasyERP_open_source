define([
        "text!templates/Companies/EditTemplate.html",
        "collections/Companies/CompaniesCollection",
        "collections/Employees/EmployeesCollection",
        "collections/Persons/PersonsCollection",
        "collections/Departments/DepartmentsCollection",
        'views/Assignees/AssigneesView',
        'views/CustomersSuppliers/salesPurchases',
        'views/selectView/selectView',
        "common",
        "populate"
    ],
    function (EditTemplate, CompaniesCollection, EmployeesCollection, PersonsCollection, DepartmentsCollection, AssigneesView, SalesPurchasesView, selectView, common, populate) {
        var EditView = Backbone.View.extend({
            el         : "#content-holder",
            contentType: "Companies",
            imageSrc   : '',
            template: _.template(EditTemplate),

            initialize : function (options) {
                _.bindAll(this, "render", "saveItem");
                _.bindAll(this, "render", "deleteItem");
                this.currentModel = (options.model) ? options.model : options.collection.getElement();
                this.currentModel.urlRoot = "/Companies";
                this.responseObj = {};

                this.render();
            },

            events       : {
                "click #tabList a"                                                : "switchTab",
                "click #contacts"                                                 : "editContacts",
                "click #saveBtn"                                                  : "saveItem",
                "click #cancelBtn"                                                : "hideDialog",
                "mouseenter .avatar"                                              : "showEdit",
                "mouseleave .avatar"                                              : "hideEdit",
                "click .current-selected"                                         : "showNewSelect",
                "click .newSelectList li"                                         : "chooseOption",
                "click"                                                           : "hideNewSelect",
                "click .details"                                                  : "toggleDetails",
                'click .dialog-tabs a'                                            : 'changeTab',
                "click .newSelectList li:not(.miniStylePagination)"               : "chooseOption"
            },

            hideNewSelect: function () {
                $(".newSelectList").hide();

                if (this.selectView) {
                    this.selectView.remove();
                }
            },


            showNewSelect: function (e, prev, next) {
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
                $(e.target).parents("dd").find(".current-selected").text($(e.target).text()).attr("data-id", $(e.target).attr("id"));
            },

            changeTab    : function (e) {
                var holder = $(e.target);
                var n;
                var dialog_holder;

                holder.closest(".dialog-tabs").find("a.active").removeClass("active");
                holder.addClass("active");
                n = holder.parents(".dialog-tabs").find("li").index(holder.parent());
                dialog_holder = $(".dialog-tabs-items");
                dialog_holder.find(".dialog-tabs-item.active").removeClass("active");
                dialog_holder.find(".dialog-tabs-item").eq(n).addClass("active");
            },

            chooseUser   : function (e) {
                $(e.target).toggleClass("choosen");
            },

            toggleDetails: function () {
                $("#details-dialog").toggle();
            },

            hideDialog   : function () {
                $(".edit-companies-dialog").remove();
                $(".add-group-dialog").remove();
                $(".add-user-dialog").remove();
                $(".crop-images-dialog").remove();
            },

            showEdit     : function () {
                $(".upload").animate({
                    height : "20px",
                    display: "block"
                }, 250);

            },

            hideEdit     : function () {
                $(".upload").animate({
                    height : "0px",
                    display: "block"
                }, 250);

            },

            switchTab    : function (e) {
                e.preventDefault();
                var link = this.$("#tabList a");
                if (link.hasClass("selected")) {
                    link.removeClass("selected");
                }
                var index = link.index($(e.target).addClass("selected"));
                this.$(".tab").hide().eq(index).show();
            },

            editContacts: function (e) {
                e.preventDefault();
                var link = this.$("#tabList a");
                if (link.hasClass("selected")) {
                    link.removeClass("selected");
                }
                var index = link.index($(e.target).addClass("selected"));
                this.$(".tab").hide().eq(index).show();
            },

            saveItem    : function (event) {
                var self = this;
                var mid = 39;
                var usersId = [];
                var groupsId = [];
                var whoCanRW;
                var website;
                var data;
                var thisEl = this.$el;

                var isCustomer = thisEl.find("#isCustomer").is(":checked");
                var isSupplier = thisEl.find("#isSupplier").is(":checked");
                var active = thisEl.find("#active").is(":checked");
                var salesPerson = thisEl.find('#employeesDd').data("id");
                var salesTeam = thisEl.find("#departmentDd").data("id");
                var implementedBy = thisEl.find("#implementedBy").data("id");
                var reference = thisEl.find("#reference").val();
                var language = thisEl.find("#language").text();

                if (event) {
                    event.preventDefault()
                }
                if (salesPerson === '') {
                    salesPerson = null
                }
                if (salesTeam === '') {
                    salesTeam = null
                }
                if (implementedBy === '') {
                    implementedBy = null
                }

                $(".groupsAndUser tr").each(function () {
                    if ($(this).data("type") == "targetUsers") {
                        usersId.push($(this).data("id"));
                    }
                    if ($(this).data("type") == "targetGroups") {
                        groupsId.push($(this).data("id"));
                    }
                });

                whoCanRW = this.$el.find("[name='whoCanRW']:checked").val();
                website = this.$el.find('#websiteEdit').val();

                website.replace('http://', '');
                data = {
                    name         : {
                        first: this.$el.find("#name").val(),
                        last : ''
                    },
                    imageSrc     : this.imageSrc,
                    social       : {
                        LI: $.trim(thisEl.find('#LI').val()),
                        FB: $.trim(thisEl.find('#FB').val())
                    },
                    email        : this.$el.find("#emailEdit").val(),
                    phones       : {
                        phone : this.$el.find("#phone").val(),
                        mobile: this.$el.find("#mobile").val(),
                        fax   : this.$el.find("#fax").val()
                    },
                    address      : {
                        street : this.$el.find('#street').val(),
                        city   : this.$el.find('#city').val(),
                        state  : this.$el.find('#state').val(),
                        zip    : this.$el.find('#zip').val(),
                        country: this.$el.find('#country').val()
                    },
                    website      : this.$el.find('#websiteEdit').val(),
                    internalNotes: $.trim(this.$el.find("#internalNotes").val()),

                    salesPurchases: {
                        isCustomer   : isCustomer,
                        isSupplier   : isSupplier,
                        active       : active,
                        salesPerson  : salesPerson,
                        salesTeam    : salesTeam,
                        implementedBy: implementedBy,
                        reference    : reference,
                        language     : language
                    },
                    groups        : {
                        owner: $("#allUsersSelect").data("id"),
                        users: usersId,
                        group: groupsId
                    },
                    whoCanRW      : whoCanRW
                };

                this.currentModel.save(data, {
                    headers: {
                        mid: mid
                    },
                    wait   : true,
                    success: function (model) {
                        $(".edit-companies-dialog").remove();
                        Backbone.history.fragment = "";
                        Backbone.history.navigate("#easyErp/Companies/form/" + model.id, {trigger: true});
                    },
                    error  : function (model, xhr) {
                        self.errorNotification(xhr);
                    }
                });
            },

            deleteItem: function (event) {
                var mid = 39;

                event.preventDefault();
                var self = this;
                var answer = confirm("Really DELETE items ?!");
                if (answer == true) {
                    this.currentModel.destroy({
                        headers: {
                            mid: mid
                        },
                        success: function () {
                            $('.edit-companies-dialog').remove();
                            Backbone.history.navigate("easyErp/" + self.contentType, {trigger: true});
                        },
                        error  : function (models, err) {
                            if (err.status === 403) {
                                App.render({
                                    type: 'error',
                                    message: "You do not have permission to perform this action"
                                });
                            }
                        }
                    });
                }
            },

            render: function () {

                var formString = this.template({
                    model: this.currentModel.toJSON()
                });
                var self = this;
                var notDiv;
                var salesPurchasesEl;
                var thisEl;
                var model;

                this.$el = $(formString).dialog({
                    closeOnEscape: false,
                    autoOpen     : true,
                    resizable    : false,
                    dialogClass  : "edit-companies-dialog",
                    width        : "80%",
                    title        : 'Edit Company',
                    buttons      : [
                        {
                            text : "Save",
                            click: function () {
                                self.saveItem();
                            }
                        },
                        {
                            text : "Cancel",
                            click: function () {
                                self.hideDialog();
                            }
                        },
                        {
                            text : "Delete",
                            click: self.deleteItem
                        }
                    ],
                    modal        : true
                });

                thisEl = this.$el;
                notDiv = this.$el.find('.assignees-container');
                salesPurchasesEl = thisEl.find('#salesPurchases-container');

                notDiv.append(
                    new AssigneesView({
                        model: this.currentModel
                    }).render().el
                );

                salesPurchasesEl.append(
                    new SalesPurchasesView({
                        parrent  : self,
                        model    : this.currentModel,
                        editState: true
                    }).render().el
                );

                $('#text').datepicker({dateFormat: "d M, yy"});

                this.delegateEvents(this.events);
                common.canvasDraw({model: this.currentModel.toJSON()}, this);

                model = this.currentModel.toJSON();

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

                this.delegateEvents(this.events);

                return this;
            }

        });
        return EditView;
    });