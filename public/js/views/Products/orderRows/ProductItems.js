define([
    'Backbone',
    'jQuery',
    'Underscore',
    'text!templates/Products/orderRows/ProductItems.html',
    'text!templates/Products/orderRows/ExpenseInputContent.html',
    'text!templates/Products/orderRows/ProductInputContent.html',
    'text!templates/Products/orderRows/ProductItemsEditList.html',
    'text!templates/Products/orderRows/ItemsEditList.html',
    'text!templates/Products/orderRows/TotalAmount.html',
    'text!templates/Products/orderRows/ShippingTemplate.html',
    'collections/Products/products',
    'views/Projects/projectInfo/wTracks/generateWTrack',
    'views/selectView/selectView',
    'populate',
    'helpers',
    'dataService',
    'constants',
    'async',
    'helpers/keyValidator'
], function (Backbone,
             $,
             _,
             productItemTemplate,
             ExpenseInputContent,
             ProductInputContent,
             ProductItemsEditList,
             ItemsEditList,
             totalAmount,
             ShippingTemplate,
             ProductCollection,
             GenerateWTrack,
             SelectView,
             populate,
             helpers,
             dataService,
             CONSTANTS,
             async,
             keyValidator) {
    'use strict';
    var ProductItemTemplate = Backbone.View.extend({

        events: {
            'click .addProductItem a'                                                 : 'getProducts',
            'click #selectShippingMethod:not(.disabled)'                              : 'addShipping',
            'click #shippingRow .removeShipping'                                      : 'removeShipping',
            //'click :not(.newSelectList)'                                              : 'closeSelect',
            'click .newSelectList li:not(.miniStylePagination, #createNewEl)'         : 'chooseOption',
            'click .newSelectList li.miniStylePagination'                             : 'notHide',
            'click .newSelectList li.miniStylePagination .next:not(.disabled)'        : 'nextSelect',
            'click .newSelectList li.miniStylePagination .prev:not(.disabled)'        : 'prevSelect',
            'click .current-selected.productsDd'                                      : 'showProductsSelect',
            'click .current-selected.accountDd'                                       : 'showProductsSelect',
            'click .current-selected.taxCode'                                         : 'showProductsSelect',
            'mouseenter .editable:not(.quickEdit), .editable .no-long:not(.quickEdit)': 'quickEdit',
            'mouseleave .editable'                                                    : 'removeEdit',
            'click #cancelSpan'                                                       : 'cancelClick',
            'click #saveSpan'                                                         : 'saveClick',
            'click #editSpan'                                                         : 'editClick',
            'click .removeProduct'                                                    : 'deleteProduct',
            'click .removeJob'                                                        : 'deleteRow',
            'keyup td[data-name=price],td[data-name=quantity] input'                  : 'priceChange',
            // 'keyup .discountPercentage'                                               : 'discountChange',
            'keypress  .forNum'                                                       : 'keypressHandler',
            'keyup #discount'                                                         : 'recalculateDiscount',
            'click .productItem'                                                      : 'renderMessage',
            'click li#createNewEl'                                                    : 'createNewElement'
        },

        createNewElement: function (e) {
            var target = $(e.target);
            var type = target.attr('data-level');

            Backbone.history.fragment = '';
            Backbone.history.navigate('#easyErp/Products', {trigger: true});
        },

        template: _.template(productItemTemplate),

        initialize: function (options) {
            var products;

            options = options || Object.create(null);

            this.responseObj = {};
            this.taxesRate = 0;
            this.availableVisible = true;
            this.productsCount = 0;

            if (options) {
                this.parentModel = options.parentModel;
                this.projectModel = options.projectModel;
                this.wTrackCollection = options.wTrackCollection;
                this.availableVisible = options.availableVisible;
                this.createJob = options.createJob;
                this.notEditable = options.notEditable;
                this.discountVisible = options.discountVisible;
                this.deletedProducts = options.deletedProducts;

                this.forSales = options.forSales;

                delete options.projectModel;
                delete options.parentModel;
                delete options.wTrackCollection;
                delete options.createJob;
                delete options.visible;
                delete options.forSales;
                delete options.notEditable;
                delete options.discountVisible;
            }

            if (this.parentModel) {
                this.forSales = this.parentModel.get('forSales');
            }

            if (options && options.balanceVisible) {
                this.visible = options.balanceVisible;
            }
            if (options.writeOff) {
                this.writeOff = options.writeOff;
            }

            if (options && options.quotations) {
                this.quotations = options.quotations;
            } else {
                this.quotations = false;
            }

            this.account = options.account;

            this.expense = options.expense;

            this.notPayed = options.notPayed;

            this.project = options.project;

            options.projection = {
                name    : 1,
                info    : 1,
                variants: 1
            };
            this.responseObj = options.responseObj || {};

            delete options.responseObj;

            products = new ProductCollection(options);
            products.bind('reset', function () {
                this.products = products;
                this.responseObj['#productsDd'] = products.toJSON();
                this.filterProductsForDD();
            }, this);

            this.priceChange = _.debounce(this.priceChange, 250);
        },

        closeSelect: function (e) {
            $('.newSelectList').remove();
        },

        renderMessage: function (e) {
            var $target = $(e.target);
            var $tr = $target.closest('tr');
            var productOrJob = 'product';

            if (this.expense) {
                return false;
            }

            if ($target.hasClass('current-selected') || $target.hasClass('productDescr') || $target.closest('ul').length) {
                return false;
            }

            if ($tr.attr('data-error') || ($tr.find('a.jobs').attr('data-id') === 'jobs')) {
                return App.render({
                    type   : 'error',
                    message: 'Please, choose ' + productOrJob + ' first.'
                });
            }
        },

        generateJob: function () {
            var self = this;
            var model = this.projectModel;
            var $projectsDdContainer = this.$dialogContainer.find('#projectDd'); // this.$projectsDdContainer created in render block
            var projectId = $projectsDdContainer.attr('data-id');

            if (!model) {
                $projectsDdContainer.css('color', 'red');

                App.render({
                    type   : 'error',
                    message: CONSTANTS.SELECTP_ROJECT
                });
            }

            if (projectId === model._id) {
                if (this.generatedView) {
                    this.generatedView.undelegateEvents();
                }

                this.generatedView = new GenerateWTrack({
                    model               : this.projectModel,
                    wTrackCollection    : this.wTrackCollection,
                    createJob           : true,
                    forQuotationGenerate: true,
                    quotationDialog     : this
                });
            } else {
                dataService.getData(CONSTANTS.URLS.PROJECTS_GET_FOR_WTRACK, {_id: projectId}, function (project) {
                    self.projectModel = project && project.data ? project.data[0] : {};

                    if (self.generatedView) {
                        self.generatedView.undelegateEvents();
                    }

                    self.generatedView = new GenerateWTrack({
                        model               : self.projectModel,
                        wTrackCollection    : self.wTrackCollection,
                        createJob           : true,
                        forQuotationGenerate: true,
                        quotationDialog     : self
                    });
                });
            }

            return false;
        },

        deleteRow: function (e) {
            var target = $(e.target);
            var tr = target.closest('tr');
            var trNext = tr.next();
            var jobId = tr.attr('data-id');
            var exJob = _.findWhere(this.responseObj['#jobs'], {_id: jobId});

            e.stopPropagation();
            e.preventDefault();

            if (this.responseObj['#jobs']) {
                this.responseObj['#jobs'].splice(_.indexOf(this.responseObj['#jobs'], exJob), 1);
            }

            tr.remove();
            trNext.remove();

            this.recalculateDiscount();
            // this.calculateTotal();
        },

        deleteProduct: function (e) {
            var target = $(e.target);
            var tr = target.closest('.info');
            var trNext = tr.prev('.productItem');
            var productId = tr.attr('data-id');

            e.stopPropagation();
            e.preventDefault();

            tr.remove();
            trNext.remove();

            this.productsCount--;

            if (this.productsCount === 1) {
                this.$el.find('.info').first().find('.removeProduct').remove();
            }

            this.deletedProducts.push(productId);
        },

        generatedWtracks: function () {
            var tr = this.$el.find('tr[data-error="true"]');
            var aEl = tr.find('a[data-id="jobs"]');

            // aEl.click();
        },

        keypressHandler: function (e) {

            if ($(e.target).closest('input').hasClass('quantity')) {
                return keyValidator(e);
            }

            return keyValidator(e, true);
        },

        checkForQuickEdit: function (el) {
            var tr = el.closest('tr');
            var quickEditing = tr.find('.quickEdit');

            return !quickEditing.length;
        },

        removeShipping: function (e) {
            var target = $(e.target);
            var $parrent = target.closest('tbody');

            $parrent.find('#shippingRow').remove();
            this.$el.find('#selectShippingMethod').removeClass('disabled');

            this.recalculateTaxes();
        },

        addShipping: function (e) {
            var self = this;
            var target = $(e.target);
            var $parrent = this.$el.find('#productList');
            var $parrentRow = $parrent.find('.info').last();
            var rowId = $parrentRow.attr('data-id');
            var templ = _.template(ShippingTemplate);
            var $trEll = $parrent.find('tr.info');

            e.stopPropagation();
            e.preventDefault();

            if (!(this.$el.find('#shippingRow').length)) {
                if (!$trEll.length) {
                    $parrent.prepend(templ({
                        forSales: self.forSales
                    }));
                } else {
                    $($trEll[$trEll.length - 1]).after(templ({
                        forSales: self.forSales
                    }));
                }

                this.$el.find('#selectShippingMethod').addClass('disabled');
            }

        },

        getProducts: function (e) {
            var self = this;
            var target = $(e.target);
            var $parrent = target.closest('tbody');
            var $parrentRow = $parrent.find('.info').last();
            var rowId = $parrentRow.attr('data-id');
            var hasError = $parrentRow.attr('data-error') === 'true';
            var $trEll = $parrent.find('tr.info');
            var products = this.products ? this.products.toJSON() : [];
            var templ = _.template(ProductInputContent);
            var curSymbol;
            var warehouse;
            var account;
            var accountObj;
            var defaultTax;
            var expensesCategory;

            e.preventDefault();
            e.stopPropagation();

            curSymbol = this.$el.closest('form').find('#currencyDd').attr('data-symbol');

            if (rowId === undefined || /* rowId !== 'false'*/ !hasError) {
                if (!$trEll.length) {
                    if (this.expense) {
                        templ = _.template(ExpenseInputContent);
                    }
                    $parrent.prepend(templ({
                        forSales  : self.forSales,
                        products  : products,
                        curSymbol : curSymbol,
                        writeOff  : self.writeOff,
                        quotations: self.quotations,
                        project   : self.project,
                        account   : self.account
                    }));
                } else {

                    if (this.expense) {
                        templ = _.template(ExpenseInputContent);
                    }

                    $($trEll[$trEll.length - 1]).after(templ({
                        forSales  : self.forSales,
                        products  : products,
                        curSymbol : curSymbol,
                        writeOff  : self.writeOff,
                        quotations: self.quotations,
                        project   : self.project,
                        account   : self.account
                    }));
                }

                warehouse = _.findWhere(this.responseObj['#warehouseDd'], {_id: $('#warehouseDd').attr('data-id')});
                expensesCategory = _.findWhere(this.responseObj['#categories'], {_id: $('#categories').attr('data-id')});
                defaultTax = _.findWhere(this.responseObj['#taxCode'], {type: true});
                account = warehouse ? warehouse.account : expensesCategory && expensesCategory.account ? expensesCategory.account : null;
                accountObj = _.findWhere(this.responseObj['#accountDd'], {_id: this.account || account});

                if (accountObj && accountObj._id) {
                    this.$el.find('.productItem ').each(function () {
                        $(this).find('.accountDd').text(accountObj.name).attr('data-id', accountObj._id);
                    });
                }

                if (defaultTax && defaultTax._id) {
                    $parrent.find('tr.productItem ').last().find('.current-selected.taxCode').text(defaultTax.name).attr('data-id', defaultTax._id).attr('data-tax', defaultTax.level);
                }

                this.removeEditableCass($parrent.find('tr').last());

            }

            $('.newSelectList').remove();

            return false;
        },

        filterProductsForDD: function () {
            var id = '.productsDd';
            var self = this;
            var products = this.products.toJSON();

            this.responseObj[id] = products;

            /*this.responseObj[id] = [];
             this.responseObj[id] = this.responseObj[id].concat(_.map(products, function (item) {
             return {_id: item._id, name: item.name, level: item.projectShortDesc || ''};
             }));*/
        },

        discountChange: function (e) {
            var $targetEl = $(e.target);

            if ($targetEl.val() > 100) {
                $targetEl.val(100);
            }
        },

        priceChange: function (e) {
            var $targetEl = $(e.target);
            var parent = $targetEl.closest('tr');
            var inputEl = $targetEl.closest('input');
            var val;

            if (!inputEl.length) {
                inputEl = parent.find('textarea');
            }
            val = inputEl.val();

            e.preventDefault();

            if (!val.length) {
                val = '0';
                inputEl.val(val);
            }

            parent.addClass('changedPrice');

            this.recalculateDiscount(e);
            this.recalculateTaxes(parent);
        },

        showProductsSelect: function (e) {
            var $target = $(e.target);

            e.stopPropagation();

            if ($target.attr('id') === 'selectInput') {
                return false;
            }

            if (this.selectView) {
                this.selectView.remove();
            }

            this.selectView = new SelectView({
                e          : e,
                responseObj: this.responseObj
            });

            $target.append(this.selectView.render().el);

            return false;
        },

        chooseOption: function (e) {
            var self = this;
            var $target = $(e.target).closest('li');
            var $parrent = $target.parents('td');
            var $trEl = $target.parents('tr.item') && $target.parents('tr.item').length ? $target.parents('tr.item') : $target.parents('tr.productItem');
            var $infoTr = $trEl.next();
            var $SKU = $target.find('b');
            var $variants = $target.find('span.variants');
            var $quantityContainer = $trEl.find('[data-name="quantity"]');
            var $descriptionContainer = $trEl.find('.productDescr');
            var $descriptionDiv = $infoTr.find('.fullfilledHolder');
            var $taxesContainer = $trEl.find('[data-name="taxes"] .sum');
            var $subtotalContainer = $trEl.find('[data-name="subtotal"] .sum');
            var $costContainer = $trEl.find('[data-name="cost"] .sum');
            var isAccount = !!$parrent.hasClass('account') || !!$parrent.hasClass('taxCodeLine');
            var $quantity = $quantityContainer.find('input');
            var $parrents = $trEl.find('td');
            var _id = $target.attr('id');
            var quantity = $quantity.val() || 1;
            var salePrice = 0;
            var description;
            var model;
            var taxes;
            var total;
            var subtotal;
            var selectedProduct;
            var jobId;
            var currentJob;
            var product = $trEl.find('.productsDd');
            var currency = {};
            var priceList = this.$dialogContainer.find('#priceList').attr('data-id');
            var costList = this.$dialogContainer.find('#costList').attr('data-id');
            var warehouse = this.$dialogContainer.find('#warehouseDd').attr('data-id');
            var parallelTasks;
            var variant;
            var taxCode;

            if (_id === 'createJob') {
                return self.generateJob();
            }

            if (!this.expense && !warehouse) {
                return App.render({type: 'error', message: 'Please, choose Warehouse first'});
            }

            if ($SKU.length) {
                variant = $variants.length ? (' ' + $variants.text()) : '';
                $parrent.find('.current-selected').text($SKU.text()).attr('data-id', _id);
                $descriptionContainer.val($target.find('span.name').text() + variant);
            } else {
                $parrent.find('.current-selected').text($target.text()).attr('data-id', _id);
            }

            if ($parrent.hasClass('taxCodeLine')) {
                taxCode = _.findWhere(this.responseObj['#taxCode'], {_id: $target.attr('id')});

                if (taxCode && taxCode._id) {
                    $parrent.find('.current-selected').attr('data-tax', taxCode.level);
                }

                this.recalculateTaxes($parrent.closest('tr'));
            }

            if (isAccount) {
                return false;
            }

            function getAvailability(pCb) {
                dataService.getData('/products/productAvalaible', {
                    product  : _id,
                    warehouse: warehouse
                }, function (data) {
                    var itemsStock = data.onHand ? 'green' : 'red';
                    var cost;
                    $descriptionDiv.removeClass('green red');

                    if (self.project && data.cost) {
                        cost = data.cost / 100;
                    }

                    $descriptionDiv.addClass(itemsStock);
                    $trEl.attr('data-hand', data.onHand);
                    $descriptionDiv.find('.fullfilledInfo').html('<div><span class="">' + (data.inStock || 0) + ' in Stock, ' + (data.onHand || 0) + ' on Hand </span></div>');
                    pCb(null, cost);
                });
            }

            function getPrices(pCb) {
                dataService.getData('/priceList/getPrices', {
                    product  : _id,
                    costList : costList,
                    priceList: priceList,
                    quantity : quantity
                }, function (data) {
                    pCb(null, data);
                });
            }

            parallelTasks = [getPrices];

            if (this.availableVisible) {
                parallelTasks.push(getAvailability);
            }

            async.parallel(parallelTasks, function (err, resp) {
                var data = resp[0];
                var cost = resp[1];

                var priceEl = cost || data.price || 0;

                $quantity.val(quantity);
                $trEl.attr('data-error', null);
                $trEl.find('#editInput').val(priceEl.toFixed(2));

                currency._id = $('#currencyDd').attr('data-id');

                total = parseFloat(priceEl.toFixed(2) * quantity);
                taxes = total * self.taxesRate;
                subtotal = total + taxes;
                taxes = taxes.toFixed(2);
                subtotal = subtotal.toFixed(2);

                $taxesContainer.text(taxes);
                $subtotalContainer.text(subtotal);

                $('.newSelectList').remove();

                if ($trEl.find('.jobs').length) {
                    if ($trEl.find('a.jobs').attr('data-id') !== 'jobs') {
                        self.addEditableClass($trEl);
                    }
                } else {
                    self.addEditableClass($trEl);
                }

                if ($trEl.find('.taxCode').attr('data-tax')) {
                    self.recalculateTaxes($trEl);
                }

                self.removeDisabled();
                self.recalculateDiscount();
            });
        },

        isNaN: function (val) {
            return isNaN(val) ? 0 : val;
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
                quantity = $parent.find('#quantity').val() || $parent.find('td[data-name="quantity"]').text();
                //quantity = $.trim($parent.find('[data-name="quantity"]').text());
                quantity = parseInt(quantity);
            }

            quantity = this.isNaN(quantity);

            return quantity;
        },

        recalculateTaxes: function ($parent) {
            var quantity = this.quantityRetriver($parent);
            var total;
            var cost;
            var taxes;
            var subtotal;
            var taxesRate = parseFloat($parent.find('.current-selected.taxCode').attr('data-tax')) || 0;
            var taxContainer = $parent.find('.taxes .sum').length ? $parent.find('.taxes .sum') : $parent.find('[data-name="taxes"] .sum');

            $parent = $parent.closest('tr');

            cost = $parent.find('[data-name="price"] input').val() || $parent.find('[data-name="price"]').text();
            cost = parseFloat(helpers.spaceReplacer(cost)) || 0;

            total = quantity * cost;
            taxes = total * taxesRate;
            subtotal = total;

            taxes = taxes.toFixed(2);
            taxContainer.text(helpers.currencySplitter(taxes));

            subtotal = subtotal.toFixed(2);
            $parent.find('.subtotal .sum').text(helpers.currencySplitter(subtotal));

            this.recalculateDiscount(null);
            // this.calculateTotal();
        },

        recalculateDiscount: function (e) {
            var $target = e ? $(e.target) : this.$el.find('#discount');
            var parentTr = $target.closest('tr');
            var quantity = parseInt($target.val(), 10) || 0;
            var cost = parseFloat(helpers.spaceReplacer(this.$el.find('#totalUntaxes').text()));
            var discount = quantity;
            discount = discount.toFixed(2);

            parentTr.find('#discountSum').text(helpers.currencySplitter(discount));

            this.calculateTotal(discount);
        },

        calculateTotal: function (discount) {
            var thisEl = this.$el;

            var totalUntaxContainer = thisEl.find('#totalUntaxes');
            var taxesContainer = thisEl.find('#taxes');
            var totalContainer = thisEl.find('#totalAmount');
            var balanceContainer = thisEl.find('#balance');
            var shippingContainer = thisEl.find('#shippingExpenses');
            var resultForCalculate = thisEl.find('tr.productItem');

            var totalUntax = 0;
            var totalEls;
            var $currentEl;
            var quantity;
            var cost;
            var balance;
            var taxes;
            var total;
            var date;
            var dates = [];
            var i;
            var taxesTotal = 0;
            var totalShippment = 0;
            var tax;

            resultForCalculate.push(thisEl.find('#shippingRow'));

            totalEls = resultForCalculate.length;

            if (totalEls) {
                for (i = totalEls - 1; i >= 0; i--) {
                    $currentEl = $(resultForCalculate[i]);
                    //  quantity = $currentEl.find('[data-name="quantity"]').text();
                    cost = $currentEl.find('[data-name="price"] input').val() || $currentEl.find('[data-name="price"]').text() || '0';
                    quantity = this.quantityRetriver($currentEl);
                    cost = helpers.spaceReplacer(cost);
                    cost = parseFloat(cost) || 0;
                    cost = quantity * cost;
                    tax = parseFloat(helpers.spaceReplacer($currentEl.find('.taxes .sum').text() || $currentEl.find('[data-name="taxes"] .sum').text())) || 0;
                    taxesTotal += tax;
                    totalUntax += cost;
                    date = $currentEl.find('.datepicker').text();
                    dates.push(date);

                    if ($currentEl.attr('id') === 'shippingRow') {
                        totalShippment = cost;
                    }
                }
            }

            totalUntax = (totalUntax - totalShippment).toFixed(2);
            totalUntaxContainer.text(helpers.currencySplitter(totalUntax));
            totalUntax = parseFloat(helpers.spaceReplacer(totalUntax)) + totalShippment;

            totalShippment = totalShippment.toFixed(2);
            shippingContainer.text(helpers.currencySplitter(totalShippment));

            taxes = taxesTotal;
            taxes = taxes.toFixed(2);
            taxesContainer.text(helpers.currencySplitter(taxes));
            taxes = parseFloat(helpers.spaceReplacer(taxes));

            total = totalUntax + taxes;
            if (discount) {
                total = total - discount;
            }

            balance = total - (this.paid || 0);
            total = total.toFixed(2);
            balance = balance.toFixed(2);

            totalContainer.text(helpers.currencySplitter(total));

            balanceContainer.text(helpers.currencySplitter(balance));

            date = helpers.minFromDates(dates);
            thisEl.find('#minScheduleDate span').text(date);

            if (parseFloat(discount)) {
                if (parseFloat(total) < 0) {
                    discount = parseFloat(discount) + parseFloat(total);

                    this.$el.find('#discount').val(discount.toFixed(2));

                    this.recalculateDiscount(null);
                }
            }
        },

        nextSelect: function (e) {
            this.showProductsSelect(e, false, true);
        },

        prevSelect: function (e) {
            this.showProductsSelect(e, true, false);
        },

        removeEditableCass: function ($tr) {
            $tr.find('input').attr('readonly', true);
            $tr.find('textarea').attr('readonly', true);
        },

        addEditableClass: function ($tr) {
            $tr.find('input').attr('readonly', false);
            $tr.find('textarea').attr('readonly', false);
        },

        /*populateTaxCodes: function (taxesData) {
         var $thisEl = this.$el;
         var selectedTaxIds;
         var $selectedTaxes;
         var $taxContainers;
         var $taxContainer

         $taxContainers = $thisEl.find('.taxesList');

         _.each($taxContainers, function (taxContainer) {
         $taxContainer = $(taxContainer);
         $selectedTaxes = $taxContainer.closest('.taxCodeLine').find('.taxLines');

         selectedTaxIds = _.map($selectedTaxes, function (tax) {
         return $(tax).data('code');
         });

         _.each(taxesData, function (tax) {
         if (selectedTaxIds.indexOf(tax._id) >= 0) {
         $taxContainer.append('<li><label class="_customCHeckbox"><input checked="checked" type="checkbox" class="checkbox tax" data-rate="' + tax.rate + ' " data-value="' + tax.name + '" data-id="' + tax._id + '"> <span></span></label>' + tax.name + '</li>');
         } else {
         $taxContainer.append('<li><label class="_customCHeckbox"><input type="checkbox" class="checkbox tax" data-rate="' + tax.rate + ' " data-value="' + tax.name + '" data-id="' + tax._id + '"> <span></span></label>' + tax.name + '</li>');
         }
         });

         $taxContainer.hide();
         });
         },

         onClickTaxesList: function (e) {
         var $target = $(e.target);
         var $thisEl = this.$el;
         var $taxContainer;
         var $taxList;

         e.preventDefault();

         $thisEl.find('.taxesList').hide();
         $taxContainer = $target.closest('.taxCodeLine');
         $taxList = $taxContainer.find('.taxesList');

         $taxList.show();
         },

         onClickTaxesLine: function (e) {
         var $thisEl = this.$el;
         var $target = $(e.target);
         var rate = $target.data('rate');
         var $currentRow;


         },*/

        removeDisabled: function () {
            $('.discountPercentage').prop('disabled', false);
        },

        render: function (options) {
            var productsContainer;
            var totalAmountContainer;
            var $thisEl = this.$el;
            var model = this.parentModel ? this.parentModel.toJSON() : options ? options.model : '';
            var self = this;
            var products;
            var currency;
            var channel;
            var templ;
            var shipping;

            this.$dialogContainer = $('#dialogContainer').html() ? $('#dialogContainer') : $('#formContent');

            populate.get('#accountDd', '/chartOfAccount/getForDd', {}, 'name', this, true, true, this.account || null);
            populate.get('#shippingDd', '/shippingMethod/getForDd', {}, 'name', this, false, true);

            if (model) {
                products = model.products;
                currency = model.currency;
                channel = model.channel;
                shipping = model.sourceDocument && model.sourceDocument.shippingMethod ? model.sourceDocument.shippingMethod : model.shippingMethod;

                templ = _.template(ProductItemsEditList);

                $thisEl.html(templ({
                    model      : model,
                    forSales   : self.forSales,
                    expense    : this.expense,
                    notEditable: this.notEditable
                }));

                if (products) {

                    this.productsCount = products.length;

                    productsContainer = $thisEl.find('#productList');
                    productsContainer.append(_.template(ItemsEditList, {
                        products        : products,
                        shippingMethod  : shipping,
                        notEditable     : this.notEditable,
                        availableVisible: this.availableVisible,
                        forSales        : self.forSales,
                        currencySplitter: helpers.currencySplitter,
                        currency        : currency,
                        quotations      : self.quotations,
                        expense         : this.expense,
                        channel         : channel
                    }));
                    totalAmountContainer = $thisEl.find('#totalAmountContainer');
                    totalAmountContainer.append(_.template(totalAmount, {
                        model           : model,
                        forSales        : self.forSales,
                        balanceVisible  : this.visible,
                        discountVisible : this.discountVisible,
                        notEditable     : this.notEditable,
                        currencySplitter: helpers.currencySplitter
                    }));
                }
            } else {
                this.$el.html(this.template({
                    forSales   : self.forSales,
                    writeOff   : self.writeOff,
                    expense    : this.expense,
                    notEditable: this.notEditable
                }));

                totalAmountContainer = $thisEl.find('#totalAmountContainer');
                totalAmountContainer.append(_.template(totalAmount, {
                    model           : null,
                    forSales        : self.forSales,
                    balanceVisible  : this.visible,
                    discountVisible : this.discountVisible,
                    notEditable     : false,
                    currencySplitter: helpers.currencySplitter,
                    currencyClass   : helpers.currencyClass
                }));

            }

            return this;
        }
    });

    return ProductItemTemplate;
});
