/**
 * Created by Roman on 27.04.2015.
 */
define([
    'text!templates/Product/InvoiceOrder/ProductItems.html',
    'text!templates/Product/InvoiceOrder/ProductInputContent.html',
    'text!templates/Product/InvoiceOrder/ProductItemsEditList.html',
    'text!templates/Product/InvoiceOrder/ItemsEditList.html',
    'text!templates/Product/InvoiceOrder/TotalAmount.html',
    'collections/Product/products',
    'views/Projects/projectInfo/wTracks/generateWTrack',
    'populate',
    'helpers',
    'dataService',
    'constants'
], function (productItemTemplate, ProductInputContent, ProductItemsEditList, ItemsEditList, totalAmount, productCollection, GenerateWTrack, populate, helpers, dataService, CONSTANTS) {
    "use strict";
    var ProductItemTemplate = Backbone.View.extend({
        el: '#productItemsHolder',

        events: {
            'click .addProductItem a'                                                 : 'getProducts',
            "click .newSelectList li:not(.miniStylePagination)"                       : "chooseOption",
            "click .newSelectList li.miniStylePagination"                             : "notHide",
            "click .newSelectList li.miniStylePagination .next:not(.disabled)"        : "nextSelect",
            "click .newSelectList li.miniStylePagination .prev:not(.disabled)"        : "prevSelect",
            "click .current-selected.productsDd"                                      : "showProductsSelect",
            "click .current-selected.jobs"                                            : "showSelect",
            "mouseenter .editable:not(.quickEdit), .editable .no-long:not(.quickEdit)": "quickEdit",
            "mouseleave .editable"                                                    : "removeEdit",
            "click #cancelSpan"                                                       : "cancelClick",
            "click #saveSpan"                                                         : "saveClick",
            "click #editSpan"                                                         : "editClick",
            //"click #generateJobs"                                                     : "createJob"
        },

        template: _.template(productItemTemplate),

        initialize: function (options) {
            var products;

            this.responseObj = {};
            this.taxesRate = 0.15;

            if (options) {
                this.projectModel = options.projectModel;
                this.wTrackCollection = options.wTrackCollection;
                this.createJob = options.createJob;

                delete options.projectModel;
                delete options.wTrackCollection;
                delete options.createJob;
                delete options.visible;
            }

            if (options && options.editable) {
                this.editable = options.editable;
            }

            if (options && options.balanceVisible) {
                this.visible = options.balanceVisible;
            }

            this.forSales = options.service;

            products = new productCollection(options);
            products.bind('reset', function () {
                this.products = products;
                this.filterProductsForDD();
            }, this);
        },

        generateJob: function () {
            var model = this.projectModel;
            var projectsDdContainer = $('#projectDd');

            if (!model) {
                projectsDdContainer.css('color', 'red');

                App.render({
                    type: 'error',
                    message: CONSTANTS.SELECTP_ROJECT
                });
            }

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

            return false;
        },

        generatedWtracks: function () {
            var tr = this.$el.find('tr[data-error="true"]');
            var aEl = tr.find('a[data-id="jobs"]');

            //aEl.click();
        },

        checkForQuickEdit: function (el) {
            var tr = el.closest('tr');
            var quickEditing = tr.find('.quickEdit');

            return !quickEditing.length;
        },

        showSelect: function (e, prev, next) {
            var targetEl = $(e.target);
            var self = this;
            var thisEl = this.$el;

            if (!this.checkForQuickEdit(targetEl)) {
                return false;
            }

            e.preventDefault();

            dataService.getData("/jobs/getForDD", {"projectId": $("#projectDd").attr("data-id")}, function (jobs) {
                var aEl;

                self.responseObj['#jobs'] = jobs;

                if (!jobs.length) {
                    /* $("#jobs").text("Select");
                     $("#jobs").attr("data-id", null);*/
                    aEl = thisEl.find('.current-selected.jobs');
                    aEl.text("Select");
                }

                if (!self.projectModel){
                    dataService.getData("/project/getForQuotation", {"projectId": $("#projectDd").attr("data-id")}, function (project) {
                        self.projectModel = project;
                    })
                }

                populate.showSelect(e, prev, next, self);
            });

        },

        getProducts: function (e) {
            e.preventDefault();
            e.stopPropagation();

            var self = this;
            var target = $(e.target);
            var parrent = target.closest('tbody');
            var parrentRow = parrent.find('.productItem').last();
            var rowId = parrentRow.attr("data-id");
            var hasError = parrentRow.attr("data-error") === 'true';
            var trEll = parrent.find('tr.productItem');
            var products = this.products ? this.products.toJSON() : [];

            var templ = _.template(ProductInputContent);


            if (rowId === undefined || /*rowId !== 'false'*/ !hasError) {
                if (!trEll.length) {
                    return parrent.prepend(templ({
                        forSales: self.forSales,
                        products: products
                    }));
                }
                $(trEll[trEll.length - 1]).after(templ({
                    forSales: self.forSales,
                    products: products
                }));
            }

            return false;
        },

        filterProductsForDD: function () {
            var id = '.productsDd';
            var self = this;
            var products = this.products.toJSON();

            this.responseObj[id] = [];
            this.responseObj[id] = this.responseObj[id].concat(_.map(products, function (item) {
                return {_id: item._id, name: item.name, level: item.projectShortDesc || ""};
            }));

            //$(id).text(this.responseObj[id][0].name).attr("data-id", this.responseObj[id][0]._id);

        },

        quickEdit: function (e) {
            var target = $(e.target);
            var trId = target.closest("tr");
            var tdId = target.closest("td");

            if (trId.find("#editSpan").length === 0) {
                tdId.append('<span id="editSpan" class=""><a href="javascript:;">e</a></span>');
                if (tdId.width() - 30 < tdId.find(".no-long").width()) {
                    tdId.find(".no-long").width(tdId.width() - 40);
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
            var textarea = parent.find('.textarea');
            var prevParent = $(this.prevQuickEdit).closest("td");
            var inputEl = prevParent.find('input');

            if (!inputEl.length) {
                inputEl = prevParent.find('textarea');
            }

            e.preventDefault();

            if (this.prevQuickEdit) {
                if ($(this.prevQuickEdit).hasClass('quickEdit')) {
                    $('.quickEdit').html('<span>' + (this.text ? this.text : "") + '</span>');
                    $('.quickEdit').removeClass('quickEdit');
                }
            }
            if (inputEl.hasClass('datepicker')) {
                prevParent.find('span').addClass('datepicker');
            }
            if (inputEl.hasClass('textarea')) {
                prevParent.find('span').addClass('textarea');
            }

            $('.quickEdit #editInput').remove();
            $('.quickEdit #cancelSpan').remove();
            $('.quickEdit #saveSpan').remove();

            parent.addClass('quickEdit');

            $('#editSpan').remove();

            this.text = $.trim(parent.text());

            parent.text('');

            if (textarea.length) {
                parent.append('<textarea id="editInput" class="textarea"/>');
                $('#editInput').val(this.text);
            } else {
                if (datePicker.length) {
                    parent.append('<input id="editInput"  maxlength="' + maxlength + '" type="text" readonly/>');
                } else {
                    parent.append('<input id="editInput"  maxlength="' + maxlength + '" type="number"/>');
                }

                $('#editInput').val(this.text);
            }

            if (datePicker.length) {
                $('#editInput').datepicker({
                    dateFormat : "d M, yy",
                    changeMonth: true,
                    changeYear : true
                }).addClass('datepicker');
            }

            this.prevQuickEdit = parent;

            if (textarea.length) {
                parent.append('<span id="cancelSpan" class="productEdit right"><i class="fa fa-times"></i></span>');
                parent.append('<span id="saveSpan" class="productEdit right"><i class="fa fa-check"></i></span>');

            } else {
                parent.append('<span id="saveSpan" class="productEdit"><i class="fa fa-check"></i></span>');
                parent.append('<span id="cancelSpan" class="productEdit"><i class="fa fa-times"></i></span>');
            }
            parent.find("#editInput").width(parent.find("#editInput").parent().width() - 55);
        },

        saveClick: function (e) {
            e.preventDefault();

            var targetEl = $(e.target);
            var parent = targetEl.closest('td');
            var inputEl = parent.find('input');
            if (!inputEl.length)
                inputEl = parent.find('textarea');
            var val = inputEl.val();

            if (!val.length) {
                val = 0;
            }

            parent.removeClass('quickEdit').html('<span>' + val + '</span>');

            if (inputEl.hasClass('datepicker')) {
                parent.find('span').addClass('datepicker');
            }
            if (inputEl.hasClass('textarea')) {
                parent.find('span').addClass('textarea');
            }

            this.recalculateTaxes(parent);
        },

        cancelClick: function (e) {
            e.preventDefault();

            var text = this.text ? this.text : '';
            var targetEl = $(e.target);
            var parent = targetEl.closest('td');
            var inputEl = parent.find('input');

            if (!inputEl.length) {
                inputEl = parent.find('textarea');
            }
            if (this.prevQuickEdit) {
                if ($(this.prevQuickEdit).hasClass('quickEdit')) {
                    $('.quickEdit').removeClass('quickEdit').html('<span>' + text + '</span>');
                }
            }
            if (inputEl.hasClass('datepicker')) {
                parent.find('span').addClass('datepicker');
            }
            if (inputEl.hasClass('textarea')) {
                parent.find('span').addClass('textarea');
            }

        },

        showProductsSelect: function (e, prev, next) {
            var targetEl = $(e.target);

            if (!this.checkForQuickEdit(targetEl)) {
                return false;
            }

            populate.showProductsSelect(e, prev, next, this);

            return false;
        },

        chooseOption: function (e) {
            var self = this;
            var target = $(e.target);
            var parrent = target.parents("td");
            var trEl = target.parents("tr");
            var parrents = trEl.find('td');
            var _id = target.attr("id");
            var model;
            var taxes;
            var datePicker;
            var spanDatePicker;
            var total;
            var subtotal;
            var selectedProduct;
            var jobId;
            var currentJob;
            var product = $('.productsDd');

            if (_id !== 'createJob') {


                if (parrent.hasClass('jobs')) {
                    _id = product.attr("data-id");
                    jobId = target.attr("id");

                    currentJob = _.find(self.responseObj['#jobs'], function (job) {
                        return job._id === jobId
                    });

                    parrent.find(".jobs").text(target.text()).attr("data-id", jobId);

                    model = this.products.get(_id);

                } else {
                    model = this.products.get(_id);

                    trEl.attr('data-id', model.id);

                    parrent.find(".current-selected").text(target.text()).attr("data-id", _id);
                }

                selectedProduct = model ? model.toJSON() : null;

                if (currentJob && selectedProduct) {
                    selectedProduct.info.salePrice = currentJob.budget.budgetTotal.revenueSum;

                    this.taxesRate = 0;
                }

                if (!this.forSales && selectedProduct) {
                    $(parrents[1]).attr('class', 'editable').find('span').text(selectedProduct.info.description || '');
                }


                //trEl.find('.datepicker').removeClass('notVisible');


                //$(parrents[1]).attr('class', 'editable').find('span').text(selectedProduct.info.description || '');
                $(parrents[2]).find('.datepicker.notVisible').datepicker({
                    dateFormat : "d M, yy",
                    changeMonth: true,
                    changeYear : true
                }).datepicker('setDate', new Date());

                datePicker = trEl.find('input.datepicker');
                spanDatePicker = trEl.find('span.datepicker');

                spanDatePicker.text(datePicker.val());
                datePicker.remove();

                $(parrents[2]).attr('class', 'editable');
                $(parrents[3]).attr('class', 'editable').find("span").text(1);

                if (selectedProduct) {
                    $(parrents[4]).attr('class', 'editable').find('span').text(selectedProduct.info.salePrice);
                    total = parseFloat(selectedProduct.info.salePrice);
                    taxes = total * this.taxesRate;
                    subtotal = total + taxes;
                    taxes = taxes.toFixed(2);
                    subtotal = subtotal.toFixed(2);

                    $(parrents[5]).text(taxes);
                    $(parrents[6]).text(subtotal);

                    $(".newSelectList").hide();
                    trEl.attr('data-error', null);

                    this.calculateTotal(selectedProduct.info.salePrice);
                }
            } else if (_id === 'createJob') {
                self.generateJob();
            }
        },

        recalculateTaxes: function (parent) {
            parent = parent.closest('tr');

            var quantity = parent.find('[data-name="quantity"] span').text();
            quantity = parseFloat(quantity);
            var cost = parent.find('[data-name="price"] span').text();
            cost = parseFloat(cost);

            var total = quantity * cost;
            var taxes = total * this.taxesRate;
            var subtotal = total + taxes;

            taxes = taxes.toFixed(2);
            parent.find('.taxes').text(taxes);

            subtotal = subtotal.toFixed(2);
            parent.find('.subtotal').text(subtotal);

            this.calculateTotal();
        },

        calculateTotal: function () {
            var thisEl = this.$el;
            var totalAmountEl = thisEl.find('#totalAmountContainer');

            var totalUntaxContainer = totalAmountEl.find('#totalUntaxes');
            var taxesContainer = totalAmountEl.find('#taxes');
            var totalContainer = totalAmountEl.find('#totalAmount');
            var resultForCalculate = thisEl.find('tr.productItem');

            var totalUntax = 0;
            var totalEls = resultForCalculate.length;
            var $currentEl;
            var quantity;
            var cost;
            var dates = [];
            var date;
            var taxes;
            var total;

            if (totalEls) {
                for (var i = totalEls - 1; i >= 0; i--) {
                    $currentEl = $(resultForCalculate[i]);
                    quantity = $currentEl.find('[data-name="quantity"]').text();
                    cost = $currentEl.find('[data-name="price"]').text();
                    totalUntax += (quantity * cost);
                    date = $currentEl.find('.datepicker').text();
                    dates.push(date);
                }
            }

            totalUntax = totalUntax.toFixed(2);
            totalUntaxContainer.text(totalUntax);
            totalUntax = parseFloat(totalUntax);

            taxes = totalUntax * this.taxesRate;
            taxes = taxes.toFixed(2);
            taxesContainer.text(taxes);
            taxes = parseFloat(taxes);

            total = totalUntax + taxes;
            total = total.toFixed(2);
            totalContainer.text(total);

            date = helpers.minFromDates(dates);
            thisEl.find('#minScheduleDate span').text(date);
        },

        nextSelect: function (e) {
            this.showProductsSelect(e, false, true);
        },

        prevSelect: function (e) {
            this.showProductsSelect(e, true, false);
        },

        render: function (options) {
            var productsContainer;
            var totalAmountContainer;
            var thisEl = this.$el;
            var products;
            var self = this;

            if (options && options.model) {
                products = options.model.products;

                thisEl.html(_.template(ProductItemsEditList, {model: options.model, forSales: self.forSales}));

                if (products) {
                    productsContainer = thisEl.find('#productList');
                    productsContainer.append(_.template(ItemsEditList, {
                        products: products,
                        editable: this.editable,
                        forSales: self.forSales
                    }));
                    totalAmountContainer = thisEl.find('#totalAmountContainer');
                    totalAmountContainer.append(_.template(totalAmount, {
                        model         : options.model,
                        balanceVisible: this.visible
                    }));
                }
            } else {
                this.$el.html(this.template({forSales: self.forSales}));
                totalAmountContainer = thisEl.find('#totalAmountContainer');
                totalAmountContainer.append(_.template(totalAmount, {model: null, balanceVisible: this.visible}));
            }

            return this;
        }
    });

    return ProductItemTemplate;
});