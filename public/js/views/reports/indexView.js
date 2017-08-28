define([
    'Backbone',
    'jQuery',
    'Underscore',
    'views/listViewBase',
    'views/reports/CreateView',
    'views/reports/EditView',
    'dataService',
    'moment',
    'text!templates/reports/MainTemplate.html',
    'constants/customReports',
    'services/productCategories'
], function (Backbone, $, _, Parent, CreateView, EditView, dataService, moment, mainTemplate, constants, productCategoriesService) {
    'use strict';

    var ContentView = Parent.extend({
        contentType: 'reports',
        actionType : 'Content',
        CreateView : CreateView,
        EditView   : EditView,
        template   : _.template(mainTemplate),
        el         : '#content-holder',
        responseObj: {},

        initialize: function (options) {
            var collectionJson;

            this.startTime = options.startTime;
            this.collection = options.collection;

            collectionJson = this.collection.toJSON();

            this.collection.bind('change', this.render, this);

            this.model = collectionJson.length ? collectionJson[0] : {};
            this.render();

            this.productCategoriesIds = [];
        },

        events: {
            'click .mainSettings'    : 'chooseDetails',
            'click .mainList'        : 'renderChildElements',
            'click .editRow'         : 'editItem',
            'click .deleteRow'       : 'deleteItem',
            'click .copyRow'         : 'copyRow',
            'click #showBtn'         : productCategoriesService.showCategories,
            'change .productCategory': 'changeCategory',
            'click .deleteTag'       : 'deleteCategory',
            'click .favoriteRow'     : 'addToFavorite',
            'click .allreadyFav'     : 'onAllreadyFav'
        },

        renderReportCategories: function () {
            var $thisEl = this.$el;
            var $checkedCategoryContainer = $thisEl.find('#checkedProductCategories');
            var changedCategories = this.productCategoriesIds || [];
            var constantsTypesReport = constants.typesReports;

            _.each(changedCategories, function (category) {
                $thisEl.find('#' + category).prop('checked', true);

                $checkedCategoryContainer.append('<li><span class="checkedProductCategory"  data-value="' + category + '" data-id="' + category + '">' + constantsTypesReport[category] + '</span><span class="deleteTag icon-close3"></span></li>');
            });
        },

        changeCategory: function (e) {
            var $thisEl = this.$el;
            var $categoryContainer = $thisEl.find('#checkedProductCategories');
            var $target = $(e.target);
            var categoryId = $target.data('id');
            var categoryName = $target.data('value');
            var checkedProductCategory = $thisEl.find('.checkedProductCategory');
            var constantsTypesReport = constants.typesReports;
            var idsArray = [];
            var indexCategory;

            e.stopPropagation();

            if (checkedProductCategory && checkedProductCategory.length) {
                checkedProductCategory.each(function (key, item) {
                    idsArray.push($(item).data('id'));
                });
            }

            if (idsArray.length && idsArray.indexOf(categoryId) >= 0) {
                $categoryContainer.find('[data-id=' + categoryId + ']').closest('li').remove();
            } else {
                $categoryContainer.append('<li><span class="checkedProductCategory"  data-value="' + categoryName + '" data-id="' + categoryId + '">' + constantsTypesReport[categoryName] + '</span><span class="deleteTag icon-close3"></span></li>');
            }

            if (typeof this.useFilter === 'function') {
                this.useFilter();
            }

            indexCategory = this.productCategoriesIds.indexOf(categoryId);

            if (indexCategory >= 0) {
                this.productCategoriesIds.splice(indexCategory, 1);
            } else {
                this.productCategoriesIds.push(categoryId);
            }

            this.collection.getFirstPage({
                reportCategory: this.productCategoriesIds
            });
        },

        deleteCategory: function (e) {
            var $thisEl = this.$el;
            var $target = $thisEl.find(e.target);
            var id = $thisEl.find($target.closest('li')
                .find('.checkedProductCategory')[0])
                .data('id');
            var indexCategory = this.productCategoriesIds.indexOf(id);

            e.stopPropagation();

            $thisEl.find('.productCategory[data-id="' + id + '"]')
                .prop('checked', false);
            $target.closest('li').remove();

            if (typeof this.useFilter === 'function') {
                this.useFilter();
            }

            if (indexCategory >= 0) {
                this.productCategoriesIds.splice(indexCategory, 1);
            }

            this.collection.getFirstPage({
                type: this.productCategoriesIds
            });
        },

        editItem: function (e) {
            var id = $(e.target).closest('tr').attr('id');
            var collection = this.collection.toJSON()[0].all;
            var isPrivate = $(e.target).closest('tr').hasClass('private');
            var model;

            model = _.find(collection, function (item) {
                return item._id === id;
            });

            e.preventDefault();
            e.stopPropagation();

            if (isPrivate) {

                if (model.createdBy.user !== App.currentUser._id) {
                    return App.render({type: 'error', message: 'Permission denied. It\'s private report'});
                }
            }

            return new EditView({model: model, collection: this.collection});
            //return new EditView({model: this.model});
        },

        copyRow: function (e) {
            var id = $(e.target).closest('tr').attr('id');
            var collection = this.collection.toJSON()[0].all;
            var isPrivate = $(e.target).closest('tr').hasClass('private');
            var model;

            model = _.find(collection, function (item) {
                return item._id === id;
            });

            e.preventDefault();
            e.stopPropagation();

            if (isPrivate) {

                if (model.createdBy.user !== App.currentUser._id) {
                    return App.render({type: 'error', message: 'Permission denied. It\'s private report'});
                }
            }
            return new EditView({model: model, collection: this.collection, copyReport: true});
        },

        chooseDetails: function (e) {
            var $elem = $(e.target);
            var rowId = $elem.closest('.mainSettings').attr('id');
            var pathFragment = '#easyErp/reports/';
            var isPrivate = $elem.closest('.mainSettings').hasClass('private');
            var current;

            if (isPrivate) {
                current = _.find(this.model.private, function (el) {
                    return el._id === rowId;
                });

                if (current.createdBy.user !== App.currentUser._id) {
                    return App.render({type: 'error', message: 'Permission denied. It\'s private report'});
                }
            }

            Backbone.history.navigate(pathFragment + rowId, {trigger: true});
        },

        deleteItem: function (e) {
            var $elem = $(e.target);
            var $currentRow = $elem.closest('.mainSettings');
            var id = $currentRow.attr('id');
            var collection = this.collection;
            var url = collection.url;
            var isPrivate = $elem.closest('.mainSettings').hasClass('private');
            var answer;
            var current;

            e.stopPropagation();

            if (this.changed) {
                return this.cancelChanges();
            }

            if (isPrivate) {
                current = _.find(this.model.private, function (el) {
                    return el._id === id;
                });

                if (current.createdBy.user !== App.currentUser._id) {
                    return App.render({type: 'error', message: 'Permission denied. It\'s private dashboard'});
                }
            }

            answer = confirm('Really DELETE items ?!');

            if (answer === false) {
                return false;
            }

            dataService.deleteData(url, {contentType: this.contentType, ids: [id]}, function (err, response) {
                if (err) {
                    return App.render({
                        type   : 'error',
                        message: 'Can\'t remove items'
                    });
                }

                Backbone.history.fragment = '';
                Backbone.history.navigate('easyErp/reports', {trigger: true});
            });
        },

        addToFavorite: function (e) {
            var $elem = $(e.target);
            var $currentRow;
            var reportId;
            var favoriteUrl = '/reports/favorite/';

            e.preventDefault();
            e.stopPropagation();

            $currentRow = $elem.closest('tr');
            reportId = $currentRow.attr('id');

            favoriteUrl = favoriteUrl + reportId;

            dataService.getData(favoriteUrl, {}, function (response) {
                if (response.success) {
                    $elem.removeClass('icon-star');
                    $elem.removeClass('favoriteRow');
                    $elem.addClass('icon-star2');
                    $elem.addClass('allreadyFav');

                    App.render({
                        type   : 'notify',
                        message: response.success
                    });
                } else {
                    App.render({
                        type   : 'error',
                        message: response.error
                    });
                }
            }, this);
        },

        onAllreadyFav: function (e) {
            var $elem = $(e.target);
            var $currentRow;
            var reportId;
            var favoriteUrl = '/reports/unfavorite/';

            e.preventDefault();
            e.stopPropagation();

            $currentRow = $elem.closest('tr');
            reportId = $currentRow.attr('id');

            favoriteUrl = favoriteUrl + reportId;

            dataService.getData(favoriteUrl, {}, function (response) {
                if (response.success) {
                    $elem.removeClass('icon-star2');
                    $elem.removeClass('allreadyFav');
                    $elem.addClass('icon-star');
                    $elem.addClass('favoriteRow');

                    App.render({
                        type   : 'notify',
                        message: response.success
                    });
                } else {
                    App.render({
                        type   : 'error',
                        message: response.error
                    });
                }
            }, this);
        },

        renderChildElements: function (e) {
            var allMainLi = this.$el.find('.reportsList').find('li');
            var $target = e ? $(e.target) : allMainLi.first();
            var id = $target.closest('li').attr('id');

            allMainLi.removeClass('active');
            $target.addClass('active');

            this.$el.find('.childBlock').addClass('hidden');

            this.$el.find('[data-id="' + id + '"]').removeClass('hidden');
        },

        showMoreContent: function (newModels) {
            newModels = newModels.toJSON();

            this.model = newModels.length ? newModels[0] : {};

            this.render();
        },

        render: function () {
            var $thisEl = this.$el;
            var constantsReports = constants.reports;
            var constantsTypesReport = constants.typesReports;
            var $categoriesBlock;

            this.$el.html(this.template({
                moment              : moment,
                model               : this.model,
                constants           : Object.keys(constantsReports),
                constantsTypesReport: constantsTypesReport
            }));

            $categoriesBlock = $thisEl.find('#variantsCategoriesBlock');
            $categoriesBlock.removeClass('open');
            $categoriesBlock.children('ul').hide();

            this.renderChildElements();
            this.renderReportCategories();

            return this;
        }

    });

    return ContentView;
});

