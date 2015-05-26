define([
        "text!templates/Persons/EditTemplate.html",
        'views/Assignees/AssigneesView',
        'views/CustomersSuppliers/salesPurchases',
        "common",
        "custom",
        "dataService",
        "populate"
    ],
    function (EditTemplate, AssigneesView, SalesPurchasesView, common, Custom, dataService, populate) {

        var EditView = Backbone.View.extend({
            contentType: "Persons",
            imageSrc: '',
            template: _.template(EditTemplate),

            initialize: function (options) {
                _.bindAll(this, "render", "saveItem");
                _.bindAll(this, "render", "deleteItem");
                this.currentModel = (options.model) ? options.model : options.collection.getElement();
                this.currentModel.urlRoot = "/Persons";
                this.responseObj = {};
                this.render();
            },

            events: {
                "click #saveBtn": "saveItem",
                "click #cancelBtn": "hideDialog",
                "click .current-selected": "showNewSelect",
                "click": "hideNewSelect",
                "mouseenter .avatar": "showEdit",
                "mouseleave .avatar": "hideEdit",
                'click .dialog-tabs a': 'changeTab',
                "click .newSelectList li:not(.miniStylePagination)": "chooseOption",
                "click .newSelectList li.miniStylePagination": "notHide",
                "click .newSelectList li.miniStylePagination .next:not(.disabled)": "nextSelect",
                "click .newSelectList li.miniStylePagination .prev:not(.disabled)": "prevSelect",
                "click .details": "showDetailsBox"
            },

            showDetailsBox: function (e) {
                $(e.target).parent().find(".details-box").toggle();
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

            changeTab: function (e) {
                var holder = $(e.target);
                holder.closest(".dialog-tabs").find("a.active").removeClass("active");
                holder.addClass("active");
                var n = holder.parents(".dialog-tabs").find("li").index(holder.parent());
                var dialog_holder = $(".dialog-tabs-items");
                dialog_holder.find(".dialog-tabs-item.active").removeClass("active");
                dialog_holder.find(".dialog-tabs-item").eq(n).addClass("active");
            },

            chooseUser: function (e) {
                $(e.target).toggleClass("choosen");
            },
            hideDialog: function () {
                $('.edit-person-dialog').remove();
                $(".add-group-dialog").remove();
                $(".add-user-dialog").remove();
                $(".crop-images-dialog").remove();
            },
            showEdit: function () {
                $(".upload").animate({
                    height: "20px",
                    display: "block"
                }, 250);

            },
            hideEdit: function () {
                $(".upload").animate({
                    height: "0px",
                    display: "block"
                }, 250);

            },
            saveItem: function () {
                var self = this;
                var mid = 39;
                var thisEl = this.$el;
                var whoCanRW;
                var data;

                //var dateBirthSt = $.trim(this.$el.find("#dateBirth").val());
                var dateBirth = thisEl.find(".dateBirth").val();
                var company = $('#companiesDd').data("id");
                company = (company) ? company : null;

                var department = $("#departmentDd").data("id");
                department = (department) ? department : null;

                var jobPosition = $.trim(thisEl.find('#jobPositionInput').val());
                jobPosition = (jobPosition) ? jobPosition : null;

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
                whoCanRW = thisEl.find("[name='whoCanRW']:checked").val();

                data = {
                    imageSrc: this.imageSrc,
                    name: {
                        first: $.trim(thisEl.find('#firstName').val()),
                        last: $.trim(thisEl.find('#lastName').val())
                    },
                    dateBirth: dateBirth,
                    department: department,
                    company: company,
                    address: {
                        street: $.trim(thisEl.find('#addressInput').val()),
                        city: $.trim(thisEl.find('#cityInput').val()),
                        state: $.trim(thisEl.find('#stateInput').val()),
                        zip: $.trim(thisEl.find('#zipInput').val()),
                        country: $.trim(thisEl.find('#countryInput').val())
                    },
                    website: $.trim(thisEl.find('#websiteInput').val()),
                    jobPosition: jobPosition,
                    skype: $.trim(thisEl.find('#skype').val()),
                    phones: {
                        phone: $.trim(thisEl.find('#phoneInput').val()),
                        mobile: $.trim(thisEl.find('#mobileInput').val()),
                        fax: $.trim(thisEl.find('#faxInput').val())
                    },
                    email: $.trim(thisEl.find('#emailInput').val()),
                    salesPurchases: {
                        isCustomer: isCustomer,
                        isSupplier: isSupplier,
                        active: active,
                        salesPerson: salesPerson,
                        salesTeam: salesTeam,
                        implementedBy: implementedBy,
                        reference: reference,
                        language: language
                    },
                    groups: {
                        owner: $("#allUsersSelect").data("id"),
                        users: usersId,
                        group: groupsId
                    },
                    whoCanRW: whoCanRW
                };

                this.currentModel.save(data, {
                    headers: {
                        mid: mid
                    },
                    //wait: true,
                    success: function (model) {
                        self.hideDialog();
                        Backbone.history.fragment = "";
                        Backbone.history.navigate("#easyErp/Persons/form/" + model.id, {trigger: true});
                    },
                    error: function (model, xhr) {
                        self.errorNotification(xhr);
                    }
                });
            },

            showNewSelect: function (e, prev, next) {
                populate.showSelect(e, prev, next, this);
                return false;

            },

            hideNewSelect: function () {
                $(".newSelectList").hide();
            },
            chooseOption: function (e) {
                $(e.target).parents("dd").find(".current-selected").text($(e.target).text()).attr("data-id", $(e.target).attr("id"));
            },
            deleteItem: function (event) {
                var mid = 39;
                event.preventDefault();
                var self = this;
                var answer = confirm("Realy DELETE items ?!");
                if (answer == true) {
                    this.currentModel.destroy({
                        headers: {
                            mid: mid
                        },
                        success: function () {
                            $('.edit-person-dialog').remove();
                            Backbone.history.navigate("easyErp/" + self.contentType, {trigger: true});
                        },
                        error: function (model, err) {
                            if (err.status === 403) {
                                alert("You do not have permission to perform this action");
                            }
                        }
                    });
                }

            },
            render: function () {
                var self = this;
                var notDiv;
                var thisEl;
                var salesPurchasesEl;
                var model;
                var formString = this.template({
                    model: this.currentModel.toJSON()
                });
                this.$el = $(formString).dialog({
                    closeOnEscape: false,
                    autoOpen: true,
                    resizable: true,
                    dialogClass: "edit-person-dialog",
                    title: "Edit Person",
                    width: "900",
                    buttons: [
                        {
                            text: "Save",
                            click: function () {
                                self.saveItem();
                            }
                        },

                        {
                            text: "Cancel",
                            click: function () {
                                self.hideDialog();
                            }
                        },
                        {
                            text: "Delete",
                            click: self.deleteItem
                        }
                    ]

                });

                thisEl = this.$el;
                notDiv = thisEl.find('.assignees-container');
                salesPurchasesEl = thisEl.find('#salesPurchases-container');

                notDiv.append(
                    new AssigneesView({
                        model: this.currentModel
                    }).render().el
                );

                salesPurchasesEl.append(
                    new SalesPurchasesView({
                        parrent: self,
                        model: this.currentModel,
                        editState: true
                    }).render().el
                );

                //populate.getCompanies("#companiesDd", "/CompaniesForDd", {}, this, false, true);

                common.canvasDraw({model: this.currentModel.toJSON()}, this);
                thisEl.find('.dateBirth').datepicker({
                    dateFormat: "d M, yy",
                    changeMonth: true,
                    changeYear: true,
                    yearRange: '-100y:c+nn',
                    maxDate: '-18y'
                });
                this.delegateEvents(this.events);
                model = this.currentModel.toJSON();
                if (model.groups)
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
                this.delegateEvents(this.events);
                return this;
            }

        });

        return EditView;
    });
