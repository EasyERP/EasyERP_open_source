define([
    'Backbone',
    'jQuery',
    'Underscore',
    'text!templates/customDashboard/customDashboard/ContentTemplate.html',
    'views/customDashboard/tools/ContainerView',
    'constants',
    'collections/customDashboard/customChartCollection',
    'models/CustomChartModel',
    'models/gridForCustomDashboardModel',
    'views/customDashboard/customDashboard/CreateView',
    'views/topBarViewBase',
    'helpers/eventsBinder',
    'views/Filter/dateFilter',
    'moment'
], function (Backbone, $, _, mainTemplate, ChartView, CONSTANTS, CustomChartCollection, Model, CellsModel, CreateView, TopBarBase, eventsBinder, DateFilterView, moment) {
    'use strict';

    var View = TopBarBase.extend({
        el: '#content-holder',

        contentType: CONSTANTS.CUSTOMDASHBOARDCHARDS,

        template: _.template(mainTemplate),

        events: {
            'click .editChart'   : 'onEdit',
            'click #changeCharts': 'changeCharts',
            'click #saveBtn'     : 'saveDashboard'
        },

        initialize: function (options) {
            var regexp = /purchase/i;
            var eventChannel = {};
            var self = this;
            var charts = [];

            this.content = options.contentType;
            this.dashboardModel = options.model;
            this.numberOfColumns = this.dashboardModel.attributes[0].columns;
            this.description = this.dashboardModel.attributes[0].description;
            this.numberOfRows = this.dashboardModel.attributes[0].rows;
            this.charts = this.dashboardModel.attributes[0].charts;

            if (this.content === 'purchaseDashboard') {
                this.charts.forEach(function (el) {
                    if (regexp.test(el.dataset)) {
                        charts.push(el);
                    }
                });
            } else {
                this.charts.forEach(function (el) {
                    if (!regexp.test(el.dataset)) {
                        charts.push(el);
                    }
                });
            }

            this.charts = charts;

            this.collection = new CustomChartCollection(charts);
            this.CreateView = CreateView;
            this.cellsModel = new CellsModel();
            this.model = new Model();
            this.name = options.model.attributes[0].name;
            this.cellsModel.set({engagedCells: []});
            this.chartCounter = 0;
            this.limitCells = [];
            this.xPoints = [];
            this.yPoints = [];

            this.startDate = moment(new Date()).startOf('month');
            this.endDate = moment(new Date());

            this.eventChannel = options.eventsChannel;
            _.extend(eventChannel, Backbone.Events);

            self.eventChannel = eventChannel;

            $(window).resize(function () {
                self.render();
            });

            this.render();
        },

        changeCharts: function () {
            this.eventChannel.trigger('changeDate', this.dateFilterView.dateArray);

            $('#saveBtn').show();
        },

        onEdit: function (e) {
            var $target = $(e.target).closest('.panel-heading');
            var $chart = $target.closest('.panel');
            var id = $chart.attr('id');
            var name = $chart.find('.chartName').text();
            var dataset = $chart.attr('data-dataset');
            var type = $chart.attr('data-type');

            return new CreateView({
                editOptions: {
                    id     : '#' + id,
                    name   : name,
                    dataset: dataset,
                    type   : type
                }
            });
        },

        createItem: function () {
            this.chartCounter++;

            return new CreateView({
                numberOfColumns: this.numberOfColumns,
                numberOfRows   : this.numberOfRows,
                limitCells     : this.limitCells,
                xPoints        : this.xPoints,
                yPoints        : this.yPoints,
                cellsModel     : this.cellsModel,
                chartCounter   : this.chartCounter,
                ParentView     : this,
                eventChannel   : this.eventChannel
            });
        },

        markEngagedCells: function () {
            var newEngagedCells = [];
            var self = this;

            this.$el.find('.panel').each(function () {
                var xIndex = self.xPoints.indexOf(parseFloat($(this).attr('data-x')));
                var yIndex = self.yPoints.indexOf(parseFloat($(this).attr('data-y')));
                var panelWidth = parseInt($(this).attr('data-width'), 10);
                var panelHeight = parseInt($(this).attr('data-height'), 10);
                var xIndexVal = xIndex + panelWidth;
                var yIndexVal = yIndex + panelHeight;
                var dataIndex = [];
                var i;
                var j;

                for (i = xIndex; i < xIndexVal; i++) {

                    for (j = yIndex; j < yIndexVal; j++) {
                        dataIndex.push(i + '' + j);
                        newEngagedCells.push(i + '' + j);
                    }
                }

                $(this).attr('data-index', dataIndex);
            });

            this.cellsModel.set({engagedCells: (this.limitCells.slice(0)).concat(newEngagedCells)});
        },

        removeAllCharts: function () {

            this.$el.find('.panel').each(function () {
                $(this).remove();
            });

            this.cellsModel.set({engagedCells: []});
            this.limitCells = [];
            this.chartCounter = 0;
        },

        saveDashboard: function () {
            var $thisEl = this.$el;
            var $descriptionHolder = $('#dashboardDescription');
            var description = $descriptionHolder.val();
            var $nameHolder = $('#dashboardName');
            var name = $nameHolder.val();
            var $chart = $thisEl.find('.panel');
            var self = this;
            var model;

            $('#top-bar-createBtn').addClass('hidden');
            $('#top-bar-saveAllBtn').addClass('hidden');
            $('#top-bar-removeAllBtn').addClass('hidden');
            $('#top-bar-moveToEditBtn').removeClass('hidden');
            $thisEl.find('#chartPlace').addClass('disabled');
            $nameHolder.hide();
            $descriptionHolder.hide();
            $('#description').html(description).show();
            $('#name').html(name).show();

            $chart.each(function () {
                var $this = $(this);
                var options = {};
                var firstIndex = $this.attr('data-index').split(',')[0];
                var body = {
                    dataHeight          : parseInt($this.attr('data-height'), 10),
                    dataWidth           : parseInt($this.attr('data-width'), 10),
                    indexY              : parseInt(firstIndex[1], 10),
                    indexX              : parseInt(firstIndex[0], 10),
                    nameId              : 'chart',
                    name                : $this.find('.panel-heading').find('.chartName').text(),
                    type                : $this.attr('data-type'),
                    dataset             : $this.attr('data-dataset'),
                    startDate           : $this.find('.startDateValue').text(),
                    endDate             : $this.find('.endDateValue').text(),
                    dashboard           : self.dashboardModel.attributes[0]._id,
                    dashboardName       : name,
                    dashboardDescription: description
                };

                if ($(this).attr('id').substr(5).length >= 24) {
                    body._id = $(this).attr('id').substr(5);
                }

                if (body._id) {
                    model = self.collection.get(body._id);

                    model.set(body);
                } else {
                    model = new Model();
                    model.set(body);
                }

                options = {
                    success: function (model) {
                        $('#saveBtn').hide();
                        self.collection.set(model, {remove: false});
                    }
                };

                if (body._id) {
                    options.patch = true;
                }

                model.save(model.changed, options);
            });

            $thisEl.find('.removeChart').hide();
            $thisEl.find('.editChart').hide();
            $chart.draggable('destroy');
            $chart.resizable('destroy');

        },

        moveToEdit: function () {
            var $thisEl = this.$el;
            var $li = $thisEl.find('#grid > li');
            var $chart = $('.panel');
            var cell = $li.eq(0);

            $('#top-bar-createBtn').removeClass('hidden');
            $('#top-bar-saveAllBtn').removeClass('hidden');
            $('#top-bar-removeAllBtn').removeClass('hidden');
            $('#top-bar-moveToEditBtn').addClass('hidden');
            $thisEl.find('#chartPlace').removeClass('disabled');
            /* this.collection.remove(this.dashboardModel.attributes[0]._id);
             this.collection.models = [];*/
            $thisEl.find('.removeChart').show();
            $thisEl.find('.editChart').show();
            $('#dashboardName').show();
            $('#dashboardDescription').show();
            $('#description').hide();
            $('#name').hide();

            $(function () {
                $chart.draggable({
                    cursor: 'move'
                });

                $chart.resizable({
                    handles  : 'w, n, e, s',
                    minWidth : 2 * cell.width(),
                    minHeight: cell.height()
                });
            });
        },

        render: function () {
            var margin = 20;
            var self = this;
            var contentHolder;
            var allCellsWidth;
            var $chartArea;
            var cellWidth;
            var padding;
            var $grid;
            var $li;
            var y;
            var x;
            var i;
            var j;

            this.limitCells = [];
            this.xPoints = [];
            this.yPoints = [];

            this.$el.html(this.template({}));

            $grid = this.$el.find('#grid');
            $chartArea = this.$el.find('#chartPlace');
            allCellsWidth = (($chartArea.width() - margin * (1 + parseInt(this.numberOfColumns, 10))) / this.numberOfColumns);
            cellWidth = 100 * allCellsWidth / $chartArea.width();
            contentHolder = $chartArea.offset();

            for (j = 0; j < this.numberOfRows; j++) {

                for (i = 0; i < this.numberOfColumns; i++) {
                    $li = $('<li></li>')
                        .addClass('cell')
                        .attr('data-id', i + '' + j)
                        .css({
                            width : cellWidth + '%',
                            margin: margin / 2
                        });

                    $grid.append($li);
                }
            }

            $chartArea = this.$el.find('#chartPlace');
            padding = $chartArea.css('padding-right');

            if (this.chartCounter === 0) {

                $grid.find('li').each(function () {
                    x = $(this).offset().left - contentHolder.left;
                    y = $(this).offset().top - contentHolder.top;

                    if (!(self.xPoints.indexOf(x) + 1)) {
                        self.xPoints.push(x);
                    }

                    if (!(self.yPoints.indexOf(y) + 1)) {
                        self.yPoints.push(y);
                    }
                });
            }

            for (i = (parseInt(this.numberOfRows, 10) + 1); i--;) {

                this.limitCells.push(this.numberOfColumns + '' + i);
            }

            for (j = this.numberOfColumns; j--;) {

                this.limitCells.push(j + '' + this.numberOfRows);
            }

            this.cellsModel.set({engagedCells: this.limitCells.slice(0)});

            this.restoreCharts();

            this.dateFilterView = new DateFilterView({
                contentType: 'customDashboardCharts',
                el         : this.$el.find('#dateFilterMain')
            });

            this.dateFilterView.on('dateChecked', function () {
                self.trigger('changeDateRange', self.dateFilterView.dateArray);
            });

            this.dateFilterView.checkElement('custom', [this.startDate, this.endDate]);

            return this;
        },

        restoreCharts: function () {
            var models = this.charts;
            var i;

            for (i = 0; i < models.length; i++) {

                this.subview = new ChartView({
                    counter        : 0,
                    numberOfColumns: this.numberOfColumns,
                    numberOfRows   : this.numberOfRows,
                    type           : this.typeId,
                    dataset        : this.datasetId,
                    restoreOptions : models[i],
                    limitCells     : this.limitCells,
                    xPoints        : this.xPoints,
                    yPoints        : this.yPoints,
                    cellsModel     : this.cellsModel,
                    collection     : this.collection,
                    eventChannel   : this.eventChannel
                });

                this.$el.find('#chartPlace').append(this.subview.render().$el);
                eventsBinder.subscribeCustomChartEvents(this.subview, this);
            }

            this.$el.find('.removeChart').hide();
            this.$el.find('.editChart').hide();

            this.markEngagedCells();
        }
    });

    return View;
});
