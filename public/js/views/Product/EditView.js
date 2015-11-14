define([
        "text!templates/Product/EditTemplate.html",
        'views/Assignees/AssigneesView',
        "common",
        "custom",
        "dataService",
        "populate",
        'views/Notes/AttachView',
        "constants"
    ],
    function (EditTemplate, AssigneesView, common, Custom, dataService, populate, attachView, CONSTANTS) {

        var EditView = Backbone.View.extend({
            contentType: "Product",
            imageSrc   : '',
            template   : _.template(EditTemplate),

            initialize: function (options) {
                _.bindAll(this, "render", "saveItem");
                _.bindAll(this, "render", "deleteItem");
                this.currentModel = (options.model) ? options.model : options.collection.getElement();
                this.currentModel.urlRoot = "/Product";
                this.responseObj = {};
                this.render();
            },

            events: {
                "click #saveBtn"                                                  : "saveItem",
                "click #cancelBtn"                                                : "hideDialog",
                "click .current-selected"                                         : "showNewSelect",
                "click"                                                           : "hideNewSelect",
                "mouseenter .avatar"                                              : "showEdit",
                "mouseleave .avatar"                                              : "hideEdit",
                'click .dialog-tabs a'                                            : 'changeTab',
                "click .newSelectList li:not(.miniStylePagination)"               : "chooseOption",
                "click .newSelectList li.miniStylePagination"                     : "notHide",
                "click .newSelectList li.miniStylePagination .next:not(.disabled)": "nextSelect",
                "click .newSelectList li.miniStylePagination .prev:not(.disabled)": "prevSelect",
                "click .details"                                                  : "showDetailsBox",
                'keyup #barcode'                                                  : 'drawBarcode',
                'change #barcode'                                                 : 'drawBarcode'
            },

            drawBarcode: function () {
                var el = this.$el;
                var content = el.find("#barcode").val();

                if (!content) {
                    el.find("#bcTarget").empty();
                } else {
                    el.find("#bcTarget").barcode(el.find("#barcode").val(), "code128");
                }
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
                var n;
                var dialog_holder;
                var closestEl = holder.closest('.dialog-tabs');
                var dataClass = closestEl.data('class');
                var selector = '.dialog-tabs-items.' + dataClass;
                var itemActiveSelector = '.dialog-tabs-item.' + dataClass + '.active';
                var itemSelector = '.dialog-tabs-item.' + dataClass;

                closestEl.find("a.active").removeClass("active");
                holder.addClass("active");

                n = holder.parents(".dialog-tabs").find("li").index(holder.parent());
                dialog_holder = $(selector);

                dialog_holder.find(itemActiveSelector).removeClass("active");
                dialog_holder.find(itemSelector).eq(n).addClass("active");
            },

            chooseUser: function (e) {
                $(e.target).toggleClass("choosen");
            },

            hideDialog: function () {
                $('.edit-dialog').remove();
                $(".crop-images-dialog").remove();
                $(".add-group-dialog").remove();
                $(".add-user-dialog").remove();
            },
            showEdit  : function () {
                $(".upload").animate({
                    height : "20px",
                    display: "block"
                }, 250);

            },
            hideEdit  : function () {
                $(".upload").animate({
                    height : "0px",
                    display: "block"
                }, 250);

            },
            saveItem  : function () {
                var self = this;

                var name = $.trim(this.$el.find("#product").val());
                var description = $.trim(this.$el.find('textarea.productDescriptionCreate').val());

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

                var canBeSold = this.$el.find('#sold').prop('checked');
                var canBeExpensed = this.$el.find('#expensed').prop('checked');
                var eventSubscription = this.$el.find('#subscription').prop('checked');
                var canBePurchased = this.$el.find('#purchased').prop('checked');
                var salePrice = this.$el.find("#salePrice").val();
                var barcode = $.trim(this.$el.find("#barcode").val());
                var isActive = this.$el.find('#active').prop('checked');
                var productType = this.$el.find("#productType").data("id");
                var categoryEl = this.$el.find('#productCategory');
                var category = {
                    _id : categoryEl.data('id'),
                    name: categoryEl.text()
                };
                var data = {
                    canBeSold        : canBeSold,
                    canBeExpensed    : canBeExpensed,
                    eventSubscription: eventSubscription,
                    canBePurchased   : canBePurchased,
                    imageSrc         : this.imageSrc,
                    name             : name,
                    info             : {
                        productType: productType,
                        salePrice  : salePrice ? salePrice : 0,
                        isActive   : isActive,
                        barcode    : barcode,
                        description: description
                    },
                    accounting       : {
                        category: category
                    },
                    groups           : {
                        owner: $("#allUsersSelect").data("id"),
                        users: usersId,
                        group: groupsId
                    },
                    whoCanRW         : whoCanRW
                };
                this.currentModel.set(data);
                this.currentModel.save(this.currentModel.changed, {
                    headers: {
                        mid: 58
                    },
                    patch  : true,
                    success: function (model) {
                        Backbone.history.fragment = "";
                        Backbone.history.navigate(window.location.hash, {trigger: true});
                        self.hideDialog();
                    },
                    error  : function (model, xhr) {
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
            chooseOption : function (e) {
                $(e.target).parents("dd").find(".current-selected").text($(e.target).text()).attr("data-id", $(e.target).attr("id"));
            },

            deleteItem   : function (event) {
                var mid = 58;
                var id = this.currentModel.get('_id');
                var self = this;
                var answer = confirm("Really DELETE items ?!");

                event.preventDefault();

                if (CONSTANTS.PRODUCRSERVICE !== id.toString()){
                    if (answer == true) {
                        this.currentModel.destroy({
                            headers: {
                                mid: mid
                            },
                            success: function () {
                                $('.edit-product-dialog').remove();
                                Backbone.history.navigate("easyErp/" + self.contentType, {trigger: true});
                            },
                            error  : function (model, err) {
                                if (err.status === 403) {
                                    alert("You do not have permission to perform this action");
                                }
                            }
                        });
                    }
                } else {
                    alert("You do not have permission to delete this product");
                }
            },

            render       : function () {
                var self = this;
                var formString = this.template({
                    model: this.currentModel.toJSON()
                });
                this.$el = $(formString).dialog({
                    closeOnEscape: false,
                    autoOpen     : true,
                    resizable    : true,
                    dialogClass  : "edit-dialog",
                    title        : "Edit Product",
                    width        : "900",
                    buttons      : {
                        save  : {
                            text : "Save",
                            class: "btn",
                            click: self.saveItem
                        },
                        cancel: {
                            text : "Cancel",
                            class: "btn",
                            click: self.hideDialog
                        },
                        delete: {
                            text : "Delete",
                            class: "btn",
                            click: self.deleteItem
                        }
                    }
                });


                var model = this.currentModel.toJSON();
                this.$el.find("#bcTarget").barcode(model.info.barcode, "code128");

                var notDiv = this.$el.find('.attach-container');
                this.attachView = new attachView({
                    model   : this.currentModel,
                    url     : "/product/uploadProductFiles",
                    isCreate: true
                });
                notDiv.append(this.attachView.render().el);

                notDiv = this.$el.find('.assignees-container');
                notDiv.append(
                    new AssigneesView({
                        model: this.currentModel
                    }).render().el
                );
                populate.get("#productType", "/product/getProductsTypeForDd", {}, 'name', this);
                populate.get("#productCategory", "/category", {}, 'fullName', this);
                common.canvasDraw({model: this.model.toJSON()}, this);

                this.delegateEvents(this.events);

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
                return this;
            }

        });

        return EditView;
    });
