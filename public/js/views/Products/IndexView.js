define([
    'Backbone',
    'jQuery',
    'Underscore',
    'text!templates/Product/ContentTemplate.html',
    'models/Category',
    'views/Products/category/CreateView',
    'views/Products/category/EditView',
    'collections/Products/filterCollection',
    'views/Products/thumbnails/ThumbnailsView',
    'helpers/eventsBinder',
    'dataService'
], function (Backbone, $, _, ContentTemplate, CurrentModel, CreateCategoryView, EditCategoryView, ProductsCollection, ThumbnailsView, eventsBinder, dataService) {
    var ProductsView = Backbone.View.extend({
        el                : '#content-holder',
        thumbnailsView    : null,
        productCollection : null,
        selectedCategoryId: null,

        events: {
            'click .expand'        : 'expandHideItem',
            'click .item > span'   : 'selectCategory',
            'click .editCategory'  : 'editItem',
            'click .deleteCategory': 'deleteItem'
        },

        initialize: function (options) {
            var self = this;
            this.startTime = options.startTime;
            this.collection = options.collection;
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

            this.productCollection.bind('reset', _.bind(this.render, this));
        },

        expandHideItem: function (e) {
            var $target = $(e.target);
            var $ulEl = $target.closest('li').find('ul');

            if ($target.text() === '+') {
                $ulEl.first().removeClass('hidden');
                $ulEl.closest('li').find('.expand').first().text('-');
            } else {
                $ulEl.addClass('hidden');
                $ulEl.closest('li').find('.expand').text('+');
            }

        },

        selectCategory: function (e) {
            var self = this;
            var $targetEl = $(e.target);
            var $thisEl = this.$el;
            var $groupList = $thisEl.find('.groupList');
            var $currentLi;
            var id;

            $groupList.find('.selected').removeClass('selected');
            $targetEl.closest('li').addClass('selected');

            $currentLi = $targetEl.closest('li');
            id = $currentLi.attr('data-id');

            this.productCollection.getPage(1, {
                categoryId : id,
                contentType: 'Products',
                viewType   : 'thumbnails',
                filter     : this.filter
            });
        },

        createItem: function () {
            var $thisEl = this.$el;
            var $groupList = $thisEl.find('.groupList');
            var $selectedEl = $groupList.find('.selected').length ? $groupList.find('.selected') : $groupList.find('li').first();
            var categoryId = $selectedEl.attr('data-id');

            new CreateCategoryView({
                _id: categoryId
            });
        },

        editItem: function (e) {
            var self = this;
            var model = new CurrentModel({validate: false});
            var id = $(e.target).closest('li').data('id');

            model.urlRoot = '/category/' + id;
            model.fetch({
                success: function (model) {
                    new EditCategoryView({myModel: model});
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
            var mid = 39;
            var self = this;
            var answer = confirm('Really DELETE items ?!');

            e.preventDefault();

            if (answer === true) {
                myModel.destroy({
                    headers: {
                        mid: mid
                    },
                    wait   : true,
                    success: function () {
                        self.render();
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

        groupMove: function () {
            $('.groupList li').each(function () {
                if ($(this).find('li').length > 0) {
                    $(this).attr('class', 'parent');
                } else {
                    $(this).attr('class', 'child');
                }
            });
        },

        renderItem: function (product, index, className, selected) {
            return '<li class="' + className + ' item ' + selected + '" data-id="' + product._id + '" data-level="' + product.nestingLevel + '" data-sequence="' + product.sequence + '"><span class="content"><span class="text">' + product.name + '</span><span class="editCategory">&nbspe&nbsp</span><span class="deleteCategory">&nbspd&nbsp</span></span></li>';
        },

        renderFoldersTree: function (products) {
            var self = this;
            var $thisEl = this.$el;
            var par;

            products.forEach(function (product, i) {

                if (!product.parent) {
                    $thisEl.find('.groupList').append(self.renderItem(product, i + 1, 'child', 'selected'));
                } else {
                    par = $thisEl.find("[data-id='" + product.parent._id + "']").removeClass('child').addClass('parent');

                    if (!par.find('.expand').length) {
                        par.append('<a class="expand" href="javascript:;" style="display: inline-block; float: left">-</a>')
                    }

                    if (par.find('ul').length === 0) {
                        par.append('<ul style="margin-left:20px"></ul>');
                    }

                    par.find('ul').first().append(self.renderItem(product, i + 1, 'child'));
                }

            });
        },

        renderThumbnails: function () {

            this.thumbnailsView = new ThumbnailsView({
                collection: this.productCollection,
                startTime : new Date(),
                filter    : this.filter,
                el        : '#productContent'
            });

            this.productCollection.unbind('reset');

            eventsBinder.subscribeCollectionEvents(this.productCollection, this.thumbnailsView);

            this.productCollection.trigger('fetchFinished', {
                totalRecords: this.productCollection.totalRecords,
                currentPage : this.productCollection.currentPage,
                pageSize    : this.productCollection.pageSize
            });

        },

        render: function () {
            var products = this.collection.toJSON();

            this.$el.html(_.template(ContentTemplate));
            this.renderFoldersTree(products);
            this.renderThumbnails();

        }
    });

    return ProductsView;
});
