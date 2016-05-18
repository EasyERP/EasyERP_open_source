/**
 * Created by Roman on 27.04.2015.
 */
define([
    'jQuery',
    'Underscore',
    'Backbone',
    'text!templates/ExpensesInvoice/InvoiceProductItems.html',
    'text!templates/ExpensesInvoice/InvoiceProductInputContent.html',
    'text!templates/Invoice/EditInvoiceProductInputContent.html',
    'text!templates/Product/InvoiceOrder/TotalAmount.html',
    'collections/Product/products',
    'populate',
    'helpers'
], function ($, _, Backbone, productItemTemplate, ProductInputContent, ProductItemsEditList, totalAmount, productCollection, populate, helpers) {
    var ProductItemTemplate = Backbone.View.extend({
        el: '#invoiceItemsHolder',

        events: {
            'click .addProductItem'                                                   : 'getProducts',
            "click .newSelectList li:not(.miniStylePagination)"                       : "chooseOption",
            "click .newSelectList li.miniStylePagination"                             : "notHide",
            "click .newSelectList li.miniStylePagination .next:not(.disabled)"        : "nextSelect",
            "click .newSelectList li.miniStylePagination .prev:not(.disabled)"        : "prevSelect",
            "click .current-selected"                                                 : "showProductsSelect",
            'change input.statusInfo'                                                 : 'recalculateTaxes',
            'keyup input.statusInfo'                                                  : 'recalculateTaxes'
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
            };

            this.forSales = options.forSales;

            this.render();

            products = new productCollection(options);
            products.bind('reset', function () {
                this.products = products;
                this.filterProductsForDD();
            }, this);
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

        filterProductsForDD: function () {
            var id = '.productsDd';
            var products = this.products.toJSON();

            this.responseObj[id] = [];
            this.responseObj[id] = this.responseObj[id].concat(_.map(products, function (item) {
                return {_id: item._id, name: item.name, level: item.projectShortDesc || ""};
            }));

            //$(id).text(this.responseObj[id][0].name).attr("data-id", this.responseObj[id][0]._id);

        },

        showProductsSelect: function (e, prev, next) {
            populate.showProductsSelect(e, prev, next, this);

            return false;
        },

        chooseOption: function (e) {
            var target = $(e.target);
            var parrent = target.parents("td");
            var trEl = target.parents("tr");
            var parrents = trEl.find('td');
            var _id = target.attr("id");
            var model = this.products.get(_id);
            var selectedProduct = model.toJSON();
            var taxes;
            var price;
            var amount;

            trEl.attr('data-id', model.id);
            //trEl.find('.datepicker').removeClass('notVisible');

            parrent.find(".current-selected").text(target.text()).attr("data-id", _id);

            /*$(parrents[1]).attr('class', 'editable').find('span').text(selectedProduct.info.description || '');
            $(parrents[2]).attr('class', 'editable').find("span").text(1);

            price = selectedProduct.info.salePrice;
            $(parrents[3]).attr('class', 'editable').find('span').text(price);

            taxes = parseFloat(selectedProduct.info.salePrice) * this.taxesRate;
            amount = price + taxes;
            taxes = taxes.toFixed(2);

            $(parrents[4]).text(taxes);
            $(parrents[5]).text(amount.toFixed(2));*/

            $(".newSelectList").hide();

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
            var balance;
            var cost;

            if (totalEls) {
                for (var i = totalEls - 1; i >= 0; i--) {
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
                    model     : options.model,
                    forSales  : self.forSales,
                    isPaid    : self.isPaid,
                    notAddItem: this.notAddItem
                }));

                if (products) {
                    productsContainer = thisEl.find('#productList');
                    productsContainer.prepend(_.template(ProductItemsEditList, {
                        products  : products,
                        forSales  : self.forSales,
                        isPaid    : self.isPaid,
                        notAddItem: this.notAddItem,
                        currencySplitter : helpers.currencySplitter
                    }));
                    this.recalculateTaxes(this.$el.find('.listTable'));
                    totalAmountContainer = thisEl.find('#totalAmountContainer');
                    totalAmountContainer.append(_.template(totalAmount, {
                        model         : options.model,
                        balanceVisible: this.visible,
                        currencySplitter : helpers.currencySplitter
                    }));
                }
            } else {
                this.$el.html(this.template({
                    forSales  : self.forSales,
                    /*collection: this.collection,
                     options: options*/
                    isPaid    : self.isPaid,
                    notAddItem: this.notAddItem
                }));
                totalAmountContainer = thisEl.find('#totalAmountContainer');
                totalAmountContainer.append(_.template(totalAmount, {model: null, balanceVisible: this.visible}));
            }

            return this;
        }
    });

    return ProductItemTemplate;
});