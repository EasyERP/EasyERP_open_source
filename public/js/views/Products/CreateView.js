define([
    'Backbone',
    'jQuery',
    'Underscore',
    'text!templates/Products/CreateTemplate.html',
    'views/dialogViewBase',
    'models/ProductModel',
    'common',
    'populate',
    'views/Notes/AttachView',
    'views/Assignees/AssigneesView',
    'constants'
], function (Backbone, $, _, CreateTemplate, ParentView, ProductModel, common, populate, AttachView, AssigneesView, CONSTANTS) {

    var CreateView = ParentView.extend({
        el      : '#content-holder',
        template: _.template(CreateTemplate),
        imageSrc: '',

        initialize: function (options) {
            this.mId = CONSTANTS.MID[this.contentType];
            this.eventChannel = options.eventChannel;
            _.bindAll(this, 'saveItem');

            if (options && options.contentType) {
                this.contentType = options.contentType;
            } else {
                this.contentType = CONSTANTS.PRODUCTS;
            }

            this.viewType = options.viewType || 'list';

            this.model = new ProductModel();
            this.responseObj = {};
            this.render();
        },

        events: {
            'mouseenter .avatar': 'showEdit',
            'mouseleave .avatar': 'hideEdit'
        },

        eventType: function () {
            var $container = this.$('#typeOfEvent');

            return $container.toggleClass('hidden');
        },

        chooseOption: function (e) {
            var $targetEl = $(e.target);
            var id = $targetEl.attr('id');

            $targetEl.parents('dd').find('.current-selected').text($targetEl.text()).attr('data-id', id);
            /* $('.newSelectList').hide();*/
        },

        deleteAttach: function (e) {
            $(e.target).closest('.attachFile').remove();
        },

        fileSizeIsAcceptable: function (file) {
            if (!file) {
                return false;
            }
            return file.size < App.File.MAXSIZE;
        },

        saveItem: function () {
            var $currEl = this.$el;
            var self = this;
            var mid = 58;
            var productModel = new ProductModel();
            var name = $.trim($currEl.find('#product').val());
            var description = $.trim($currEl.find('.productDescriptionCreate').val());
            var usersId = [];
            var groupsId = [];
            var valid;
            var whoCanRW = $currEl.find("[name='whoCanRW']:checked").val();
            var canBeSold = $currEl.find('#sold').prop('checked');
            var canBeExpensed = $currEl.find('#expensed').prop('checked');
            var eventSubscription = $currEl.find('#subscription').prop('checked');
            var canBePurchased = $currEl.find('#purchased').prop('checked');
            var salePrice = $currEl.find('#salePrice').val();
            var barcode = $.trim($currEl.find('#barcode').val());
            var isActive = $currEl.find('#active').prop('checked');
            //var productType = $currEl.find('#productType').attr('data-id');
            var $categoryEl = $currEl.find('#productCategory');
            var categoryId = $categoryEl.attr('data-id');
            var categoryName = $categoryEl.text();

            var category = {
                _id : categoryId,
                name: categoryName
            };

            $currEl.find('#createBtnDialog').attr('disabled', 'disabled');

            $currEl.find('.groupsAndUser tr').each(function () {
                var type = $(this).attr('data-type');
                var id = $(this).attr('data-id');

                if (type === 'targetUsers') {
                    usersId.push(id);
                }
                if (type === 'targetGroups') {
                    groupsId.push(id);
                }

            });

            valid = productModel.save({
                canBeSold        : canBeSold,
                canBeExpensed    : canBeExpensed,
                eventSubscription: eventSubscription,
                canBePurchased   : canBePurchased,
                imageSrc         : this.imageSrc,
                name             : name,
                whoCanRW         : whoCanRW,

                info: {
                    //productType: productType,
                    salePrice  : salePrice ? salePrice : 0,
                    isActive   : isActive,
                    barcode    : barcode,
                    description: description
                },

                accounting: {
                    category: category
                },

                groups: {
                    owner: $currEl.find('#allUsersSelect').attr('data-id') || null,
                    users: usersId,
                    group: groupsId
                }
            }, {
                headers: {
                    mid: mid
                },

                wait: true,

                success: function (model, response) {
                    self.attachView.sendToServer(null, model.changed);

                    if (self.viewType === 'thumbnails') {
                        self.eventChannel.trigger('itemCreated', categoryId);
                    } else {
                        Backbone.history.fragment = '';
                        Backbone.history.navigate(window.location.hash, {trigger: true});
                    }
                },

                error: function (model, xhr) {
                    self.errorNotification(xhr);
                }
            });

            if (!valid) {
                $('#createBtnDialog').removeAttr('disabled');
            }
        },

        render: function () {
            var formString = this.template({contentType: this.contentType});
            var self = this;
            var notDiv;

            this.$el = $(formString).dialog({
                dialogClass: 'edit-dialog',
                width      : 800,
                title      : 'Create Product',
                buttons    : {
                    save: {
                        text : 'Create',
                        class: 'btn',
                        id   : 'createBtnDialog',
                        click: self.saveItem
                    },

                    cancel: {
                        text : 'Cancel',
                        class: 'btn',
                        click: function () {
                            self.hideDialog();
                        }
                    }
                }
            });

            notDiv = this.$el.find('.attach-container');

            this.attachView = new AttachView({
                model      : new ProductModel,
                url        : '/products/uploadProductFiles',
                isCreate   : true,
                contentType: CONSTANTS.PRODUCTS
            });

            notDiv.append(this.attachView.render().el);
            notDiv = this.$el.find('.assignees-container');
            notDiv.append(
                new AssigneesView({
                    model: this.currentModel
                }).render().el
            );

            populate.get('#productCategory', '/category', {}, 'fullName', this, true);
            common.canvasDraw({model: this.model.toJSON()}, this);

            this.delegateEvents(this.events);

            return this;
        }

    });

    return CreateView;
});
