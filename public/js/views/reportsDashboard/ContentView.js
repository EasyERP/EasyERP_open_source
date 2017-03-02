define([
    'Backbone',
    'jQuery',
    'Underscore',
    'async',
    'views/Filter/dateFilter',
    'text!templates/reportsDashboard/DashboardTemplate.html',
    'custom',
    'collections/Filter/filterCollection',
    'collections/Workflows/WorkflowsCollection',
    'collections/Opportunities/OpportunitiesCollection',
    'collections/Jobs/filterCollection',
    'd3',
    'common',
    'dataService',
    'helpers',
    'helpers/getDateHelper',
    'moment',
    'topojson'
], function (Backbone, $, _, async, DateFilterView, DashboardTemplate, Custom, filterValuesCollection,
             workflowsCollection, OpportunitiesCollection, LeadsCollection, d3,
             common, dataService, helpers, getDateHelper, moment, topojson) {

    var ContentView = Backbone.View.extend({
        contentType: 'Dashboard',
        actionType : 'Content',
        template   : _.template(DashboardTemplate),
        el         : '#content-holder',

        initialize: function (options) {
            var self = this;
            this.leadsCollection = new LeadsCollection();
            this.startTime = options.startTime;
            this.leadsByNamesChartType = 'leadsBySales';
            this.startTime = new Date();
            this.buildTime = 0;
            /*this.dateRange = {
                date                  : 30,
                source                : 30,
                opportunitie          : 30,
                sale                  : 7,
                opportunitieConversion: 90,
                winLost               : 30,
                salesByCountry        : 30
            };*/

            this.dateItem = {
                Leads      : 'createdBy',
                LeadsByName: 'leadsBySales'
            };

            this.dataForLeadsChart = [];
            this.numberToDate = {};
            this.source = null;
            this.resizeHandler = _.debounce(this.resizeHandler, 500);
            this.resizeHandler = this.resizeHandler.bind(this);
            this.render();
        },

        events: {
            /*'click .dateRange'          : 'toggleDateRange',*/
            'click .choseDateItem .item': 'newItem',
            /*'click .dateRangeLeadsByName'      : 'toggleDateRange',
             'click .dateRangeLeadsBySale'      : 'toggleDateRange',
             'click .dateRangeLeadsBySource'    : 'toggleDateRange',
             'click .dateRangeLeads'            : 'toggleDateRange',
             'click #updateDate'                : 'changeDateRange',
             'click #updateDateLeadsByName'     : 'changeLeadsDateRangeByName',
             'click #updateDateLeadsBySale'     : 'changeLeadsDateRangeBySale',
             'click #updateDateLeads'           : 'changeLeadsDateRange',
             'click #updateDateLeadsBySource'   : 'changeLeadsDateRangeBySource',
             // 'click li.filterValues:not(#custom, #customLeads, #customLeadsByName, #customLeadsBySale, #customLeadsBySource)': 'setDateRange',
             'click .choseDateRange .item'      : 'newRange',
             'click .chart-tabs a'       : 'changeTab',
             'click #custom'                    : 'showDatePickers',
             'click #customLeadsByName'         : 'showDatePickersLeadsByName',
             'click #customLeadsBySale'         : 'showDatePickersLeadsBySale',
             'click #customLeadsBySource'       : 'showDatePickersLeadsBySource',
             'click #customLeads'               : 'showDatePickersLeads',
             'click #cancelBtn'                 : 'cancel',
             'click #cancelBtnLeadsByName'      : 'cancel',
             'click #cancelBtnLeadsBySale'      : 'cancel',
             'click #cancelBtnLeadsBySource'    : 'cancel',
             'click #cancelBtnLeads'            : 'cancel',
             'click .dropDownDateRangeContainer': 'toggleDateFilter'*/
        },

        /*toggleDateFilter: function (e) {
         var $target = $(e.target);
         if ($target.hasClass('active')) {

         e.stopPropagation();
         e.preventDefault();
         }

         $target.closest('.dropDownDateRangeContainer').find('.dropDownDateRange').toggleClass('open');
         },*/

        toggleDateRange: function (e, type) {
            var ul = e ? $(e.target).closest('ul') : this.$el.find('.dateFilter' + type);

            if (!ul.hasClass('frameDetail')) {
                ul.find('.frameDetail').toggleClass('hidden');
            } else {
                ul.toggleClass('hidden');
            }
        },

        /* changeClass: function ($target) {
         if ($target.text() !== "Custom Dates") {
         $target.toggleClass('checkedValue');
         return;
         }

         $target.toggleClass('checkedArrow')
         },*/

        /*changeDateRange: function (e, type) {
         var self = this;
         var dateFilter;
         var startDate;
         var endDate;
         var startTime;
         var endTime;

         type = type || '';

         dateFilter = e ? $(e.target).closest('ul.dateFilter' + type) : this.$el.find('ul.dateFilter' + type);
         startDate = dateFilter.find('#startDate' + type);
         endDate = dateFilter.find('#endDate' + type);
         startTime = dateFilter.find('#startTime' + type);
         endTime = dateFilter.find('#endTime' + type);
         startDate = startDate.val();
         endDate = endDate.val();

         if (new Date(startDate) > new Date(endDate)) {
         return App.render({
         type   : 'error',
         message: 'StartDate can\'t be greater than EndDate'
         });
         }

         startTime.text(startDate);
         endTime.text(endDate);

         switch (type) {
         case 'Leads':
         this.startDateLeads = startDate;
         this.endDateLeads = endDate;
         this.renderLeads();
         this.toggleDateRange(null, type);
         break;
         case 'LeadsByName':
         this.startDateLeadsByName = startDate;
         this.endDateLeadsByName = endDate;
         this.getDataForLeadsChart();
         this.toggleDateRange(null, type);
         break;
         case 'LeadsBySale':
         this.startDateLeadsBySale = startDate;
         this.endDateLeadsBySale = endDate;
         this.renderPopulateByType(self, 'sale', startDate, endDate);
         this.toggleDateRange(null, type);
         break;
         case 'LeadsBySource':
         this.startDateLeadsBySource = startDate;
         this.endDateLeadsBySource = endDate;
         this.renderPopulateByType(self, 'source', startDate, endDate);
         this.toggleDateRange(null, type);
         break;
         default:
         this.startDate = startDate;
         this.endDate = endDate;
         this.toggleDateRange(null, '');
         this.renderSalesByCountry();
         break;
         }

         this.trigger('changeDateRange');
         },

         changeLeadsDateRangeByName: function (e) {
         this.changeDateRange(null, 'LeadsByName');
         },

         changeLeadsDateRangeBySale: function (e) {
         this.changeDateRange(null, 'LeadsBySale');
         },

         changeLeadsDateRangeBySource: function (e) {
         this.changeDateRange(null, 'LeadsBySource');
         },

         changeLeadsDateRange: function (e) {
         this.changeDateRange(null, 'Leads');
         },*/

        /* setDateRange: function (e) {
         /!*var date = moment(new Date());*!/
         var $target = $(e.target);
         /!*var id = $target.attr('id');*!/
         var period = $target.attr('data-name');
         var dateObj;
         var type = $target.attr('data-type');
         /!*var quarter;*!/
         var startDate;
         var endDate;

         switch (type) {
         case 'leads':
         type = 'Leads';
         break;
         case 'leadsName':
         type = 'LeadsByName';
         break;
         case 'leadsSale':
         type = 'LeadsBySale';
         break;
         case 'leadsSource':
         type = 'LeadsBySource';
         break;
         default:
         type = '';
         }

         this.$el.find('.customTime' + type).addClass('hidden');
         this.removeAllChecked(type);
         $target.toggleClass('checkedValue');

         dateObj = getDateHelper.getDate(period);

         if (!dateObj) {
         return false;
         }
         startDate = dateObj.value && dateObj.value[0] || null;
         endDate = dateObj.value && dateObj.value[1] || null;

         /!*switch (id) {
         case 'thisMonth' + type:
         startDate = date.startOf('month');
         endDate = moment(startDate).endOf('month');
         break;
         case 'thisYear' + type:
         startDate = date.startOf('year');
         endDate = moment(startDate).endOf('year');
         break;
         case 'lastMonth' + type:
         startDate = date.subtract(1, 'month').startOf('month');
         endDate = moment(startDate).endOf('month');
         break;
         case 'lastQuarter' + type:
         quarter = date.quarter();
         startDate = date.quarter(quarter - 1).startOf('quarter');
         endDate = moment(startDate).endOf('quarter');
         break;
         case 'lastYear' + type:
         startDate = date.subtract(1, 'year').startOf('year');
         endDate = moment(startDate).endOf('year');
         break;
         default:
         break;
         }*!/

         this.$el.find('#startDate' + type).datepicker('setDate', new Date(startDate));
         this.$el.find('#endDate' + type).datepicker('setDate', new Date(endDate));
         this.changeDateRange(null, type);
         },*/

        /*newRange: function (e) {
         var $target = $(e.target);
         var $parent = $target.closest('.choseDateRange');
         var type = $parent.attr('data-type');

         if ($target.hasClass('active')) {
         return;
         }

         $target.parent().find('.active').removeClass('active');
         $target.addClass('active');
         this.dateRange[type] = $(e.target).data('day');

         switch (type) {
         case 'source':
         this.renderPopulateByType(this, type);
         break;
         case 'sale':
         this.renderPopulateByType(this, type);
         break;
         case 'opportunitie':
         this.renderOpportunities();
         break;
         case 'opportunitieConversion':
         this.renderOpportunitiesConversion();
         break;
         case 'winLost':
         this.renderOpportunitiesWinAndLost();
         break;
         // skip default;
         }
         },*/

        newItem: function (e) {
            var $target = $(e.target);
            var $parent = $(e.target).closest('.choseDateItem');
            var type = $parent.attr('data-type');

            if ($target.hasClass('active')) {
                return;
            }

            $target.parent().find('.active').removeClass('active');
            $target.addClass('active');
            this.dateItem[type] = $(e.target).data('item');

            switch (type) {
                /*case 'source':
                 this.renderPopulateByType(this, type);
                 break;
                 case 'sale':
                 this.renderPopulateByType(this, type);
                 break;
                 case 'opportunitie':
                 this.renderOpportunities();
                 break;
                 case 'winLost':
                 this.renderOpportunitiesWinAndLost();
                 break;*/
                case 'LeadsByName':
                    this.renderLeadsByName(type + 'DateFilterView');
                    break;
                case 'Leads':
                    this.renderLeads(type + 'DateFilterView');
                    break;
                // skip default;
            }
        },

        /*showDatePickers: function (e) {
         var $target = $(e.target);
         this.removeAllChecked();

         this.changeClass($target);
         this.$el.find('.customTime').toggleClass('hidden');
         },

         showDatePickersLeadsByName: function (e) {
         var $target = $(e.target);
         this.removeAllChecked('LeadsByName');

         this.changeClass($target);
         this.$el.find('.customTimeLeadsByName').toggleClass('hidden');
         },

         showDatePickersLeadsBySale: function (e) {
         var $target = $(e.target);
         this.removeAllChecked('LeadsBySale');

         this.changeClass($target);
         this.$el.find('.customTimeLeadsBySale').toggleClass('hidden');
         },

         showDatePickersLeadsBySource: function (e) {
         var $target = $(e.target);
         this.removeAllChecked('LeadsBySource');

         this.changeClass($target);
         this.$el.find('.customTimeLeadsBySource').toggleClass('hidden');
         },

         showDatePickersLeads: function (e) {
         var $target = $(e.target);
         this.removeAllChecked('Leads');

         this.changeClass($target);
         this.$el.find('.customTimeLeads').toggleClass('hidden');
         },*/

        /*cancel: function (e) {
         var targetEl = $(e.target);
         var ul = targetEl.closest('ul.frameDetail');

         ul.addClass('hidden');
         },*/

        /*removeAllChecked: function (type) {
         var filter = this.$el.find('ul.dateFilter' + type);
         var li = filter.find('li');

         li.removeClass('checkedValue');
         },*/

        /*getDateFromDayOfYear: function (index) {
         // return dateFormat(new Date(this.numberToDate[index]).toString('MMMM ,yyyy'), 'mmmm dd, yyyy');
         return moment(new Date(this.numberToDate[index])).format('MMM DD, YYYY');
         },*/

        /*changeTab: function (e) {
         var $tab = $('.chart-tabs-items');
         var n;

         $(e.target).closest('.chart-tabs').find('a.active').removeClass('active');
         $(e.target).addClass('active');
         n = $(e.target).parents('.chart-tabs').find('li').index($(e.target).parent());
         $tab.find('.chart-tabs-item.active').removeClass('active');
         $tab.find('.chart-tabs-item').eq(n).addClass('active');
         },*/

        /*getDay: function (index) {
         switch (index) {
         case 1:
         return 'Monday';
         case 2:
         return 'Tuesday';
         case 3:
         return 'Wednesday';
         case 4:
         return 'Thursday';
         case 5:
         return 'Friday';
         case 6:
         return 'Saturday';
         case 7:
         return 'Sunday';
         // skip default;
         }
         },

         getMonth: function (index) {
         switch (index) {
         case 1:
         return 'January';
         case 2:
         return 'February';
         case 3:
         return 'March';
         case 4:
         return 'April';
         case 5:
         return 'May';
         case 6:
         return 'June';
         case 7:
         return 'July';
         case 8:
         return 'August';
         case 9:
         return 'September';
         case 10:
         return 'October';
         case 11:
         return 'November';
         case 12:
         return 'December';
         // skip default;
         }
         },*/

        renderDateFilters: function (options) {
            var self = this;
            var _opts = options || {};
            var contentTypeArr = Object.keys(_opts);

            async.map(contentTypeArr, function (contentType) {
                var viewName = contentType + 'DateFilterView';

                self[viewName] = new DateFilterView({
                    contentType: contentType,
                    type       : _opts[contentType].type,
                    el         : self.$el.find('#' + contentType + 'DateFilter')
                });
                self[viewName].on('dateChecked', function () {
                    if (contentType !== 'LeadsBySale') {
                        self['render' + contentType](viewName);
                    } else {
                        var typeArray = ['source', 'sale'];

                        async.eachSeries(typeArray, function (type, eachCallback) {
                            return self['render' + contentType](viewName, type, eachCallback);
                        }, function (err) {
                            if (err) {
                                App.render(err);
                            }
                        });
                    }
                });
                self[viewName].checkElement(_opts[contentType].defaultValue);
            });
        },

        render: function () {
            var date = moment(new Date());
            var self = this;
            var optionsForDateFilter = {
                'LeadsBySale': {
                    defaultValue: 'thisMonth',
                    type        : 'date'
                },

                'Leads': {
                    defaultValue: 'thisMonth',
                    type        : 'date'
                },

                'LeadsByName': {
                    defaultValue: 'thisMonth',
                    type        : 'date'
                },

                'SalesByCountry': {
                    defaultValue: 'thisMonth',
                    type        : 'date'
                }
            };

            /*this.startDate = (date.startOf('month')).format('D MMM, YYYY');
             this.endDate = (moment(new Date(this.startDate)).endOf('month')).format('D MMM, YYYY');
             this.startDateLeadsByName = this.startDate;
             this.endDateLeadsByName = this.endDate;
             this.startDateLeadsBySale = this.startDate;
             this.endDateLeadsBySale = this.endDate;
             this.startDateLeadsBySource = this.startDate;
             this.endDateLeadsBySource = this.endDate;
             this.startDateLeads = this.startDate;
             this.endDateLeads = this.endDate;*/

            this.$el.html(this.template({
                startDate             : this.startDate,
                endDate               : this.endDate,
                startDateLeads        : this.startDateLeads,
                endDateLeads          : this.endDateLeads,
                startDateLeadsByNames : this.startDateLeadsByName,
                endDateLeadsByNames   : this.endDateLeadsByName,
                startDateLeadsBySale  : this.startDateLeadsBySale,
                endDateLeadsBySale    : this.endDateLeadsBySale,
                startDateLeadsBySource: this.startDateLeadsBySource,
                endDateLeadsBySource  : this.endDateLeadsBySource
            }));

            /*this.bindDatePickers(this.startDate, this.endDate, '');
             this.bindDatePickers(this.startDateLeadsByName, this.endDateLeadsByName, 'LeadsByName');
             this.bindDatePickers(this.startDateLeads, this.endDateLeads, 'Leads');
             this.bindDatePickers(this.startDateLeads, this.endDateLeads, 'LeadsBySale');
             this.bindDatePickers(this.startDateLeads, this.endDateLeads, 'LeadsBySource');*/
            /*this.rendersalesByCountry();
             this.renderPopulateByType(self, 'source', this.startDateLeadsBySource, this.endDateLeadsBySource);
             this.renderPopulateByType(self, 'sale', this.startDateLeadsBySale, this.endDateLeadsBySale);

             */// this.renderLeadsChart();

            /*this.getDataForLeadsChart();*/

            this.renderDateFilters(optionsForDateFilter);

            this.$el.on('click', function (e) {
                var $target = $(e.target);
                var $dropDown = $target.closest('._filterDropDownWrap');

                var $allDropDowns = self.$el.find('._filterDropDownWrap');

                if ($dropDown.length) {
                    $allDropDowns = $allDropDowns.not($dropDown);
                }

                $allDropDowns
                    .find('.frameDetail')
                    .addClass('hidden');

            });

            this.$el.append("<div id='timeRecivingDataFromServer'>Created in " + (new Date() - this.startTime) + ' ms</div>');

            return this;
        },

        /*bindDatePickers: function (startDate, endDate, type) {
         var self = this;
         var endDatePicker;
         var endDateValue;

         this.$el.find('#startDate' + type)
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
         this.$endDate = this.$el.find('#endDate' + type)
         .datepicker({
         dateFormat : 'd M, yy',
         changeMonth: true,
         changeYear : true,
         defaultDate: endDate
         })
         .datepicker('setDate', endDate);
         },*/

        /*getDataForLeadsChart: function () {
         var self = this;
         var filter = {
         date: {
         value: [new Date(this.startDateLeadsByName), new Date(this.endDateLeadsByName)]
         }
         };

         common.getLeads(filter, function (data) {

         self.dataForLeadsChart = data;

         self.renderLeadsByName();
         });

         },*/

        renderLeadsByName: function (viewName) {
            var dateArray = this[viewName].dateArray;
            var $wrapper = $('#content-holder');
            var self = this;
            var filter = {
                date: {
                    value: dateArray
                }
            };
            var padding = 15;
            var offset = 2;
            var barChart;
            var gradient;
            var height;
            var margin;
            var xScale;
            var yScale;
            var xAxis;
            var yAxis;
            var width;
            var rect;
            var max;

            d3.selectAll('svg.leadsByNameBarChart > *').remove();

            common.getLeads(filter, function (data) {
                data = data[self.dateItem.LeadsByName];
                margin = {top: 50, right: 150, bottom: 80, left: 150};
                width = ($wrapper.width()) / 2;
                height = data.length * 20;

                barChart = d3.select('svg.leadsByNameBarChart')
                    .attr({
                        'width' : width - margin.left - margin.right,
                        'height': height + margin.bottom + margin.top
                    })
                    .append('g')
                    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

                max = d3.max(data, function (d) {
                    return d.count;
                });

                max = Math.ceil(max / 10) * 10;

                xScale = d3.scale.linear()
                    .domain([0, max])
                    .range([0, (width - margin.left)]);

                yScale = d3.scale.linear()
                    .domain([0, data.length])
                    .range([0, height]);

                rect = height / (data.length);

                gradient = d3.select('svg.leadsByNameBarChart').append("linearGradient")
                    .attr({
                        'y1'           : 0,
                        'y2'           : 0,
                        'x1'           : '0',
                        'x2'           : width - 30,
                        'id'           : 'gradientBarForLeads',
                        'gradientUnits': 'userSpaceOnUse'
                    });

                gradient
                    .append('stop')
                    .attr({
                        'offset'    : '0',
                        'stop-color': '#FFA17F'
                    });

                gradient
                    .append('stop')
                    .attr({
                        'offset'    : '0.5',
                        'stop-color': '#ACC7F2'
                    });

                barChart.selectAll('rect')
                    .data(data)
                    .enter()
                    .append('rect')
                    .attr({
                        x     : function () {
                            return 0;
                        },
                        y     : function (d, i) {
                            return yScale(i) + offset;
                        },
                        width : function (d) {
                            return xScale(d.count);
                        },
                        height: rect - 2 * offset,
                        fill  : 'url(#gradientBarForLeads)'
                    });

                xAxis = d3.svg.axis()
                    .scale(xScale)
                    .orient('bottom');

                yAxis = d3.svg.axis()
                    .scale(yScale)
                    .orient('left')
                    .tickSize(0)
                    .tickPadding(offset)
                    .tickFormat(function (d, i) {
                        return data[i].salesPerson;
                    })
                    .tickValues(d3.range(data.length));

                barChart.append('g')
                    .attr({
                        'class'    : 'x axis',
                        'transform': 'translate(0,' + height + ')'
                    })
                    .call(xAxis);

                barChart.append('g')
                    .attr({
                        'class'    : 'y axis',
                        'transform': 'translate(0,' + (padding - 2 * offset) + ')'
                    })
                    .call(yAxis);

                barChart.selectAll('.x .tick line')
                    .attr({
                        'y2'   : -height,
                        'style': 'stroke: #f2f2f2'
                    });

            });
        },

        renderLeads: function (viewName) {
            var dateArray = this[viewName].dateArray;
            var $wrapper = $('#content-holder');
            var filter = {
                date: {
                    value: dateArray
                }
            };
            var verticalBarSpacing = 1;
            var percentData = [];
            var percent = {};
            var padding = 40;
            var self = this;
            var offset = 0;
            var value = 0;
            var rectWidth;
            var daysCount;
            var barChart;
            var baseRect;
            var yScale2;
            var yOffset;
            var height;
            var margin;
            var xScale;
            var yScale;
            var yAxis2;
            var xAxis;
            var yAxis;
            var width;
            var month;
            var data2;
            var data1;
            var date;
            var base;
            var year;
            var keys;
            var line;
            var max2;
            var max1;
            var day;
            var max;
            var i;
            var j;

            $('svg.leadsBarChart').empty();

            common.getLeads(filter, function (data) {

                // daysCount = Math.floor((dateArray[1] - dateArray[0]) / 24 / 60 / 60 / 1000);
                daysCount = Math.floor(moment.duration(dateArray[1] - dateArray[0]).asDays());

                data2 = _.filter(data[self.dateItem.Leads], function (item) {
                    return item.isOpp;
                });

                data1 = _.filter(data[self.dateItem.Leads], function (item) {
                    return !item.isOpp;
                });

                max1 = d3.max(data1, function (d) {
                        return d.count;
                    }) || 0;

                max2 = d3.max(data2, function (d) {
                        return d.count;
                    }) || 0;

                max = Math.ceil((max1 + max2) / 10) * 10;

                margin = {
                    top   : 50,
                    right : 150,
                    bottom: 80,
                    left  : 80
                };

                width = ($wrapper.width()) / 2 - margin.left - margin.right;
                height = $wrapper.width() / 4;

                barChart = d3.select('svg.leadsBarChart')
                    .attr({
                        'width' : width,
                        'height': height + margin.top + margin.bottom
                    })
                    .append('g')
                    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

                xScale = d3.time.scale()
                    .domain(dateArray)
                    .range([0, width - margin.left * 1.5]);

                yScale = d3.scale.linear()
                    .domain([0, max])
                    .range([0, height]);

                yScale2 = d3.scale.linear()
                    .domain([0, 100])
                    .range([height, 0]);

                xAxis = d3.svg.axis()
                    .scale(xScale)
                    .orient('bottom')
                    .tickFormat(d3.time.format("%b %d"));

                yAxis = d3.svg.axis()
                    .scale(yScale)
                    .orient('left')
                    .ticks(10)
                    .tickSize(0)
                    .tickPadding(padding)
                    .tickFormat(function (d, i) {
                        return Math.abs(d - max);
                    });

                yAxis2 = d3.svg.axis()
                    .scale(yScale2)
                    .orient('right')
                    .tickSize(0)
                    .tickPadding(padding)
                    .tickFormat(function (d, i) {
                        return d + '%';
                    });

                rectWidth = width / daysCount;

                if ((rectWidth - 4) > 0) {
                    offset = 2;
                    rectWidth = rectWidth - 2 * offset;
                }

                barChart.selectAll('.rect1')
                    .data(data1)
                    .enter()
                    .append('rect')
                    .attr({
                        x          : function (d) {
                            date = (d._id).toString();
                            year = date.substr(0, 4);
                            month = date.substr(4, 2);
                            day = date.substr(6, 2);

                            return xScale(new Date(year + '-' + month + '-' + day));
                        },
                        y          : function (d) {
                            return height - yScale(d.count)
                        },
                        width      : rectWidth,
                        height     : function (d) {
                            return yScale(d.count)
                        },
                        fill       : '#FEA281',
                        class      : function (d) {
                            return 'total_' + d._id;
                        },
                        'transform': 'translate(' + (-(rectWidth / 2 + 2 * offset)) + ',0)'
                    });

                barChart.selectAll('.rect2')
                    .data(data2)
                    .enter()
                    .append('rect')
                    .attr({
                        x          : function (d) {
                            date = (d._id).toString();
                            year = date.substr(0, 4);
                            month = date.substr(4, 2);
                            day = date.substr(6, 2);

                            return xScale(new Date(year + '-' + month + '-' + day));
                        },
                        y          : function (d, i) {

                            baseRect = d3.select('rect.total_' + d._id);

                            if (baseRect[0][0]) {
                                yOffset = baseRect.attr('y') - verticalBarSpacing;
                            } else {
                                yOffset = height;
                            }

                            return yOffset - yScale(d.count)
                        },
                        width      : rectWidth,
                        height     : function (d) {

                            baseRect = d3.select('rect.total_' + d._id);

                            if (baseRect[0][0]) {
                                return yScale(d.count) - 2 * verticalBarSpacing;
                            }

                            return yScale(d.count);
                        },
                        fill       : '#ACC7F2',
                        'transform': 'translate(' + (-(rectWidth / 2 + 2 * offset)) + ',0)'
                    });

                for (i = 0; i < data1.length; i++) {
                    percent[data1[i]._id] = 0;
                }

                for (i = data2.length; i--;) {

                    base = data2[i].count;

                    for (j = data1.length; j--;) {

                        if (data1[j]._id === data2[i]._id) {
                            base = data1[j].count;

                            break;
                        }
                    }

                    value = data2[i].count / base;

                    if (value > 1) {
                        value = 1;
                    }

                    percent[data2[i]._id] = value;
                }

                keys = Object.keys(percent).sort();

                for (i = 0; i < keys.length; i++) {
                    percentData.push({
                        date : keys[i],
                        value: percent[keys[i]]
                    })
                }

                line = d3.svg.line()
                    .x(function (d) {
                        var date = d.date;
                        var year = date.substr(0, 4);
                        var month = date.substr(4, 2);
                        var day = date.substr(6, 2);

                        return xScale(new Date(year + '-' + month + '-' + day)) - 2 * offset || 0;
                    })
                    .y(function (d) {
                        return yScale2(d.value * 100);
                    })
                    .interpolate('monotone');

                barChart.append('path')
                    .datum(percentData)
                    .attr({
                        'class': 'line1',
                        'd'    : line,
                        'fill' : 'none'
                    })
                    .style('stroke', '#ACC7F2')
                    .style('stroke-width', 2);

                barChart.selectAll('.circle')
                    .data(percentData)
                    .enter().append('circle')
                    .attr({
                        'class'       : 'circle',
                        'cx'          : function (d) {
                            var date = d.date;
                            var year = date.substr(0, 4);
                            var month = date.substr(4, 2);
                            var day = date.substr(6, 2);
                            return xScale(new Date(year + '-' + month + '-' + day)) - 2 * offset || 0;
                        },
                        'cy'          : function (d) {
                            return yScale2(d.value * 100);
                        },
                        'r'           : 3,
                        'fill'        : '#ACC7F2',
                        'stroke'      : '#fff',
                        'stroke-width': '1'
                    });

                barChart.append('g')
                    .attr({
                        'class'    : 'x axis',
                        'transform': 'translate(0,' + height + ')'
                    })
                    .call(xAxis);

                barChart.append('g')
                    .attr({
                        'class': 'y axis'
                    })
                    .call(yAxis)
                    .select('path.domain')
                    .attr({
                        'style': 'display: none'
                    });

                barChart.append('g')
                    .attr({
                        'class'    : 'y2 axis2',
                        'transform': 'translate(' + (width - margin.right) + ',0)'
                    })
                    .call(yAxis2)
                    .select('path.domain')
                    .attr({
                        'style': 'display: none'
                    });

                barChart.selectAll('.y .tick line')
                    .attr({
                        'x2'       : function (d) {
                            return width - margin.right + 1.4 * padding;
                        },
                        'stroke'   : '#f2f2f2',
                        'transform': 'translate(' + (-0.7 * padding) + ',0)'
                    });

                barChart.selectAll('.x text')
                    .attr('transform', "translate(-23,20) rotate(-45)")
            });
        },

        renderLeadsBySale: function (viewName, type, cb) {
            var dateArray = this[viewName].dateArray;
            var filter = {
                date: {
                    value: dateArray
                }
            };
            var chartClass = '.' + type + 'sChart';
            var self = this;
            var margin = {
                top   : 50,
                right : 50,
                bottom: 80,
                left  : 150
            };
            var maxOpportunities;
            var uniqueNames;
            var scaleArray;
            var gradient2;
            var gradient;
            var maxLeads;
            var height;
            var width;
            var xAxis;
            var yAxis;
            var chart;
            var data1;
            var data2;
            var y;
            var x;

            function uniqueVal(value, index, self) {
                return self.indexOf(value) === index;
            }

            $(chartClass).empty();

            common.getLeadsForChart(type, filter, function (data) {

                $('#timeBuildingDataFromServer').text('Server response in ' + self.buildTime + ' ms');

                if (type === 'sale') {
                    data.map(function (el) {
                        el.source = el.source || 'No User';
                        return el;
                    });

                } else {
                    data.map(function (el) {
                        el.source = el.source || 'No Source Name';
                        return el;
                    });
                }

                scaleArray = data.map(function (d) {
                    return d.source;
                });

                uniqueNames = scaleArray.slice().filter(uniqueVal);
                width = ($('#content-holder').width()) / 2;
                height = uniqueNames.length * 20;

                y = d3.scale.ordinal()
                    .rangeRoundBands([0, height], 0.3)
                    .domain(uniqueNames);

                x = d3.scale.linear()
                    .range([0, width])
                    .domain([0, d3.max(data, function (d) {
                        return d.count;
                    }) + 10]);

                xAxis = d3.svg.axis()
                    .scale(x)
                    .orient('bottom');

                yAxis = d3.svg.axis()
                    .scale(y)
                    .orient('left');

                chart = d3.select(chartClass)
                    .attr('width', width - margin.left - margin.right)
                    .attr('height', height + margin.top + margin.bottom)
                    .append('g')
                    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

                chart.append('g')
                    .attr('class', 'x axis')
                    .attr('transform', 'translate(0,' + height + ')')
                    .call(xAxis);

                chart.append('g')
                    .attr('class', 'y axis')
                    .call(yAxis);

                data1 = _.filter(data, function (item) {
                    return item.isOpp;
                });

                data2 = _.filter(data, function (item) {
                    return !item.isOpp;
                });

                maxLeads = d3.max(data2, function (d) {
                        return d.count
                    }) || 0;

                maxOpportunities = d3.max(data1, function (d) {
                        return d.count;
                    }) || 0;

                gradient = d3.select('svg.chart.' + type + 'sChart').select('g').append('linearGradient')
                    .attr({
                        'y1'           : 0,
                        'y2'           : 0,
                        'x1'           : 0,
                        'x2'           : x(maxOpportunities),
                        'id'           : 'gradientBarForOpportunities',
                        'gradientUnits': 'userSpaceOnUse'
                    });

                gradient
                    .append('stop')
                    .attr({
                        'offset'    : '0',
                        'stop-color': '#98aac4'
                    });

                gradient
                    .append('stop')
                    .attr({
                        'offset'    : '0.8',
                        'stop-color': '#6b456c'
                    });

                gradient2 = d3.select('svg.chart.' + type + 'sChart').select('g').append('linearGradient')
                    .attr({
                        'y1'           : 0,
                        'y2'           : 0,
                        'x1'           : 0,
                        'x2'           : x(maxLeads),
                        'id'           : 'gradientBarForTotalLeads',
                        'gradientUnits': 'userSpaceOnUse'
                    });

                gradient2
                    .append('stop')
                    .attr({
                        'offset'    : '0',
                        'stop-color': '#FFA17F'
                    });

                gradient2
                    .append('stop')
                    .attr({
                        'offset'    : '0.7',
                        'stop-color': '#ACC7F2'
                    });

                chart.selectAll('.bar2')
                    .data(data2)
                    .enter()
                    .append('rect')
                    .attr({
                        'class' : 'bar2',
                        'x'     : 0,
                        'y'     : function (d) {
                            return y(d.source);
                        },
                        'height': y.rangeBand(),
                        'width' : function (d) {
                            return x(d.count);
                        }
                    })
                    .style('fill', 'url(#gradientBarForTotalLeads)')
                    .style('opacity', 1);

                chart.selectAll('.bar')
                    .data(data1)
                    .enter()
                    .append('rect')
                    .attr({
                        'class' : 'bar',
                        'x'     : 0,
                        'y'     : function (d) {
                            return y(d.source);
                        },
                        'height': y.rangeBand(),
                        'width' : function (d) {
                            return x(d.count);
                        }
                    })
                    .attr('fill', 'url(#gradientBarForOpportunities)');

                chart.selectAll('.x .tick line')
                    .data(data)
                    .attr('y2', function (d) {
                        return -height;
                    });
                return cb();
            });
        },

        /*renderPopulateByType: function (that, type, startDay, endDay) {
         var chartClass = '.' + type + 'sChart';
         var filter = {
         date: {
         value: [new Date(startDay), new Date(endDay)]
         }
         };
         var self = this;
         var margin = {
         top   : 50,
         right : 50,
         bottom: 80,
         left  : 150
         };
         var maxOpportunities;
         var uniqueNames;
         var scaleArray;
         var gradient2;
         var gradient;
         var maxLeads;
         var height;
         var width;
         var xAxis;
         var yAxis;
         var chart;
         var data1;
         var data2;
         var y;
         var x;

         function uniqueVal(value, index, self) {
         return self.indexOf(value) === index;
         }

         if (that) {
         self = that;
         }

         $(chartClass).empty();

         common.getLeadsForChart(type, filter, function (data) {

         $('#timeBuildingDataFromServer').text('Server response in ' + self.buildTime + ' ms');

         if (type === 'sale') {
         data.map(function (el) {
         el.source = el.source || 'No User';
         return el;
         });

         } else {
         data.map(function (el) {
         el.source = el.source || 'No Source Name';
         return el;
         });
         }

         scaleArray = data.map(function (d) {
         return d.source;
         });

         uniqueNames = scaleArray.slice().filter(uniqueVal);
         width = ($('#content-holder').width()) / 2;
         height = uniqueNames.length * 20;

         y = d3.scale.ordinal()
         .rangeRoundBands([0, height], 0.3)
         .domain(uniqueNames);

         x = d3.scale.linear()
         .range([0, width])
         .domain([0, d3.max(data, function (d) {
         return d.count;
         }) + 10]);

         xAxis = d3.svg.axis()
         .scale(x)
         .orient('bottom');

         yAxis = d3.svg.axis()
         .scale(y)
         .orient('left');

         chart = d3.select(chartClass)
         .attr('width', width - margin.left - margin.right)
         .attr('height', height + margin.top + margin.bottom)
         .append('g')
         .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

         chart.append('g')
         .attr('class', 'x axis')
         .attr('transform', 'translate(0,' + height + ')')
         .call(xAxis);

         chart.append('g')
         .attr('class', 'y axis')
         .call(yAxis);

         data1 = _.filter(data, function (item) {
         return item.isOpp;
         });

         data2 = _.filter(data, function (item) {
         return !item.isOpp;
         });

         maxLeads = d3.max(data2, function (d) {
         return d.count
         }) || 0;

         maxOpportunities = d3.max(data1, function (d) {
         return d.count;
         }) || 0;

         gradient = d3.select('svg.chart.' + type + 'sChart').select('g').append('linearGradient')
         .attr({
         'y1'           : 0,
         'y2'           : 0,
         'x1'           : 0,
         'x2'           : x(maxOpportunities),
         'id'           : 'gradientBarForOpportunities',
         'gradientUnits': 'userSpaceOnUse'
         });

         gradient
         .append('stop')
         .attr({
         'offset'    : '0',
         'stop-color': '#98aac4'
         });

         gradient
         .append('stop')
         .attr({
         'offset'    : '0.8',
         'stop-color': '#6b456c'
         });

         gradient2 = d3.select('svg.chart.' + type + 'sChart').select('g').append('linearGradient')
         .attr({
         'y1'           : 0,
         'y2'           : 0,
         'x1'           : 0,
         'x2'           : x(maxLeads),
         'id'           : 'gradientBarForTotalLeads',
         'gradientUnits': 'userSpaceOnUse'
         });

         gradient2
         .append('stop')
         .attr({
         'offset'    : '0',
         'stop-color': '#FFA17F'
         });

         gradient2
         .append('stop')
         .attr({
         'offset'    : '0.7',
         'stop-color': '#ACC7F2'
         });

         chart.selectAll('.bar2')
         .data(data2)
         .enter()
         .append('rect')
         .attr({
         'class' : 'bar2',
         'x'     : 0,
         'y'     : function (d) {
         return y(d.source);
         },
         'height': y.rangeBand(),
         'width' : function (d) {
         return x(d.count);
         }
         })
         .style('fill', 'url(#gradientBarForTotalLeads)')
         .style('opacity', 1);

         chart.selectAll('.bar')
         .data(data1)
         .enter()
         .append('rect')
         .attr({
         'class' : 'bar',
         'x'     : 0,
         'y'     : function (d) {
         return y(d.source);
         },
         'height': y.rangeBand(),
         'width' : function (d) {
         return x(d.count);
         }
         })
         .attr('fill', 'url(#gradientBarForOpportunities)');

         chart.selectAll('.x .tick line')
         .data(data)
         .attr('y2', function (d) {
         return -height;
         });
         });
         },
         */
        renderSalesByCountry: function (viewName) {
            var dateArray = this[viewName].dateArray;
            var $wrapper = $('.content-holder');
            var filter = {
                date: {
                    value: dateArray
                }
            };
            var padding = 15;
            var offset = 2;
            var barChart;
            var gradient;
            var height1;
            var xScale;
            var yScale;
            var margin;
            var width;
            var xAxis;
            var yAxis;
            var rect;
            var max;
            var svg;
            var g;

            d3.selectAll('svg.salesByCountryBarChart > *').remove();

            common.getSalesByCountry(filter, true, function (data) {

                margin = {
                    top   : 50,
                    right : 150,
                    bottom: 80,
                    left  : 80
                };
                width = ($wrapper.width()) / 2;
                height1 = data.length * 20;

                barChart = d3.select('svg.salesByCountryBarChart')
                    .attr({
                        'width' : width - margin.left - margin.right,
                        'height': height1 + margin.top + margin.bottom
                    })
                    .append('g')
                    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

                max = d3.max(data, function (d) {
                    return d.pays / 100;
                });

                xScale = d3.scale.linear()
                    .domain([0, max])
                    .range([0, width - 30]);

                yScale = d3.scale.linear()
                    .domain([0, data.length])
                    .range([0, height1]);

                rect = height1 / (data.length);

                gradient = barChart.append("linearGradient")
                    .attr({
                        'y1'           : 0,
                        'y2'           : 0,
                        'x1'           : '0',
                        'x2'           : width - 30,
                        'id'           : 'gradientBar',
                        'gradientUnits': 'userSpaceOnUse'
                    });

                gradient
                    .append('stop')
                    .attr({
                        'offset'    : '0',
                        'stop-color': '#FFA17F'
                    });

                gradient
                    .append('stop')
                    .attr({
                        'offset'    : '0.5',
                        'stop-color': '#ACC7F2'
                    });

                barChart.selectAll('rect')
                    .data(data)
                    .enter()
                    .append('rect')
                    .attr({
                        x     : function () {
                            return 0;
                        },
                        y     : function (d, i) {
                            return yScale(i) + offset;
                        },
                        width : function (d) {
                            return xScale(d.pays / 100);
                        },
                        height: rect - 2 * offset,
                        fill  : 'url(#gradientBar)'
                    });

                xAxis = d3.svg.axis()
                    .scale(xScale)
                    .orient('bottom');

                yAxis = d3.svg.axis()
                    .scale(yScale)
                    .orient('left')
                    .tickSize(0)
                    .tickPadding(offset)
                    .tickFormat(function (d, i) {
                        return data[i]._id;
                    })
                    .tickValues(d3.range(data.length));

                barChart.append('g')
                    .attr({
                        'class'    : 'x axis',
                        'transform': 'translate(0,' + height1 + ')'
                    })
                    .call(xAxis);

                barChart.append('g')
                    .attr({
                        'class'    : 'y axis',
                        'transform': 'translate(0,' + (padding - 2 * offset) + ')'
                    })
                    .call(yAxis);

                barChart.selectAll('.x .tick line')
                    .attr({
                        'y2'   : function (d) {
                            return -height1
                        },
                        'style': 'stroke: #f2f2f2'
                    });
            });
        }
    });

    return ContentView;
});
