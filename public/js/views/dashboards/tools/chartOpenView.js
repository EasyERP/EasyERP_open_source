define([
    'Backbone',
    'jQuery',
    'Underscore',
    'views/dialogViewBase',
    'views/Filter/dateFilter',
    'views/dashboards/tools/ChartView',
    'text!templates/dashboards/tools/openViewTemplate.html'
], function (Backbone, $, _, ParentView, DateFilterView, ChartView, OpenViewTemplate) {

    var OpenView = ParentView.extend({
        el      : '#content-holder',
        template: _.template(OpenViewTemplate),

        initialize: function (options) {
            this.editOptions = options.editOptions;
            this.eventChannel = options.eventChannel;
            this.bind('changeDateRange', this.changeDateRange, this);

            this.render();
        },

        changeDateRange: function (dateArray) {
            var startDate = dateArray[0];
            var endDate = dateArray[1];

            if (this.chartView) {
                this.chartView.undelegateEvents();
                this.chartView = new ChartView({
                    el        : $('#chartOpenView'),
                    type      : this.editOptions.type,
                    dataSelect: this.editOptions.dataSet,
                    startDate : startDate,
                    endDate   : endDate,
                    cellsModel: this.editOptions.cellsModel,
                    limitCells: this.editOptions.limitCells,
                    xPoints   : this.editOptions.xPoints,
                    yPoints   : this.editOptions.yPoints,
                    width     : this.chartViewWidth,
                    height    : this.chartViewHeight,
                    openView  : true
                });
            }
        },

        render: function () {
            var self = this;
            var width;
            var height;
            var chartType = this.editOptions.type;
            var sizeParams = {
                horizontalBar      : 'rectangle',
                horizontalBarLayout: 'rectangle',
                verticalBar        : 'rectangle',
                line               : 'rectangle',
                overview           : 'horizontal',
                table              : 'square',
                singleValue        : 'square',
                donut              : 'square',
                donutAnimated      : 'square',
                pieAnimated        : 'square',
                pie                : 'square'
            };

            if (sizeParams[chartType] === 'rectangle') {
                width = 1000;
                height = 500;
            } else if (sizeParams[chartType] === 'square') {
                width = 700;
                height = 600;
            } else {
                width = 700;
            }

            this.startDate = this.editOptions.startDate;
            this.endDate = this.editOptions.endDate;
            this.$el = $(this.template({
                startDate  : this.startDate,
                endDate    : this.endDate,
                dialogTitle: this.editOptions.name
            })).dialog({
                autoOpen   : true,
                dialogClass: 'open-view-dialog',
                title      : 'View dashboard',
                width      : width,
                height     : height,
                buttons    : [{
                    text : 'Cancel',
                    class: 'btn',
                    click: function () {
                        self.hideDialog();
                    }
                }]
            });

            this.dateFilterView = new DateFilterView({
                contentType: 'customDashboardCharts',
                el         : this.$el.find('#dateFilter')
            });

            this.dateFilterView.on('dateChecked', function () {
                self.trigger('changeDateRange', self.dateFilterView.dateArray);
            });

            this.dateFilterView.checkElement('custom', [this.startDate, this.endDate]);

            this.chartViewHeight = height - this.$el.find('._chartDialogTitle').height() - this.$el.closest('.ui-dialog').find('.ui-dialog-buttonpane').height();
            this.chartViewWidth = width;
            this.chartView = new ChartView({
                el        : $('#chartOpenView'),
                type      : this.editOptions.type,
                dataSelect: this.editOptions.dataSet,
                startDate : this.editOptions.startDate,
                endDate   : this.editOptions.endDate,
                cellsModel: this.editOptions.cellsModel,
                limitCells: this.editOptions.limitCells,
                xPoints   : this.editOptions.xPoints,
                yPoints   : this.editOptions.yPoints,
                height    : this.chartViewHeight,
                width     : this.chartViewWidth,
                openView  : true
            });

            return this;
        }
    });

    return OpenView;
});