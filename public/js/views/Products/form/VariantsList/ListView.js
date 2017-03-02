define([
    'Backbone',
    'jQuery',
    'Underscore',
    'views/listViewBase',
    'text!templates/Products/form/VariantsList/ListHeader.html',
    'views/Products/form/VariantsList/ListItemView',
    'common',
    'constants',
    'services/productCategories',
    'models/ProductModel'
], function (Backbone,
             $,
             _,
             listViewBase,
             listTemplate,
             ListItemView,
             common,
             CONSTANTS,
             productCategoriesService,
             ProductModel) {
    'use strict';

    var ListView = listViewBase.extend({
        el           : '#variantsTable',
        listTemplate : listTemplate,
        ListItemView : ListItemView,
        hasPagination: false,

        initialize: function (options) {
            $(document).off('click');

            options.startTime = new Date();
            this.noNeedCreatedIn = options.noNeedCreatedIn;
            this.products = options.products;
            this.sort = options.sort;
            this.filter = options.filter;
            this.stages = [];

            this.parentView = options.parentView;
            this.id = options.id;
            this.groupId = options.groupId;

            listViewBase.prototype.initialize.call(this, options);
        },

        events: {
            'click td:not(a.goToRemove)': 'goToEdit',
            'click #showBtn'            : productCategoriesService.showCategories,
            'change .productCategory'   : productCategoriesService.changeCategory,
            'click .deleteTag'          : productCategoriesService.deleteCategory,
            'click .goToRemoveVariant'  : 'deleteItem'
        },

        deleteItem: function (event) {
            var $target = $(event.target);
            var mid = 58;
            var id = $target.closest('tr').attr('id');
            var answer = confirm('Really DELETE items ?!');
            var editModel = new ProductModel(_.find(this.products, function (el) {
                return el._id === id;
            }));

            event.preventDefault();
            event.stopPropagation();

            if (CONSTANTS.PRODUCRSERVICE !== id.toString()) {
                if (answer) {
                    editModel.destroy({
                        headers: {
                            mid: mid
                        },
                        success: function () {
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

        goToEdit: function (e) {
            var $target = $(e.target);
            var id = $target.closest('tr').attr('id');

            this.$el.find('tr').removeClass('red');

            this.parentView.rerender({id: id});
        },

        useFilter: function () {
            var $thisEl = this.$el;
            var $categoryContainer = $thisEl.find('#checkedProductCategories');
            var $checked = $categoryContainer.find('.checkedProductCategory');
            var values = [];
            var $table = this.$el.find('#listTableVariants');
            var hideIds;

            $table.find('tr').removeClass('notHide');
            $table.find('tr').removeClass('hidden');

            $checked.each(function () {
                var valueId = $(this).attr('data-id');
                values.push(valueId);
            });

            values.forEach(function (id) {
                $table.find('td.variant').find('[id="' + id + '"]').closest('tr').addClass('notHide');
            });

            if (values && values.length) {
                $table.find('tr:not(.notHide)').toggleClass('hidden');
            }

        },

        render: function () {
            var $currentEl;
            var itemView;

            $('.ui-dialog ').remove();

            $currentEl = this.$el;

            $currentEl.html('');
            $currentEl.append(_.template(listTemplate));

            itemView = new this.ListItemView({
                collection : this.products,
                page       : this.page,
                itemsNumber: this.collection.namberToShow,
                id         : this.id
            });

            $currentEl.append(itemView.render());

            productCategoriesService.renderMultiFilter.call(this);
        }
    });

    return ListView;
});
