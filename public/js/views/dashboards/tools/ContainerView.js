define([
    'Backbone',
    'jQuery',
    'Underscore',
    'views/Filter/dateFilter',
    'text!templates/dashboards/tools/ContainerTemplate.html',
    'views/dashboards/tools/ChartView',
    'views/dashboards/tools/chartOpenView',
    'moment',
    'helpers/ga',
    'constants/googleAnalytics'
], function (Backbone, $, _, DateFilterView, template, ChartView, ChartOpenView, moment, ga, GA) {
    'use strict';

    var View = Backbone.View.extend({

        template: _.template(template),
        tagName : 'div',

        events: {
            resizestop          : 'setSize',
            dragstop            : 'setPosition',
            dragstart           : 'writeCoordinates',
            resizestart         : 'writeDimensions',
            'click .removeChart': 'removeView',
            'click #viewAll'    : 'renderSaveMsg',
            'click .openViewBtn': 'openChart'
        },

        initialize: function (options) {
            var $grid = $('#grid');
            var $firstLi = $grid.find('li').first();

            this.chartAreaWidth = $('#chartPlace').width();
            this.cellsModel = options.cellsModel;
            this.cellsModel.on('change', this.markCells, this);
            this.options = options;
            var margin = $firstLi.attr('style').split('margin:')[1];
            this.offset = 2 * parseFloat(margin);
            this.offsetPercent = 100 * this.offset / this.chartAreaWidth;
            this.cellWidth = 100 * $firstLi.width() / this.chartAreaWidth;
            this.cellHeight = $firstLi.height();
            this.engagedCells = this.cellsModel.attributes.engagedCells;
            this.limitCells = options.limitCells;
            this.xPoints = options.xPoints;
            this.yPoints = options.yPoints;
            this.numberOfRows = options.numberOfRows;
            this.numberOfColumns = options.numberOfColumns;
            this.startDate = new Date(options.startDate);
            this.endDate = new Date(options.endDate);
            this.collection = options.collection;
            this.eventChannel = options.eventChannel;

            this.listenTo(this.eventChannel, 'changeDate', this.changeDate);

        },

        renderSaveMsg: function (e) {
            if (!$('#chartPlace').hasClass('disabled')) {
                e.stopPropagation();
                e.preventDefault();
                return App.render({type: 'error', message: 'Please, save changes first.'});
            }

            ga && ga.event({
                eventCategory: GA.EVENT_CATEGORIES.USER_ACTION,
                eventAction  : GA.EVENT_ACTIONS.CHARTS_VIEW,
                eventLabel   : GA.EVENT_LABEL.VIEW_ALL,
                eventValue   : GA.EVENTS_VALUES[13],
                fieldsObject : {}
            });
        },

        markCells: function () {
            this.engagedCells = this.cellsModel.attributes.engagedCells;
        },

        changeDateRange: function (dateArray) {
            var id = 'chart_' + this.options.counter;
            var restore = this.options.restoreOptions;
            var dataset = this.$el.attr('data-dataset') || this.options.dataset;
            var type = this.$el.attr('data-type') || this.options.type;

            /*if (restore && !dataset && !type) {
             return App.render({type: 'error', message: 'Please, save changes first'});
             }*/

            if (restore) {
                dataset = dataset || restore.dataset;
                type = type || restore.type;
                id = restore.nameId + restore._id;
                name = restore.name;
            }

            if (!this.filter) {
                this.filter = {};
            }

            this.filter.date = {
                value: dateArray
            };

            this.startDate = dateArray[0];
            this.endDate = dateArray[1];

            this.renderChart('#' + id, type, dataset);

            $('#saveBtn').show();
        },

        setPosition: function (e, ui) {
            var currentX = ui.position.left;
            var currentY = ui.position.top;
            var $element = $(ui.helper[0]);
            var closestX = this.xPoints[0];
            var closestY = this.yPoints[0];
            var i;

            if (e) {
                e.stopPropagation();
            }

            for (i = this.xPoints.length; i--;) {

                if (Math.abs(this.xPoints[i] - currentX) < Math.abs(closestX - currentX)) {
                    closestX = this.xPoints[i];
                }
            }

            for (i = this.yPoints.length; i--;) {

                if (Math.abs(this.yPoints[i] - currentY) < Math.abs(closestY - currentY)) {
                    closestY = this.yPoints[i];
                }
            }

            if (!this.countIndexes(closestX, closestY, $element)) {
                closestY = this.yToReturn;
                closestX = this.xToReturn;
            }

            $element.animate({
                top : closestY + 'px',
                left: closestX + 'px'
            }, 100);

            $element.attr({
                'data-y': closestY,
                'data-x': closestX
            });

            this.trigger('actionWithChart');
        },

        setSize: function (e, ui) {
            var self = this;
            var currentWidth = 100 * ui.size.width / this.chartAreaWidth;
            var currentHeight = ui.size.height;
            var kWidth;
            var kHeight;
            var $element = $(ui.helper[0]);
            var type = $element.attr('data-type');
            var dataset = $element.attr('data-dataset');
            var dataWidthToReturn = $element.attr('data-width');
            var dataHeightToReturn = $element.attr('data-height');
            var startDate = $element.find('#startDate').text();
            var endDate = $element.find('#endDate').text();
            var id = $element.attr('id');
            var originalLeft = ui.originalPosition.left;
            var newLeft = ui.position.left;
            var originalHeight = ui.originalSize.height;
            var newHeight = ui.size.height;
            var newWidth;

            if (newLeft > originalLeft && (currentWidth / (this.cellWidth + this.offsetPercent)) < parseInt(dataWidthToReturn, 10)) {
                kWidth = Math.floor(currentWidth / (this.cellWidth + this.offsetPercent));
                kWidth = kWidth <= 1 ? 2 : kWidth;
            } else {
                kWidth = Math.ceil(currentWidth / (this.cellWidth + this.offsetPercent));
            }

            if (newHeight < originalHeight && Math.round((currentHeight / (this.cellHeight + this.offset))) < parseInt(dataHeightToReturn, 10)) {
                kHeight = Math.floor(currentHeight / (this.cellHeight + this.offset));
                kHeight = kHeight <= 0 ? 1 : kHeight;
            } else {
                kHeight = Math.ceil(currentHeight / (this.cellHeight + this.offset));
            }

            if (e) {
                e.stopPropagation();
            }

            newWidth = kWidth * this.cellWidth + (kWidth - 1) * this.offsetPercent;
            newHeight = kHeight * this.cellHeight + (kHeight - 1) * this.offset;

            if (!this.countIndexes(parseFloat($element.attr('data-x')), parseFloat($element.attr('data-y')), $element, kWidth, kHeight)) {
                newWidth = this.widthToReturn;
                newHeight = this.heightToReturn;
                kWidth = dataWidthToReturn;
                kHeight = dataHeightToReturn;
            }

            $element.attr({
                'data-width' : kWidth,
                'data-height': kHeight
            });

            $element.animate({
                width : newWidth + '%',
                height: newHeight
            }, 100, function () {

                self.renderChart('#' + id, type, dataset, startDate, endDate);
                self.trigger('actionWithChart');

                if (!(self.xPoints.indexOf(ui.position.left) + 1) || !(self.yPoints.indexOf(ui.position.top) + 1)) {
                    self.setPosition(e, ui);
                }
            });
        },

        writeCoordinates: function (e, ui) {
            this.xToReturn = parseFloat(ui.position.left);
            this.yToReturn = parseFloat(ui.position.top);
        },

        writeDimensions: function (e, ui) {
            $(window).unbind('resize');
            this.widthToReturn = 100 * parseFloat($(ui.helper[0]).css('width')) / this.chartAreaWidth;
            this.heightToReturn = parseFloat($(ui.helper[0]).css('height'));
        },

        removeView: function (e) {
            var self = this;
            var panel = $(e.target).closest('.panel');
            var id = panel.attr('id').substr(5);
            var model = this.collection.get(id);

            if (model) {
                model.destroy({
                    success: function () {
                        self.collection.remove(model);
                    },

                    error: function (model, res) {
                        if (res.status === 403) {
                            App.render({
                                type   : 'error',
                                message: 'You do not have permission to perform this action'
                            });
                        }
                    }
                });
            }

            panel.remove();

            this.trigger('actionWithChart');

            ga && ga.event({
                eventCategory: GA.EVENT_CATEGORIES.USER_ACTION,
                eventAction  : GA.EVENT_ACTIONS.CHARTS_VIEW,
                eventLabel   : GA.EVENT_LABEL.REMOVE_CHART,
                eventValue   : GA.EVENTS_VALUES[11],
                fieldsObject : {}
            });
        },

        countIndexes: function (closestX, closestY, $element, kWidth, kHeight) {
            var elIndexes = $element.attr('data-index').split(',');
            var width = kWidth || parseInt($element.attr('data-width'), 10);
            var height = kHeight || parseInt($element.attr('data-height'), 10);
            var xStartVal = this.xPoints.indexOf(closestX);
            var xEndVal = this.xPoints.indexOf(closestX) + width;
            var yStartVal = this.yPoints.indexOf(closestY);
            var yEndVal = this.yPoints.indexOf(closestY) + height;
            var indexes = [];
            var callback;
            var i;
            var j;

            for (i = xStartVal; i < xEndVal; i++) {

                for (j = yStartVal; j < yEndVal; j++) {
                    indexes.push(i + '' + j);
                }
            }

            callback = indexes;

            for (j = indexes.length; j--;) {

                if ((this.engagedCells.indexOf(indexes[j]) + 1) && (!(elIndexes.indexOf(indexes[j]) + 1))) {
                    callback = false;
                    break;
                }
            }

            return callback;
        },

        selectEnterPoint: function () {
            var isFound = false;
            var i = this.options.numberOfColumns - 2;
            var j = this.options.numberOfRows - 2;
            var x0 = 0;
            var y0 = 0;

            if (this.options.type === 'overview') {
                j += 1;
            }

            while (!isFound) {

                if ((!(this.engagedCells.indexOf(x0 + '' + y0) + 1)) && (!(this.engagedCells.indexOf((x0 + 1) + '' + y0) + 1)) &&
                    (!(this.engagedCells.indexOf(x0 + '' + (y0 + 1)) + 1)) && (!(this.engagedCells.indexOf((x0 + 1) + '' + (y0 + 1)) + 1))) {

                    isFound = true;
                } else {

                    if (x0 < (i)) {
                        x0++;
                    } else if (y0 < (j)) {
                        x0 = 0;
                        y0++;
                    } else {
                        // error massage should appear
                        return null;
                    }
                }
            }

            return {
                x: x0,
                y: y0
            };
        },

        openChart: function (e) {
            var $elem = $(e.target);
            var editOptions = {};
            editOptions.startDate = $.trim($elem.closest('.panel').find('.startDateValue').text());
            editOptions.endDate = $.trim($elem.closest('.panel').find('.endDateValue').text());
            editOptions.id = $.trim($elem.closest('.panel').attr('id'));
            editOptions.name = $.trim($elem.closest('.panel').find('.chartName').text());
            editOptions.dataSet = $.trim($elem.closest('.panel').attr('data-dataset'));
            editOptions.type = $.trim($elem.closest('.panel').attr('data-type'));
            editOptions.cellsModel = this.cellsModel;
            editOptions.limitCells = this.limitCells;
            editOptions.xPoints = this.xPoints;
            editOptions.yPoints = this.yPoints;

            return new ChartOpenView({
                editOptions : editOptions,
                eventChannel: this.eventChannel
            });
        },

        render: function () {
            var name = this.options.name ? this.options.name : 'New Chart ' + this.options.counter;
            var enterPoints = this.selectEnterPoint();
            var id = 'chart_' + this.options.counter;
            var restore = this.options.restoreOptions;
            var dataset = this.options.dataset;
            var type = this.options.type;
            var panelHeight = (type === 'overview' || type === 'singleValue') ? 1 : 2;
            var panelWidth = type === 'singleValue' ? 3 : 2;
            var self = this;
            var xEnterPoint;
            var yEnterPoint;
            var style;

            if (!enterPoints) {
                // error massage should appear

                alert('Please clear field 2x2');
                return;
            }

            if (restore) {
                yEnterPoint = this.yPoints[restore.indexY];
                xEnterPoint = this.xPoints[restore.indexX];
                panelHeight = restore.dataHeight;
                panelWidth = restore.dataWidth;
                dataset = restore.dataset;
                type = restore.type;
                id = restore.nameId + restore._id;
                name = restore.name;
                this.startDate = moment(new Date(restore.startDate)).startOf('day');
                this.endDate = moment(new Date(restore.endDate)).endOf('day');
            } else {
                xEnterPoint = this.xPoints[enterPoints.x];
                yEnterPoint = this.yPoints[enterPoints.y];
            }

            style = 'width: ' + (panelWidth * this.cellWidth + (panelWidth - 1) * this.offsetPercent) +
                '%; height: ' + (panelHeight * this.cellHeight + (panelHeight - 1) * this.offset) + 'px; top: ' +
                (yEnterPoint) + 'px; left: ' + xEnterPoint + 'px;position: absolute;';

            this.$el.addClass('panel')
                .attr({
                    'data-width'  : panelWidth,
                    'data-height' : panelHeight,
                    'data-y'      : yEnterPoint,
                    'data-x'      : xEnterPoint,
                    'data-dataset': dataset,
                    'data-type'   : type,
                    id            : id,
                    style         : style
                });

            this.$el.html(this.template({
                type     : type,
                name     : name,
                endDate  : this.endDate,
                startDate: this.startDate
            }));

            if (!restore) {

                this.$el.draggable({
                    cursor: 'move'
                });

                this.$el.resizable({
                    handles  : 'w, n, e, s',
                    minWidth : 2 * self.cellWidth,
                    minHeight: type !== 'overview' ? 2 * self.cellHeight : self.cellHeight
                });
            }

            this.dateFilterView = new DateFilterView({
                contentType: 'customDashboardCharts',
                el         : this.$el.find('#dateFilter')
            });

            this.dateFilterView.on('dateChecked', function () {
                self.trigger('changeDateRange', self.dateFilterView.dateArray);
            });

            this.dateFilterView.checkElement('custom', [this.startDate, this.endDate]);

            setTimeout(function () {
                self.renderChart('#' + id, type, dataset);
                self.trigger('actionWithChart');
            }, 100);

            return this;
        },

        changeDate: function (dates) {
            this.dateFilterView.checkElement('custom', dates);
            this.dateFilterView.trigger('changeDateRange', dates);
        },

        renderChart: function (id, type, dataset, startDate, endDate) {
            var startDay = startDate || this.startDate;
            var endDay = endDate || this.endDate;

            if(type === 'singleValue'){
                this.$el.addClass('small-panel');
            }

            this.$el.find('svg').remove();

            return new ChartView({
                el        : id,
                type      : type,
                dataSelect: dataset,
                startDate : startDay,
                endDate   : endDay,
                cellsModel: this.cellsModel,
                limitCells: this.limitCells,
                selfEl    : this.$el,
                xPoints   : this.xPoints,
                yPoints   : this.yPoints
            });
        }
    });

    return View;
});
