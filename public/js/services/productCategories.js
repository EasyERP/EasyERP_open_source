define([
    'jQuery',
    'Underscore',
    'dataService'
], function ($, _, dataService) {
    function changeCategory(e) {
        var $thisEl = this.$el;
        var $categoryContainer = $thisEl.find('#checkedProductCategories');
        var $target = $(e.target);
        var categoryId = $target.data('id');
        var categoryName = $target.data('value');
        var checkedProductCategory = $thisEl.find('.checkedProductCategory');
        var idsArray = [];

        e.stopPropagation();

        if (checkedProductCategory && checkedProductCategory.length) {
            checkedProductCategory.each(function (key, item) {
                idsArray.push($(item).data('id'));
            });
        }

        if (idsArray.length && idsArray.indexOf(categoryId) >= 0) {
            $categoryContainer.find('[data-id=' + categoryId + ']').closest('li').remove();
        } else {
            $categoryContainer.append('<li><span class="checkedProductCategory"  data-value="' + categoryName + '" data-id="' + categoryId + '">' + categoryName + '</span><span class="deleteTag icon-close3"></span></li>');
        }

        if (typeof this.useFilter === 'function') {
            this.useFilter();
        }
    }

    function deleteCategory(e) {
        var $thisEl = this.$el;
        var $target = $thisEl.find(e.target);
        var id = $thisEl.find($target.closest('li')
            .find('.checkedProductCategory')[0])
            .data('id');

        e.stopPropagation();

        $thisEl.find('.productCategory[data-id="' + id + '"]')
            .prop('checked', false);
        $target.closest('li').remove();

        if (typeof this.useFilter === 'function') {
            this.useFilter();
        }
    }

    function renderProductCategories(changedCategories) {
        var $thisEl = this.$el;
        var $checkedCategoryContainer = $thisEl.find('#checkedProductCategories');
        var $categoriesBlock = $thisEl.find('#variantsCategoriesBlock');
        var $categoryContainer = $thisEl.find('#productCategories');
        var checkedSelectedId;
        var checkedName;

        changedCategories = changedCategories || [];

        dataService.getData('/category', {}, function (result) {
            var categories = result.data;

            _.each(categories, function (category) {
                checkedName = '';
                checkedSelectedId = '';

                if (changedCategories.indexOf(category._id) >= 0) {
                    $categoryContainer.append('<li><label class="_customCHeckbox"><input checked="checked" type="checkbox" class="checkbox productCategory" id="' + category._id + '" data-value="' + category.name + '" data-id="' + category._id + '"> <span></span></label><label class="_checkboxLabel" for="' + category._id + '">' + category.name + '</label></li>');
                    checkedSelectedId = category._id;
                    checkedName = category.name;
                } else {
                    $categoryContainer.append('<li><label class="_customCHeckbox"><input type="checkbox" class="checkbox productCategory" id="' + category._id + '" data-value="' + category.name + '" data-id="' + category._id + '"> <span></span></label><label class="_checkboxLabel" for="' + category._id + '">' + category.name + '</label></li>');
                }

                if (checkedName) {
                    $checkedCategoryContainer.append('<li><span class="checkedProductCategory"  data-value="' + checkedName + '" data-id="' + checkedSelectedId + '">' + checkedName + '</span><span class="deleteTag icon-close3"></span></li>');
                }
            });

            // $categoriesBlock.children('ul').hide();

        }, this);
    }

    function renderMultiFilter() {
        var $thisEl = this.$el;
        var $checkedCategoryContainer = $thisEl.find('#checkedProductCategories');
        var $categoriesBlock = $thisEl.find('#variantsCategoriesBlock');
        var $categoryContainer = $thisEl.find('#productCategories');
        var checkedSelectedId;
        var checkedName;
        var self = this;
        var checkObject = {};

        dataService.getData('/products/optionsValues/getForFiler', {id: this.groupId}, function (result) {

            _.each(result, function (category) {
                checkedName = '';
                checkedSelectedId = '';

                if (!category.name) {
                    return false;
                }

                if (!checkObject[category.name]) {
                    checkObject[category.name] = 1;
                    $categoryContainer.append('<li><label class="_customCHeckbox"><input type="checkbox" class="checkbox productCategory" data-value="' + category.name + '" data-id="' + category.variantId + '" data-variant="' + category._id + '"> <span></span></label>' + category.name + '</li>');

                    if (checkedName) {
                        $checkedCategoryContainer.append('<li><span class="checkedProductCategory"  data-value="' + checkedName + '" data-id="' + checkedSelectedId + '">' + checkedName + '</span><span class="deleteTag icon-close3"></span></li>');
                    }
                }

            });

            // $categoriesBlock.children('ul').hide();

        }, this);
    }

    function showCategories(e) {
        var $thisEl = this.$el;
        var $categoriesBlock = $thisEl.find('#variantsCategoriesBlock');

        e.stopPropagation();

        if (!$categoriesBlock.length) {
            $categoriesBlock = $thisEl.find('#variantsCategoriesBlock');
        }

        if ($categoriesBlock.hasClass('open')) {
            $categoriesBlock.removeClass('open');
            $categoriesBlock.children('ul').hide();
        } else {
            $categoriesBlock.addClass('open');
            $categoriesBlock.children('ul').show();
        }
    }

    return {
        changeCategory         : changeCategory,
        renderProductCategories: renderProductCategories,
        showCategories         : showCategories,
        deleteCategory         : deleteCategory,
        renderMultiFilter      : renderMultiFilter
    };
});

