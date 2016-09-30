define([
    'Backbone',
    'jQuery',
    'Underscore',
    'text!templates/customDashboard/customDashboard/CreateChartTemplate.html',
    'views/dialogViewBase',
    'constants',
    'views/Notes/AttachView',
    'views/customDashboard/tools/ContainerView',
    'views/customDashboard/tools/ChartView',
    'helpers/eventsBinder',
    'moment'
], function (Backbone, $, _, CreateTemplate, ParentView, CONSTANTS, AttachView, ContainerView, ChartView, eventsBinder, moment) {

    var CreateView = ParentView.extend({
        el         : '#content-holder',
        contentType: CONSTANTS.CUSTOMDASHBOARDCHARDS,
        template   : _.template(CreateTemplate),

        events: {
            'click #typeSelect'                 : 'setChartsOptions',
            'click .dateRange'                  : 'toggleDateRange',
            'click li.filterValues:not(#custom)': 'setDateRange',
            'click #custom'                     : 'showDatePickers',
            'click #cancelBtn'                  : 'cancel',
            'click .dropDownDateRangeContainer' : 'toggleDateFilter',
            'click #updateDate'                 : 'changeDateRange'
        },

        initialize: function (options) {
            this.numberOfColumns = options.numberOfColumns;
            this.numberOfRows = options.numberOfRows;
            this.chartCounter = options.chartCounter;
            this.defaultValues = {
                name     : '',
                dataSet  : 'Invoice By Week',
                typeLabel: 'Line chart'
            };
            this.limitCells = options.limitCells;
            this.xPoints = options.xPoints;
            this.yPoints = options.yPoints;
            this.cellsModel = options.cellsModel;
            this.ParentView = options.ParentView;
            this.startTime = new Date();
            this.defaultValues = {
                name     : '',
                dataSet  : 'Invoice By Week',
                typeLabel: 'Line chart'
            };
            this.propsSet = {
                'Line chart'           : '#invoiceByWeek, #leadsByDay, #leadsByWeek, #leadsByMonth',
                'Horizontal bar chart' : '#revenueBySales, #revenueByCountry, #revenueByCustomer',
                'Vertical bar chart'   : '#invoiceByWeek, #leadsByDay, #leadsByWeek, #leadsByMonth',
                'Donut Chart'          : '#revenueBySales, #revenueByCountry, #revenueByCustomer',
                'Single value'         : '#amount',
                'Horizontal Bar Layout': '#leadsBySource'
                // 'Vertical Bar Layout': '#leadsByDay, #leadsByWeek, #leadsByMonth'
                // 'Table': '#revenueBySales, #revenueByCountry, #revenueByCustomer'
                // 'Map chart': '#revenueByCountry'
            };
            this.editOptions = options.editOptions;
            this.render();
        },

        onEdit: function () {
            var $dataSelect = this.$el.find('#dataSelect');
            var $type = this.$el.find('#typeSelect');
            var datasetId;
            var typeId;
            var $chart;

            this.$el.find('.dataset').each(function () {

                if ($(this).text() === $dataSelect.val()) {
                    datasetId = $(this).attr('id');
                }
            });

            this.$el.find('.chartOptions').each(function () {

                if ($(this).text() === $type.val()) {
                    typeId = $(this).attr('id');
                }
            });

            $chart = $(this.editOptions.id);
            $chart.find('svg').remove();
            $chart.attr({
                'data-dataset': datasetId,
                'data-type'   : typeId
            });

            $chart.find('.chartName').text(this.$el.find('#inputName').val());
            $chart.find('#startDate').text(this.startDate);
            $chart.find('#endDate').text(this.endDate);

            return new ChartView({
                el        : this.editOptions.id,
                dataSelect: datasetId,
                type      : typeId,
                startDate : this.startDate,
                endDate   : this.endDate
            });
        },

        setChartsOptions: function (e) {
            var $target = e ? $(e.target) : this.$el.find('#line');
            var $selection;

            $('.dataset').hide();
            $selection = this.$el.find(this.propsSet[$target.val()]);
            $selection.show();
            $('#dataSelect').val($selection.eq(0).text());
        },

        toggleDateRange: function (e) {
            var ul = e ? $(e.target).closest('ul') : this.$el.find('.dateFilter');

            if (!ul.hasClass('frameDetail')) {
                ul.find('.frameDetail').toggleClass('hidden');
            } else {
                ul.toggleClass('hidden');
            }
        },

        setDateRange: function (e) {
            var $target = $(e.target);
            var id = $target.attr('id');
            var date = moment(new Date());
            var startDate;
            var quarter;
            var endDate;

            this.$el.find('.customTime').addClass('hidden');
            this.removeAllChecked();
            $target.toggleClass('checkedValue');

            switch (id) {
                case 'thisMonth':
                    startDate = date.startOf('month');
                    endDate = moment(startDate).endOf('month');
                    break;
                case 'thisYear':
                    startDate = date.startOf('year');
                    endDate = moment(startDate).endOf('year');
                    break;
                case 'lastMonth':
                    startDate = date.subtract(1, 'month').startOf('month');
                    endDate = moment(startDate).endOf('month');
                    break;
                case 'lastQuarter':
                    quarter = date.quarter();
                    startDate = date.quarter(quarter - 1).startOf('quarter');
                    endDate = moment(startDate).endOf('quarter');
                    break;
                case 'lastYear':
                    startDate = date.subtract(1, 'year').startOf('year');
                    endDate = moment(startDate).endOf('year');
                    break;
                default:
                    break;
            }

            this.$el.find('#startDate').datepicker('setDate', new Date(startDate));
            this.$el.find('#endDate').datepicker('setDate', new Date(endDate));
            this.changeDateRange(null);
        },

        showDatePickers: function () {
            this.removeAllChecked();
            this.$el.find('.customTime').toggleClass('hidden');
        },

        cancel: function (e) {
            var targetEl = $(e.target);
            var ul = targetEl.closest('ul.frameDetail');

            e.preventDefault();
            ul.addClass('hidden');
        },

        removeAllChecked: function () {
            this.$el.find('.filterValues').removeClass('checkedValue');
        },

        changeDateRange: function (e) {
            var dateFilter;
            var startDate;
            var endDate;
            var startTime;
            var endTime;

            dateFilter = e ? $(e.target).closest('ul.dateFilter') : this.$el.find('ul.dateFilter');
            startDate = dateFilter.find('#startDate');
            endDate = dateFilter.find('#endDate');
            startTime = dateFilter.find('#startTime');
            endTime = dateFilter.find('#endTime');
            startDate = startDate.val();
            endDate = endDate.val();
            startTime.text(startDate);
            endTime.text(endDate);
            this.startDate = startDate;
            this.endDate = endDate;
            this.toggleDateRange(null);
            this.trigger('changeDateRange');
        },

        createItem: function () {
            var $dataSelect = this.$el.find('#dataSelect');
            var $name = this.$el.find('#inputName');
            var name = $name.val();
            var $type = this.$el.find('#typeSelect');
            var datasetId;
            var typeId;

            this.$el.find('.dataset').each(function () {

                if ($(this).text() === $dataSelect.val()) {
                    datasetId = $(this).attr('id');

                    if (!name) {
                        name = $(this).text();
                    }
                }
            });

            this.$el.find('.chartOptions').each(function () {

                if ($(this).text() === $type.val()) {
                    typeId = $(this).attr('id');
                }
            });

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
                endDate        : this.endDate
            });

            eventsBinder.subscribeCustomChartEvents(this.subview, this.ParentView);
            $('#chartPlace').append(this.subview.render().$el);
            $name.val(this.defaultValues.name);
            $type.val(this.defaultValues.typeLabel);
            $dataSelect.val(this.defaultValues.dataSet);
        },

        render: function () {
            var date = moment(new Date());
            var self = this;
            var $name;
            var notDiv;

            this.startDate = (date.startOf('month')).format('D MMM, YYYY');
            this.endDate = (moment(this.startDate).endOf('month')).format('D MMM, YYYY');

            this.$el = $(this.template({
                startDate: this.startDate,
                endDate  : this.endDate
            })).dialog({
                closeOnEscape: false,
                autoOpen     : true,
                resizable    : true,
                dialogClass  : 'edit-dialog',
                title        : 'Edit Company',
                width        : '1000',
                buttons      : [{
                    text : 'Create',
                    class: 'btn blue',
                    id   : 'createBtn',
                    click: function () {
                        self.createItem();
                        self.hideDialog();
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
                        self.hideDialog();
                    }
                }]
            });

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
                this.$el.find('#dataSelect').val($('#' + this.editOptions.dataset).eq(0).text());
                this.$el.find('#typeSelect').val($('#' + this.editOptions.type).eq(0).text());
            } else {
                $('#editBtn').hide();
            }

            return this;
        },

        bindDatePickers: function (startDate, endDate) {
            var self = this;
            var endDatePicker;
            var endDateValue;

            this.$el.find('#startDate')
                .datepicker({
                    dateFormat : 'd M, yy',
                    changeMonth: true,
                    changeYear : true,
                    defaultDate: startDate,
                    onSelect   : function () {
                        endDatePicker = self.$endDate;
                        endDatePicker.datepicker('option', 'minDate', $(this).val());
                        endDateValue = moment(new Date($(this).val())).endOf('month');
                        endDateValue = new Date(endDateValue);
                        endDatePicker.datepicker('setDate', endDateValue);

                        return false;
                    }
                })
                .datepicker('setDate', startDate);

            this.$endDate = this.$el.find('#endDate')
                .datepicker({
                    dateFormat : 'd M, yy',
                    changeMonth: true,
                    changeYear : true,
                    defaultDate: endDate
                })
                .datepicker('setDate', endDate);
        }
    });

    return CreateView;
});
