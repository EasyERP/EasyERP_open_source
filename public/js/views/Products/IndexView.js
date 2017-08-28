define([
    'Backbone',
    'jQuery',
    'Underscore',
    'text!templates/Products/ContentTemplate.html',
    'text!templates/Products/TreeItemTemplate.html',
    'models/Category',
    'views/Products/category/CreateView',
    'views/Products/category/EditView',
    'views/Products/category/TopBarView',
    'collections/Products/filterCollection',
    'collections/Products/ProductCategories',
    'views/Products/thumbnails/ThumbnailsView',
    'helpers/eventsBinder',
    'dataService',
    'constants'
], function (Backbone, $, _, ContentTemplate, ItemTemplate, CurrentModel, CreateCategoryView, EditCategoryView, TopBarView, ProductsCollection, CategoryCollection, ThumbnailsView, eventsBinder, dataService, CONSTANTS) {
    var ProductsView = Backbone.View.extend({
        el               : '#content-holder',
        thumbnailsView   : null,
        productCollection: null,
        itemTemplate     : _.template(ItemTemplate),

        events: {
            'click .expand'         : 'expandHideItem',
            'click .item > .content': 'selectCategory',
            'click .editCategory'   : 'editItem',
            'click .deleteCategory' : 'deleteItem',
            'click .addProduct'     : 'addProduct',
            'click #magentoExport'  : 'magentoProductExport',
            'click #magentoImport'  : 'magentoProductImport'
        },

        initialize: function (options) {
            var eventChannel = {};

            _.extend(eventChannel, Backbone.Events);

            this.topBar = options.topBar;
            this.startTime = options.startTime;
            this.collection = options.collection;
            this.eventChannel = eventChannel;
            this.collection.bind('reset', _.bind(this.render, this));
            this.startNumber = 0;
            this.filter = options.filter;
            this.countPerPage = options.countPerPage;
            this.productCollection = new ProductsCollection({
                page       : 1,
                contentType: 'Products',
                viewType   : 'thumbnails',
                filter     : this.filter,
                count      : this.countPerPage,
                reset      : true,
                showMore   : false
            });

            this.render();

            this.productCollection.bind('reset', _.bind(this.renderThumbnails, this));
            this.listenTo(eventChannel, 'itemCreated', this.renderFilteredContent);
        },

        magentoProductExport: function (event) {
            event.preventDefault();
            this.thumbnailsView.magentoExport();
        },

        magentoProductImport: function (event) {
            event.preventDefault();
            this.thumbnailsView.magentoImport();
        },

        addProduct: function (event) {
            event.preventDefault();
            this.thumbnailsView.createItemProduct();
        },

        selectFirstCategory: function () {
            var $thisEl = this.$el;

            $thisEl.find('.groupList .selected').removeClass('selected');
            $thisEl.find('.content').first().addClass('selected');
        },

        selectCategory: function (e) {
            var $targetEl = $(e.target);
            var $thisEl = this.$el;
            var $groupList = $thisEl.find('.groupList');
            var $currentLi;
            var id;

            e.stopPropagation();

            $groupList.find('.selected').removeClass('selected');
            $targetEl.closest('.content').addClass('selected');

            $currentLi = $targetEl.closest('li');
            id = $currentLi.attr('data-id');

            this.renderFilteredContent(id);
        },

        createItem: function () {
            var $thisEl = this.$el;
            var $groupList = $thisEl.find('.groupList');
            var $selectedEl = $groupList.find('.selected').length ? $groupList.find('.selected').closest('li') : $groupList.find('li').first();
            var categoryId = $selectedEl.attr('data-id');

            return new CreateCategoryView({
                _id: categoryId
            });
        },

        expandHideItem: function (e) {
            var $target = $(e.target);
            var parentId = $target.closest('li').attr('data-id');
            var $ulEl = $target.closest('li').find('ul');

            if ($target.hasClass('disclosed')) {
                $ulEl.remove();
                $target.closest('li').find('.expand').removeClass('disclosed icon-folder-open3').addClass('icon-folder3');
            } else {
                this.trigger('renderChildren', {parentId: parentId});

                $target.removeClass('icon-folder3').addClass('disclosed icon-folder-open3');
            }
        },

        renderFilteredContent: function (categoryId) {
            var self = this;
            var categoryUrl = '/category/' + categoryId;
            var ids;

            dataService.getData(categoryUrl, {}, function (category) {

                ids = category.child || [];
                ids.push(categoryId);

                if (!App.filtersObject.filter) {
                    App.filtersObject.filter = {};
                }

                App.filtersObject.filter.productCategory = {
                    key  : 'info.categories',
                    value: ids,
                    type : this.filterType || null
                };

                self.thumbnailsView.showFilteredPage(App.filtersObject.filter);
                self.thumbnailsView.filterView.showFilterIcons(self.filter);
            }, this);
        },

        editItem: function (e) {
            var model = new CurrentModel({validate: false});
            var id = $(e.target).closest('li').data('id');

            model.urlRoot = '/category/' + id;
            model.fetch({
                success: function (model) {
                    return new EditCategoryView({myModel: model});
                },

                error: function () {
                    App.render({
                        type   : 'error',
                        message: 'Please refresh browser'
                    });
                }
            });

            return false;
        },

        deleteItem: function (e) {
            var $targetEl = $(e.target);
            var myModel = this.collection.get($targetEl.closest('li').data('id'));
            var answer = confirm('Really DELETE items ?!');

            e.preventDefault();

            if (answer === true) {
                myModel.destroy({
                    wait   : true,
                    success: function () {
                        var url = window.location.hash;
                        Backbone.history.fragment = '';
                        Backbone.history.navigate(url, {trigger: true});
                    },

                    error: function (model, err) {
                        if (err.status === 403) {
                            App.render({
                                type   : 'error',
                                message: 'You do not have permission to perform this action'
                            });
                        } else {
                            Backbone.history.navigate('home', {trigger: true});
                        }
                    }
                });
            }
            return false;
        },

        renderItem: function (product, className, selected) {
            var canDelete = true;
            var hasChild = false;

            if (product.child && product.child.length) {
                canDelete = false;
            } else {
                if (product.productsCount > 0) {
                    canDelete = false;
                }
            }

            if (product.ch && product.ch.length) {
                hasChild = true;
            }

            return this.itemTemplate({
                className: className,
                selected : selected,
                product  : product,
                hasChild : hasChild,
                canDelete: canDelete
            });
        },

        renderFoldersTree: function (products) {
            var self = this;
            var $thisEl = this.$el;
            var selectedMain = '';
            var selected = '';
            var currentCategory;

            if (App.filtersObject.filter && App.filtersObject.filter.productCategory && App.filtersObject.filter.productCategory.value.length) {
                currentCategory = App.filtersObject.filter.productCategory.value[App.filtersObject.filter.productCategory.value.length - 1];
            }

            products.forEach(function (product) {

                if (!currentCategory) {
                    selectedMain = 'selected';
                } else {
                    if (currentCategory === product._id) {
                        selected = 'selected';
                    } else {
                        selected = '';
                    }
                }

                $thisEl.find('.groupList').append(self.renderItem(product, 'parent', selectedMain));
                $thisEl.find('.groupList li.item').append('<a class="expand icon-folder3" href="javascript:;"></a>');
            });

            this.on('renderChildren', renderChildren, this);

            function renderChildren(opts) {
                var parentId = opts.parentId;
                var categories;
                var par;

                this.childrenCollection = new CategoryCollection({
                    isChild  : true,
                    parentId : parentId,
                    forParent: true
                }, {reset: true});

                this.childrenCollection.on('reset', function () {
                    categories = self.childrenCollection.toJSON();

                    categories.forEach(function (category) {
                        par = $thisEl.find("[data-id='" + category.parent + "']");

                        if (par.find('ul').length === 0) {
                            par.append('<ul></ul>');
                        }

                        par.find('ul').append(self.renderItem(category, 'child', selected));
                    });
                });
            }

            $('.groupList .item .content').droppable({
                accept   : '.product',
                tolerance: 'pointer',
                drop     : function (event, ui) {
                    var $droppable = $(this).closest('li');
                    var $draggable = ui.draggable;
                    var productId = $draggable.attr('id');
                    var categoryId = $droppable.data('id');
                    var changed;
                    var currentModel = self.productCollection.get(productId);

                    if (!currentModel) {
                        currentModel = new CurrentModel({validate: false});

                        currentModel.urlRoot = CONSTANTS.URLS.PRODUCT;

                        currentModel.fetch({
                            data   : {id: productId, viewType: 'form'},
                            success: function (response) {
                                currentModel.set({
                                    'info.category': categoryId
                                });

                                changed = currentModel.changed;

                                currentModel.save(changed, {
                                    patch  : true,
                                    wait   : true,
                                    success: function () {
                                        self.renderFilteredContent(categoryId);
                                    }
                                });

                                $(this).addClass('selected');
                            },

                            error: function () {
                                App.render({
                                    type   : 'error',
                                    message: 'Please refresh browser'
                                });
                            }
                        });
                    } else {
                        currentModel.set({
                            'info.category': categoryId
                        });

                        changed = currentModel.changed;

                        currentModel.save(changed, {
                            patch  : true,
                            wait   : true,
                            success: function () {
                                self.renderFilteredContent(categoryId);
                            }
                        });

                        $(this).addClass('selected');
                    }
                },

                over: function () {
                    var $droppableEl = $(this);
                    var $groupList = self.$el;

                    $groupList.find('.selected').removeClass('selected');
                    $droppableEl.addClass('selected');
                },

                out: function () {
                    $(this).removeClass('selected');
                }
            });
        },

        renderThumbnails: function () {
            var topBarView;

            this.thumbnailsView = new ThumbnailsView({
                collection  : this.productCollection,
                categories  : this.collection,
                startTime   : new Date(),
                filter      : this.filter,
                el          : '#productsHolder',
                eventChannel: this.eventChannel,
                topBar      : this.topBar
            });

            this.productCollection.unbind('reset');

            /*if (this.topBarView) {
             this.topBarView.undelegateEvents();
             this.topBarView.stopListening();
             }

             this.topBarView = new TopBarView({
             collection: this.productCollection,
             actionType: 'Content'
             });

             eventsBinder.subscribeTopBarEvents(this.topBarView, this.thumbnailsView);*/
            eventsBinder.subscribeCollectionEvents(this.productCollection, this.thumbnailsView);

            this.productCollection.trigger('fetchFinished', {
                totalRecords: this.productCollection.totalRecords,
                currentPage : this.productCollection.currentPage,
                pageSize    : this.productCollection.pageSize
            });

            this.listenTo(this.thumbnailsView.filterView, 'categoryRemoved', this.selectFirstCategory);
        },

        render: function () {
            var products = this.collection.toJSON();
            this.$el.html(_.template(ContentTemplate));
            this.renderFoldersTree(products);
        }
    });

    return ProductsView;
});
