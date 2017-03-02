/**
 * Created by Roman on 27.04.2015.
 */
define([
    'Backbone',
    'jQuery',
    'Underscore',
    'text!templates/Products/InvoiceOrder/ProductItems.html',
    'text!templates/Products/InvoiceOrder/ProductInputContent.html',
    'text!templates/Products/InvoiceOrder/ProductItemsEditList.html',
    'text!templates/Products/InvoiceOrder/ItemsEditList.html',
    'text!templates/Products/InvoiceOrder/TotalAmount.html',
    'collections/Products/products',
    'views/Projects/projectInfo/wTracks/generateWTrack',
    'populate',
    'helpers',
    'dataService',
    'constants',
    'helpers/keyValidator'
], function (Backbone,
             $,
             _,
             productItemTemplate,
             ProductInputContent,
             ProductItemsEditList,
             ItemsEditList,
             totalAmount,
             ProductCollection,
             GenerateWTrack,
             populate,
             helpers,
             dataService,
             CONSTANTS,
             keyValidator) {
    'use strict';
    var ProductItemTemplate = Backbone.View.extend({
        /*el: '#productItemsHolder',*/

        events: {
            'click .addProductItem a'                                                 : 'getProducts',
            'click .newSelectList li:not(.miniStylePagination, #createNewEl)'         : 'chooseOption',
            'click .newSelectList li.miniStylePagination'                             : 'notHide',
            'click .newSelectList li.miniStylePagination .next:not(.disabled)'        : 'nextSelect',
            'click .newSelectList li.miniStylePagination .prev:not(.disabled)'        : 'prevSelect',
            'click .current-selected.productsDd'                                      : 'showProductsSelect',
            'click .current-selected.jobs'                                            : 'showSelect',
            'mouseenter .editable:not(.quickEdit), .editable .no-long:not(.quickEdit)': 'quickEdit',
            'mouseleave .editable'                                                    : 'removeEdit',
            'click #cancelSpan'                                                       : 'cancelClick',
            'click #saveSpan'                                                         : 'saveClick',
            'click #editSpan'                                                         : 'editClick',
            'click .removeJob'                                                        : 'deleteRow',
            'keyup td[data-name=price],td[data-name=quantity] input'                  : 'priceChange',
            'keyup .discountPercentage'                                               : 'discountChange',
            'keypress  .forNum'                                                       : 'keypressHandler',
            'change #discount'                                                        : 'recalculateDiscount',
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

            if (options) {
                this.projectModel = options.projectModel;
                this.wTrackCollection = options.wTrackCollection;
                this.discountVisible = options.discountVisible;
                this.createJob = options.createJob;

                delete options.projectModel;
                delete options.wTrackCollection;
                delete options.createJob;
                delete options.visible;
            }

            if (options && options.editable) {
                this.editable = options.editable;
            }

            if (options && options.editablePrice) {
                this.editablePrice = options.editablePrice;
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

            this.forSales = options.canBeSold;
            this.notPayed = options.notPayed;

            options.projection = {
                name: 1,
                info: 1
            };

            products = new ProductCollection(options);
            products.bind('reset', function () {
                this.products = products;
                this.filterProductsForDD();
            }, this);

            this.priceChange = _.debounce(this.priceChange, 250);
        },

        renderMessage: function (e) {
            var $target = $(e.target);
            var $tr = $target.closest('tr');
            var productOrJob = this.forSales ? 'job' : 'product';

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
            var jobId = tr.attr('data-id');
            var exJob = _.findWhere(this.responseObj['#jobs'], {_id: jobId});

            e.stopPropagation();
            e.preventDefault();

            if (this.responseObj['#jobs']) {
                this.responseObj['#jobs'].splice(_.indexOf(this.responseObj['#jobs'], exJob), 1);
            }

            tr.remove();
        },

        generatedWtracks: function () {
            var tr = this.$el.find('tr[data-error="true"]');
            var aEl = tr.find('a[data-id="jobs"]');

            // aEl.click();
        },

        keypressHandler: function (e) {
            return keyValidator(e, true);
        },

        checkForQuickEdit: function (el) {
            var tr = el.closest('tr');
            var quickEditing = tr.find('.quickEdit');

            return !quickEditing.length;
        },

        showSelect: function (e, prev, next) {
            var $targetEl = $(e.target);
            var self = this;
            var $thisEl = this.$el;
            var project = this.$dialogContainer.find('#projectDd').attr('data-id');
            var $existedJobs = $thisEl.find('.jobs.current-selected[data-id!="jobs"]');

            if (!this.checkForQuickEdit($targetEl)) {
                return false;
            }

            e.preventDefault();
            e.stopPropagation();

            if (project && project.length >= 24) {
                dataService.getData('/jobs/getForDD', {projectId: project, notPayed: this.notPayed}, function (jobs) {
                    var aEl;

                    self.responseObj['#jobs'] = jobs;

                    if ($existedJobs.length) {
                        $existedJobs.each(function () {
                            var jobId = $(this).attr('data-id');
                            var exJob = _.findWhere(self.responseObj['#jobs'], {_id: jobId});

                            self.responseObj['#jobs'].splice(_.indexOf(self.responseObj['#jobs'], exJob), 1);
                        });

                    } // to show only not selected jobs

                    if (!jobs.length) {
                        /* $("#jobs").text("Select");
                         $("#jobs").attr("data-id", null);*/
                        aEl = $thisEl.find('.current-selected.jobs[data-id="jobs"]'); // if other jobs are on page
                        if (!aEl.text()) {
                            aEl.text('Select');
                        }
                    }

                    if (!self.projectModel) {
                        dataService.getData(CONSTANTS.URLS.PROJECTS_GET_FOR_QUOTATION, {projectId: project}, function (project) {
                            self.projectModel = project;
                        });
                    }

                    populate.showSelect(e, prev, next, self);
                });
            }
        },

        getProducts: function (e) {
            var self = this;
            var target = $(e.target);
            var $parrent = target.closest('tbody');
            var $parrentRow = $parrent.find('.productItem').last();
            var rowId = $parrentRow.attr('data-id');
            var hasError = $parrentRow.attr('data-error') === 'true';
            var $trEll = $parrent.find('tr.productItem');
            var products = this.products ? this.products.toJSON() : [];
            var templ = _.template(ProductInputContent);
            var curSymbol;

            e.preventDefault();
            e.stopPropagation();

            curSymbol = this.$el.closest('form').find('#currencyDd').attr('data-symbol');

            if (rowId === undefined || /* rowId !== 'false'*/ !hasError) {
                if (!$trEll.length) {
                    $parrent.prepend(templ({
                        forSales  : self.forSales,
                        products  : products,
                        curSymbol : curSymbol,
                        writeOff  : self.writeOff,
                        quotations: self.quotations
                    }));

                    this.removeEditableCass($parrent.find('tr.productItem').last());

                    return false;

                }
                $($trEll[$trEll.length - 1]).after(templ({
                    forSales  : self.forSales,
                    products  : products,
                    curSymbol : curSymbol,
                    writeOff  : self.writeOff,
                    quotations: self.quotations
                }));

                this.removeEditableCass($parrent.find('tr').last());

            }

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
            }

            /* parent.removeClass('quickEdit').html('<span>' + val + '</span>');
             parent.removeClass('quickEdit').html('<span>' + helpers.currencySplitter(val) + '</span>');*/

            if (inputEl.hasClass('datepicker')) {
                parent.find('span').addClass('datepicker');
            }
            /* if (inputEl.hasClass('textarea')) {
             parent.find('span').addClass('textarea');
             } */

            this.recalculateTaxes(parent);
        },

        showProductsSelect: function (e, prev, next) {
            var $targetEl = $(e.target);

            if (!this.checkForQuickEdit($targetEl)) {
                return false;
            }

            populate.showProductsSelect(e, prev, next, this);

            return false;
        },

        chooseOption: function (e) {
            var self = this;
            var $target = $(e.target);
            var $parrent = $target.parents('td');
            var $trEl = $target.parents('tr');
            var $quantityContainer = $trEl.find('[data-name="quantity"]');
            var $descriptionContainer = $trEl.find('.productDescr');
            var $taxesContainer = $trEl.find('[data-name="taxes"] .sum');
            var $subtotalContainer = $trEl.find('[data-name="subtotal"] .sum');

            var isJob = !!$parrent.hasClass('jobs');
            var $quantity = $quantityContainer.find('input');
            var $parrents = $trEl.find('td');
            var _id = $target.attr('id');
            var quantity = $quantity.text() || 0;
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
            var price;
            var currency = {};
            var classForParent;

            if (_id === 'createJob') {
                return self.generateJob();
            }

            if (isJob) {
                _id = product.attr('data-id');
                jobId = $target.attr('id');

                currentJob = _.find(self.responseObj['#jobs'], function (job) {
                    return job._id === jobId;
                });

                quantity = 1;

                $parrent.find('.jobs').text($target.text()).attr('data-id', jobId);
                $parrent.find('.jobsDescription').remove();
                $parrent.find('.jobsWescWrap').append('<textarea class="jobsDescription">' + currentJob.description + '</textarea>');
                $parrent.attr('data-content', jobId); // in case of getting id  on edit quotation
                // $quantity.text(currentJob.budget.budgetTotal.hoursSum);
                model = this.products.get(_id);
                $quantity.attr('disabled', 'disabled');
            } else {
                model = this.products.get(_id);

                $trEl.attr('data-id', model.id);
                $parrent.find('.current-selected').text($target.text()).attr('data-id', _id);
            }

            selectedProduct = model ? model.toJSON() : null;

            if (!isJob) {
                description = selectedProduct && selectedProduct.info ? selectedProduct.info.description : '';
                $descriptionContainer.val(description);
            }
            if (currentJob && selectedProduct) {
                selectedProduct.info.salePrice = 0;

                this.taxesRate = 0;
            }

            if (!this.forSales && selectedProduct) {
                $($parrents[1]).attr('class', 'editable').find('span').text(selectedProduct.info.description || '');
            }

            $quantity.val(1);
            $trEl.attr('data-error', null);
            $trEl.find('#editInput').val(salePrice); // changed on def 0

            salePrice = selectedProduct.info.salePrice;

            currency._id = $('#currencyDd').attr('data-id');

            $($parrents[2]).find('input').val(salePrice);
            total = parseFloat(selectedProduct.info.salePrice);
            taxes = total * this.taxesRate;
            subtotal = total + taxes;
            taxes = taxes.toFixed(2);
            subtotal = subtotal.toFixed(2);

            $taxesContainer.text(taxes);
            $subtotalContainer.text(subtotal);

            $('.newSelectList').remove();

            if ($trEl.find('.jobs').length) {
                if ($trEl.find('a.jobs').attr('data-id') !== 'jobs') {
                    this.addEditableClass($trEl);
                }
            } else {
                this.addEditableClass($trEl);
            }

            this.calculateTotal(selectedProduct.info.salePrice);
            /* }*/
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
                quantity = parseFloat(quantity);
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

            $parent = $parent.closest('tr');

            cost = $parent.find('[data-name="price"] input').val() || $parent.find('[data-name="price"]').text();
            cost = parseFloat(helpers.spaceReplacer(cost)) || 0;

            total = quantity * cost;
            taxes = total * this.taxesRate;
            subtotal = total + taxes;

            taxes = taxes.toFixed(2);
            $parent.find('.taxes .sum').text(taxes);

            subtotal = subtotal.toFixed(2);
            $parent.find('.subtotal .sum').text(helpers.currencySplitter(subtotal));

            this.calculateTotal();
        },

        recalculateDiscount: function (e) {
            var $target = $(e.target);
            var parentTr = $target.closest('tr');
            var quantity = parseFloat($target.val() / 100);
            var cost = parseFloat(helpers.spaceReplacer(this.$el.find('#totalUntaxes').text()));
            var discount = quantity * cost;
            discount = discount.toFixed(2);

            parentTr.find('#discountSum').text('-' + helpers.currencySplitter(discount));

            this.calculateTotal(discount);
        },

        calculateTotal: function (discount) {
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
                    //  quantity = $currentEl.find('[data-name="quantity"]').text();
                    cost = $currentEl.find('[data-name="price"] input').val() || $currentEl.find('[data-name="price"]').text() || '0';
                    quantity = this.quantityRetriver($currentEl);
                    cost = helpers.spaceReplacer(cost);
                    cost = parseFloat(cost) || 0;
                    cost = quantity * cost;
                    totalUntax += cost;
                    date = $currentEl.find('.datepicker').text();
                    dates.push(date);
                }
            }

            totalUntax = totalUntax.toFixed(2);
            totalUntaxContainer.text(helpers.currencySplitter(totalUntax));
            totalUntax = parseFloat(helpers.spaceReplacer(totalUntax));

            taxes = totalUntax * this.taxesRate;
            taxes = taxes.toFixed(2);
            taxesContainer.text(helpers.currencySplitter(taxes));
            taxes = parseFloat(helpers.spaceReplacer(taxes));

            total = totalUntax + taxes;
            if (discount) {
                total = total - discount;
            }

            balance = total - this.paid;
            total = total.toFixed(2);
            balance = balance.toFixed(2);

            totalContainer.text(helpers.currencySplitter(total));

            balanceContainer.text(helpers.currencySplitter(balance));

            date = helpers.minFromDates(dates);
            thisEl.find('#minScheduleDate span').text(date);
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

        render: function (options) {
            var productsContainer;
            var totalAmountContainer;
            var $thisEl = this.$el;
            var products;
            var self = this;
            var currency;

            this.$dialogContainer = $('#dialogContainer').html() ? $('#dialogContainer') : $('#formContent');

            if (options && options.model) {
                products = options.model.products;
                currency = options.model.currency;

                $thisEl.html(_.template(ProductItemsEditList, {model: options.model, forSales: self.forSales}));

                if (products) {
                    productsContainer = $thisEl.find('#productList');
                    productsContainer.append(_.template(ItemsEditList, {
                        products        : products,
                        editable        : this.editable,
                        editablePrice   : this.editablePrice,
                        forSales        : self.forSales,
                        currencySplitter: helpers.currencySplitter,
                        currency        : currency,
                        quotations      : self.quotations
                    }));
                    totalAmountContainer = $thisEl.find('#totalAmountContainer');
                    totalAmountContainer.append(_.template(totalAmount, {
                        model           : options.model,
                        balanceVisible  : this.visible,
                        discountVisible : this.discountVisible,
                        currencySplitter: helpers.currencySplitter
                    }));
                }
            } else {
                this.$el.html(this.template({
                    forSales: self.forSales,
                    writeOff: self.writeOff
                }));
                if (!this.writeOff) {
                    totalAmountContainer = $thisEl.find('#totalAmountContainer');
                    totalAmountContainer.append(_.template(totalAmount, {
                        model           : null,
                        balanceVisible  : this.visible,
                        discountVisible : this.discountVisible,
                        currencySplitter: helpers.currencySplitter,
                        currencyClass   : helpers.currencyClass
                    }));
                }
            }

            return this;
        }
    });

    return ProductItemTemplate;
});
