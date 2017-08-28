define([
    'Backbone',
    'Underscore',
    'jQuery',
    'text!templates/Products/EditTemplate.html',
    'text!templates/Products/PreviewVariantsTemplate.html',
    'text!templates/Products/EditForPrewiewVariantTemplate.html',
    'text!templates/Products/EditPreviewVariantsTemplate.html',
    'text!templates/Products/EditingValuesTemplate.html',
    'text!templates/Products/AddOptionsTemplate.html',
    'collections/Products/filterCollection',
    'models/ProductModel',
    'views/Notes/AttachView',
    'views/selectView/selectView',
    'views/Products/EditView',
    'views/dialogViewBase',
    'views/Products/form/VariantsList/ListView',
    'views/Products/form/PublishList/ListView',
    'views/imageViewBase',
    'common',
    'custom',
    'views/guideTours/guideNotificationView',
    'dataService',
    'populate',
    'constants',
    'async',
    'services/productCategories',
    'services/select',
    'helpers/keyValidator'
], function (Backbone, _, $, ProductFormTemplate, PreviewVariantsTemplate, EditForPreviewVariantsTemplate, EditPreviewVariantsTemplate, EditingValuesTemplate, AddOptionsTemplate, SearchCollection, ProductModel, AttachView, SelectView, EditView, ParentView, VariantsArrayListView, PublishListView, ImagesViewBase, common, Custom, GuideNotify, dataService, populate, CONSTANTS, async, productCategoriesService, select, keyValidator) {
    var FormProductView = ParentView.extend({
        el: '#content-holder',

        initialize: function (options) {
            var model;
            var self = this;

            this.formModel = options.model;
            this.formModel.urlRoot = '/products/';
            this.bundleObj = {};
            this.allVariantsProduct = [];

            model = this.formModel.toJSON();
            this.groupImages = model.images;

            if (model.isBundle) {
                _.each(model.bundles, function (item) {
                    self.bundleObj[item._id] = item.quantity;
                });
            }
        },

        events: {
            'click #saveBtn'                                                  : 'saveItem',
            'click #cancelBtn'                                                : 'hideDialog',
            click                                                             : select.hideNewSelect,
            'mouseenter .avatar'                                              : 'showEdit',
            'mouseleave .avatar'                                              : 'hideEdit',
            'click .newSelectList li.miniStylePagination'                     : 'notHide',
            'click .newSelectList li.miniStylePagination .next:not(.disabled)': 'nextSelect',
            'click .newSelectList li.miniStylePagination .prev:not(.disabled)': 'prevSelect',
            'click .details'                                                  : 'showDetailsBox',
            'click .icon-attach'                                              : 'clickInput',
            'click #searchBtnEdit'                                            : 'searchProduct',
            'click .itemForBundle'                                            : 'addToBundle',
            'click .removeBundle'                                             : 'removeBundle',
            'click #createVariants'                                           : 'createVariants',
            'click #saveVariants'                                             : 'saveVariants',
            'click #cancelVariants'                                           : 'cancelVariants',
            'click #startEditing'                                             : 'startEditing',
            'click #saveSKUs'                                                 : 'saveSKUs',
            'click #editAllBtn'                                               : 'editAll',
            'click #showBtn'                                                  : productCategoriesService.showCategories,
            'change .productCategory'                                         : productCategoriesService.changeCategory,
            'change .optionsForVariants'                                      : 'changeOption',
            'click .deleteTag'                                                : productCategoriesService.deleteCategory,
            'click .item'                                                     : 'checkItem',
            'click #addOptions'                                               : 'addOptions',
            'keypress .forNum'                                                : 'keypressHandler',
            'click .goToRemove'                                               : 'deleteItem',
            'click .goToRemoveVariant'                                        : 'deleteVariant',
            'click #picturesTab'                                              : 'renderSlider'
        },

        keypressHandler: function (e) {
            return keyValidator(e, true);
        },

        getChannelData: function () {
            var $currentEl = this.$el;
            var $checked = $currentEl.find('input.checkVariants:checked');
            var products = [];
            var data;

            $.each($checked, function () {
                var $el = $(this);

                products.push($el.val());
            });

            data = {
                products: products,
                channel : this.channel
            };

            if (this.priceList) {
                data.priceList = this.priceList;
            }

            return data;
        },

        renderSlider: function () {
            this.imagesView.render();
        },

        clickInput: function () {
            var $thisEl = this.$el;

            $thisEl.find('.input-file .inputAttach').click();
        },

        checkItem: function (e) {
            var $thisEl = this.$el;
            var $target = $(e.target);
            var $parent = $target.closest('.changeTableCombobox');

            $parent.find('.item').removeClass('active');
            $target.addClass('active');
            $parent.toggleClass('open');
        },

        editAll: function (e) {
            var $thisEl = this.$el;
            var $target = $(e.target);
            var value = $target.closest('#editAllBlock').find('#editAllInput').val();

            $thisEl.find('.newVariantEdit').val(value);
        },

        addOptions: function () {
            var $thisEl = this.$el;
            var productLength = this.allVariantsProduct.length;
            var changedProductArr = [];
            var self = this;
            var $products;
            var rendermsg = false;

            _.each(self.changedProductType.opts, function (opt) {
                $products = $thisEl.find('.active.newOpt[data-optid="' + opt._id + '"]');
                if ($products && $products.length) {
                    if ($products.length !== productLength) {
                        App.render({
                            type   : 'error',
                            message: 'Check all options please'
                        });
                    } else {
                        $products.each(function (key, product) {
                            changedProductArr.push({
                                product: $thisEl.find(product).attr('data-prodId'),
                                value  : $thisEl.find(product).data('id')
                            });
                        });
                    }
                }
            });

            if (rendermsg) {
                return App.render({
                    type   : 'error',
                    message: 'You used maximum size of Options Categories. Return to Create Variants.'
                });
            }

            if (changedProductArr && changedProductArr.length) {
                dataService.postData('products/newVariants', {changedProductArr: changedProductArr}, function () {
                    Backbone.history.fragment = '';
                    Backbone.history.navigate(window.location.hash, {trigger: true});
                });
            }
        },

        imageSave: function (options, _context) {
            var context = _context || this;
            var inputFile = context.$('#inputAttach');
            var functionsArray = [];
            var files;
            var filesExt;


            inputFile.prop('accept', 'image/*');
            inputFile.on('change', function (e) {
                e.preventDefault();

                filesExt = ['jpg', 'gif', 'png', 'jpe', 'jfif', 'jpeg', 'bmp', 'JPEG', 'JPG', 'GIF', 'PNG', 'BMP']; //fix type file

                files = inputFile[0].files;

                _.each(files, function (file) {
                    functionsArray.push(
                        function (wCb) {
                            var fileReader;
                            var parts;

                            parts = $(inputFile).val().split('.');

                            if (filesExt.join().search(parts[parts.length - 1]) !== -1) {
                                fileReader = new FileReader();

                                fileReader.onload = function () {
                                    var src = fileReader.result;

                                    if (src) {
                                        context.addImage({imageSrc: src});
                                    }
                                };

                                inputFile.val('');

                                if (file) {
                                    fileReader.readAsDataURL(file);
                                }

                                wCb();
                            } else {
                                App.render({
                                    type   : 'error',
                                    message: 'Invalid file type!'
                                });

                                wCb();
                            }
                        }
                    );
                });

                async.waterfall(functionsArray, function () {
                    return;
                });
            });

            context.$('#avatar').hide();
        },


        saveSKUs: function (e) {
            var $thisEl = this.$el;
            var editedValues = {};
            var url = '/products/sku';
            var formModel = this.editModel.toJSON();
            var arrayOfDifferent = [];
            var key;

            e.preventDefault();

            $thisEl.find('.newVariantEdit').each(function () {
                var $el = $(this);

                key = $el.data('value');

                editedValues[key] = {
                    productId: $el.data('id'),
                    sku      : $el.val()
                };
            });

            _.each(Object.keys(formModel.valuesIds), function (item) {
                if (formModel.valuesIds[item].sku !== editedValues[item].sku) {
                    arrayOfDifferent.push(editedValues[item]);
                }
            });

            dataService.postData(url, {skus: arrayOfDifferent}, function (result) {
                Backbone.history.fragment = '';
                Backbone.history.navigate('easyErp/Products/list', {trigger: true});
            });
        },

        changeOption: function (e) {
            var $thisEl = this.$el;
            var $target = $(e.target);
            var $optValue = $target.closest('.editPanel').find('.optionValue');
            var count = this.$el.find('.optionsForVariants:checked').length;

            e.stopPropagation();

            if (count > 4) {
                $optValue.prop('checked', false);
                return App.render({
                    type   : 'error',
                    message: '1 product cannot have more than 4 options assigned. To assign another option please uncheck any another one.'
                });
            }

            if ($target.is(':checked')) {
                $optValue.prop('disabled', false);
                return;
            }

            $optValue.prop('disabled', true);
            $optValue.prop('checked', false);
        },

        saveVariants: function () {
            var url = '/products/variants/' + this.editModel.id;

            dataService.postData(url, {variants: this.variantsArr, isNew: true}, function (result) {
                Backbone.history.fragment = '';
                Backbone.history.navigate(window.location.hash, {trigger: true});
                //Backbone.history.navigate('easyErp/Products/list', {trigger: true});
            });
        },

        cancelVariants: function () {
            var $thisEl = this.$el;
            var preview = $thisEl.find('#createdVariants');

            preview.empty();
        },

        startEditing: function (e) {
            var $thisEl = this.$el;
            var checkedBoxes = [];
            var url = '/products/variants/' + this.editModel.id;
            var $checkedVariants = $thisEl.find('.newVariantCheck');
            var checkbox;

            e.preventDefault();

            $checkedVariants.each(function (key, value) {
                checkbox = $thisEl.find(value);
                if (checkbox.is(':checked')) {
                    checkedBoxes.push(checkbox.data('value').split('/'));
                }
            });

            dataService.postData(url, {variants: checkedBoxes, isNew: false}, function (result) {
                Backbone.history.fragment = '';
                Backbone.history.navigate(window.location.hash, {trigger: true});
                //Backbone.history.navigate('easyErp/Products/list', {trigger: true});
            });
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

        createVariants: function (e) {
            var $thisEl = this.$el;
            var valuesForCollection = [];
            var values = [];
            var collection = [];
            var $variantsBlock = $thisEl.find('#createdVariants');
            var formModel = this.editModel.toJSON();
            var collectionValuesLength = 0;
            var self = this;
            var $option;
            var $values;
            var $options;
            var $valueItem;
            var $valueItemId;
            var $valueItemName;

            this.variantsArr = [];

            if (e) {
                e.preventDefault();
            }

            $options = $thisEl.find('.optionsForVariants:checked');

            $options.each(function (key, option) {
                $option = $thisEl.find(option);
                $values = $option.closest('.editPanel').find('.optionValue:checked');

                $values.each(function (key, value) {
                    $valueItem = $thisEl.find(value);
                    $valueItemId = $valueItem.attr('data-id');
                    $valueItemName = $valueItem.val();
                    values.push($valueItemId);
                    valuesForCollection.push({
                        id  : $valueItemId,
                        name: $valueItem.val()
                    });
                });

                self.variantsArr.push({
                    optionId  : $option.attr('data-id'),
                    optionName: $option.val(),
                    values    : values
                });

                collection.push(valuesForCollection);

                collectionValuesLength += valuesForCollection.length;

                values = [];
                valuesForCollection = [];
            });

            if (e && !collectionValuesLength) {
                return App.render({
                    type   : 'error',
                    message: 'Please, check at least one Product Options value.'
                });
            }

            if (formModel.isVariant) {
                $variantsBlock = $thisEl.find('#editedVariants');

                $variantsBlock.html(_.template(EditPreviewVariantsTemplate, {
                    collection   : collection,
                    variantsArray: formModel.valuesIds ? Object.keys(formModel.valuesIds) : []
                }));

                $thisEl.find($thisEl.find('.tabSKU')[0]).html(_.template(EditingValuesTemplate, {
                    collection   : collection,
                    variantsArray: formModel.valuesIds ? Object.keys(formModel.valuesIds) : [],
                    valuesIds    : formModel.valuesIds || {}
                }));
            } else {
                $variantsBlock.html(_.template(PreviewVariantsTemplate, {
                    collection: collection
                }));
            }
        },

        removeBundle: function (e) {
            var $target = $(e.target).closest('.bundle');
            var position = Object.keys(this.bundleObj).indexOf($target.data('id'));

            if (position >= 0) {
                delete this.bundleObj[$target.data('id')];
            }

            $target.remove();
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

            this.bundleObj[id] = '0';

            $container.append('<div class="bundle" data-id="' + id + '"><input value="' + val + '"><div class="editConteiner"><input class="quantity" value="0"><span class="removeBundle icon-close3"></span></div></div>');
        },

        searchProduct: function (e) {
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
                filter  : filterOpts,
                viewType: 'forBundle'
            };

            e.preventDefault();

            if (!this.searchProdCollection) {
                this.searchProdCollection = new SearchCollection(collectionOpts);
                this.searchProdCollection.bind('reset', _.bind(this.renderSearchProducts, this));
            } else {
                this.renderSearchProducts();
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
                        variant += variantOne.name + ' | ';
                    });
                }

                $container.append('<li class="itemForBundle" data-id="' + item._id + '">' + item.name + ' <span>' + variant + '</span></li>');
                variant = '';
            });

            this.searchProdCollection = null;
        },

        bundlesValues: function () {
            var $thisEl = this.$el;
            var self = this;
            var $bundlesArray = $thisEl.find('.bundle');
            var id;
            var quantity;

            $bundlesArray.each(function () {
                var $el = $(this);

                id = $el.data('id');
                quantity = $el.find('.quantity').val();

                self.bundleObj[id] = quantity;
            });
        },

        saveItem: function () {
            var self = this;
            var $thisEl = this.$el;
            var name = $.trim($thisEl.find('#productName').val());

            var SKU = $.trim($thisEl.find('#SKU').val());
            var UPC = $.trim($thisEl.find('#UPC').val());
            var ISBN = $.trim($thisEl.find('#ISBN').val());
            var EAN = $.trim($thisEl.find('#EAN').val());

            var weight = $.trim($thisEl.find('#weight').val());
            var popUpMsg = $thisEl.find('#popUpMsg').val();
            var mainMinStockLevel = $.trim($thisEl.find('#mainMinStockLevel').val());

            var description = $.trim($thisEl.find('textarea#description').val());

            var usersId = [];
            var groupsId = [];

            var whoCanRW = $thisEl.find('[name="whoCanRW"]:checked').val();
            var prices = this.getPrices($thisEl);

            var canBeSold = $thisEl.find('#sold').prop('checked');
            var canBeExpensed = $thisEl.find('#expensed').prop('checked');
            var eventSubscription = $thisEl.find('#subscription').prop('checked');
            var canBePurchased = $thisEl.find('#purchased').prop('checked');
            var salePrice = $thisEl.find('#salePrice').val();
            var productType = $thisEl.find('#productType').data('id');
            var isBundle = false;
            var categoryIds = [];
            var categoryElements = $thisEl.find('.checkedProductCategory');
            var currentModel = this.formModel.toJSON();
            var data;

            if (categoryElements && categoryElements.length) {
                categoryElements.each(function (key, item) {
                    categoryIds.push($thisEl.find(item).attr('data-id'));
                });
            }

            if (Object.keys(this.bundleObj).length) {
                this.bundlesValues();
                isBundle = true;
            }
            data = {
                isBundle         : isBundle,
                canBeSold        : canBeSold,
                canBeExpensed    : canBeExpensed,
                eventSubscription: eventSubscription,
                canBePurchased   : canBePurchased,
                imageSrc         : this.imageSrc,
                name             : name,
                prices           : prices,
                info             : {
                    productType: productType,
                    salePrice  : salePrice || 0,
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
                    minStockLevel: mainMinStockLevel
                },

                groups: {
                    owner: $thisEl.find('#allUsersSelect').attr('data-id') || null,
                    users: usersId,
                    group: groupsId
                },

                whoCanRW: whoCanRW
            };

            $thisEl.find('.groupsAndUser tr').each(function () {
                var $el = $(this);
                var type = $el.data('type');

                if (type === 'targetUsers') {
                    usersId.push($el.attr('data-id'));
                }
                if (type === 'targetGroups') {
                    groupsId.push($el.attr('data-id'));
                }
            });

            this.editModel.set(data);
            this.editModel.save(this.editModel.changed, {
                headers: {
                    mid    : 58,
                    groupid: currentModel.groupId
                },
                patch  : true,
                success: function (model) {
                    Backbone.history.fragment = '';
                    Backbone.history.navigate(window.location.hash, {trigger: true});
                    self.hideDialog();
                    self.gaTrackingEditConfirm();
                },

                error: function (model, xhr) {
                    self.errorNotification(xhr);
                }
            });
        },

        showNewSelect: function (e, prev, next) {
            var $target = $(e.target);

            e.stopPropagation();

            if ($target.attr('id') === 'selectInput') {
                return false;
            }

            if (this.selectView) {
                this.selectView.remove();
            }

            this.selectView = new SelectView({
                e          : e,
                responseObj: this.responseObj
            });

            $target.append(this.selectView.render().el);

            return false;
        },

        chooseOption: function (e) {
            var $target = $(e.target);

            $target.parent('ul')
                .closest('.current-selected')
                .text($target.text())
                .attr('data-id', $target.attr('id'));
        },

        deleteVariant: function (e) {
            var id = $(e.target).closest('tr').attr('id');
            var self = this;
            var answer = confirm('Really DELETE items ?!');

            e.preventDefault();

            if (CONSTANTS.PRODUCRSERVICE !== id.toString()) {
                if (answer) {
                    dataService.deleteData('/products/' + id, {}, function () {
                        self.hideDialog();
                        Backbone.history.fragment = '';
                        Backbone.history.navigate(window.location.hash, {trigger: true});
                    });
                }
            } else {
                App.render({
                    type   : 'error',
                    message: 'You do not have permission to perform this action'
                });
            }
        },

        deleteItem: function (event) {
            var mid = 58;
            var id = this.editModel.get('_id');
            var self = this;
            var answer = confirm('Really DELETE items ?!');

            event.preventDefault();

            if (CONSTANTS.PRODUCRSERVICE !== id.toString()) {
                if (answer) {
                    this.editModel.destroy({
                        headers: {
                            mid: mid
                        },
                        success: function () {
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

        renderVariantsTable: function (firstVariants) {
            var products = this.formModel.toJSON().variantsArray;
            var id = firstVariants ? firstVariants._id : products[0]._id;
            var groupId = firstVariants ? firstVariants.groupId : products[0].groupId;

            return new VariantsArrayListView({
                products       : products,
                parentView     : this,
                id             : id,
                groupId        : groupId,
                noNeedCreatedIn: true
            });
        },

        renderPublishTable: function () {
            return new PublishListView({product: this.editModel.toJSON()});
        },

        getPrices: function ($thisEl) {
            var $priceLists = $thisEl.find('.priceList');
            var resultArray = [];
            var self = this;

            $priceLists.each(function () {
                var $priceList = $(this);
                var priceListId = $priceList.data('id');
                var $priceGrid = $priceList.find('.priceBlock');
                var priceArray = [];

                $priceGrid.each(function () {
                    var $priceItem = $(this);

                    priceArray.push({
                        count: parseInt($priceItem.find('.productCount').val(), 10) || 0,
                        price: parseFloat($priceItem.find('.productPrice').val()) || 0
                    });
                });

                resultArray.push({priceLists: priceListId, product: self._id, prices: priceArray});
            });

            return resultArray;
        },

        rerender: function (options) {
            var id = options.id;
            var formModel = this.formModel.toJSON();
            var firstVariants = formModel.variantsArray;
            var element = _.find(firstVariants, function (el) {
                return el._id.toString() === id.toString();
            });

            this.render(element);
        },

        render: function (element) {
            var formModel = this.formModel.toJSON();
            var firstVariants = element ? element : formModel.variantsArray && formModel.variantsArray.length ? formModel.variantsArray[0] : {};
            var $thisEl = this.$el;
            var self = this;
            var productTypeId = firstVariants.info && firstVariants.info.productType || null;
            var checkedObj = {};
            var typeId = productTypeId;
            var $variantsBlock;
            var $addOptionsBlock;
            var currentProductId;
            var parallelTasks;

            firstVariants.currentValues = formModel.currentValues;
            firstVariants.valuesIds = formModel.valuesIds;

            if (!formModel.variantsArray || !formModel.variantsArray.length) {
                return $('.closeBtn').click();
            }

            this.editModel = new ProductModel(firstVariants);
            this.productCategoriesIds = [];
            currentProductId = this.editModel.get('_id');

            this._id = currentProductId;

            parallelTasks = {
                availabilities: function (pCb) {
                    dataService.getData('/products/stockInventory/' + currentProductId, {}, function (availabilities) {
                        if (availabilities.error) {
                            return pCb(availabilities.error);
                        }

                        pCb(null, availabilities.data);
                    });
                }
            };

            if (firstVariants && firstVariants.categories && firstVariants.categories.length) {
                this.productCategoriesIds = _.pluck(firstVariants.categories, '_id');
            }

            function renderHelper() {
                $thisEl.html(_.template(ProductFormTemplate, {
                    product       : firstVariants,
                    allPriceLists : self.allPriceLists,
                    availabilities: self.availabilities
                }));

                self.renderVariantsTable(firstVariants);
                self.renderPublishTable();

                $variantsBlock = $thisEl.find('#creatingVariants');
                $addOptionsBlock = $thisEl.find('.tabAddOptions');

                common.canvasDraw({model: firstVariants}, self);

                if (firstVariants.isVariant) {
                    $variantsBlock = $thisEl.find('#editingVariants');
                    _.each(firstVariants.currentValues, function (currentValue) {
                        if (currentValue._id) {
                            checkedObj[currentValue._id] = currentValue.values;
                        }
                    });

                    if (firstVariants.groupId) {
                        dataService.getData('/products/productVariants/' + firstVariants.groupId, {}, function (products) {

                            self.allVariantsProduct = products;

                            $addOptionsBlock.html(_.template(AddOptionsTemplate, {
                                productVariants   : products,
                                changedProductType: self.changedProductType,
                                checkedObj        : checkedObj
                            }));
                        });
                    }
                }

                $variantsBlock.html(_.template(EditForPreviewVariantsTemplate, {
                    changedProductType: self.changedProductType,
                    checkedObj        : checkedObj
                }));

                if (firstVariants.isVariant) {
                    self.createVariants();
                } else {
                    $thisEl.find('.optionValue').prop('disabled', true);
                }

                $thisEl.find($thisEl
                    .find($thisEl.find('[data-class=subTabs]')[0])
                    .find('a')[0])
                    .addClass('active');

                $thisEl.find($thisEl
                    .find('.priceList')[0])
                    .addClass('active');

                productCategoriesService.renderProductCategories.call(self, self.productCategoriesIds);
                populate.getProductTypeOrCategory('#productType', '/products/getProductsTypeForDd', {}, 'name', self, true, false, null, productTypeId);

                self.delegateEvents(self.events);

                self.imagesView = new ImagesViewBase({
                    model      : firstVariants,
                    images     : self.groupImages,
                    contentType: 'products',
                    parent     : self
                });

                if (App.guide) {
                    if (App.notifyView) {
                        App.notifyView.undelegateEvents();
                        App.notifyView.stopListening();
                    }
                    App.notifyView = new GuideNotify({e: null, data: App.guide});
                }
            }

            if (!self.allPriceLists || !self.changedProductType) {
                if (!self.allPriceLists) {
                    parallelTasks.allPriceLists = function (pCb) {
                        dataService.getData('/priceList/forProduct/', {}, function (allPriceLists) {
                            if (allPriceLists.error) {
                                return pCb(allPriceLists.error);
                            }

                            pCb(null, allPriceLists);
                        });
                    };
                }

                if (!self.changedProductType) {
                    parallelTasks.changedProductType = function (pCb) {
                        dataService.getData('/products/productTypes/' + typeId, {}, function (changedProductType) {
                            if (changedProductType.error) {
                                return pCb(changedProductType.error);
                            }

                            pCb(null, changedProductType);
                        });
                    };
                }

                async.parallel(parallelTasks, function (err, result) {
                    if (err) {
                        return App.render({
                            message: 'Oops, something went wrong'
                        });
                    }

                    self.allPriceLists = result.allPriceLists || self.allPriceLists;
                    self.changedProductType = result.changedProductType || self.changedProductType;
                    self.availabilities = result.availabilities;

                    renderHelper();
                });

            } else {
                async.parallel(parallelTasks, function (err, result) {
                    if (err) {
                        return App.render({
                            message: 'Oops, something went wrong'
                        });
                    }

                    self.availabilities = result.availabilities;

                    renderHelper();
                });
            }

            return self;
        },

        editItem: function () {
            //create editView in dialog here
            new EditView({model: this.formModel});
        },

        deleteItems: function () {
            var mid = 58;
            this.editModel.urlRoot = '/Product';
            this.editModel.destroy({
                headers: {
                    mid: mid
                },
                success: function () {
                    Backbone.history.navigate('#easyErp/Products/thumbnails', {trigger: true});
                }
            });
        }

    });
    return FormProductView;
});
