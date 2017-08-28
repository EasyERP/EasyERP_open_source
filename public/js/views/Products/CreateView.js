define([
    'Backbone',
    'jQuery',
    'Underscore',
    'text!templates/Products/CreateTemplate.html',
    'views/dialogViewBase',
    'models/ProductModel',
    'collections/Products/filterCollection',
    'common',
    'populate',
    'views/Notes/AttachView',
    'views/Assignees/AssigneesView',
    'dataService',
    'constants',
    'services/productCategories',
    'helpers/keyValidator'
], function (Backbone, $, _, CreateTemplate, ParentView, ProductModel, SearchCollection, common, populate, AttachView, AssigneesView, dataService, CONSTANTS, productCategoriesService, keyValidator) {

    var CreateView = ParentView.extend({
        el                  : '#content-holder',
        template            : _.template(CreateTemplate),
        imageSrc            : '',
        searchProdCollection: null,

        initialize: function (options) {
            this.mId = CONSTANTS.MID[this.contentType];
            this.eventChannel = options.eventChannel;
            this.bundleObj = {};

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
            'mouseenter .avatar'     : 'showEdit',
            'mouseleave .avatar'     : 'hideEdit',
            'click #searchBtn'       : 'searchProduct',
            'click .itemForBundle'   : 'addToBundle',
            'click .removeBundle'    : 'removeBundle',
            'click #showBtn'         : productCategoriesService.showCategories,
            'change .productCategory': productCategoriesService.changeCategory,
            'click .deleteTag '      : productCategoriesService.deleteCategory,
            'keypress .forNum'       : 'keypressHandler'
        },

        keypressHandler: function (e) {
            return keyValidator(e, true);
        },

        eventType: function () {
            var $container = this.$('#typeOfEvent');

            return $container.toggleClass('hidden');
        },

        chooseOption: function (e) {
            var $targetEl = $(e.target);
            var id = $targetEl.attr('id');

            $targetEl.parents('ul').closest('.current-selected').text($targetEl.text()).attr('data-id', id);
            /* $('.newSelectList').hide();*/
        },

        /* showCategories: function (e) {
         var $categoriesBlock = $('#variantsCategoriesBlock');

         if ($categoriesBlock.hasClass('open')) {
         $categoriesBlock.removeClass('open');
         $categoriesBlock.children('ul').hide();
         } else {
         $categoriesBlock.addClass('open');
         $categoriesBlock.children('ul').show();
         }
         },*/

        deleteAttach: function (e) {
            $(e.target).closest('.attachFile').remove();
        },

        fileSizeIsAcceptable: function (file) {
            if (!file) {
                return false;
            }
            return file.size < App.File.MAXSIZE;
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
            var $target = $(e.target).closest('li');
            var $container = $thisEl.find('#productsBundle');
            var val = $target.text();
            var id = $target.data('id');

            if (Object.keys(this.bundleObj).indexOf(id) >= 0) {
                return;
            }

            this.bundleObj[id] = '0';

            $container.append('<div class="bundle _bundle" data-id="' + id + '">' + val + '<div class="_editConteiner"><input class="quantity _quantity _animate " value="0"><span class="removeBundle _actionCircleBtn icon-close3"></span></div></div>');
        },

        searchProduct: function (e) {
            var $target = e ? $(e.target) : null;
            var $searchContainer = $target && $target.closest('.searchContainer');
            var $search = $searchContainer && $searchContainer.find('#searchProducts');
            var searchValue = $search ? $search.val() : '';
            var filterOpts = {
                value: searchValue
            };
            var collectionOpts = {
                page    : 1,
                showMore: false,
                reset   : true,
                filter  : filterOpts,
                viewType: 'forBundle'
            };

            if (e){
                e.preventDefault();
            }

            if (!this.searchProdCollection) {
                this.searchProdCollection = new SearchCollection(collectionOpts);
                this.searchProdCollection.bind('reset', _.bind(this.renderSearchProducts, this));
            } else {
                this.searchProdCollection.getFirstPage(collectionOpts);
            }
        },

        renderSearchProducts: function () {
            var $thisEl = this.$el;
            var $container = $thisEl.find('#productsForBundle');
            var variant = '';

            $container.html('');

            _.each(this.searchProdCollection.toJSON(), function (item) {
                if (item.variants && item.variants.length) {
                    _.each(item.variants, function (variantOne) {
                        variant += variantOne && variantOne.name ? variantOne.name + ' | ' : 'this product has no variants';
                    });
                }

                $container.append('<li class="itemForBundle" data-id="' + item._id + '">' + item.name + ' <span data-id="' + item._id + '">' + variant + '</span></li>');
                variant = '';
            });
        },

        bundlesValues: function () {
            var $thisEl = this.$el;
            var self = this;
            var bundlesArray = $thisEl.find('.bundle');
            var id;
            var quantity;

            _.each(bundlesArray, function (item) {
                id = $(item).data('id');
                quantity = $(item).find('.quantity').val();

                self.bundleObj[id] = quantity;
            });
        },

        getPrices: function ($thisEl) {
            var $priceLists = $('.priceListCreate');
            var resultArray = [];

            _.each($priceLists, function (item) {
                var $priceList = $(item);
                var priceListId = $priceList.data('id');
                var $priceGrid = $priceList.find('.priceBlock');
                var priceArray = [];

                _.each($priceGrid, function (priceItem) {
                    var $priceItem = $(priceItem);

                    priceArray.push({
                        count: $priceItem.find('.productCount').val() || 0,
                        price: $priceItem.find('.productPrice').val() || 0
                    });
                });

                resultArray.push({priceLists: priceListId, prices: priceArray});
            });

            return resultArray;
        },

        saveItem: function () {
            var $currEl = this.$el;
            var self = this;
            var mid = 58;
            var productModel = new ProductModel();
            var name = $.trim($currEl.find('#product').val());
            var description = $.trim($currEl.find('textarea#description').val());
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
            var categoryElements = $currEl.find('.checkedProductCategory');
            //var categoryIds = $categoryEl.attr('data-id');
            var productType = $currEl.find('#productType').attr('data-id');
            var productCategory = $currEl.find('#productCategory').data('id');
            var SKU = $currEl.find('#SKU').val();
            var UPC = $currEl.find('#UPC').val();
            var ISBN = $currEl.find('#ISBN').val();
            var EAN = $currEl.find('#EAN').val();
            var weight = $currEl.find('#weight').val();
            var popUpMsg = $currEl.find('#popUpMsg').val();
            var isBundle = false;
            var minStockLevel = $currEl.find('#mainMinStockLevel').val();

            var prices = this.getPrices($currEl);
            var categoryIds = [];

            if (categoryElements && categoryElements.length) {
                categoryElements.each(function (key, item) {
                    categoryIds.push($(item).data('id'));
                });
            }

            if (Object.keys(this.bundleObj).length) {
                this.bundlesValues();
                isBundle = true;
            }

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
                isBundle         : isBundle,
                canBeSold        : canBeSold,
                canBeExpensed    : canBeExpensed,
                eventSubscription: eventSubscription,
                canBePurchased   : canBePurchased,
                imageSrc         : this.imageSrc,
                name             : name,
                whoCanRW         : whoCanRW,

                info: {
                    productType: productType,
                    categories : categoryIds,
                    SKU        : SKU,
                    UPC        : UPC,
                    ISBN       : ISBN,
                    EAN        : EAN,
                    description: description
                },

                bundles: this.bundleObj,

                inventory: {
                    weight       : weight,
                    warehouseMsg : popUpMsg,
                    minStockLevel: minStockLevel
                },

                prices: prices,

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
                    Backbone.history.fragment = '';
                    Backbone.history.navigate(window.location.hash, {trigger: true});
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
            var formString;
            var self = this;
            var $priceListCreate;

            dataService.getData('/priceList/forProduct/', {}, function (result) {
                formString = self.template({
                    contentType: self.contentType,
                    priceLists : result
                });

                self.$el = $(formString).dialog({
                    dialogClass: 'edit-dialog',
                    width      : 900,
                    title      : 'Create Product',
                    buttons    : {
                        save: {
                            text : 'Create',
                            class: 'btn blue',
                            id   : 'linkProduct',
                            click: function () {
                                self.saveItem();
                                self.gaTrackingConfirmEvents();
                            }
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

                $priceListCreate = $($('.priceListCreate')[0]);
                $($priceListCreate.closest('#priceBlock').find('a')[0]).addClass('active');
                $priceListCreate.addClass('active');

                populate.get('#productType', '/products/getProductsTypeForDd', {}, 'name', self, true);
                productCategoriesService.renderProductCategories.call(self);
                common.canvasDraw({model: self.model.toJSON()}, self);

                self.searchProduct(null);

                self.delegateEvents(self.events);

                return self;
            }, this);
        }

    });

    return CreateView;
});
