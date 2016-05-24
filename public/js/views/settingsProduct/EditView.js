define([
        "text!templates/settingsProduct/EditTemplate.html",
        "common",
        "custom",
        "populate"
    ],
    function (EditTemplate, common, Custom, populate) {
        var EditView = Backbone.View.extend({
            el         : "#content-holder",
            contentType: "productSettings",
            template   : _.template(EditTemplate),
            initialize : function (options) {
                _.bindAll(this, "render", "saveItem");
                _.bindAll(this, "render", "deleteItem");

                if (options.myModel) {
                    this.currentModel = options.myModel;
                } else {
                    this.currentModel = (options.model) ? options.model : options.collection.getElement();
                }
                this.currentModel.urlRoot = '/category';
                this.responseObj = {};
                this.render();
            },
            events     : {
                'click .dialog-tabs a'                                            : 'changeTab',
                'click #sourceUsers li'                                           : 'addUsers',
                'click #targetUsers li'                                           : 'removeUsers',
                "click .current-selected"                                         : "showNewSelect",
                "click"                                                           : "hideNewSelect",
                "click .prevUserList"                                             : "prevUserList",
                "click .nextUserList"                                             : "nextUserList",
                "click .newSelectList li:not(.miniStylePagination)"               : "chooseOption",
                "click .newSelectList li.miniStylePagination"                     : "notHide",
                "click .newSelectList li.miniStylePagination .next:not(.disabled)": "nextSelect",
                "click .newSelectList li.miniStylePagination .prev:not(.disabled)": "prevSelect"
            },
          /*  notHide    : function (e) {
                return false;
            },

            nextSelect: function (e) {
                this.showNewSelect(e, false, true)
            },
            prevSelect: function (e) {
                this.showNewSelect(e, true, false)
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
            },*/

            hideNewSelect: function (e) {
                $(".newSelectList").hide();
            },
            showNewSelect: function (e, prev, next) {
                populate.showSelect(e, prev, next, this);
                return false;
            },

            chooseOption: function (e) {
                $(e.target).parents("dd").find(".current-selected").text($(e.target).text()).attr("data-id", $(e.target).attr("id")).attr("data-level", $(e.target).data("level"));
            },

            saveItem  : function () {
                var self = this;
                var thisEl = this.$el;
                var mid = 39;
                var categoryName = $.trim(thisEl.find("#categoryName").val());
                var parentCategory = thisEl.find("#parentCategory").attr("data-id") || null;
                var nestingLevel = thisEl.find("#parentCategory").attr("data-level");
                var fullName = thisEl.find("#parentCategory").attr("data-fullname") + ' / ' + categoryName;
                var res = _.filter(this.responseObj["#parentCategory"], function (item) {
                    return (item.parent ? item.parent._id : null) === parentCategory;
                });

                if (parentCategory === this.currentModel.get('_id')) {
                    this.currentModel.set({
                        name        : categoryName,
                        parent      : null,
                        nestingLevel: 0,
                        sequence    : 0,
                        fullName    : fullName
                    });
                } else {
                    this.currentModel.set({
                        name        : categoryName,
                        parent      : parentCategory,
                        nestingLevel: ++nestingLevel,
                        sequence    : res.length,
                        fullName    : fullName
                    });
                }

                this.currentModel.save({}, {
                    headers: {
                        mid: mid
                    },
                    wait   : true,
                    success: function (model) {
                        Backbone.history.fragment = '';
                        Backbone.history.navigate("#easyErp/productSettings", {trigger: true});
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
                    model: this.currentModel.toJSON()
                });
                var self = this;
                this.$el = $(formString).dialog({
                    closeOnEscape: false,
                    autoOpen     : true,
                    resizable    : false,
                    dialogClass  : "edit-dialog",
                    width        : "950px",
                    title        : "Edit Category",
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

                populate.getParrentCategory("#parentCategory", "/category", {}, this);

                return this;
            }
        });
        return EditView;
    });