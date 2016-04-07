/**
 * Created by Roman on 27.04.2015.
 */
define([
    'Backbone',
    'text!templates/Invoice/InvoiceProductItems.html',
    'text!templates/Invoice/InvoiceProductInputContent.html',
    'text!templates/Proforma/EditInvoiceProductInputContent.html',
    'text!templates/Product/InvoiceOrder/TotalAmount.html',
    'collections/Product/products',
    'populate',
    'helpers/keyValidator',
    'helpers',
    'constants'
], function (Backbone, productItemTemplate, ProductInputContent, ProductItemsEditList, totalAmount, productCollection, populate, keyValidator, helpers, CONSTANTS) {
    'use strict'
    var ProductItemTemplate = Backbone.View.extend({
        el: '#invoiceItemsHolder',

        events: {
            'click .addProductItem'                                           : 'getProducts',
            "click .newSelectList li:not(.miniStylePagination)"               : "chooseOption",
            "click .newSelectList li.miniStylePagination"                     : "notHide",
            "click .newSelectList li.miniStylePagination .next:not(.disabled)": "nextSelect",
            "click .newSelectList li.miniStylePagination .prev:not(.disabled)": "prevSelect",
            "click .current-selected"                                         : "showProductsSelect",
            "keyup td[data-name=price] input"                                 : 'priceChange',
            'keypress .forNum'                                                : 'keypressHandler'
        },

        initialize: function (options) {
            var products;

            this.responseObj = {};
            this.taxesRate = 0;

            if (options) {
                this.visible = !!options.balanceVisible;
                this.isPaid = !!options.isPaid;
                this.notAddItem = !!options.notAddItem;
                this.paid = options.paid;
            }

            this.forSales = options.forSales;

            this.render();

            products = new productCollection(options);
            products.bind('reset', function () {
                this.products = products;
                this.filterProductsForDD();
            }, this);

            this.priceChange = _.debounce(this.priceChange, 250);
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

        keypressHandler: function (e) {
            return keyValidator(e, true);
        },

        priceChange: function (e) {
            e.preventDefault();

            var $targetEl = $(e.target);
            var parent = $targetEl.closest('td');
            var inputEl = parent.find('input');
            if (!inputEl.length) {
                inputEl = parent.find('textarea');
            }
            var val = inputEl.val();

            if (!val.length) {
                val = 0;
            }

            //parent.removeClass('quickEdit').html('<span>' + val + '</span>');

            if (inputEl.hasClass('datepicker')) {
                parent.find('span').addClass('datepicker');
            }
            if (inputEl.hasClass('textarea')) {
                parent.find('span').addClass('textarea');
            }

            this.recalculateTaxes(parent);
        },

        /*quickEdit: function (e) {
         var target = $(e.target);
         var trId = target.closest("tr");
         var tdId = target.closest("td");

         if (trId.find("#editSpan").length === 0) {
         tdId.append('<span id="editSpan" class=""><a href="javascript:;">e</a></span>');
         if (tdId.width() - 30 < tdId.find(".no-long").width()) {
         tdId.find(".no-long").width(tdId.width() - 30);
         }
         }
         },

         removeEdit: function (e) {
         $('#editSpan').remove();
         $("td .no-long").css({width: "auto"});
         },

         editClick: function (e) {
         var parent = $(e.target).closest('td');
         var maxlength = parent.find(".no-long").attr("data-maxlength") || 20;
         var datePicker = parent.find('.datepicker');

         e.preventDefault();

         $('.quickEdit #editInput').remove();
         $('.quickEdit #cancelSpan').remove();
         $('.quickEdit #saveSpan').remove();

         if (this.prevQuickEdit) {
         if ($(this.prevQuickEdit).hasClass('quickEdit')) {
         $('.quickEdit').text(this.text ? this.text : "").removeClass('quickEdit');
         }
         }

         parent.addClass('quickEdit');

         $('#editSpan').remove();

         this.text = $.trim(parent.text());

         parent.text('');
         parent.append('<input id="editInput" maxlength="' + maxlength + '" type="text" />');
         $('#editInput').val(this.text);

         //if (datePicker.length) {
         //    $('#editInput').datepicker({
         //        dateFormat: "d M, yy",
         //        changeMonth: true,
         //        changeYear: true
         //    }).addClass('datepicker');
         //}

         this.prevQuickEdit = parent;

         parent.append('<span id="saveSpan" class="productEdit"><i class="fa fa-check"></i></span>');
         parent.append('<span id="cancelSpan" class="productEdit"><i class="fa fa-times"></i></span>');
         parent.find("#editInput").width(parent.find("#editInput").width() - 50);
         },

         saveClick: function (e) {
         e.preventDefault();

         var targetEl = $(e.target);
         var parent = targetEl.closest('td');
         var inputEl = parent.find('input');
         var val = inputEl.val();

         parent.removeClass('quickEdit').html('<span>' + val + '</span>');

         if (inputEl.hasClass('datepicker')) {
         parent.find('span').addClass('datepicker');
         }

         this.recalculateTaxes(parent);
         },

         cancelClick: function (e) {
         e.preventDefault();
         var text = this.text ? this.text : '';

         if (this.prevQuickEdit) {
         if ($(this.prevQuickEdit).hasClass('quickEdit')) {
         $('.quickEdit').removeClass('quickEdit').html('<span>' + text + '</span>');
         }
         }
         },*/

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

            $(parrents[1]).attr('class', 'editable').find('span').text(selectedProduct.info.description || '');
            $(parrents[2]).attr('class', 'editable').find("span").text(1);

            price = selectedProduct.info.salePrice;
            $(parrents[3]).attr('class', 'editable').find('span').text(price);

            taxes = parseFloat(selectedProduct.info.salePrice) * this.taxesRate;
            amount = price + taxes;
            taxes = taxes.toFixed(2);

            $(parrents[4]).text(taxes);
            $(parrents[5]).text(amount.toFixed(2));

            $(".newSelectList").hide();

            this.calculateTotal(selectedProduct.info.salePrice);
        },

        recalculateTaxes: function (parent) {
            parent = parent.closest('tr');

            var quantity = parent.find('[data-name="quantity"] span').text();
            quantity = parseFloat(quantity);
            var cost = parent.find('[data-name="price"] input').val();
            cost = parseFloat(cost);
            var taxes = cost * this.taxesRate;
            var amount = cost + taxes;
            taxes = taxes.toFixed(2);
            amount = amount.toFixed(2);

            parent.find('.taxes').text(taxes);
            parent.find('.amount').text(amount);

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

            if (totalEls) {
                for (var i = totalEls - 1; i >= 0; i--) {
                    $currentEl = $(resultForCalculate[i]);
                    cost = $currentEl.find('[data-name="price"] input').val() || '0';
                    quantity = this.quantityRetriver($currentEl);
                    cost = helpers.spaceReplacer(cost);
                    totalUntax += parseInt(cost);
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

            balanceContainer.text(balance);

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
                quantity = 1
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
                        model     : options.model
                    }));
                    this.recalculateTaxes(this.$el.find('.listTable'));
                    totalAmountContainer = thisEl.find('#totalAmountContainer');
                    totalAmountContainer.append(_.template(totalAmount, {
                        model           : options.model,
                        balanceVisible  : this.visible,
                        currencySplitter: helpers.currencySplitter
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
                totalAmountContainer.append(_.template(totalAmount, {
                    model           : null,
                    balanceVisible  : this.visible,
                    currencySplitter: helpers.currencySplitter
                }));
            }

            return this;
        }
    });

    return ProductItemTemplate;
});