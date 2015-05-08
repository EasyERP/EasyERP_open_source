define([
        "text!templates/Product/EditTemplate.html",
        'views/Assignees/AssigneesView',
        "common",
        "custom",
        "dataService",
        "populate",
        'views/Notes/AttachView'
    ],
    function (EditTemplate, AssigneesView, common, Custom, dataService, populate, attachView) {

        var EditView = Backbone.View.extend({
            contentType: "Product",
            imageSrc: '',
            template: _.template(EditTemplate),

            initialize: function (options) {
                _.bindAll(this, "render", "saveItem");
                _.bindAll(this, "render", "deleteItem");
                this.currentModel = (options.model) ? options.model : options.collection.getElement();
                this.currentModel.urlRoot = "/Product";
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
                "click .details":"showDetailsBox"
            },

            showDetailsBox:function(e){
                $(e.target).parent().find(".details-box").toggle();
            },
            notHide: function () {
                return false;
            },
            nextSelect:function(e){
                this.showNewSelect(e,false,true);
            },
            prevSelect:function(e){
                this.showNewSelect(e,true,false);
            },

            changeTab:function(e){
                var holder = $(e.target);
                holder.closest(".dialog-tabs").find("a.active").removeClass("active");
                holder.addClass("active");
                var n= holder.parents(".dialog-tabs").find("li").index(holder.parent());
                var dialog_holder = $(".dialog-tabs-items");
                dialog_holder.find(".dialog-tabs-item.active").removeClass("active");
                dialog_holder.find(".dialog-tabs-item").eq(n).addClass("active");
            },

            chooseUser: function(e){
                $(e.target).toggleClass("choosen");
            },
            hideDialog: function () {
                $('.edit-dialog').remove();
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

                var name =  $.trim(this.$el.find("#product").val());

                var canBeSold = $('#solid').prop('checked');
                var canBeExpensed = $('#expensed').prop('checked');
                var eventSubscription = $('#subscription').prop('checked');
                var canBePurchased = $('#purchased').prop('checked');
                var salePrice = $.trim(this.$el.find("#salePrice").val());
                var barcode = $.trim(this.$el.find("#barcode").val());
                var isActive = $('#active').prop('checked');
                var productType = this.$("#productType").data("id");
                var data = {
                        canBeSold: canBeSold,
                        canBeExpensed: canBeExpensed,
                        eventSubscription: eventSubscription,
                        canBePurchased: canBePurchased,
                        imageSrc: this.imageSrc,
                        name: name,
                        info: {
                            productType: productType,
                            salePrice: salePrice,
                            isActive: isActive,
                            barcode: barcode,
                            description: ""
                        },
                        workflow: null,
                        whoCanRW: 'everyOne',
                        groups: {
                            owner: null,
                            users: null,
                            group: null
                        }
                    };
                this.currentModel.set(data);
                this.currentModel.save(this.currentModel.changed, {
                    headers: {
                        mid: 58
                    },
                    patch: true,
                    success: function (model) {
                        Backbone.history.fragment = "";
                        Backbone.history.navigate("easyErp/Product/form/" + model.id, { trigger: true });
                        self.hideDialog();
                    },
                    error: function (model, xhr) {
                        self.errorNotification(xhr);
                    }

                });
            },

            showNewSelect:function(e,prev,next){
                populate.showSelect(e,prev,next,this);
                return false;

            },

            hideNewSelect: function () {
                $(".newSelectList").hide();
            },
            chooseOption: function (e) {
                $(e.target).parents("dd").find(".current-selected").text($(e.target).text()).attr("data-id",$(e.target).attr("id"));
            },
            deleteItem: function(event) {
                var mid = 58;
                event.preventDefault();
                var self = this;
                var answer = confirm("Realy DELETE items ?!");
                if (answer == true) {
                    this.currentModel.destroy({
                        headers: {
                            mid: mid
                        },
                        success: function () {
                            $('.edit-product-dialog').remove();
                            Backbone.history.navigate("easyErp/" + self.contentType, { trigger: true });
                        },
                        error: function (model, err) {
                            if (err.status===403){
                                alert("You do not have permission to perform this action");
                            }
                        }
                    });
                }

            },
            render: function () {
                var self = this;
                var formString = this.template({
                    model: this.currentModel.toJSON()
                });
                this.$el = $(formString).dialog({
                    closeOnEscape: false,
                    autoOpen: true,
                    resizable: true,
                    dialogClass: "edit-dialog",
                    title: "Edit Product",
                    width: "900",
                    buttons:{
                        save:{
                            text: "Save",
                            class: "btn",
                            click: self.saveItem
                        },
                        cancel:{
                            text: "Cancel",
                            class: "btn",
                            click: self.hideDialog
                        },
                        delete:{
                            text: "Delete",
                            class: "btn",
                            click: self.deleteItem
                        }
                    }

                });

                var notDiv = this.$el.find('.attach-container');
                this.attachView = new attachView({
                    model: this.currentModel,
                    url:"/product/uploadProductFiles",
                    isCreate:true
                });
                notDiv.append(this.attachView.render().el);
                notDiv = this.$el.find('.assignees-container');
                notDiv.append(
                    new AssigneesView({
                        model: this.currentModel
                    }).render().el
                );
                populate.get("#productType", "/product/getProductsTypeForDd", {}, 'name', this);
                common.canvasDraw({ model: this.model.toJSON() }, this);
                this.delegateEvents(this.events);
                return this;
            }

        });

        return EditView;
    });
