define([
        'Backbone',
        'jQuery',
        'Underscore',
        "text!templates/settingsProduct/CreateTemplate.html",
        "models/Category",
        "common",
        "custom",
        "populate"
    ],
    function (Backbone, $, _, CreateTemplate, Model, common, Custom, populate) {

        var CreateView = Backbone.View.extend({
            el         : "#content-holder",
            contentType: "Departments",
            template   : _.template(CreateTemplate),

            initialize: function (options) {
                _.bindAll(this, "saveItem", "render");
                this.model = new Model();
                this.responseObj = {};
                this.render();
            },
            events    : {
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
                // 'keydown': 'keydownHandler'
            },

            close: function () {
                this._modelBinder.unbind();
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

                if (fullName) {
                    fullName += ' / ' + categoryName;
                } else {
                    fullName = categoryName;
                }

                this.model.save({
                        name        : categoryName,
                        parent      : parentCategory,
                        nestingLevel: ++nestingLevel,
                        sequence    : res.length,
                        fullName    : fullName
                    },
                    {
                        headers: {
                            mid: mid
                        },
                        wait   : true,
                        success: function (model) {
                            Backbone.history.fragment = '';
                            Backbone.history.navigate("easyErp/productSettings", {trigger: true});
                        },
                        error  : function (model, xhr) {
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
                    autoOpen   : true,
                    resizable  : true,
                    dialogClass: "create-dialog",
                    width      : "900px",
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

                populate.getParrentCategory("#parentCategory", "/category", {}, this, true);
                this.delegateEvents(this.events);
                return this;
            }
        });
        return CreateView;
    });