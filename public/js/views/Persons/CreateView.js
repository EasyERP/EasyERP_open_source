define([
        "text!templates/Persons/CreateTemplate.html",
        "collections/Persons/PersonsCollection",
        "collections/Departments/DepartmentsCollection",
        'views/selectView/selectView',
        'views/Assignees/AssigneesView',
        'views/CustomersSuppliers/salesPurchases',
        "models/PersonsModel",
        "common",
        "populate"
    ],
    function (CreateTemplate, PersonsCollection, DepartmentsCollection, selectView, AssigneesView, SalesPurchasesView, PersonModel, common, populate) {

        var CreateView = Backbone.View.extend({
            el         : "#content-holder",
            contentType: "Persons",
            template   : _.template(CreateTemplate),
            imageSrc   : '',

            initialize: function (options) {
                _.bindAll(this, "saveItem", "render");
                this.model = new PersonModel();
                this.models = (options && options.model) ? options.model : null;
                this.responseObj = {};
                this.render();
            },

            events        : {
                "mouseenter .avatar"                                              : "showEdit",
                "mouseleave .avatar"                                              : "hideEdit",
                'keydown'                                                         : 'keydownHandler',
                'click .dialog-tabs a'                                            : 'changeTab',
                "click .details"                                                  : "showDetailsBox",
                "click .current-selected"                                         : "showNewSelect",
                "click"                                                           : "hideNewSelect",
                "click .newSelectList li:not(.miniStylePagination)"               : "chooseOption"
            },
            showNewSelect : function (e) {
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

            hideNewSelect : function () {
                $(".newSelectList").hide();
                if (this.selectView){
                    this.selectView.remove();
                }
            },

            chooseOption  : function (e) {
                $(e.target).parents("dd").find(".current-selected").text($(e.target).text()).attr("data-id", $(e.target).attr("id"));

            },

            showDetailsBox: function (e) {
                $(e.target).parent().find(".details-box").toggle();
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

            showEdit: function () {
                $(".upload").animate({
                    height : "20px",
                    display: "block"
                }, 250);

            },

            hideEdit: function () {
                $(".upload").animate({
                    height : "0px",
                    display: "block"
                }, 250);

            },

            saveItem: function () {
                var self = this;
                var mid = 39;
                var thisEl = this.$el;

                var company = $('#companiesDd').data("id");
                var dateBirth = $(".dateBirth").val();
                var department = $("#departmentDd option:selected").val();

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
                    name          : {
                        first: $.trim(thisEl.find('#firstName').val()),
                        last : $.trim(thisEl.find('#lastName').val())
                    },
                    imageSrc      : this.imageSrc,
                    dateBirth     : dateBirth,
                    company       : company,
                    department    : department,
                    address       : {
                        street : $.trim($('#addressInput').val()),
                        city   : $.trim($('#cityInput').val()),
                        state  : $.trim($('#stateInput').val()),
                        zip    : $.trim($('#zipInput').val()),
                        country: $.trim(this.$el.find('#countryInput').val())
                    },
                    website       : $.trim($('#websiteInput').val()),
                    jobPosition   : $.trim($('#jobPositionInput').val()),
                    skype         : $.trim($('#skype').val()),
                    social        : {
                        LI: $.trim(thisEl.find('#LI').val()),
                        FB: $.trim(thisEl.find('#FB').val())
                    },
                    phones        : {
                        phone : $.trim($('#phoneInput').val()),
                        mobile: $.trim($('#mobileInput').val()),
                        fax   : $.trim($('#faxInput').val())
                    },
                    email         : $.trim($('#emailInput').val()),
                    salesPurchases: {
                        isCustomer   : thisEl.find("#isCustomer").is(":checked"),
                        isSupplier   : thisEl.find("#isSupplier").is(":checked"),
                        active       : thisEl.find("#active").is(":checked"),
                        implementedBy: thisEl.find("#implementedBy").data("id"),
                        salesPerson  : thisEl.find('#employeesDd').data("id"),
                        salesTeam    : thisEl.find("#departmentDd").data("id"),
                        reference    : thisEl.find("#reference").val(),
                        language     : thisEl.find("#language").text()
                    },
                    groups        : {
                        owner: $("#allUsersSelect").data("id"),
                        users: usersId,
                        group: groupsId
                    },
                    whoCanRW      : whoCanRW

                };

                var model = new PersonModel();
                model.save(data, {
                    headers: {
                        mid: mid
                    },
                    wait   : true,
                    success: function () {
                        self.hideDialog();
                        Backbone.history.navigate("easyErp/Persons", {trigger: true});
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
                $(".crop-images-dialog").remove();
            },

            render: function () {
                var personModel = new PersonModel();
                var formString = this.template();
                var self = this;
                var notDiv;
                var salesPurchasesEl;

                var thisEl = this.$el = $(formString).dialog({
                    closeOnEscape: false,
                    autoOpen     : true,
                    resizable    : true,
                    dialogClass  : "edit-dialog",
                    title        : "Edit Person",
                    width        : "900px",
                    position     : {within: $("#wrapper")},
                    buttons      : [
                        {
                            id   : "create-person-dialog",
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
                        }]

                });
                notDiv = thisEl.find('.assignees-container');
                salesPurchasesEl = thisEl.find('#salesPurchases-container');

                notDiv.append(
                    new AssigneesView({
                        model: null
                    }).render().el
                );

                salesPurchasesEl.append(
                    new SalesPurchasesView({
                        parrent: self
                    }).render().el
                );

                populate.getCompanies("#companiesDd", "/customers/getCompaniesForDd", {}, this, false, true, (this.models) ? this.models._id : null);
                common.canvasDraw({model: personModel.toJSON()}, this);
                this.$el.find('.dateBirth').datepicker({
                    dateFormat : "d M, yy",
                    changeMonth: true,
                    changeYear : true,
                    yearRange  : '-100y:c+nn',
                    maxDate    : '-18y'
                });
                this.delegateEvents(this.events);
                return this;
            }

        });

        return CreateView;
    });
