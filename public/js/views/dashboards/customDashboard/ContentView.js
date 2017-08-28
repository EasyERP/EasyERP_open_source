define([
    'Backbone',
    'jQuery',
    'Underscore',
    'text!templates/dashboards/customDashboard/ContentTemplate.html',
    'views/dashboards/tools/ContainerView',
    'constants',
    'constants/googleAnalytics',
    'collections/dashboards/customChartCollection',
    'models/CustomChartModel',
    'models/gridForCustomDashboardModel',
    'views/dashboards/customDashboard/CreateView',
    'views/guideTours/listView',
    'views/topBarViewBase',
    'helpers/eventsBinder',
    'helpers/ga',
    'views/Filter/dateFilter',
    'views/guideTours/guideNotificationView',
    'moment',
    'async'
], function (Backbone, $, _, mainTemplate, ChartView, CONSTANTS, GA, CustomChartCollection, Model, CellsModel, CreateView, GuideTourView, TopBarBase, eventsBinder, ga, DateFilterView, GuideNotify, moment, async) {
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
            this.jsonModel = this.dashboardModel.toJSON();
            this.jsonModel = this.jsonModel && this.jsonModel[0] ? this.jsonModel[0] : this.jsonModel;
            this.numberOfColumns = this.jsonModel.columns;
            this.description = this.jsonModel.description;
            this.numberOfRows = this.jsonModel.rows;
            this.charts = this.jsonModel.charts;
            this._id = this.jsonModel._id;

            /*if (this.content === 'purchaseDashboard') {
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

             this.charts = charts;*/

            this.collection = new CustomChartCollection(this.charts);
            this.CreateView = CreateView;
            this.cellsModel = new CellsModel();
            this.model = new Model();
            this.name = this.jsonModel.name;
            this.cellsModel.set({engagedCells: []});
            this.chartCounter = 0;
            this.limitCells = [];
            this.xPoints = [];
            this.yPoints = [];

            this.startDate = moment(new Date()).startOf('month');
            this.endDate = moment(new Date());

            this.eventChannel = options.eventsChannel;
            _.extend(eventChannel, Backbone.Events);

            this.eventChannel = eventChannel;

            this.windowResize();

            if (App.guide) {
                if (App.notifyView) {
                    App.notifyView.undelegateEvents();
                    App.notifyView.stopListening();
                }
                App.notifyView = new GuideNotify({e: null, data: App.guide});
            }

            // this.render();
        },

        windowResize: function () {
            var self = this;

            $(window).resize(function (e) {
                self.render();

                $('#top-bar-createBtn').addClass('hidden');
                $('#top-bar-saveAllBtn').addClass('hidden');
                $('#top-bar-removeAllBtn').addClass('hidden');
                $('#top-bar-cancelBtn').addClass('hidden');
                $('#top-bar-moveToEditBtn').removeClass('hidden');
            });
        },

        changeCharts: function () {
            this.eventChannel.trigger('changeDate', this.dateFilterView.dateArray);

            $('#saveBtn').show();

            ga && ga.event({
                eventCategory: GA.EVENT_CATEGORIES.USER_ACTION,
                eventAction  : GA.EVENT_ACTIONS.CHARTS_VIEW,
                eventLabel   : GA.EVENT_LABEL.CHANGE_CHARTS_DATE,
                eventValue   : GA.EVENTS_VALUES[14],
                fieldsObject : {}
            });
        },

        onEdit: function (e) {
            var $target = $(e.target).closest('.panel-heading');
            var $chart = $target.closest('.panel');
            var id = $chart.attr('id');
            var name = $chart.find('.chartName').text();
            var dataSet = $chart.attr('data-dataset');
            var type = $chart.attr('data-type');
            var startDate = $chart.find('.startDateValue').text();
            var endDate = $chart.find('.endDateValue').text();

            ga && ga.event({
                eventCategory: GA.EVENT_CATEGORIES.USER_ACTION,
                eventAction  : GA.EVENT_ACTIONS.CHARTS_VIEW,
                eventLabel   : GA.EVENT_LABEL.EDIT_CHART,
                eventValue   : GA.EVENTS_VALUES[12],
                fieldsObject : {}
            });

            return new CreateView({
                editOptions: {
                    id       : '#' + id,
                    name     : name,
                    dataSet  : dataSet,
                    type     : type,
                    startDate: startDate,
                    endDate  : endDate
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
            var self = this;

            this.chartsToDelete = [];

            this.$el.find('.panel').each(function () {
                var _id = $(this).attr('id').substr(5);

                self.chartsToDelete.push(_id);

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

            $('.panel-heading').removeClass('withActions');
            $('#top-bar-createBtn').addClass('hidden');
            $('#top-bar-saveAllBtn').addClass('hidden');
            $('#top-bar-removeAllBtn').addClass('hidden');
            $('#top-bar-cancelBtn').addClass('hidden');
            $('#top-bar-moveToEditBtn').removeClass('hidden');
            $thisEl.find('#chartPlace').addClass('disabled');
            $nameHolder.hide();
            $descriptionHolder.hide();
            $('#description').html(description).show();
            $('#name').html(name).show();
            $('#editDashTitle').addClass('hidden');

            if (!$chart.length) {
                this.dashboardModel.urlRoot = '/dashboards/';
                return this.dashboardModel.save({charts: [], chartsToDelete: this.chartsToDelete}, {
                    patch  : true,
                    success: function () {
                        $thisEl.find('.removeChart').hide();
                        $thisEl.find('.editChart').hide();
                        $thisEl.find('.openViewBtn').removeClass('hidden');
                        $chart.draggable('destroy');
                        $chart.resizable('destroy');

                        self.collection.reset([]);

                        self.windowResize();

                        $(window).trigger('resize');
                    },

                    error: function () {
                        App.render({type: 'error', message: 'Some error'});
                    }
                });
            }

            async.each($chart, function (el, cb) {
                var $this = $(el);
                var model;
                var options = {};
                var firstIndex = $this.attr('data-index').split(',')[0];
                var body = {
                    dataHeight: parseInt($this.attr('data-height'), 10),
                    dataWidth : parseInt($this.attr('data-width'), 10),
                    indexY    : parseInt(firstIndex[1], 10),
                    indexX    : parseInt(firstIndex[0], 10),
                    nameId    : 'chart',
                    name      : $this.find('.panel-heading').find('.chartName').text(),
                    type      : $this.attr('data-type'),
                    dataset   : $this.attr('data-dataset'),
                    startDate : $this.find('.startDateValue').text(),
                    endDate   : $this.find('.endDateValue').text(),
                    dashboard : self.jsonModel._id
                    /*dashboardName       : name,
                     dashboardDescription: description*/
                };

                if ($this.attr('id').substr(5).length >= 24) {
                    body._id = $this.attr('id').substr(5);
                }

                if (body._id) {
                    model = self.collection.get(body._id);

                    model.set(body);
                } else {
                    model = new Model();
                    model.set(body);
                    $this.attr('id', 'chart' + model.cid);
                }

                options = {
                    success: function () {
                        $('#saveBtn').hide();
                        self.collection.set(model, {remove: false});
                        cb();
                    },

                    error: function () {
                        cb();
                    }
                };

                if (body._id) {
                    options.patch = true;
                }

                model.save(model.changed, options);

                if (body._id && !Object.keys(model.changed).length) {
                    cb();
                }
            }, function () {

                $thisEl.find('.removeChart').hide();
                $thisEl.find('.editChart').hide();
                $thisEl.find('.openViewBtn').removeClass('hidden');
                $chart.draggable('destroy');
                $chart.resizable('destroy');

                self.windowResize();

                $(window).trigger('resize');
            });
        },

        cancelChanges: function () {
            Backbone.history.fragment = '';
            Backbone.history.navigate(window.location.hash, {trigger: true});
        },

        moveToEdit: function () {
            var $thisEl = this.$el;
            var $li = $thisEl.find('#grid > li');
            var $chart = $('.panel');
            var cell = $li.eq(0);

            $('.panel-heading').addClass('withActions');
            $('#top-bar-createBtn').removeClass('hidden');
            $('#top-bar-saveAllBtn').removeClass('hidden');
            $('#top-bar-removeAllBtn').removeClass('hidden');
            $('#top-bar-cancelBtn').removeClass('hidden');
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
            $('#editDashTitle').removeClass('hidden');
            $thisEl.find('.openViewBtn').addClass('hidden');

            $(function () {
                $chart.draggable({
                    cursor: 'move'
                });

                $chart.resizable({
                    handles  : 'w, n, e, s',
                    minWidth : 2 * cell.width(),
                    minHeight: cell.attr('data-type') !== 'overview' ? 2 * cell.height() : cell.height()
                });
            });
        },

        renderGuideList: function () {

            if (this.guideTours) {
                this.guideTours.undelegateEvents();
                this.guideTours.stopListening();
            }

            this.guideTours = new GuideTourView();
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
            var guideTours = false;

            this.limitCells = [];
            this.xPoints = [];
            this.yPoints = [];

            this.$el.html(this.template({guideTours: guideTours}));
            this.$el.find('._openViewBtn').removeClass('hidden');

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

            for (i = (parseInt(this.numberOfRows, 10) + 1); i--;) {

                this.limitCells.push(this.numberOfColumns + '' + i);
            }

            for (j = this.numberOfColumns; j--;) {

                this.limitCells.push(j + '' + this.numberOfRows);
            }

            this.cellsModel.set({engagedCells: this.limitCells.slice(0)});

            this.restoreCharts();

            this.dateFilterView = new DateFilterView({
                contentType: 'customDashboard',
                el         : this.$el.find('#dateFilterMain')
            });

            this.dateFilterView.on('dateChecked', function () {
                self.trigger('changeDateRange', self.dateFilterView.dateArray);
            });

            this.dateFilterView.checkElement('custom', [this.startDate, this.endDate]);

            if (this._id === '582bfabf5a43a4bc2524bf09') {
                $('#top-bar-moveToEditBtn').hide();
            }

            return this;
        },

        restoreCharts: function () {
            var models = this.collection.toJSON();
            var i;

            for (i = 0; i < models.length; i++) {

                this.subview = new ChartView({
                    counter        : 0,
                    numberOfColumns: this.numberOfColumns,
                    numberOfRows   : this.numberOfRows,
                    type           : this.typeId ? this.typeId : models[i].type,
                    dataset        : this.datasetId ? this.datasetId : models[i].dataset,
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
            this.$el.find('._openViewBtn').removeClass('hidden');

            this.markEngagedCells();
        }
    });

    return View;
});
