define([
        "text!templates/Departments/CreateTemplate.html",
        'views/selectView/selectView',
        "collections/Departments/DepartmentsCollection",
        "collections/Customers/AccountsDdCollection",
        "models/DepartmentsModel",
        "common",
        "custom",
        "populate"
    ],
    function (CreateTemplate, selectView, DepartmentsCollection, AccountsDdCollection, DepartmentsModel, common, Custom, populate) {

        var CreateView = Backbone.View.extend({
            el         : "#content-holder",
            contentType: "Departments",
            template   : _.template(CreateTemplate),

            initialize    : function (options) {
                _.bindAll(this, "saveItem", "render");
                this.departmentsCollection = new DepartmentsCollection();
                this.model = new DepartmentsModel();
                this.responseObj = {};
                this.render();
            },
            events        : {
                'click .dialog-tabs a'                                            : 'changeTab',
                'click #sourceUsers li'                                           : 'addUsers',
                'click #targetUsers li'                                           : 'removeUsers',
                "click .current-selected"                                         : "showNewSelect",
                "click"                                                           : "hideNewSelect",
                "click .prevUserList"                                             : "prevUserList",
                "click .nextUserList"                                             : "nextUserList",
                "click .newSelectList li:not(.miniStylePagination)"               : "chooseOption"
                // 'keydown': 'keydownHandler'
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

            updateAssigneesPagination: function (el) {
                var pag = el.find(".userPagination .text");
                el.find(".userPagination .nextUserList").remove();
                el.find(".userPagination .prevUserList").remove();
                el.find(".userPagination .nextGroupList").remove();
                el.find(".userPagination .prevGroupList").remove();
                var list = el.find("ul");
                var count = list.find("li").length;
                var s = "";
                var page = parseInt(list.attr("data-page"));
                if (page > 1) {
                    el.find(".userPagination").prepend("<a class='prevUserList' href='javascript:;'>« prev</a>");
                }
                if (count === 0) {
                    s += "0-0 of 0";
                } else {
                    if ((page) * 20 - 1 < count) {
                        s += ((page - 1) * 20 + 1) + "-" + ((page) * 20) + " of " + count;
                    } else {
                        s += ((page - 1) * 20 + 1) + "-" + (count) + " of " + count;
                    }
                }

                if (page < count / 20) {
                    el.find(".userPagination").append("<a class='nextUserList' href='javascript:;'>next »</a>");
                }
                el.find("ul li").hide();
                for (var i = (page - 1) * 20; i < 20 * page; i++) {
                    el.find("ul li").eq(i).show();
                }
                pag.text(s);
            },

            nextUserList: function (e, page) {
                $(e.target).closest(".left").find("ul").attr("data-page", parseInt($(e.target).closest(".left").find("ul").attr("data-page")) + 1);
                this.updateAssigneesPagination($(e.target).closest(".left"));
            },

            prevUserList: function (e, page) {
                $(e.target).closest(".left").find("ul").attr("data-page", parseInt($(e.target).closest(".left").find("ul").attr("data-page")) - 1);
                this.updateAssigneesPagination($(e.target).closest(".left"));
            },
            chooseUser  : function (e) {
                $(e.target).toggleClass("choosen");
            },
            changeTab   : function (e) {
                $(e.target).closest(".dialog-tabs").find("a.active").removeClass("active");
                $(e.target).addClass("active");
                var n = $(e.target).parents(".dialog-tabs").find("li").index($(e.target).parent());
                $(".dialog-tabs-items").find(".dialog-tabs-item.active").removeClass("active");
                $(".dialog-tabs-items").find(".dialog-tabs-item").eq(n).addClass("active");
            },
            close       : function () {
                this._modelBinder.unbind();
            },
            addUsers    : function (e) {
                e.preventDefault();
                var div = $(e.target).parents(".left");
                $('#targetUsers').append($(e.target));
                this.updateAssigneesPagination(div);
                div = $(e.target).parents(".left");
                this.updateAssigneesPagination(div);
            },
            removeUsers : function (e) {
                e.preventDefault();
                var div = $(e.target).parents(".left");
                $('#sourceUsers').append($(e.target));
                this.updateAssigneesPagination(div);
                div = $(e.target).parents(".left");
                this.updateAssigneesPagination(div);
            },

            saveItem     : function () {
                var self = this;
                var mid = 39;
                var departmentName = $.trim($("#departmentName").val());
                var parentDepartment = this.$("#parentDepartment").data("id") ? this.$("#parentDepartment").data("id") : null;
                var nestingLevel = this.$("#parentDepartment").data('level');
                var departmentManager = this.$("#departmentManager").data("id");
                var users = this.$el.find("#targetUsers li");
                var res = _.filter(this.responseObj["#parentDepartment"], function (item) {
                    return item.parentDepartment === parentDepartment;
                });
                users = _.map(users, function (elm) {
                    return $(elm).attr('id');
                });
                this.model.save({
                        departmentName   : departmentName,
                        parentDepartment : parentDepartment,
                        departmentManager: departmentManager,
                        nestingLevel     : ++nestingLevel,
                        users            : users,
                        sequence         : res.length
                    },
                    {
                        headers: {
                            mid: mid
                        },
                        wait   : true,
                        success: function (model) {
                            Backbone.history.navigate("easyErp/Departments", {trigger: true});
                        },
                        error  : function (model, xhr) {
                            self.errorNotification(xhr);
                        }
                    });
            },
            hideDialog   : function () {
                $(".create-dialog").remove();
            },
            hideNewSelect: function (e) {
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

            chooseOption: function (e) {
                $(e.target).parents("dd").find(".current-selected").text($(e.target).text()).attr("data-id", $(e.target).attr("id")).attr("data-level", $(e.target).data("level"));
            },

            render: function () {
                var self = this;
                var formString = this.template({});

                this.$el = $(formString).dialog({
                    autoOpen   : true,
                    resizable  : true,
                    dialogClass: "create-dialog",
                    width      : "950px",
                    buttons    : [
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
                        }]

                });
                populate.get2name("#departmentManager", "/employee/getPersonsForDd", {}, this, true, true);
                populate.getParrentDepartment("#parentDepartment", "/department/getSalesTeam", {}, this, true, true);
                common.populateUsersForGroups('#sourceUsers', '#targetUsers', null, 1);
                this.delegateEvents(this.events);
                return this;
            }
        });
        return CreateView;
    });