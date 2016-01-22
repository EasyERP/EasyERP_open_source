define([
    "Backbone",
    "jQuery",
    "Underscore",
    'text!templates/Assignees/AssigneesTemplate.html',
    'text!templates/Assignees/addGroupDialog.html',
    'text!templates/Assignees/addUserDialog.html',
    'views/selectView/selectView',
    'common',
    "populate"

], function (Backbone, $, _, assigneesTemplate, addGroupTemplate, addUserTemplate, selectView, common, populate) {
    var AssigneesView = Backbone.View.extend({

        initialize: function (options) {
            this.remove();
            this.model = options.model;
            this.responseObj = {};
        },

        events: {
            'click .addUser'                                   : 'addUser',
            'click .addGroup'                                  : 'addGroup',
            'click .unassign'                                  : 'unassign',
            "click .prevUserList"                              : "prevUserList",
            "click .nextUserList"                              : "nextUserList",
            "click .current-selected"                          : "showNewSelect",
            "click .newSelectList li:not(.miniStylePagination)": "chooseOption",
            "click"                                            : "hideNewSelect"
        },

        template: _.template(assigneesTemplate),

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

        chooseOption: function (e) {
            $(e.target).parents("dd").find(".current-selected").text($(e.target).text()).attr("data-id", $(e.target).attr("id"));

            this.hideNewSelect();
        },

        hideNewSelect: function () {
            if (this.selectView) {
                this.selectView.remove();
            }
        },

        unassign    : function (e) {
            var holder = $(e.target);
            var id = holder.closest("tr").data("id");
            var type = holder.closest("tr").data("type");
            var text = holder.closest("tr").find("td").eq(0).text();
            $("#" + type).append("<option value='" + id + "'>" + text + "</option>");
            holder.closest("tr").remove();
            var groupsAndUser_holder = $(".groupsAndUser");
            if (groupsAndUser_holder.find("tr").length === 1) {
                groupsAndUser_holder.hide();
            }
        },
        nextUserList: function (e, page) {
            $(e.target).closest(".left").find("ul").attr("data-page", parseInt($(e.target).closest(".left").find("ul").attr("data-page")) + 1);
            e.data.self.updateAssigneesPagination($(e.target).closest(".left"));
        },

        prevUserList: function (e, page) {
            $(e.target).closest(".left").find("ul").attr("data-page", parseInt($(e.target).closest(".left").find("ul").attr("data-page")) - 1);
            e.data.self.updateAssigneesPagination($(e.target).closest(".left"));
        },
        addUsers    : function (e) {
            e.preventDefault();
            $(e.target).parents("ul").find("li:not(:visible)").eq(0).show();
            var div = $(e.target).parents(".left");
            if ($(e.target).hasClass("temp")) {
                $(e.target).closest(".ui-dialog").find(".target").append($(e.target).removeClass("temp"));
            } else {
                $(e.target).closest(".ui-dialog").find(".target").append($(e.target).addClass("temp"));
            }
            e.data.self.updateAssigneesPagination(div);
            div = $(e.target).parents(".left");
            e.data.self.updateAssigneesPagination(div);
        },

        removeUsers              : function (e) {
            e.preventDefault();
            var div = $(e.target).parents(".left");
            if ($(e.target).hasClass("temp")) {
                $(e.target).closest(".ui-dialog").find(".source").append($(e.target).removeClass("temp"));
            } else {
                $(e.target).closest(".ui-dialog").find(".source").append($(e.target).addClass("temp"));
            }
            e.data.self.updateAssigneesPagination(div);
            div = $(e.target).parents(".left");
            e.data.self.updateAssigneesPagination(div);
        },
        closeDialog              : function (e) {
            $(e.target).closest(".ui-dialog").find(".source").find(".temp").each(function () {
                $(e.target).closest(".ui-dialog").find(".target").append($(this).removeClass("temp"));
            });
            $(e.target).closest(".ui-dialog").find(".target").find(".temp").each(function () {
                $(e.target).closest(".ui-dialog").find(".source").append($(this).removeClass("temp"));
            });

            $(".addUserDialog").remove();
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
            if (!list.attr("data-page")) {
                list.attr("data-page", 1);
            }
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

        addUser       : function () {
            var self = this;
            var addUser = _.template(addUserTemplate)();
            var dialog;
            var userDialog = $('#addUseDialog');

            if (userDialog.length) {
                this.updateAssigneesPagination(userDialog.find("#sourceUsers").closest(".left")); // need refresh if cancel Dialog
                this.updateAssigneesPagination(userDialog.find("#targetUsers").closest(".left"));
                return userDialog.dialog("open");
            }

            dialog = $(addUser).dialog({
                dialogClass: "add-user-dialog",
                width      : "900px",
                buttons    : {
                    save  : {
                        text : "Choose",
                        class: "btn",

                        click: function (e) {
                            self.addUserToTable("#targetUsers");
                            $(this).find(".temp").removeClass("temp");
                            $(this).dialog("close");
                        }

                    },
                    cancel: {
                        text : "Cancel",
                        class: "btn",
                        click: function (e) {
                            $(this).dialog("close");
                            self.closeDialog(e);
                            //$("#targetUsers").unbind("click");
                            //$("#sourceUsers").unbind("click");
                        }
                    }
                }

            });

            if (this.model) {
                common.populateUsersForGroups(dialog.find('#sourceUsers'), dialog.find('#targetUsers'), this.model.toJSON(), 1);
            } else {
                common.populateUsersForGroups(dialog.find('#sourceUsers'), dialog.find('#targetUsers'), null, 1);
            }

            this.updateAssigneesPagination(dialog.find("#sourceUsers").closest(".left"));
            this.updateAssigneesPagination(dialog.find("#targetUsers").closest(".left"));
            dialog.find("#targetUsers").unbind("click");
            dialog.find("#sourceUsers").unbind("click");
            dialog.find("#targetUsers").on("click", "li", {self: this}, this.removeUsers);
            dialog.find("#sourceUsers").on("click", "li", {self: this}, this.addUsers);
            $(dialog).on("click", ".nextUserList", {self: this}, function (e) {
                self.nextUserList(e);
            });
            $(dialog).on("click", ".prevUserList", {self: this}, function (e) {
                self.prevUserList(e);
            });
        },
        addUserToTable: function (id) {
            var groupsAndUser = $(".groupsAndUser");
            var groupsAndUserTr = $(".groupsAndUser tr");
            groupsAndUser.show();
            groupsAndUserTr.each(function () {
                if ($(this).data("type") == id.replace("#", "")) {
                    $(this).remove();
                }
            });
            $(id).find("li").each(function () {
                groupsAndUser.append("<tr data-type='" + id.replace("#", "") + "' data-id='" + $(this).attr("id") + "'><td>" + $(this).text() + "</td><td class='text-right'></td></tr>");
            });
            if ($(".groupsAndUser tr").length < 2) {
                groupsAndUser.hide();
            }

            if (this.model) {
                this.model.trigger('chooseAssignee');
            }

        },

        addGroup: function () {
            var self = this;
            var addGroup = _.template(addGroupTemplate)();
            var userDialog = $('#addGroupDialog');
            var dialog;

            if (userDialog.length) {
                this.updateAssigneesPagination(userDialog.find("#sourceGroups").closest(".left")); // need refresh if cancel Dialog
                this.updateAssigneesPagination(userDialog.find("#targetGroups").closest(".left"));
                return userDialog.dialog("open");
            }

            dialog = $(addGroup).dialog({
                dialogClass: "add-group-dialog",
                width      : "900px",
                buttons    : {
                    save  : {
                        text : "Choose",
                        class: "btn",
                        click: function (e) {
                            self.addUserToTable("#targetGroups");
                            $(this).find(".temp").removeClass("temp");
                            $(this).dialog("close");
                        }
                    },
                    cancel: {
                        text : "Cancel",
                        class: "btn",
                        click: function (e) {
                            $(this).dialog("close");
                            self.closeDialog(e);
                            //$("#targetGroups").unbind("click");
                            //$("#sourceGroups").unbind("click");
                        }
                    }
                }

            });

            if (this.model) {
                common.populateDepartmentsList(dialog.find("#sourceGroups"), dialog.find("#targetGroups"), "/DepartmentsForDd", this.model.toJSON(), 1);
            } else {
                common.populateDepartmentsList(dialog.find("#sourceGroups"), dialog.find("#targetGroups"), "/DepartmentsForDd", null, 1);
            }

            this.updateAssigneesPagination(dialog.find("#sourceGroups").closest(".left"));
            this.updateAssigneesPagination(dialog.find("#targetGroups").closest(".left"));
            dialog.find("#targetGroups").on("click", "li", {self: this}, this.removeUsers);
            dialog.find("#sourceGroups").on("click", "li", {self: this}, this.addUsers);
            $(dialog).on("click", ".nextUserList", {self: this}, function (e) {
                self.nextUserList(e);
            });
            $(dialog).on("click", ".prevUserList", {self: this}, function (e) {
                self.prevUserList(e);
            });
        },

        render: function () {
            var owner = "";
            var whoCanRW = "everyOne";

            if (this.model && this.model.toJSON().groups && this.model.toJSON().groups.owner) {
                owner = this.model.toJSON().groups.owner;
                whoCanRW = this.model.toJSON().whoCanRW;
            }

            this.$el.html(this.template({owner: owner, whoCanRW: whoCanRW}));

            if (owner !== "") {
                populate.get("#allUsersSelect", "/UsersForDd", {}, "login", this);

            } else {
                populate.get("#allUsersSelect", "/UsersForDd", {}, "login", this, true);
            }
            return this;
        }
    });

    return AssigneesView;
});
