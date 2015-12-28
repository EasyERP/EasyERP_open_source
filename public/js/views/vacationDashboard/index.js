define([
    'text!templates/vacationDashboard/index.html',
    'views/vacationDashboard/statisticsView',
    'collections/Dashboard/vacationDashboard',
    'views/wTrack/dashboard/vacationDashEdit',
    'views/Filter/FilterView',
    'dataService',
    'async',
    'custom',
    'moment',
    'constants'
], function (mainTemplate, StatisticsView, vacationDashboard, VacationDashEdit, filterView, dataService, async, custom, moment, CONSTANTS) {
    "use strict";
    var View = Backbone.View.extend({
        el: '#content-holder',

        contentType: CONSTANTS.DASHBOARD_VACATION,

        template : _.template(mainTemplate),
        expandAll: false,

        events: {
            "click .openAll"     : "openAll",
            "click .employeesRow": "openEmployee",
            "click .group"       : "openDepartment",
            "click .wTrackInfo"  : "getWtrackInfo"
        },

        initialize: function (options) {
            var dashCollection;
            var startWeek;
            var self = this;
            var year;
            var week;
            var socket = App.socket;

            this.startTime = options.startTime;
            this.filter = options.filter || custom.retriveFromCash('DashVacation.filter');

            year = moment().isoWeekYear();
            week = moment().isoWeek();

            this.dateByWeek = year * 100 + week;
            this.week = week;
            this.year = year;

            startWeek = self.week - 1;

            if (startWeek >= 0) {
                this.startWeek = startWeek;
            } else {
                this.startWeek = startWeek + 53;
                this.year -= 1;
            }

            dashCollection = this.dashCollection = custom.retriveFromCash('dashboardVacation');
            custom.cacheToApp('DashVacation.filter', this.filter);

            if (!dashCollection) {
                dashCollection = this.dashCollection = this.fetchData(options);
                dashCollection.on('reset sort', this.render, this);
            } else {
                this.render();
            }
        },

        fetchData: function (options) {
            var dashCollection;

            dashCollection = new vacationDashboard(options);

            return dashCollection;
        },

        openAll: function (e) {
            var self = this;
            var rows = self.$el.find('tr');
            var length = rows.length;
            var employeeRows = self.$el.find("tr[data-content='employee']");
            var projectsRows = self.$el.find("tr[data-content='project']");
            var countEmployees = employeeRows.length;
            var countProjects = projectsRows.length;

            if (!self.expandAll) {
                for (var i = length; i >= 0; i--) {
                    rows.eq(i).show();
                }

                self.$el.find('.icon').text('-');
                self.expandAll = true;
            } else {
                for (var i = countEmployees; i >= 0; i--) {
                    employeeRows.eq(i).hide();
                }
                for (var i = countProjects; i >= 0; i--) {
                    projectsRows.eq(i).hide();
                }

                self.$el.find('.icon').text('5');
                self.expandAll = false;
            }
        },

        openEmployee: function (e) {
            var self = this;
            var target = e.target;
            var targetIcon = $(e.target);
            var targetEmployee = '.' + $(target).parents('tr').attr('data-id');
            var display = self.$el.find(targetEmployee).css('display');

            if (display === "none") {
                self.$el.find(targetEmployee).show();
                targetIcon.text('-');
            } else {
                self.$el.find(targetEmployee).hide();
                targetIcon.text('5');
            }
        },

        openDepartment: function (e) {
            var self = this;
            var target = e.target;
            var targetDepartment = '.' + $(target).parents('tr').attr('data-id');
            var targetProjects = '.projectsFor' + $(target).parents('tr').attr('data-id');
            var display = self.$el.find(targetDepartment).css('display');

            if (display === "none") {
                self.$el.find(targetDepartment).show();
            } else {
                self.$el.find(targetDepartment).hide();
                self.$el.find(targetProjects).hide();
            }
        },

        leadComparator: function (isLeadNumber) {
            if (!isLeadNumber) {
                return '<span class="low"><span class="label label-danger">Low</span></span>'
            }
            if (isLeadNumber == 1) {
                return '<span class="medium"><span class="label label-warning">Medium</span></span>'
            }
            return '<span class="high"><span class="label label-success">High</span></span>'
        },

        isWorking: function (employee, week) {
            var date;
            var firedArr = employee.fired;
            var firedLength = firedArr.length;
            var hiredArr = employee.hired;
            var year = week.dateByWeek.toString().slice(0, 4);
            var _week = week.dateByWeek.toString().slice(4);

            var _hiredDate;
            var _firedDate;
            var _lastHiredDate = moment(hiredArr[hiredArr.length - 1], 'YYYY-MM-DD');
            var _lastFiredDate = moment(firedArr[firedArr.length - 1], 'YYYY-MM-DD');

            date = moment().set('year', year).set('week', _week);

            if (!firedLength) {
                if (date > _lastHiredDate) {
                    return true;
                }
                return false;
            } else {
                for (var i = firedLength - 1; i >= 0; i--) {
                    _hiredDate = moment(hiredArr[i]).format('YYYY-MM-DD');
                    _firedDate = moment(firedArr[i]).format('YYYY-MM-DD');

                    if (date.isBetween(_hiredDate, _firedDate) || (date > _lastHiredDate && date < _lastFiredDate)) {
                        return true;
                    }
                }
                return false;
            }
        },

        getCellClass: function (week, self, employee) {
            var s = "";
            var hours = week.hours || 0;
            var holidays = week.holidays || 0;
            var vacations = week.vacations || 0;

            hours = hours + (holidays + vacations) * 8;

            if (hours > 40) {
                s += "dgreen ";
            } else if (hours > 35) {
                s += "green ";
            } else if (hours > 19) {
                s += "yellow ";
            } else if (hours > 8) {
                s += week.hours ? "pink " : ((self.dateByWeek >= week.dateByWeek) ? "red" : "");
            } else if (self.dateByWeek >= week.dateByWeek) {
                s += "red ";
            }
            if (self.dateByWeek === week.dateByWeek) {
                s += "active ";
            }
            if (!self.isWorking(employee, week)) {
                s += "inactive ";
            }
            return s;
        },

        getHeadClass: function (week, self) {
            var s;
            var dateByWeek = week.year * 100 + week.week;

            if (self.dateByWeek === dateByWeek) {
                s = "activeHead";
            }

            return s;
        },

        getCellSize: function (week, vacation) {
            var v = '';
            var w = '';
            var vacationHours = (week.vacations || 0) * 8;
            var workedHours = week.hours || 0;

            if (vacationHours > 16) {
                v = workedHours ? "size40" : "sizeFull";
                w = workedHours ? "size40" : "size0";
            } else if (vacationHours > 8) {
                v = workedHours ? "size16" : "size40";
                w = workedHours ? "size24" : "size40";
            } else if (vacationHours > 0) {
                v = workedHours ? "size8" : "size8";
                w = "sizeFull";
            } else {
                v = "size0";
                w = "sizeFull";
            }

            if (vacation && vacationHours) {
                return v;
            } else {
                return w;
            }
        },

        getDate: function (num, year) {
            return moment().week(num).year(year).day("Monday").format("DD.MM");
        },

        calculateStatistics: function () {
            var el = this.$el;
            var startTime = new Date();
            var count = function (search) {
                return el.find(search).length;
            };
            var self = this;

            async.parallel({
                free         : function (callback) {
                    var free = count('.red.active');
                    callback(null, free);
                },
                almostFree   : function (callback) {
                    var almostFree = count('.pink.active');
                    callback(null, almostFree);
                },
                partiallyBusy: function (callback) {
                    var partiallyBusy = count('.yellow.active');
                    callback(null, partiallyBusy);
                },
                fullyBusy    : function (callback) {
                    var busy = count('.green.active');
                    callback(null, busy);
                },
                overworked   : function (callback) {
                    var overworked = count('.dgreen.active');
                    callback(null, overworked);
                }

            }, function (err, result) {
                result.startTime = startTime;
                self.statisticsView$.render(result);
            });

        },

        getWtrackInfo: function (e) {
            var targetEl = $(e.target);
            var td = targetEl.closest('td');
            var tr = td.closest('tr');
            var projectName = td.attr('data-project');
            var dateByWeek = td.attr('data-date');
            var employee = tr.attr('data-employee');
            var table = this.$el.find('#dashboardBody');
            var allRows = table.find('[data-employee="' + employee + '"]');
            var tds = allRows.find('[data-date="' + dateByWeek + '"]:not([data-project="' + projectName + '"])');

            var queryData = {
                projectName: projectName,
                dateByWeek : dateByWeek,
                employee   : employee
            };

            dataService.getData('/wTrack/dash', queryData, function (response) {
                if (!response.error) {
                    return new VacationDashEdit({
                        tr            : tr,
                        tds           : tds,
                        dateByWeek    : dateByWeek,
                        projectName   : projectName,
                        customer      : response.customer,
                        projectmanager: response.projectmanager,
                        wTracks       : response.wTracks
                    });
                }
            });
        },

        findDataPickers: function () {
            this.$startDate = $('#startDate');
            this.$endDate = $('#endDate');
        },

        changeDateRange: function (e) {
            var startDateStr = this.$startDate.val();
            var endDateStr = this.$endDate.val();
            var weeksArr = [];

            var dashCollection = this.dashCollection;
            var startWeek;
            var startYear;
            var endYear;
            var startDate;
            var endDate;
            var endWeek;
            var year;
            var week;
            var _dateStr;
            var filter;

            this.startTime = new Date();

            year = moment().isoWeekYear();
            week = moment().isoWeek();

            this.dateByWeek = year * 100 + week;
            this.week = week;
            this.year = year;

            startDateStr = moment(startDateStr);
            endDateStr = moment(endDateStr);
            startYear = startDateStr.isoWeekYear();
            endYear = endDateStr.isoWeekYear();
            startWeek = startDateStr.isoWeek();
            endWeek = endDateStr.isoWeek();

            startDate = startYear * 100 + startWeek;
            endDate = endYear * 100 + endWeek;

            for (var i = startDate; i <= endDate; i++) {
                _dateStr = i.toString();
                week = _dateStr.substr(-2);
                year = _dateStr.substr(0, 4);
                weeksArr.push({
                    lastDate: this.getDate(week, year),
                    week    : week,
                    year    : year
                });
            }

            custom.cacheToApp('vacationDashWeeksArr', weeksArr);

            filter = this.filter || custom.retriveFromCash('DashVacation.filter') || {};

            filter.startDate = startDate;
            filter.endDate = endDate;

            if (dashCollection) {
                dashCollection = this.dashCollection = this.fetchData({
                    filter: filter
                });
                dashCollection.unbind();
                dashCollection.on('reset sort', this.render, this);
            } else {
                this.render();
            }

            this.filter = filter;
            custom.cacheToApp('DashVacation.filter', this.filter);
        },

        defaultDataGenerator: function () {
            var startWeek = this.startWeek;
            var weeksArr = custom.retriveFromCash('vacationDashWeeksArr') || [];
            var week;
            var year;

            if (!weeksArr || !weeksArr.length) {
                for (var i = 0; i <= 11; i++) {
                    if (startWeek + i > 53) {
                        week = startWeek + i - 53;
                        year = this.year + 1;
                        weeksArr.push({
                            lastDate: this.getDate(week, year),
                            week    : week,
                            year    : year
                        });
                    } else {
                        week = startWeek + i;
                        year = this.year;
                        weeksArr.push({
                            lastDate: this.getDate(week, year),
                            week    : week,
                            year    : year
                        });
                    }
                }

                custom.cacheToApp('vacationDashWeeksArr', weeksArr);
            }

            return weeksArr;
        },

        showFilteredPage: function (filter) {
            var dashCollection;
            var thisFilter = this.filter || custom.retriveFromCash('DashVacation.filter');

            this.$el.find('.thumbnail').remove();
            this.startTime = new Date();
            this.newCollection = true;

            if (this.filter) {
                filter.startDate = thisFilter.startDate;
                filter.endDate = thisFilter.endDate;
            }

            this.filter = filter;

            if (Object.keys(filter).length === 0) {
                this.filter = {};
            }

            custom.cacheToApp('DashVacation.filter', this.filter);

            dashCollection = this.dashCollection = this.fetchData({
                filter: this.filter
            });
            dashCollection.unbind();
            dashCollection.on('reset sort', this.render, this);
        },

        render: function (options) {
            var $currentEl = this.$el;
            var defaultData = options ? !options.defaultData : true;
            var dashboardData = this.dashCollection;
            var filter = this.filter || custom.retriveFromCash('DashVacation.filter');
            var weeksArr;
            var self = this;
            var statictics;
            var url = '#easyErp/DashBoardVacation';

            App.filter = filter || {};

            if ('toJSON' in dashboardData) {
                dashboardData.unbind();
                dashboardData = dashboardData.toJSON();
            }

            $('title').text(this.contentType);

            custom.cacheToApp('dashboardVacation', this.dashCollection);

            if (defaultData) {
                weeksArr = this.defaultDataGenerator();
            } else {
                weeksArr = custom.retriveFromCash('vacationDashWeeksArr');
            }

            $currentEl.html(self.template({
                weeks         : weeksArr,
                dashboardData : dashboardData,
                leadComparator: self.leadComparator,
                getCellClass  : self.getCellClass,
                getCellSize   : self.getCellSize,
                getHeadClass  : self.getHeadClass,
                self          : self
            }));

            statictics = new StatisticsView({});
            this.statisticsView$ = statictics;
            $currentEl.append("<div id='timeRecivingDataFromServer'>Created in " + (new Date() - this.startTime) + " ms</div>");
            this.calculateStatistics();

            this.findDataPickers();

            if (filter) {
                url += '/filter=' + encodeURIComponent(JSON.stringify(filter));

                Backbone.history.navigate(url);
            }

            if (!this.filterView) {
                this.filterView = new filterView({contentType: 'DashVacation'});
                this.filterView.bind('filter', function (filter) {
                    self.showFilteredPage(filter)
                });
                this.filterView.bind('defaultFilter', function () {
                    self.showFilteredPage({});
                });

                this.filterView.render();
            } /*else {
                this.filterView.renderFilterContent();
            }*/

            return this;
        }
    });

    return View;
});