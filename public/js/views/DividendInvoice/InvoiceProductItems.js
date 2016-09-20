define([
    'jQuery',
    'Underscore',
    'Backbone',
    'text!templates/DividendInvoice/InvoiceProductItems.html',
    'text!templates/DividendInvoice/InvoiceProductInputContent.html',
    'text!templates/DividendInvoice/EditInvoiceProductInputContent.html',
    'text!templates/Products/InvoiceOrder/TotalAmount.html',
    'collections/Products/products',
    'populate',
    'helpers'
], function ($, _, Backbone, productItemTemplate, ProductInputContent, ProductItemsEditList, totalAmount, productCollection, populate, helpers) {
    var ProductItemTemplate = Backbone.View.extend({
        el: '#invoiceItemsHolder',

        events: {
            'click .addProductItem'                            : 'getProducts',
            'click .newSelectList li.miniStylePagination'      : 'notHide',
            'change input.statusInfo'                          : 'recalculateTaxes',
            'click .newSelectList li:not(.miniStylePagination)': 'chooseOption',
            'keyup input.statusInfo'                           : 'recalculateTaxes'
        },

        initialize: function (options) {
            this.responseObj = {};
            this.taxesRate = 0;

            this.recalculateTaxes = _.debounce(this.recalculateTaxes, 500);

            if (options) {
                this.visible = !!options.balanceVisible;
                this.isPaid = !!options.isPaid;
                this.notAddItem = !!options.notAddItem;
                this.discountVisible = !!options.discountVisible;
                this.paid = options.paid;
            }

            this.forSales = options.forSales;

            this.render();
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

        chooseOption: function (e) {
            var target = $(e.target);
            var parrent = target.parents('td');
            var trEl = target.parents('tr');
            var _id = target.attr('id');

            trEl.attr('data-id', _id);

            parrent.find('.current-selected').text(target.text()).attr('data-id', _id);
            parrent.removeClass('errorContent');

            $('.newSelectList').hide();
        },

        recalculateTaxes: function (parent) {
            var cost;
            var amount;
            var $parent = $(parent.target).closest('tr');

            cost = $parent.find('[data-name="price"] input').val();
            cost = parseFloat(cost);
            amount = (cost);
            amount = helpers.currencySplitter(amount.toFixed(2));

            $parent.find('.amount').text(amount);

            this.calculateTotal();
        },

        calculateTotal: function () {
            var $thisEl = this.$el;

            var totalUntaxContainer = $thisEl.find('#totalUntaxes');
            var totalContainer = $thisEl.find('#totalAmount');
            var balanceContainer = $thisEl.find('#balance');
            var resultForCalculate = $thisEl.find('tr.productItem');
            var i;
            var totalUntax = 0;
            var totalEls = resultForCalculate.length;
            var $currentEl;
            var balance;
            var cost;

            if (totalEls) {
                for (i = totalEls - 1; i >= 0; i--) {
                    $currentEl = $(resultForCalculate[i]);
                    cost = $currentEl.find('[data-name="price"] input').val();
                    totalUntax += parseFloat(cost);
                }
            }

            balance = totalUntax - this.paid;
            balance = helpers.currencySplitter(balance.toFixed(2));
            totalUntax = helpers.currencySplitter(totalUntax.toFixed(2));

            totalUntaxContainer.text(totalUntax);
            totalContainer.text(totalUntax);
            balanceContainer.text(balance);
        },

        render: function (options) {
            var self = this;
            var productsContainer;
            var totalAmountContainer;
            var thisEl = this.$el;
            var products;

            if (options && options.model) {
                products = options.model.products;

                if (options.model.currency) {
                    products.currency = options.model.currency._id;
                }

                thisEl.html(_.template(productItemTemplate, {
                    model     : options.model,
                    forSales  : self.forSales,
                    isPaid    : self.isPaid,
                    notAddItem: this.notAddItem
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
                    totalAmountContainer = thisEl.find('#totalAmountContainer');
                    totalAmountContainer.append(_.template(totalAmount, {
                        model           : options.model,
                        balanceVisible  : this.visible,
                        currencySplitter: helpers.currencySplitter,
                        discountVisible : this.discountVisible,
                        currencyClass   : helpers.currencyClass
                    }));
                }
            } else {
                this.$el.html(this.template({
                    forSales        : self.forSales,
                    isPaid          : self.isPaid,
                    notAddItem      : this.notAddItem,
                    currencySplitter: helpers.currencySplitter,
                    currencyClass   : helpers.currencyClass
                }));
                totalAmountContainer = thisEl.find('#totalAmountContainer');
                totalAmountContainer.append(_.template(totalAmount, {
                    model           : null,
                    balanceVisible  : this.visible,
                    discountVisible : this.discountVisible,
                    currencySplitter: helpers.currencySplitter,
                    currencyClass   : helpers.currencyClass
                }));
            }

            return this;
        }
    });

    return ProductItemTemplate;
});
