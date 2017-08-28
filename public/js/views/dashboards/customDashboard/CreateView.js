define([
    'Backbone',
    'jQuery',
    'Underscore',
    'text!templates/dashboards/customDashboard/CreateChartTemplate.html',
    'views/dialogViewBase',
    'constants',
    'views/Filter/dateFilter',
    'views/Notes/AttachView',
    'views/dashboards/tools/ContainerView',
    'views/dashboards/tools/ChartView',
    'helpers/eventsBinder',
    'moment',
    'helpers/ga',
    'constants/googleAnalytics'
], function (Backbone, $, _, CreateTemplate, ParentView, CONSTANTS, DateFilterView, AttachView, ContainerView, ChartView, eventsBinder, moment, ga, GA) {

    var CreateView = ParentView.extend({
        el         : '#content-holder',
        contentType: CONSTANTS.CUSTOMDASHBOARDCHARDS,
        template   : _.template(CreateTemplate),

        events: {
            'click #typeSelect li': 'setChartsOptions',
            'click #dataSelect li': 'setDataChartsOptions'
        },

        initialize: function (options) {
            this.numberOfColumns = options.numberOfColumns;
            this.numberOfRows = options.numberOfRows;
            this.chartCounter = options.chartCounter;
            this.eventChannel = options.eventChannel;
            this.limitCells = options.limitCells;
            this.xPoints = options.xPoints;
            this.yPoints = options.yPoints;
            this.cellsModel = options.cellsModel;
            this.ParentView = options.ParentView;
            this.startTime = new Date();
            this.collection = options.collection;
            this.defaultValues = {
                name     : '',
                dataSet  : 'Invoice By Week',
                typeLabel: 'Line chart'
            };
            this.propsSet = {
                'Line Chart'           : ['invoiceByWeek', 'purchaseInvoiceByWeek'],
                'Horizontal bar Chart' : ['revenueBySales', 'revenueByCountry', 'revenueByCustomer', 'purchaseRevenueBySales', 'purchaseRevenueByCountry', 'purchaseRevenueByCustomer'],
                'Vertical bar Chart'   : ['invoiceByWeek', 'purchaseInvoiceByWeek'],
                'Horizontal Bar Layout': ['leadsBySource'],
                'Donut Chart'          : ['revenueBySales', 'revenueByCountry', 'revenueByCustomer', 'purchaseRevenueBySales', 'purchaseRevenueByCountry', 'purchaseRevenueByCustomer'],
                'Donut Animated Chart' : ['revenueBySales', 'revenueByCountry', 'revenueByCustomer', 'purchaseRevenueBySales', 'purchaseRevenueByCountry', 'purchaseRevenueByCustomer'],
                'Pie Chart'            : ['revenueBySales', 'revenueByCountry', 'revenueByCustomer', 'purchaseRevenueBySales', 'purchaseRevenueByCountry', 'purchaseRevenueByCustomer'],
                'Pie Animated Chart'   : ['revenueBySales', 'revenueByCountry', 'revenueByCustomer', 'purchaseRevenueBySales', 'purchaseRevenueByCountry', 'purchaseRevenueByCustomer'],
                'Single Value'         : ['totalPurchaseRevenue', 'totalSalesRevenue', 'totalSalesOrders', 'totalPurchaseOrder', 'totalReceivedOrders', 'totalPartialReceivedOrders', 'totalDeliveredPurchaseOrders', 'totalPartialDeliveredPurchasedOrders'],
                'Table'                : ['orders', 'purchaseOrders', 'totalSalesRevenue', 'totalPurchaseRevenue', 'pastDueInvoices', 'pastDuePurchaseInvoices'],
                'Overview'             : ['orders', 'purchaseOrders', 'totalSalesRevenue', 'totalPurchaseRevenue']
            };
            this.allDataSelect = [{
                _id : "invoiceByWeek",
                name: 'Sales Invoice By Week'
            }, {
                _id : "purchaseInvoiceByWeek",
                name: 'Purchase Invoice By Week'
            }, {
                _id : "revenueBySales",
                name: 'Revenue By Sales Manager'
            }, {
                _id : "revenueByCountry",
                name: 'Revenue By Country'
            }, {
                _id : "revenueByCustomer",
                name: 'Report by Sales Channel'
            }, {
                _id : "purchaseRevenueBySales",
                name: 'Costs By Sales Manager'
            }, {
                _id : "purchaseRevenueByCountry",
                name: 'Costs By Country'
            }, {
                _id : "purchaseRevenueByCustomer",
                name: 'Costs By Supplier'
            }, {
                _id : "totalSalesRevenue",
                name: 'Sales Invoices'
            }, {
                _id : "totalPurchaseRevenue",
                name: 'Purchase Invoices'
            }, {
                _id : "leadsBySource",
                name: 'Leads By Source'
            }, {
                _id : "leadsByDay",
                name: 'Leads By Day (created by)'
            }, {
                _id : "leadsByWeek",
                name: 'Leads By Week (created by)'
            }, {
                _id : "leadsByMonth",
                name: 'Leads By Month (created by)'
            }, {
                _id : "leadsByDayAssigned",
                name: 'Leads By Day (Assigned to)'
            }, {
                _id : "leadsByWeekAssigned",
                name: 'Leads By Week (Assigned to)'
            }, {
                _id : "leadsByMonthAssigned",
                name: 'Leads By Month (Assigned to)'
            }, {
                _id : "orders",
                name: 'Sales Orders'
            }, {
                _id : "purchaseOrders",
                name: 'Purchase Orders'
            }, {
                _id : "pastDueInvoices",
                name: 'Past Due Sales Invoices'
            }, {
                _id : "pastDuePurchaseInvoices",
                name: 'Past Due Purchase Invoices'
            }, {
                _id: 'totalSalesOrders',
                name: 'Sales Orders Count'
            }, {
                _id: 'totalPurchaseOrder',
                name: 'Purchase Orders Count'
            }, {
                _id: 'totalReceivedOrders',
                name: 'Received Orders'
            }, {
                _id: 'totalPartialReceivedOrders',
                name: 'Partial Received Orders'
            }, {
                _id: 'totalDeliveredPurchaseOrders',
                name: 'Delivered Orders'
            }, {
                _id: 'totalPartialDeliveredPurchasedOrders',
                name: 'Partial Delivered Orders'
            }];

            this.editOptions = options.editOptions;
            this.responseObj = {};

            this.render();
        },

        onEdit: function () {
            var $dataSelect = this.$el.find('#dataSelect');
            var $type = this.$el.find('#typeSelect');
            var datasetId = this.dataSet;
            var typeId = this.type;
            var $chart;

            $chart = $(this.editOptions.id);
            $chart.find('svg').remove();
            $chart.attr({
                'data-dataset': datasetId,
                'data-type'   : typeId
            });

            $chart.find('.chartName').text(this.$el.find('#inputName').val());
            $chart.find('#startDate').text(this.startDate);
            $chart.find('#endDate').text(this.endDate);

            ga && ga.event({
                eventCategory: GA.EVENT_CATEGORIES.USER_ACTION,
                eventAction  : GA.EVENT_ACTIONS.CHARTS_VIEW,
                eventLabel   : GA.EVENT_LABEL.CONFIRM_EDITING,
                eventValue   : GA.EVENTS_VALUES[15],
                fieldsObject : {}
            });

            return new ChartView({
                el          : this.editOptions.id,
                dataSelect  : datasetId,
                type        : typeId,
                startDate   : this.startDate,
                endDate     : this.endDate,
                eventChannel: this.eventChannel
            });
        },

        setChartsOptions: function (e, type) {
            var $target = e ? $(e.target) : this.$el.find('#typeSelect');
            var self = this;
            var chartType;
            var dataChartKeys;

            this.type = type || $target.attr('data-id') || $target.attr('id');
            this.responseObj['#dataSelect'] = [];

            if (type) {
                _.find(self.responseObj['#typeSelect'], function (elem) {
                    if (elem._id === self.type) {
                        return chartType = elem.name;
                    }
                });

                $target.text(chartType).attr('data-id', type);

            } else {
                chartType = $.trim($target.text());
                $target.parents('ul').closest('.current-selected').text($target.text()).attr('data-id', $target.attr('id'));
            }

            dataChartKeys = this.propsSet[chartType];

            this.allDataSelect.forEach(function (obj) {

                if (dataChartKeys.indexOf(obj._id) > -1) {
                    self.responseObj['#dataSelect'].push(obj);
                }
            });
            this.$el.find('#dataSelect').attr('data-id', null);
            this.hideNewSelect();
        },

        setDataChartsOptions: function (e, dataSet) {
            var $target = e ? $(e.target) : this.$el.find('#dataSelect');
            var dataSelectValue;
            var self = this;
            var $dataSetInput = $target.parents('ul').closest('.current-selected');

            this.dataSet = dataSet || $target.attr('id');

            if (dataSet) {
                _.find(self.responseObj['#dataSelect'], function (elem) {
                    if (elem._id === self.dataSet) {
                        dataSelectValue = elem.name;
                    }
                });

                $dataSetInput.text($target.text(dataSelectValue)).attr('data-id', this.dataSet);
            }

            $dataSetInput.text($target.text()).attr('data-id', $target.attr('id'));

            this.hideNewSelect();
        },

        removeAllChecked: function () {
            this.$el.find('.filterValues').removeClass('checkedValue');
        },

        createItem: function () {
            var $dataSelect = this.$el.find('#dataSelect');
            var $name = this.$el.find('#inputName');
            var name = $name.val();
            var $type = this.$el.find('#typeSelect');
            var datasetId = this.dataSet;
            var typeId = this.type;

            if (!datasetId) {
                return App.render({type: 'error', message: 'Please choose data for chart'});
            }

            this.subview = new ContainerView({
                counter        : this.chartCounter,
                numberOfColumns: this.numberOfColumns,
                numberOfRows   : this.numberOfRows,
                name           : name,
                dataset        : datasetId,
                type           : typeId,
                limitCells     : this.limitCells,
                xPoints        : this.xPoints,
                yPoints        : this.yPoints,
                cellsModel     : this.cellsModel,
                startDate      : this.startDate,
                endDate        : this.endDate,
                collection     : this.ParentView.collection,
                eventChannel   : this.ParentView.eventChannel
            });

            eventsBinder.subscribeCustomChartEvents(this.subview, this.ParentView);
            $('#chartPlace').append(this.subview.render().$el);
            $name.val(this.defaultValues.name);
            $type.val(this.defaultValues.typeLabel);
            $dataSelect.val(this.defaultValues.dataSet);

            this.hideDialog();
        },

        render: function () {
            var date = moment(new Date());
            var self = this;
            var $name;
            var notDiv;

            this.startDate = this.editOptions && this.editOptions.startDate ? this.editOptions.startDate : (date.startOf('month')).format('D MMM, YYYY');
            this.endDate = this.editOptions && this.editOptions.endDate ? this.editOptions.endDate : (moment(this.startDate).endOf('month')).format('D MMM, YYYY');
            this.$el = $(this.template({
                startDate  : this.startDate,
                endDate    : this.endDate,
                dialogTitle: this.editOptions ? 'Edit Custom Dashboard' : 'Create Custom Dashboard'
            })).dialog({
                autoOpen   : true,
                dialogClass: 'edit-dialog',
                title      : 'Edit Company',
                width      : '500',
                buttons    : [{
                    text : 'Create',
                    class: 'btn blue',
                    id   : 'createBtn',
                    click: function () {
                        self.createItem();
                    }
                }, {
                    text : 'Edit',
                    class: 'btn blue',
                    id   : 'editBtn',
                    click: function () {
                        self.onEdit();
                        self.hideDialog();
                    }
                }, {
                    text : 'Cancel',
                    class: 'btn',
                    click: function () {
                        ga && ga.event({
                            eventCategory: GA.EVENT_CATEGORIES.USER_ACTION,
                            eventAction  : GA.EVENT_ACTIONS.CHARTS_VIEW,
                            eventLabel   : GA.EVENT_LABEL.CANCEL_DIALOG,
                            eventValue   : GA.EVENTS_VALUES[16],
                            fieldsObject : {}
                        });

                        self.hideDialog();
                    }
                }]
            });

            this.responseObj['#typeSelect'] = [
                {
                    _id : "line",
                    name: 'Line Chart'
                }, {
                    _id : "horizontalBar",
                    name: 'Horizontal bar Chart'
                }, {
                    _id : "verticalBar",
                    name: 'Vertical bar Chart'
                }, {
                    _id : "horizontalBarLayout",
                    name: 'Horizontal Bar Layout'
                }, {
                    _id : "donut",
                    name: 'Donut Chart'
                }, {
                    _id : "donutAnimated",
                    name: 'Donut Animated Chart'
                }, {
                    _id : "pie",
                    name: 'Pie Chart'
                }, {
                    _id : "pieAnimated",
                    name: 'Pie Animated Chart'
                },
                {
                    _id : "singleValue",
                    name: 'Single Value'
                }, {
                    _id : "table",
                    name: 'Table'
                }, {
                    _id : "overview",
                    name: 'Overview'
                }
            ];

            notDiv = this.$el.find('.attach-container');

            this.attachView = new AttachView({
                model      : this.model,
                contentType: self.contentType,
                isCreate   : true
            });

            notDiv.append(this.attachView.render().el);
            this.setChartsOptions();
            this.delegateEvents(this.events);
            this.bindDatePickers(this.startDate, this.endDate);

            if (this.editOptions) {
                $name = this.$el.find('#inputName');
                $('#createBtn').hide();
                $name.val(this.editOptions.name);
                this.setChartsOptions(null, this.editOptions.type);
                this.setDataChartsOptions(null, this.editOptions.dataSet);
            } else {
                $('#editBtn').hide();
            }

            return this;
        },

        bindDatePickers: function (startDate, endDate) {
            var self = this;

            this.dateFilterView = new DateFilterView({
                contentType: 'customDashboardCharts',
                el         : this.$el.find('#dateFilter')
            });

            this.dateFilterView.on('dateChecked', function () {
                self.trigger('changeDateRange', self.dateFilterView.dateArray);
            });

            this.dateFilterView.checkElement('custom', [startDate, endDate]);
        }
    });

    return CreateView;
});
