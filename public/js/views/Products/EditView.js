define([
    'Backbone',
    'jQuery',
    'Underscore',
    'text!templates/Product/EditTemplate.html',
    'views/Notes/AttachView',
    'views/dialogViewBase',
    'common',
    'custom',
    'dataService',
    'populate',
    'constants'
], function (Backbone, $, _, EditTemplate, AttachView, ParentView, common, Custom, dataService, populate, CONSTANTS) {

    var EditView = ParentView.extend({
        el         : '#content-holder',
        contentType: 'Products',
        imageSrc   : '',
        template   : _.template(EditTemplate),
        responseObj: {},

        initialize: function (options) {
            _.bindAll(this, 'render', 'saveItem', 'deleteItem');

            this.currentModel = options.model || options.collection.getElement();

            this.render();
        },

        events: {
            'click #saveBtn'                                                  : 'saveItem',
            'click #cancelBtn'                                                : 'hideDialog',
            click                                                             : 'hideNewSelect',
            'mouseenter .avatar'                                              : 'showEdit',
            'mouseleave .avatar'                                              : 'hideEdit',
            'click .newSelectList li.miniStylePagination'                     : 'notHide',
            'click .newSelectList li.miniStylePagination .next:not(.disabled)': 'nextSelect',
            'click .newSelectList li.miniStylePagination .prev:not(.disabled)': 'prevSelect',
            'click .details'                                                  : 'showDetailsBox',
            'click .fa-paperclip'                                             : 'clickInput'
        },

        clickInput: function () {
            this.$el.find('.input-file .inputAttach').click();
        },

       /* drawBarcode: function () {
            var el = this.$el;
            var content = el.find('#barcode').val();

            if (!content) {
                el.find('#bcTarget').empty();
            } else {
                el.find('#bcTarget').barcode(el.find('#barcode').val(), 'code128');
            }
        },*/

        showDetailsBox: function (e) {
            $(e.target).parent().find('.details-box').toggle();
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

        chooseUser: function (e) {
            $(e.target).toggleClass('choosen');
        },

        saveItem: function () {
            var self = this;

            var name = $.trim(this.$el.find('#product').val());
            var description = $.trim(this.$el.find('textarea.productDescriptionCreate').val());

            var usersId = [];
            var groupsId = [];

            var whoCanRW = this.$el.find('[name="whoCanRW"]:checked').val();

            var canBeSold = this.$el.find('#sold').prop('checked');
            var canBeExpensed = this.$el.find('#expensed').prop('checked');
            var eventSubscription = this.$el.find('#subscription').prop('checked');
            var canBePurchased = this.$el.find('#purchased').prop('checked');
            var salePrice = this.$el.find('#salePrice').val();
            var barcode = $.trim(this.$el.find('#barcode').val());
            var isActive = this.$el.find('#active').prop('checked');
            //var productType = this.$el.find('#productType').data('id');
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
                    //productType: productType,
                    salePrice  : salePrice || 0,
                    //isActive   : isActive,
                    //barcode    : barcode,
                    description: description
                },

                accounting: {
                    category: category
                },

                groups: {
                    owner: this.$el.find('#allUsersSelect').attr('data-id') || null,
                    users: usersId,
                    group: groupsId
                },

                whoCanRW: whoCanRW
            };

            $('.groupsAndUser tr').each(function () {
                if ($(this).data('type') === 'targetUsers') {
                    usersId.push($(this).data('id'));
                }
                if ($(this).data('type') === 'targetGroups') {
                    groupsId.push($(this).data('id'));
                }

            });

            this.currentModel.set(data);
            this.currentModel.save(this.currentModel.changed, {
                headers: {
                    mid: 58
                },
                patch  : true,
                success: function (model) {
                    Backbone.history.fragment = '';
                    Backbone.history.navigate(window.location.hash, {trigger: true});
                    self.hideDialog();
                },

                error: function (model, xhr) {
                    self.errorNotification(xhr);
                }
            });
        },

        showNewSelect: function (e, prev, next) {
            populate.showSelect(e, prev, next, this);
            return false;


        },

        hideNewSelect: function () {
            $('.newSelectList').hide();
        },

        chooseOption: function (e) {
            $(e.target).parents('dd').find('.current-selected').text($(e.target).text()).attr('data-id', $(e.target).attr('id'));
        },

        deleteItem: function (event) {
            var mid = 58;
            var id = this.currentModel.get('_id');
            var self = this;
            var answer = confirm('Really DELETE items ?!');

            event.preventDefault();

            if (CONSTANTS.PRODUCRSERVICE !== id.toString()) {
                if (answer) {
                    this.currentModel.destroy({
                        headers: {
                            mid: mid
                        },
                        success: function () {
                            // $('.edit-product-dialog').remove();
                            self.hideDialog();
                            Backbone.history.fragment = '';
                            Backbone.history.navigate(window.location.hash, {trigger: true});
                        },

                        error: function (model, err) {
                            if (err.status === 403) {
                                App.render({
                                    type   : 'error',
                                    message: 'You do not have permission to perform this action'
                                });
                            }
                        }
                    });
                }
            } else {
                App.render({
                    type   : 'error',
                    message: 'You do not have permission to perform this action'
                });
            }
        },

        render: function () {
            var self = this;
            var model = this.currentModel.toJSON();
            var formString = this.template({
                model: model
            });
            var $thisEl;
            var notDiv;

            this.$el = $(formString).dialog({
                closeOnEscape: false,
                autoOpen     : true,
                resizable    : true,
                dialogClass  : 'edit-dialog',
                title        : 'Edit Product',
                width        : '900',
                buttons      : {
                    save: {
                        text : 'Save',
                        class: 'btn',
                        click: self.saveItem
                    },

                    cancel: {
                        text : 'Cancel',
                        class: 'btn',
                        click: self.hideDialog
                    },

                    delete: {
                        text : 'Delete',
                        class: 'btn',
                        click: self.deleteItem
                    }
                }
            });

            $thisEl = this.$el;
            $thisEl.find('#bcTarget').barcode(model.info.barcode, 'code128');

            notDiv = $thisEl.find('.attach-container');
            notDiv.append(
                new AttachView({
                    model      : this.currentModel,
                    contentType: self.contentType
                }).render().el
            );

            this.renderAssignees(this.currentModel);

            //populate.get('#productType', CONSTANTS.URLS.PRODUCT + '/getProductsTypeForDd', {}, 'name', this, true, true);

            //populate.getParrentCategory('#parentCategory', '/category', {}, this);
            populate.get('#parentCategory', '/category', {}, 'fullName', this, true);


            common.canvasDraw({model: this.model.toJSON()}, this);

            this.delegateEvents(this.events);

            return this;
        }

    });

    return EditView;
});
