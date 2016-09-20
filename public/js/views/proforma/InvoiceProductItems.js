define([
    'Backbone',
    'Underscore',
    'jQuery',
    'text!templates/Invoices/InvoiceProductItems.html',
    'text!templates/Invoices/InvoiceProductInputContent.html',
    'text!templates/Proforma/EditInvoiceProductInputContent.html',
    'text!templates/Products/InvoiceOrder/TotalAmount.html',
    'text!templates/Invoices/EditInvoiceProductInputContent.html',
    'collections/Products/products',
    'populate',
    'helpers/keyValidator',
    'helpers',
    'constants'
], function (Backbone, _, $, productItemTemplate, ProductInputContent, ProductItemsEditList, totalAmount, ProductItemsEditListProforma, ProductCollection, populate, keyValidator, helpers, CONSTANTS) {
    'use strict';
    var ProductItemTemplate = Backbone.View.extend({
        el: '#invoiceItemsHolder',

        events: {
            'click .addProductItem'                                           : 'getProducts',
            'click .newSelectList li:not(.miniStylePagination)'               : 'chooseOption',
            'click .newSelectList li.miniStylePagination'                     : 'notHide',
            'click .newSelectList li.miniStylePagination .next:not(.disabled)': 'nextSelect',
            'click .newSelectList li.miniStylePagination .prev:not(.disabled)': 'prevSelect',
            'click .current-selected'                                         : 'showProductsSelect',
            'keyup td[data-name=price] input'                                 : 'priceChange',
            'keypress .forNum'                                                : 'keypressHandler'
        },

        initialize: function (options) {
            var products;

            this.responseObj = {};
            this.taxesRate = 0;


            if (options) {
                this.visible = !!options.balanceVisible;
                this.isPaid = !!options.isPaid;
                this.discountVisible = options.discountVisible;
                this.notAddItem = !!options.notAddItem;
                this.paid = options.paid;
                this.approved = options.approved;
            }

            this.forSales = options.forSales;

            this.render();

            products = new ProductCollection(options);
            products.bind('reset', function () {
                this.products = products;
                this.filterProductsForDD();
            }, this);

            this.priceChange = _.debounce(this.priceChange, 250);
        },

        template: _.template(productItemTemplate),

        getProducts: function (e) {
            var target = $(e.target);
            var parrent = target.closest('tbody');
            var parrentRow = parrent.find('.productItem').last();
            var rowId = parrentRow.attr('data-id');
            var trEll = parrent.find('tr.productItem');

            e.preventDefault();
            e.stopPropagation();

            if (rowId === undefined || rowId !== 'false') {
                if (!trEll.length) {
                    return parrent.prepend(_.template(ProductInputContent));
                }
                $(trEll[trEll.length - 1]).after(_.template(ProductInputContent));
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

        keypressHandler: function (e) {
            return keyValidator(e, true);
        },

        priceChange: function (e) {
            var $targetEl = $(e.target);
            var parent = $targetEl.closest('td');
            var inputEl = parent.find('input');
            var val = inputEl.val();

            if (!inputEl.length) {
                inputEl = parent.find('textarea');
            }

            if (!val.length) {
                val = 0;
            }

            e.preventDefault();

            if (inputEl.hasClass('datepicker')) {
                parent.find('span').addClass('datepicker');
            }
            if (inputEl.hasClass('textarea')) {
                parent.find('span').addClass('textarea');
            }

            this.recalculateTaxes(parent);
        },

        showProductsSelect: function (e, prev, next) {
            populate.showProductsSelect(e, prev, next, this);

            return false;
        },

        chooseOption: function (e) {
            var target = $(e.target);
            var parrent = target.parents('td');
            var trEl = target.parents('tr');
            var parrents = trEl.find('td');
            var _id = target.attr('id');
            var model = this.products.get(_id);
            var selectedProduct = model.toJSON();
            var taxes;
            var price;
            var amount;

            trEl.attr('data-id', model.id);

            parrent.find('.current-selected').text(target.text()).attr('data-id', _id);

            $(parrents[1]).attr('class', 'editable').find('span').text(selectedProduct.info.description || '');
            $(parrents[2]).attr('class', 'editable').find('span').text(1);

            price = selectedProduct.info.salePrice;
            $(parrents[3]).attr('class', 'editable').find('span').text(price);

            taxes = parseFloat(selectedProduct.info.salePrice) * this.taxesRate;
            amount = price + taxes;
            taxes = taxes.toFixed(2);

            $(parrents[4]).text(taxes);
            $(parrents[5]).text(amount.toFixed(2));

            $('.newSelectList').hide();

            this.calculateTotal(selectedProduct.info.salePrice);
        },

        recalculateTaxes: function (parent) {
            var quantity = parent.find('[data-name="quantity"] span').text();
            var cost = parseFloat(parent.find('input').val());
            var taxes = cost * this.taxesRate;
            var amount = cost + taxes;
            taxes = taxes.toFixed(2);
            amount = amount.toFixed(2);
            quantity = parseFloat(quantity);
            parent = parent.closest('tr');
            parent.find('.taxes .sum').text(taxes);
            parent.find('.subtotal .sum').text(amount);

            this.calculateTotal();
        },

        calculateTotal: function () {
            var thisEl = this.$el;

            var totalUntaxContainer = thisEl.find('#totalUntaxes');
            var taxesContainer = thisEl.find('#taxes');
            var totalContainer = thisEl.find('#totalAmount');
            var balanceContainer = thisEl.find('#balance');
            var resultForCalculate = thisEl.find('tr.productItem');

            var totalUntax = 0;
            var totalEls = resultForCalculate.length;
            var $currentEl;
            var quantity;
            var cost;
            var balance;
            var taxes;
            var total;
            var date;
            var dates = [];
            var i;

            if (totalEls) {
                for (i = totalEls - 1; i >= 0; i--) {
                    $currentEl = $(resultForCalculate[i]);
                    cost = $currentEl.find('[data-name="price"] input').val() || '0';
                    quantity = this.quantityRetriver($currentEl);
                    cost = helpers.spaceReplacer(cost);
                    totalUntax += parseFloat(cost);
                    date = $currentEl.find('.datepicker').text();
                    dates.push(date);
                }
            }

            totalUntax = totalUntax.toFixed(2);
            totalUntaxContainer.text(helpers.currencySplitter(totalUntax));
            totalUntax = parseFloat(totalUntax);

            taxes = totalUntax * this.taxesRate;
            taxes = taxes.toFixed(2);
            taxesContainer.text(helpers.currencySplitter(taxes));
            taxes = parseFloat(taxes);

            total = totalUntax + taxes;
            balance = total - this.paid;
            total = total.toFixed(2);
            balance = balance.toFixed(2);

            totalContainer.text(helpers.currencySplitter(total));

            balanceContainer.text(helpers.currencySplitter(balance));

            date = helpers.minFromDates(dates);
            thisEl.find('#minScheduleDate span').text(date);
        },

        quantityRetriver: function ($parent) {
            var selectedProduct = this.products || new Backbone.Collection();
            var id;
            var quantity;

            $parent = $parent.closest('tr');
            id = $parent.attr('data-id');

            selectedProduct = selectedProduct.get(id) || null;

            if (selectedProduct && selectedProduct.get('name') === CONSTANTS.IT_SERVICES) {
                quantity = 1;
            } else {
                quantity = $parent.find('[data-name="quantity"] span').text();
                quantity = parseFloat(quantity);
            }

            return quantity;
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
            var currency;
            var productTemplate = this.forSales ? ProductItemsEditList : ProductItemsEditListProforma;

            if (options && options.model) {
                products = options.model.products;
                currency = options.model.currency;

                thisEl.html(_.template(productItemTemplate, {
                    model     : options.model,
                    forSales  : self.forSales,
                    isPaid    : self.isPaid,
                    notAddItem: this.notAddItem
                }));

                if (products) {
                    productsContainer = thisEl.find('#productList');
                    productsContainer.prepend(_.template(productTemplate, {
                        products        : products,
                        forSales        : self.forSales,
                        isPaid          : self.isPaid,
                        notAddItem      : this.notAddItem,
                        model           : options.model,
                        currencySplitter: helpers.currencySplitter,
                        currencyClass   : helpers.currencyClass,
                        approved        : self.approved,
                        currency        : currency
                    }));
                    this.recalculateTaxes(this.$el.find('.listTable'));
                    totalAmountContainer = thisEl.find('#totalAmountContainer');
                    totalAmountContainer.append(_.template(totalAmount, {
                        model           : options.model,
                        balanceVisible  : this.visible,
                        discountVisible : this.discountVisible,
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
                    discountVisible : this.discountVisible
                }));
            }

            return this;
        }
    });

    return ProductItemTemplate;
});
