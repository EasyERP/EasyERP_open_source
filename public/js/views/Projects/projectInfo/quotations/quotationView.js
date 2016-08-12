define([
    'Underscore',
    'jQuery',
    'text!templates/Projects/projectInfo/quotations/quotationTemplate.html',
    'text!templates/Projects/projectInfo/quotations/ListTemplate.html',
    'views/salesQuotations/EditView',
    'views/salesQuotations/list/ListView',
    'views/Projects/projectInfo/quotations/CreateView',
    'collections/Quotations/filterCollection',
    'models/QuotationModel',
    'common',
    'helpers',
    'dataService',
    'constants',
    'helpers/eventsBinder'
], function (_, $, quotationTopBar, ListTemplate, EditView, listView, QuotationCreateView, quotationCollection, CurrentModel, common, helpers, dataService, CONSTANTS, eventsBinder) {
    'use strict';

    var quotationView = listView.extend({

        el                  : '#quotations',
        contentCollection   : quotationCollection,
        preventChangLocation: true,
        templateHeader      : _.template(quotationTopBar),
        templateList        : _.template(ListTemplate),

        events: {
            'click .checkbox'                        : 'checked',
            'click #createQuotation'                 : 'createQuotation',
            'click #removeQuotation'                 : 'removeItems',
            'click .list td:not(.notForm, .checkbox)': 'goToEditDialog',
            'click .stageSelect'                     : 'showNewSelect'
        },

        initialize: function (options) {
            this.remove();
            this.visible = options.visible;
            this.projectModel = options.model;
            this.wTrackCollection = options.wTrackCollection;
            this.createJob = options.createJob;
            this.collection = options.collection;
            this.projectID = options.projectId;
            this.customerId = options.customerId;
            this.salesManager = options.salesManager;
            this.filter = options.filter || {};
            this.defaultItemsNumber = 50;
            this.page = options.page || 1;
            this.eventChannel = options.eventChannel;

            eventsBinder.subscribeCollectionEvents(this.collection, this);
        },

        chooseOption: function (e) {
            var target$ = $(e.target);
            var targetElement = target$.closest('tr');
            var parentTd = target$.closest('td');
            var a = parentTd.find('a');
            var id = targetElement.attr('data-id');
            var model = this.collection.get(id);

            model.save({
                workflow: {
                    _id : target$.attr('id'),
                    name: target$.text()
                }
            }, {
                headers: {
                    mid: 55
                },

                patch   : true,
                validate: false,
                success : function () {
                    a.text(target$.text());
                }
            });

            this.hideNewSelect();

            return false;
        },

        goToEditDialog: function (e) {
            var self = this;
            var id = $(e.target).closest('tr').attr('data-id');
            var model = new CurrentModel({validate: false});
            var modelQuot = this.collection.get(id);

            function renderProformRevenue() {
                self.renderProformRevenue(modelQuot);
                self.render();
            }

            e.preventDefault();

            self.collection.bind('remove', renderProformRevenue);

            App.startPreload();

            model.urlRoot = '/quotations/';
            model.fetch({
                data   : {id: id, contentType: this.contentType, forSales: true},
                success: function (model) {
                    return new EditView({
                        model        : model,
                        redirect     : true,
                        pId          : self.projectID,
                        customerId   : self.customerId,
                        collection   : self.collection,
                        hidePrAndCust: true,
                        eventChannel : self.eventChannel
                    });
                },

                error: function () {
                    App.render({
                        type   : 'error',
                        message: 'Please refresh browser'
                    });
                }
            });
        },

        renderProformRevenue: function (modelQuot) {
            var proformContainer = $('#proformRevenueContainer');
            var modelJSON = modelQuot.toJSON();

            var orderSum = proformContainer.find('#orderSum');
            var orderCount = proformContainer.find('#orderCount');
            var totalSum = proformContainer.find('#totalSum');
            var totalCount = proformContainer.find('#totalCount');
            var total = orderSum.attr('data-value');
            var order = orderSum.attr('data-value');
            var newTotal;
            var newOrder;

            total = parseFloat(total);
            order = parseFloat(order);
            newTotal = total + parseFloat(modelJSON.paymentInfo.total);
            newOrder = order + parseFloat(modelJSON.paymentInfo.total);

            orderSum.attr('data-value', newOrder);
            orderSum.text(helpers.currencySplitter(newOrder.toString()));

            totalSum.attr('data-value', newTotal);
            totalSum.text(helpers.currencySplitter(newTotal.toString()));

            orderCount.text(parseFloat(orderCount.text()) + 1);
            totalCount.text(parseFloat(totalCount.text()) + 1);
        },

        removeItems: function (event) {
            var answer = confirm('Really DELETE items ?!');
            var that = this;
            var mid = 39;
            var model;
            var localCounter = 0;
            var listTableCheckedInput;
            var count;
            var table = $('#quotationTable');

            event.preventDefault();

            listTableCheckedInput = table.find("input:not('#checkAll_quotations'):checked");
            count = listTableCheckedInput.length;
            this.collectionLength = this.collection.length;

            if (answer === true) {
                $.each(listTableCheckedInput, function (index, checkbox) {
                    model = that.collection.get(checkbox.value);
                    model.destroy({
                        headers: {
                            mid: mid
                        },
                        wait   : true,
                        success: function (model) {
                            var id = model.get('_id');

                            table.find('[data-id="' + id + '"]').remove();

                            $('#removeQuotation').hide();
                            $('#checkAll_quotations').prop('checked', false);

                            if (that.eventChannel) {
                                that.eventChannel.trigger('elemCountChanged');
                            }

                        },

                        error: function (model, res) {
                            if (res.status === 403 && index === 0) {
                                App.render({
                                    type   : 'error',
                                    message: 'You do not have permission to perform this action'
                                });
                            }
                            that.listLength--;
                            count--;
                            if (count === 0) {
                                that.deleteCounter = localCounter;
                                that.deletePage = $('#currentShowPage').val();
                                that.deleteItemsRender(that.deleteCounter, that.deletePage);
                            }
                        }
                    });
                });
            }

        },

        checked: function (e) {
            var el = this.$el;
            var $targetEl = $(e.target);
            var checkLength = el.find('input.checkbox:checked').length;
            var checkAll$ = el.find('#checkAll_quotations');
            var removeBtnEl = $('#removeQuotation');

            e.stopPropagation();

            if ($targetEl.hasClass('notRemovable')) {
                $targetEl.prop('checked', false);

                return false;
            }

            if (this.collection.length > 0) {
                if (checkLength > 0) {
                    checkAll$.prop('checked', false);

                    removeBtnEl.show();

                    if (checkLength === this.collection.length) {

                        checkAll$.prop('checked', true);
                    }
                } else {
                    removeBtnEl.hide();
                    checkAll$.prop('checked', false);
                }
            }
        },

        createQuotation: function (e) {
            e.preventDefault();
            return new QuotationCreateView({
                projectId       : this.projectID,
                customerId      : this.customerId,
                collection      : this.collection,
                salesManager    : this.salesManager,
                projectModel    : this.projectModel,
                wTrackCollection: this.wTrackCollection,
                createJob       : this.createJob,
                eventChannel    : this.eventChannel
            });
        },

        showMoreContent: function (newModels) {
            var $holder = this.$el;
            var pagenation;

            this.hideDeleteBtnAndUnSelectCheckAll();

            $holder.find('#listTableQuotation').html(this.templateList({
                quotations      : newModels.toJSON(),
                startNumber     : 0,
                dateToLocal     : common.utcDateToLocaleDate,
                currencySplitter: helpers.currencySplitter,
                currencyClass   : helpers.currencyClass
            }));

            pagenation = $holder.find('.pagination');

            if (newModels.length !== 0) {
                pagenation.show();
            } else {
                pagenation.hide();
            }

            if (typeof (this.recalcTotal) === 'function') {
                this.recalcTotal();
            }
        },

        render: function () {
            var $currentEl = this.$el;
            var self = this;

            $currentEl.html('');
            $currentEl.prepend(this.templateHeader);

            $currentEl.find('#listTableQuotation').html(this.templateList({
                quotations      : this.collection.toJSON(),
                startNumber     : 0,
                dateToLocal     : common.utcDateToLocaleDate,
                currencySplitter: helpers.currencySplitter,
                currencyClass   : helpers.currencyClass
            }));

            this.renderPagination($currentEl, this);

            this.$el.find('#removeQuotation').hide();

            $('#checkAll_quotations').click(function () {
                self.$el.find(':checkbox:not(.notRemovable)').prop('checked', this.checked);
                if ($('input.checkbox:checked').length > 0) {
                    $('#removeQuotation').show();
                } else {
                    $('#removeQuotation').hide();
                }
            });

            dataService.getData(CONSTANTS.URLS.WORKFLOWS_FETCH, {
                wId         : 'Sales Order',
                source      : 'purchase',
                targetSource: 'quotation'
            }, function (stages) {
                self.stages = stages;
            });

            self.eventChannel.trigger('elemCountChanged');
        }

    });

    return quotationView;
});
