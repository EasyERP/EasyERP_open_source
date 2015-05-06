define([
    "text!templates/Product/CreateTemplate.html",
    "models/ProductModel",
    "common",
    "populate",
    'views/Notes/AttachView',
    'views/Assignees/AssigneesView'
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
                "click .current-selected": "showNewSelect",
                "click .newSelectList li:not(.miniStylePagination)": "chooseOption",
                "click .newSelectList li.miniStylePagination": "notHide",
                "click .newSelectList li.miniStylePagination .next:not(.disabled)": "nextSelect",
                "click .newSelectList li.miniStylePagination .prev:not(.disabled)": "prevSelect",
                "click": "hideNewSelect",
                "click #subscription": "eventType"
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
				$("#createBtnDialog").attr("disabled","disabled");

                var canBeSold = $('#solid').prop('checked') ? true : false;
                var canBeExpensed = $('#expensed').prop('checked') ? true : false;
                var eventSubscription = $('#subscription').prop('checked') ? true : false;
                var canBePurchased = $('#purchased').prop('checked') ? true : false;
                var salePrice = $.trim(this.$el.find("#salePrice").val());
                var barcode = $.trim(this.$el.find("#barcode").val());
                var isActive = $('#active').prop('checked') ? true : false;
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
                    width: 800,
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
                    url:"/uploadEmployeesFiles",
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
