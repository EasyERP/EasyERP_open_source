define([
    'jQuery',
    'Underscore',
    'Backbone',
    'text!templates/WriteOff/InvoiceProductItems.html',
    'text!templates/WriteOff/InvoiceProductInputContent.html',
    'text!templates/Invoices/EditInvoiceProductInputContent.html',
    'text!templates/Products/InvoiceOrder/TotalAmount.html',
    'collections/Products/products',
    'populate',
    'helpers'
], function ($, _, Backbone, productItemTemplate, ProductInputContent, ProductItemsEditList, totalAmount, ProductCollection, populate, helpers) {
    'use strict';

    var ProductItemTemplate = Backbone.View.extend({
        el: '#invoiceItemsHolder',

        events: {
            'click .addProductItem'                            : 'getProducts',
            'click .current-selected'                          : 'showProductsSelect',
            'change input.statusInfo'                          : 'recalculateTaxes',
            'click .newSelectList li:not(.miniStylePagination)': 'chooseOption',
            'keyup input.statusInfo'                           : 'recalculateTaxes'
        },

        initialize: function (options) {
            var products;

            this.responseObj = {};
            this.taxesRate = 0;

            this.recalculateTaxes = _.debounce(this.recalculateTaxes, 500);

            if (options) {
                this.visible = !!options.balanceVisible;
                this.isPaid = !!options.isPaid;
                this.notAddItem = !!options.notAddItem;
                this.paid = options.paid;
            }

            this.forSales = options.forSales;

            this.render();

            products = new ProductCollection(options);
            products.bind('reset', function () {
                this.products = products;
                this.filterProductsForDD();
            }, this);
        },

        template: _.template(productItemTemplate),

        getProducts: function (e) {
            var target = $(e.target);
            var parrent = target.closest('tbody');
            var parrentRow = parrent.find('.productItem').last();
            var rowId = parrentRow.attr('data-id');
            var trEll = parrent.find('tr.productItem');
            var templ = _.template(ProductInputContent);
            var currency = {};

            e.preventDefault();
            e.stopPropagation();

            currency._id = $('#currencyDd').attr('data-id');

            if (rowId === undefined || rowId !== 'false') {
                if (!trEll.length) {
                    return parrent.prepend(templ({
                        currencyClass: helpers.currencyClass,
                        currency     : currency
                    }));
                }
                $(trEll[trEll.length - 1]).after(templ({
                    currencyClass: helpers.currencyClass,
                    currency     : currency
                }));
            }

            return false;
        },

        filterProductsForDD: function () {
            var id = '.productsDd';
            var products = this.products.toJSON();

            this.responseObj[id] = [];
            this.responseObj[id] = this.responseObj[id].concat(_.map(products, function (item) {
                return {_id: item._id, name: item.name, level: item.projectShortDesc || ''};
            }));
        },

        showProductsSelect: function (e, prev, next) {
            populate.showProductsSelect(e, prev, next, this);

            return false;
        },

        chooseOption: function (e) {
            var target = $(e.target);
            var parrent = target.parents('td');
            var trEl = target.parents('tr');
            var _id = target.attr('id');
            var model = this.products.get(_id);
            var selectedProduct = model.toJSON();

            trEl.attr('data-id', model.id);

            parrent.find('.current-selected').text(target.text()).attr('data-id', _id);
            parrent.removeClass('errorContent');
            $('.newSelectList').hide();

            this.calculateTotal(selectedProduct.info.salePrice);
        },

        recalculateTaxes: function (parent) {
            var quantity;
            var cost;
            var amount;
            var $parent = $(parent.target).closest('tr');

            quantity = $parent.find('[data-name="quantity"] input').val();
            quantity = parseFloat(quantity);
            cost = $parent.find('[data-name="price"] input').val();
            cost = parseFloat(cost);
            amount = (quantity * cost);
            amount = amount.toFixed(2);

            $parent.find('.amount').text(amount);

            this.calculateTotal();
        },

        calculateTotal: function () {
            var $thisEl = this.$el;
            var totalUntaxContainer = $thisEl.find('#totalUntaxes');
            var totalContainer = $thisEl.find('#totalAmount');
            var balanceContainer = $thisEl.find('#balance');
            var resultForCalculate = $thisEl.find('tr.productItem');
            var totalUntax = 0;
            var totalEls = resultForCalculate.length;
            var $currentEl;
            var quantity;
            var cost;
            var i;

            if (totalEls) {
                for (i = totalEls - 1; i >= 0; i--) {
                    $currentEl = $(resultForCalculate[i]);
                    quantity = $currentEl.find('[data-name="quantity"] input').val();
                    cost = $currentEl.find('[data-name="price"] input').val();
                    totalUntax += (quantity * cost);
                }
            }

            totalUntax = totalUntax.toFixed(2);
            totalUntaxContainer.text(totalUntax);
            totalUntax = parseFloat(totalUntax);

            totalContainer.text(totalUntax);

            balanceContainer.text(totalUntax - this.paid);

        },

        nextSelect: function (e) {
            this.showProductsSelect(e, false, true);
        },

        prevSelect: function (e) {
            this.showProductsSelect(e, true, false);
        },

        render: function (options) {
            var self = this;
            var productsContainer;
            var totalAmountContainer;
            var thisEl = this.$el;
            var products;

            if (options && options.model) {
                products = options.model.products;

                thisEl.html(_.template(productItemTemplate, {
                    model           : options.model,
                    forSales        : self.forSales,
                    isPaid          : self.isPaid,
                    notAddItem      : this.notAddItem,
                    currencySplitter: helpers.currencySplitter,
                    currencyClass   : helpers.currencyClass
                }));

                if (products) {
                    productsContainer = thisEl.find('#productList');
                    productsContainer.prepend(_.template(ProductItemsEditList, {
                        products        : products,
                        forSales        : self.forSales,
                        isPaid          : self.isPaid,
                        notAddItem      : this.notAddItem,
                        currencySplitter: helpers.currencySplitter,
                        currencyClass   : helpers.currencyClass
                    }));
                    this.recalculateTaxes(this.$el.find('.listTable'));
                    totalAmountContainer = thisEl.find('#totalAmountContainer');
                    totalAmountContainer.append(_.template(totalAmount, {
                        model           : options.model,
                        balanceVisible  : this.visible,
                        currencySplitter: helpers.currencySplitter,
                        currencyClass   : helpers.currencyClass
                    }));
                }
            } else {
                this.$el.html(this.template({
                    forSales  : self.forSales,
                    isPaid    : self.isPaid,
                    notAddItem: this.notAddItem
                }));
                totalAmountContainer = thisEl.find('#totalAmountContainer');
                totalAmountContainer.append(_.template(totalAmount, {
                    model           : null,
                    balanceVisible  : this.visible,
                    currencySplitter: helpers.currencySplitter,
                    currencyClass   : helpers.currencyClass
                }));
            }

            return this;
        }
    });

    return ProductItemTemplate;
});
