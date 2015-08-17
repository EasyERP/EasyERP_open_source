define([
        "text!templates/settingsProduct/CreateTemplate.html",
        "models/Category",
        "common",
        "custom",
        "populate"
    ],
    function (CreateTemplate, Model, common, Custom, populate) {

        var CreateView = Backbone.View.extend({
            el: "#content-holder",
            contentType: "Departments",
            template: _.template(CreateTemplate),

            initialize: function (options) {
                _.bindAll(this, "saveItem", "render");
                //this.departmentsCollection = new DepartmentsCollection();
                this.model = new Model();
                this.responseObj = {};
                this.render();
            },
            events: {
                'click .dialog-tabs a': 'changeTab',
                'click #sourceUsers li': 'addUsers',
                'click #targetUsers li': 'removeUsers',
                "click .current-selected": "showNewSelect",
                "click": "hideNewSelect",
                "click .prevUserList": "prevUserList",
                "click .nextUserList": "nextUserList",
                "click .newSelectList li:not(.miniStylePagination)": "chooseOption",
                "click .newSelectList li.miniStylePagination": "notHide",
                "click .newSelectList li.miniStylePagination .next:not(.disabled)": "nextSelect",
                "click .newSelectList li.miniStylePagination .prev:not(.disabled)": "prevSelect",
                // 'keydown': 'keydownHandler'
            },
            notHide: function (e) {
                return false;
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
            nextSelect: function (e) {
                this.showNewSelect(e, false, true);
            },
            prevSelect: function (e) {
                this.showNewSelect(e, true, false);
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
            chooseUser: function (e) {
                $(e.target).toggleClass("choosen");
            },
            changeTab: function (e) {
                $(e.target).closest(".dialog-tabs").find("a.active").removeClass("active");
                $(e.target).addClass("active");
                var n = $(e.target).parents(".dialog-tabs").find("li").index($(e.target).parent());
                $(".dialog-tabs-items").find(".dialog-tabs-item.active").removeClass("active");
                $(".dialog-tabs-items").find(".dialog-tabs-item").eq(n).addClass("active");
            },
            close: function () {
                this._modelBinder.unbind();
            },
            addUsers: function (e) {
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

            saveItem: function () {
                var thisEl = this.$el;
                var self = this;
                var mid = 39;
                var categoryName = $.trim(thisEl.find("#categoryName").val());
                var parentCategory = thisEl.find("#parentCategory").data("id") || null;
                var nestingLevel = thisEl.find("#parentCategory").data('level');
                var fullName = thisEl.find("#parentCategory").data('fullname');
                var res = _.filter(this.responseObj["#parentCategory"], function (item) {
                    return item.parentCategory === parentCategory;
                });

                fullName += ' / ' + categoryName

                this.model.save({
                        name: categoryName,
                        parentCategory: parentCategory,
                        nestingLevel: ++nestingLevel,
                        sequence: res.length,
                        fullName: fullName
                    },
                    {
                        headers: {
                            mid: mid
                        },
                        wait: true,
                        success: function (model) {
                            Backbone.history.fragment = '';
                            Backbone.history.navigate("easyErp/productSettings", {trigger: true});
                        },
                        error: function (model, xhr) {
                            self.errorNotification(xhr);
                        }
                    });
            },
            hideDialog: function () {
                $(".create-dialog").remove();
            },
            hideNewSelect: function (e) {
                $(".newSelectList").hide();
            },
            showNewSelect: function (e, prev, next) {
                populate.showSelect(e, prev, next, this);
                return false;
            },

            chooseOption: function (e) {
                $(e.target).parents("dd").find(".current-selected").text($(e.target).text()).attr("data-id", $(e.target).attr("id")).attr("data-level", $(e.target).data("level")).attr("data-fullname", $(e.target).data("fullname"));
            },

            render: function () {
                var self = this;
                var formString = this.template({});

                this.$el = $(formString).dialog({
                    autoOpen: true,
                    resizable: true,
                    dialogClass: "create-dialog",
                    width: "900px",
                    buttons: [
                        {
                            text: "Create",
                            click: function () {
                                self.saveItem();
                            }
                        },
                        {
                            text: "Cancel",
                            click: function () {
                                self.hideDialog();
                            }
                        }]

                });
                populate.getParrentCategory("#parentCategory", "/category", {}, this, true);
                this.delegateEvents(this.events);
                return this;
            }
        });
        return CreateView;
    });