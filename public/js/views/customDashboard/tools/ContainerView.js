define([
    'Backbone',
    'jQuery',
    'Underscore',
    'text!templates/customDashboard/tools/ContainerTemplate.html',
    'views/customDashboard/tools/ChartView'
], function (Backbone, $, _, template, ChartView) {
    'use strict';

    var View = Backbone.View.extend({

        template: _.template(template),
        tagName : 'div',

        events: {
            resizestop          : 'setSize',
            dragstop            : 'setPosition',
            dragstart           : 'writeCoordinates',
            resizestart         : 'writeDimensions',
            'click .removeChart': 'removeView'
        },

        initialize: function (options) {
            var $grid = $('#grid');
            var $firstLi = $grid.find('li').first();

            this.chartAreaWidth = $('#chartPlace').width();
            this.cellsModel = options.cellsModel;
            this.cellsModel.on('change', this.markCells, this);
            this.options = options;
            this.offset = 2 * parseFloat($firstLi.css('margin'));
            this.offsetPercent = 100 * this.offset / this.chartAreaWidth;
            this.cellWidth = 100 * $firstLi.width() / this.chartAreaWidth;
            this.cellHeight = $firstLi.height();
            this.engagedCells = this.cellsModel.attributes.engagedCells;
            this.limitCells = options.limitCells;
            this.xPoints = options.xPoints;
            this.yPoints = options.yPoints;
            this.numberOfRows = options.numberOfRows;
            this.numberOfColumns = options.numberOfColumns;
            this.startDate = options.startDate;
            this.endDate = options.endDate;
        },

        markCells: function () {
            this.engagedCells = this.cellsModel.attributes.engagedCells;
        },

        setPosition: function (e, ui) {
            var currentX = ui.position.left;
            var currentY = ui.position.top;
            var $element = $(ui.helper[0]);
            var closestX = this.xPoints[0];
            var closestY = this.yPoints[0];
            var i;

            e.stopPropagation();

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

            $(ui.helper[0]).animate({
                top : closestY + 'px',
                left: closestX + 'px'
            }, 100);

            $(ui.helper[0]).attr({
                'data-y': closestY,
                'data-x': closestX
            });

            this.trigger('actionWithChart');
        },

        setSize: function (e, ui) {
            var currentWidth = 100 * ui.size.width / this.chartAreaWidth;
            var currentHeight = ui.size.height;
            var kWidth = Math.round(currentWidth / (this.cellWidth + this.offsetPercent));
            var kHeight = Math.round(currentHeight / (this.cellHeight + this.offset));
            var $element = $(ui.element[0]);
            var type = $element.attr('data-type');
            var dataset = $element.attr('data-dataset');
            var dataWidthToReturn = $element.attr('data-width');
            var dataHeightToReturn = $element.attr('data-height');
            var startDate = $element.find('#startDate').text();
            var endDate = $element.find('#endDate').text();
            var id = $element.attr('id');
            var self = this;
            var newHeight;
            var newWidth;

            e.stopPropagation();
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
            this.widthToReturn = 100 * parseFloat($(ui.helper[0]).css('width')) / this.chartAreaWidth;
            this.heightToReturn = parseFloat($(ui.helper[0]).css('height'));
        },

        removeView: function (e) {
            $(e.target).closest('.panel').remove();

            this.trigger('actionWithChart');
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

        render: function () {
            var name = this.options.name ? this.options.name : 'New Chart ' + this.options.counter;
            var enterPoints = this.selectEnterPoint();
            var id = 'chart_' + this.options.counter;
            var restore = this.options.restoreOptions;
            var dataset = this.options.dataset;
            var type = this.options.type;
            var panelHeight = 2;
            var panelWidth = 2;
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
                this.startDate = restore.startDate;
                this.endDate = restore.endDate;
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
                    minHeight: self.cellHeight
                });
            }

            setTimeout(function () {
                self.renderChart('#' + id, type, dataset);
                self.trigger('actionWithChart');
            }, 100);

            return this;
        },

        renderChart: function (id, type, dataset, startDate, endDate) {
            var startDay = startDate || this.startDate;
            var endDay = endDate || this.endDate;
            
            this.$el.find('svg').remove();

            return new ChartView({
                el        : id,
                type      : type,
                dataSelect: dataset,
                startDate : startDay,
                endDate   : endDay
            });
        }
    });

    return View;
});
