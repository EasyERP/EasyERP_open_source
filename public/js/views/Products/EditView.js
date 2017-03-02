define([
    'Backbone',
    'jQuery',
    'Underscore',
    'text!templates/Products/EditTemplate.html',
    'views/Notes/AttachView',
    'views/dialogViewBase',
    'collections/Products/filterCollection',
    'common',
    'custom',
    'dataService',
    'populate',
    'constants'
], function (Backbone, $, _, EditTemplate, AttachView, ParentView, SearchCollection, common, Custom, dataService, populate, CONSTANTS) {

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
            'click .icon-attach'                                              : 'clickInput',
            'click #searchBtnEdit'                                            : 'searchProduct',
            'click .itemForBundle'                                            : 'addToBundle',
            'click .removeBundle'                                             : 'removeBundle'
        },

        clickInput: function () {
            this.$el.find('.input-file .inputAttach').click();
        },

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

        removeBundle: function (e) {
            var $thisEl = this.$el;
            var target = $(e.target).closest('.bundle');
            var position = Object.keys(this.bundleObj).indexOf(target.data('id'));

            if (position >= 0) {
                delete this.bundleObj[target.data('id')];
            }
            target.remove();
        },

        addToBundle: function (e) {
            var $thisEl = this.$el;
            var $target = $(e.target);
            var $container = $thisEl.find('#productsBundle');
            var val = $target.text();
            var id = $target.data('id');

            if (Object.keys(this.bundleObj).indexOf(id) >= 0) {
                return;
            }

            this.bundleObj[id] = '';

            $container.append('<div class="bundle" data-id="' + id + '"><input value="' + val + '"><input value="0"><span class="removeBundle">X</span></div>');
        },

        searchProduct: function (e) {
            e.preventDefault();

            var $thisEl = this.$el;
            var $target = $(e.target);
            var $searchContatiner = $target.closest('.searchContainer');
            var $search = $searchContatiner.find('#searchProducts');
            var searchValue = $search.val();
            var filterOpts = {
                value: searchValue
            };
            var collectionOpts = {
                page    : 1,
                showMore: false,
                reset   : true,
                filter  : filterOpts
            };

            if (!this.searchProdCollection) {
                this.searchProdCollection = new SearchCollection(collectionOpts);
                this.searchProdCollection.bind('reset', _.bind(this.renderSearchProducts, this));
            } else {
                //this.searchProdCollection.getFirstPage(collectionOpts);
                this.renderSearchProducts();
            }
        },

        renderSearchProducts: function () {
            var $thisEl = this.$el;
            var $container = $thisEl.find('#productsForBundle');

            $container.html();

            _.each(this.searchProdCollection.toJSON(), function (item) {
                $container.append('<li class="itemForBundle" data-id="' + item._id + '">' + item.name + '</li>');
            });

            this.searchProdCollection = [];
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
                    salePrice  : salePrice || 0,
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
            $(e.target).parents('ul').closest('.current-selected').text($(e.target).text()).attr('data-id', $(e.target).attr('id'));
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
            var categoryId = model.info && model.info.category;
            var productTypeId = model.info && model.info.productType;
            var formString = this.template({
                product: model
            });
            var $thisEl;
            var notDiv;

            this.$el = $(formString).dialog({
                autoOpen   : true,
                dialogClass: 'edit-dialog',
                title      : 'Edit Product',
                width      : '900',
                buttons    : {
                    save: {
                        text : 'Save',
                        class: 'btn blue',
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

            notDiv = $thisEl.find('.attach-container');
            notDiv.append(
                new AttachView({
                    model      : this.currentModel,
                    contentType: self.contentType
                }).render().el
            );

            // populate.getProductTypeOrCategory('#productCategory', '/category', {}, 'fullName', this, true, false, null, categoryId);
            populate.getProductTypeOrCategory('#productType', '/products/getProductsTypeForDd', {}, 'name', this, true, false, null, productTypeId);

            //this.renderAssignees(this.currentModel);

            common.canvasDraw({model: this.model.toJSON()}, this);

            this.delegateEvents(this.events);

            return this;
        }

    });

    return EditView;
});
