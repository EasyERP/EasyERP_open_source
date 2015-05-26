define([
        "text!templates/Product/CreateTemplate.html",
        "models/ProductModel",
        "common",
        "populate",
        'views/Notes/AttachView',
        'views/Assignees/AssigneesView',
        "jqueryBarcode"
],
    function (CreateTemplate, ProductModel, common, populate, attachView, AssigneesView) {

        var CreateView = Backbone.View.extend({
            el: "#content-holder",
            contentType: "Product",
            template: _.template(CreateTemplate),
            imageSrc: '',
            initialize: function () {
                _.bindAll(this, "saveItem");
                this.model = new ProductModel();
                this.responseObj = {};
                this.render();
            },

            events: {
                "mouseenter .avatar": "showEdit",
                "mouseleave .avatar": "hideEdit",
                'keydown': 'keydownHandler',
                'click .dialog-tabs a': 'changeTab',
                "click .current-selected": "showNewSelect",
                "click .newSelectList li:not(.miniStylePagination)": "chooseOption",
                "click .newSelectList li.miniStylePagination": "notHide",
                "click .newSelectList li.miniStylePagination .next:not(.disabled)": "nextSelect",
                "click .newSelectList li.miniStylePagination .prev:not(.disabled)": "prevSelect",
                "click": "hideNewSelect",
                "click #subscription": "eventType",
                'keyup #barcode': 'drawBarcode',
                'change #barcode': 'drawBarcode'
            },

            drawBarcode: function() {
                var el = this.$el;
                var content = el.find("#barcode").val();

                if (!content) {
                    el.find("#bcTarget").empty();
                } else {
                    el.find("#bcTarget").barcode(el.find("#barcode").val(), "code128");
                }
            },

            eventType: function() {
                var container=this.$("#typeOfEvent");
                if (container.hasClass("hidden")) {
                    container.removeClass("hidden");
                } else {
                    container.addClass("hidden");
                }
            },
            notHide: function () {
                return false;
            },
            showNewSelect: function (e, prev, next) {
                populate.showSelect(e, prev, next, this);
                return false;
            },
            chooseOption: function (e) {
                $(e.target).parents("dd").find(".current-selected").text($(e.target).text()).attr("data-id", $(e.target).attr("id"));
                $(".newSelectList").hide();
            },
            nextSelect: function (e) {
                this.showNewSelect(e, false, true);
            },
            prevSelect: function (e) {
                this.showNewSelect(e, true, false);
            },
            hideNewSelect: function () {
                $(".newSelectList").hide();
            },
            addAttach: function (event) {
				var s= $(".inputAttach:last").val().split("\\")[$(".inputAttach:last").val().split('\\').length-1];
				$(".attachContainer").append('<li class="attachFile">'+
											 '<a href="javascript:;">'+s+'</a>'+
											 '<a href="javascript:;" class="deleteAttach">Delete</a></li>'
											 );
				$(".attachContainer .attachFile:last").append($(".input-file .inputAttach").attr("hidden","hidden"));
				$(".input-file").append('<input type="file" value="Choose File" class="inputAttach" name="attachfile">');
			},
			deleteAttach:function(e){
				$(e.target).closest(".attachFile").remove();
			},
            keydownHandler: function(e){
                switch (e.which){
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
            hideDialog: function () {
                $(".edit-dialog").remove();
                $(".add-group-dialog").remove();
                $(".add-user-dialog").remove();
                $(".crop-images-dialog").remove();
            },
            showEdit: function () {
                $(".upload").animate({
                    height: "20px",
                    display:"block"
                }, 250);
               
            },
            hideEdit: function () {
              $(".upload").animate({
                    height: "0px",
                    display: "block"
                }, 250);

            },
            fileSizeIsAcceptable: function(file){
                if(!file){return false;}
                return file.size < App.File.MAXSIZE;
            },
            saveItem: function () {
                var self = this;
                var mid = 58;
                var productModel = new ProductModel();
                var name =  $.trim(this.$el.find("#product").val());
                var description = $.trim(this.$el.find('.productDescriptionCreate').val());
				$("#createBtnDialog").attr("disabled","disabled");

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

                var canBeSold = this.$el.find('#solid').prop('checked');
                var canBeExpensed = this.$el.find('#expensed').prop('checked');
                var eventSubscription = this.$el.find('#subscription').prop('checked');
                var canBePurchased = this.$el.find('#purchased').prop('checked');
                var salePrice = this.$el.find("#salePrice").val();
                var barcode = $.trim(this.$el.find("#barcode").val());
                var isActive = $('#active').prop('checked');
                var productType = this.$("#productType").data("id");
                var valid = productModel.save({
                        canBeSold: canBeSold,
                        canBeExpensed: canBeExpensed,
                        eventSubscription: eventSubscription,
                        canBePurchased: canBePurchased,
                        imageSrc: this.imageSrc,
                        name: name,
                        info: {
                            productType: productType,
                            salePrice: salePrice ? salePrice : 0,
                            isActive: isActive,
                            barcode: barcode,
                            description: description
                        },
                        groups: {
                            owner: $("#allUsersSelect").data("id"),
                            users: usersId,
                            group: groupsId
                        },
                        whoCanRW: whoCanRW
                    },
                {
                    headers: {
                        mid: mid
                    },
                    wait: true,
                    success: function (model, response) {
                        self.attachView.sendToServer(null,model.changed);
                    },
                    error: function (model, xhr) {
    					self.errorNotification(xhr);
                    }
                });
				if (!valid){
						$("#createBtnDialog").removeAttr("disabled");
				}
            },

            render: function () {
                var formString = this.template();
                var self = this;
                this.$el = $(formString).dialog({
                    dialogClass: "edit-dialog",
                    width: 900,
                    title: "Create Product",
                    buttons:{
                        save:{
                            text: "Create",
                            class: "btn",
							id:"createBtnDialog",
                            click: self.saveItem
                        },
                        cancel:{
                            text: "Cancel",
                            class: "btn",
                            click: function(){
                                self.hideDialog();
                            }
                        }
                    }
                });

                var notDiv = this.$el.find('.attach-container');
                this.attachView = new attachView({
                    model: new ProductModel,
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

                populate.get("#productType", "/product/getProductsTypeForDd", {}, 'name', this, true, true);
                //populate.get2name("#eventType", "/Customer", {}, this, true);
                common.canvasDraw({ model: this.model.toJSON() }, this);
                this.delegateEvents(this.events);
                return this;
            }

        });

        return CreateView;
    });
