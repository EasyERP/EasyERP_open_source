define([
        "text!templates/Departments/EditTemplate.html",
        'views/selectView/selectView',
        "collections/Departments/DepartmentsCollection",
        "collections/Customers/AccountsDdCollection",
        "common",
        "custom",
        "populate",
        'constants'
    ],
    function (EditTemplate, selectView, DepartmentsCollection, AccountsDdCollection, common, Custom, populate, CONSTANTS) {
        var EditView = Backbone.View.extend({
            el         : "#content-holder",
            contentType: "Departments",
            template   : _.template(EditTemplate),
            initialize : function (options) {
                _.bindAll(this, "render", "saveItem");
                this.departmentsCollection = new DepartmentsCollection();
                _.bindAll(this, "render", "deleteItem");
                if (options.myModel) {
                    this.currentModel = options.myModel;
                }
                else {
                    this.currentModel = (options.model) ? options.model : options.collection.getElement();
                }
                this.currentModel.urlRoot = '/Departments';
                this.responseObj = {};
                this.render();
            },
            events     : {
                'click .dialog-tabs a'                             : 'changeTab',
                'click #sourceUsers li'                            : 'addUsers',
                'click #targetUsers li'                            : 'removeUsers',
                "click .current-selected"                          : "showNewSelect",
                "click"                                            : "hideNewSelect",
                "click .prevUserList"                              : "prevUserList",
                "click .nextUserList"                              : "nextUserList",
                "click .newSelectList li:not(.miniStylePagination)": "chooseOption"
            },

            nextUserList: function (e, page) {
                $(e.target).closest(".left").find("ul").attr("data-page", parseInt($(e.target).closest(".left").find("ul").attr("data-page")) + 1);
                this.updateAssigneesPagination($(e.target).closest(".left"));

            },

            prevUserList: function (e, page) {
                $(e.target).closest(".left").find("ul").attr("data-page", parseInt($(e.target).closest(".left").find("ul").attr("data-page")) - 1);
                this.updateAssigneesPagination($(e.target).closest(".left"));
            },

            chooseUser: function (e) {
                $(e.target).toggleClass("choosen");
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

            addUsers   : function (e) {
                e.preventDefault();
                var div = $(e.target).parents(".left");
                $('#targetUsers').append($(e.target));
                this.updateAssigneesPagination(div);
                div = $(e.target).parents(".left");
                this.updateAssigneesPagination(div);
            },
            removeUsers: function (e) {
                e.preventDefault();
                var div = $(e.target).parents(".left");
                $('#sourceUsers').append($(e.target));
                this.updateAssigneesPagination(div);
                div = $(e.target).parents(".left");
                this.updateAssigneesPagination(div);
            },
            changeTab  : function (e) {
                $(e.target).closest(".dialog-tabs").find("a.active").removeClass("active");
                $(e.target).addClass("active");
                var n = $(e.target).parents(".dialog-tabs").find("li").index($(e.target).parent());
                $(".dialog-tabs-items").find(".dialog-tabs-item.active").removeClass("active");
                $(".dialog-tabs-items").find(".dialog-tabs-item").eq(n).addClass("active");
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

            saveItem  : function () {
                var self = this;
                var mid = 39;
                var departmentName = $.trim($("#departmentName").val());
                var parentDepartment = this.$("#parentDepartment").data("id") ? this.$("#parentDepartment").data("id") : null;
                if (parentDepartment == "") {
                    parentDepartment = null;
                }
                var departmentManager = this.$("#departmentManager").data("id");
                if (departmentManager == "") {
                    departmentManager = null;
                }
                var nestingLevel = parseInt(this.$("#parentDepartment").data('level')) + 1;
                if (!nestingLevel) {
                    nestingLevel = 0;
                }
                var users = this.$el.find("#targetUsers li");
                var res = _.filter(this.responseObj["#parentDepartment"], function (item) {
                    return item.parentDepartment === parentDepartment;
                });
                users = _.map(users, function (elm) {
                    return $(elm).attr('id');
                });

                this.currentModel.set({
                    departmentName   : departmentName,
                    parentDepartment : parentDepartment,
                    departmentManager: departmentManager,
                    nestingLevel     : nestingLevel,
                    users            : users,
                    isAllUpdate      : nestingLevel != this.currentModel.toJSON().nestingLevel,
                    sequence         : res.length
                });

                this.currentModel.save({}, {
                    headers: {
                        mid: mid
                    },
                    wait   : true,
                    success: function (model) {
                        Backbone.history.navigate("#easyErp/Departments", {trigger: true});
                    },
                    error  : function (model, xhr) {
                        self.errorNotification(xhr);
                    }
                });
            },
            hideDialog: function () {
                $(".create-dialog").remove();
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
                            $('.edit-dialog').remove();
                            Backbone.history.navigate("easyErp/" + self.contentType, {trigger: true});
                        },
                        error  : function (model, xhr) {
                            self.errorNotification(xhr);
                        }
                    });
                }
            },
            render    : function () {
                var formString = this.template({
                    model: this.currentModel.toJSON(),
                });
                var self = this;
                this.$el = $(formString).dialog({
                    closeOnEscape: false,
                    autoOpen     : true,
                    resizable    : false,
                    dialogClass  : "edit-dialog",
                    width        : "950px",
                    title        : "Edit Department",
                    buttons      : [{
                        text : "Save",
                        click: function () {
                            self.saveItem();
                        }
                    },
                        {
                            text : "Cancel",
                            click: function () {
                                $(this).remove();
                            }
                        },
                        {
                            text : "Delete",
                            click: self.deleteItem
                        }]
                });
                populate.get2name("#departmentManager", CONSTANTS.URLS.EMPLOYEES_PERSONSFORDD, {}, this, false, true);
                populate.getParrentDepartment("#parentDepartment", "/departments/getDepartmentsForEditDd", {id: this.currentModel.toJSON()._id}, this, false, true);
                var k = this.currentModel.toJSON().users;
                var b = $.map(this.currentModel.toJSON().users, function (item) {
                    return $('<li/>').text(item.login).attr("id", item._id);
                });
                $('#targetUsers').append(b);
                common.populateUsersForGroups('#sourceUsers', '#targetUsers', this.currentModel.toJSON(), 1, function () {
                    self.updateAssigneesPagination($("#targetUsers").parent());
                    self.updateAssigneesPagination($("#sourceUsers").parent());
                });
                return this;
            }
        });
        return EditView;
    });