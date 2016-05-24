/**
 * Created by Roman on 27.04.2015.
 */
define([
    'jQuery',
    'Underscore',
    'Backbone',
    'text!templates/DividendInvoice/InvoiceProductItems.html',
    'text!templates/DividendInvoice/InvoiceProductInputContent.html',
    'text!templates/DividendInvoice/EditInvoiceProductInputContent.html',
    'text!templates/Product/InvoiceOrder/TotalAmount.html',
    'collections/Product/products',
    'populate',
    'helpers'
], function ($, _, Backbone, productItemTemplate, ProductInputContent, ProductItemsEditList, totalAmount, productCollection, populate, helpers) {
    var ProductItemTemplate = Backbone.View.extend({
        el: '#invoiceItemsHolder',

        events: {
            'click .addProductItem'                            : 'getProducts',
            "click .newSelectList li.miniStylePagination"      : "notHide",
            'change input.statusInfo'                          : 'recalculateTaxes',
            "click .newSelectList li:not(.miniStylePagination)": "chooseOption",
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
                this.paid = options.paid;
            }
            ;

            this.forSales = options.forSales;

            this.render();
        },

        template: _.template(productItemTemplate),

        getProducts: function (e) {
            e.preventDefault();
            e.stopPropagation();

            var target = $(e.target);
            var parrent = target.closest('tbody');
            var parrentRow = parrent.find('.productItem').last();
            var rowId = parrentRow.attr("data-id");
            var trEll = parrent.find('tr.productItem');

            if (rowId === undefined || rowId !== 'false') {
                if (!trEll.length) {
                    return parrent.prepend(_.template(ProductInputContent));
                }
                $(trEll[trEll.length - 1]).after(_.template(ProductInputContent));
            }

            return false;
        },

        chooseOption: function (e) {
            var target = $(e.target);
            var parrent = target.parents("td");
            var trEl = target.parents("tr");
            var _id = target.attr("id");

            trEl.attr('data-id', _id);

            parrent.find(".current-selected").text(target.text()).attr("data-id", _id);

            $(".newSelectList").hide();
        },

        recalculateTaxes: function (parent) {
            var cost;
            var amount;
            var $parent = $(parent.target).closest('tr');

            cost = $parent.find('[data-name="price"] input').val();
            cost = parseFloat(cost);
            amount = (cost);
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
            var balance;
            var cost;

            if (totalEls) {
                for (var i = totalEls - 1; i >= 0; i--) {
                    $currentEl = $(resultForCalculate[i]);
                    cost = $currentEl.find('[data-name="price"] input').val();
                    totalUntax += parseFloat(cost);
                }
            }

            totalUntax = totalUntax.toFixed(2);
            totalUntaxContainer.text(totalUntax);
            totalUntax = parseFloat(totalUntax);

            totalContainer.text(totalUntax);

            balanceContainer.text(totalUntax - this.paid);
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
                    currencySplitter: helpers.currencySplitter,
                    currencyClass   : helpers.currencyClass
                }));
            }

            return this;
        }
    });

    return ProductItemTemplate;
});