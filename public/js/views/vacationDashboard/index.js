define([
    'Backbone',
    'jQuery',
    'Underscore',
    'text!templates/vacationDashboard/index.html',
    'views/vacationDashboard/statisticsView',
    'collections/Dashboard/vacationDashboard',
    'views/wTrack/dashboard/vacationDashEdit',
    'views/wTrack/dashboard/CreatewTrackView',
    'views/Filter/filterView',
    'dataService',
    'async',
    'custom',
    'moment',
    'constants'
], function (Backbone,
             $,
             _,
             mainTemplate,
             StatisticsView,
             VacationDashboard,
             VacationDashEdit,
             CreatewTrackView,
             FilterView,
             dataService,
             async,
             custom,
             moment,
             CONSTANTS) {
    'use strict';

    var View = Backbone.View.extend({
        el: '#content-holder',

        contentType  : CONSTANTS.DASHBOARD_VACATION,
        contentHeader: 'Planning',
        template     : _.template(mainTemplate),
        expandAll    : false,

        events: {
            'click .openAll'                   : 'openAll',
            'click .employeesRow'              : 'openEmployee',
            'click .group'                     : 'openDepartment',
            'click .wTrackInfo :not(.createTd)': 'getWtrackInfo',
            'click td.createTd:not(.inactive)' : 'createWTrack',
            click                              : 'hideDateRange'
        },

        initialize: function (options) {
            var dashCollection;
            var year;
            var week;
            var filter;

            this.startTime = options.startTime;
            filter = this.filter = options.filter || custom.retriveFromCash('DashVacation.filter');

            year = moment().isoWeekYear();
            week = moment().isoWeek();

            this.dateByWeek = year * 100 + week;

            dashCollection = this.dashCollection = options.collection || custom.retriveFromCash('dashboardVacation');

            if (!dashCollection) {
                options.filter = filter;
                dashCollection = this.dashCollection = this.fetchData(options);
                dashCollection.on('reset sort', this.render, this);
            } else {
                this.render();
            }
        },

        createWTrack: function (e) {
            var table = this.$el.find('#dashboardBody');
            var $target = $(e.target);
            var td = $target.closest('td');
            var tr = td.closest('tr');
            var dateByWeek = td.attr('data-date');
            var employee = tr.attr('data-employee');
            var allRows = table.find('[data-employee="' + employee + '"]');
            var tds = allRows.find('[data-date="' + dateByWeek + '"]');
            var parentTr = this.$el.find('[data-id="' + employee + '"]');
            var employeeName = $.trim(parentTr.find('.employee').find('span').text());
            var department = parentTr.attr('class');
            var departmentName = $.trim(this.$el.find('[data-id="' + department + '"]').find('.departmentName').text());
            var nameArray = employeeName.split(' ');
            var nameFirst = nameArray[0];
            var nameLast = $.trim(nameArray[1]);
            var name = {
                first: nameFirst,
                last : nameLast
            };

            e.stopPropagation();

            if ($target.hasClass('inactive')) {
                return false;
            }

            return new CreatewTrackView({
                tr            : tr,
                tds           : tds,
                dateByWeek    : dateByWeek,
                employee      : employee,
                employeeName  : name,
                department    : department,
                departmentName: departmentName
            });
        },

        fetchData: function (options) {
            var dashCollection;

            dashCollection = new VacationDashboard(options);

            return dashCollection;
        },

        openAll: function () {
            var self = this;
            var rows = self.$el.find('tr');
            var length = rows.length;
            var employeeRows = self.$el.find("tr[data-content='employee']");
            var projectsRows = self.$el.find("tr[data-content='project']");
            var countEmployees = employeeRows.length;
            var countProjects = projectsRows.length;
            var i;

            if (!self.expandAll) {
                for (i = length; i >= 0; i--) {
                    rows.eq(i).show();
                }

                self.$el.find('.icon').removeClass('icon-plus').addClass('icon-minus');
                self.expandAll = true;
            } else {
                for (i = countEmployees; i >= 0; i--) {
                    employeeRows.eq(i).hide();
                }
                for (i = countProjects; i >= 0; i--) {
                    projectsRows.eq(i).hide();
                }

                self.$el.find('.icon').removeClass('icon-minus').addClass('icon-plus');
                self.expandAll = false;
            }
        },

        openEmployee: function (e) {
            var self = this;
            var target = e.target;
            var targetIcon = $(e.target);
            var targetEmployee = '.' + $(target).parents('tr').attr('data-id');
            var display = self.$el.find(targetEmployee).css('display');

            if (display === 'none') {
                self.$el.find(targetEmployee).show();
                targetIcon.removeClass('icon-plus').addClass('icon-minus');
            } else {
                self.$el.find(targetEmployee).hide();
                targetIcon.removeClass('icon-minus').addClass('icon-plus');
            }
        },

        openDepartment: function (e) {
            var self = this;
            var target = e.target;
            var targetDepartment = '.' + $(target).parents('tr').attr('data-id');
            var targetProjects = '.projectsFor' + $(target).parents('tr').attr('data-id');
            var display = self.$el.find(targetDepartment).css('display');

            if (display === 'none') {
                self.$el.find(targetDepartment).show();
            } else {
                self.$el.find(targetDepartment).hide();
                self.$el.find(targetProjects).hide();
            }
        },

        leadComparator: function (isLeadNumber) {
            if (!isLeadNumber) {
                return '<span class="low"><span class="label label-danger">Low</span></span>';
            }
            if (isLeadNumber === 1) {
                return '<span class="medium"><span class="label label-warning">Medium</span></span>';
            }
            return '<span class="high"><span class="label label-success">High</span></span>';
        },

        isWorking: function (employee, week) {
            var date;
            var isEmployee = !!employee.isEmployee;
            var firstTransfer = employee.firstTransferDate;
            var lastTransfer = employee.lastTransferDate;
            var _lastTransfer = moment(employee.lastTransfer);

            // var isTransfer = employee.isTransfer.indexOf('transfer') !== -1;
            var transferArr = employee.transferArr;
            var updateArr = employee.isTransfer;
            var lastUpdate;

            var isTransfer = !!transferArr.length;
            var lastUpdateDate;
            var _transfer;
            var i;

            lastUpdate = updateArr[updateArr.length - 1];
            lastUpdateDate = moment(lastUpdate.date);
            lastUpdateDate = lastUpdateDate.isoWeekYear() * 100 + lastUpdateDate.isoWeek();

            date = week.dateByWeek;

            firstTransfer = moment(firstTransfer);
            firstTransfer = firstTransfer.isoWeekYear() * 100 + firstTransfer.isoWeek();

            lastTransfer = moment(lastTransfer);
            lastTransfer = lastTransfer.isoWeekYear() * 100 + lastTransfer.isoWeek();

            _lastTransfer = _lastTransfer.isoWeekYear() * 100 + _lastTransfer.isoWeek();

            if (!date) {
                date = moment().isoWeekYear() * 100 + moment().isoWeek;
            }

            if (isEmployee) {
                if (firstTransfer === lastTransfer && !isTransfer) {
                    return date >= firstTransfer;
                }
                if (date >= firstTransfer && !isTransfer) {
                    return date <= lastTransfer || lastTransfer === _lastTransfer;
                }

                for (i = transferArr.length - 1; i >= 0; i--) {
                    _transfer = transferArr[i] ? transferArr[i].date : null;
                    _transfer = moment(_transfer);
                    _transfer = _transfer.isoWeekYear() * 100 + _transfer.isoWeek();

                    if (date >= firstTransfer && date <= _transfer) {
                        return true;
                    }
                    if (date >= lastUpdateDate && lastUpdate.status !== 'transfer') {
                        return true;
                    }

                }
            } else {
                return (date >= firstTransfer && date <= lastTransfer);
            }

            return false;
        },

        getCellClass: function (week, self, employee) {
            var s = '';
            var hours = week.hours || 0;
            var holidays = week.holidays || 0;
            var vacations = week.vacations || 0;

            hours = hours + (holidays + vacations) * 8;

            if (hours > 40) {
                s += 'dgreen ';
            } else if (hours > 35) {
                s += 'green ';
            } else if (hours > 19) {
                s += 'yellow ';
            } else if (hours > 8) {
                s += week.hours ? 'pink ' : ((self.dateByWeek >= week.dateByWeek) ? 'red ' : '');
            } else if (self.dateByWeek >= week.dateByWeek) {
                s += 'red ';
            }

            if (self.dateByWeek === week.dateByWeek) {
                s += 'active ';
            }

            if (!self.isWorking(employee, week)) {
                s = 'inactive ';
            }
            return s;
        },

        getHeadClass: function (week, self) {
            var s;
            var dateByWeek = week.year * 100 + week.week;

            if (self.dateByWeek === dateByWeek) {
                s = 'activeHead';
            }

            return s;
        },

        getCellSize: function (week, vacation) {
            var v = '';
            var w = '';
            var holidays = week.holidays || 0;
            var vacations = week.vacations || 0;
            var vacationHours = (holidays + vacations) * 8;
            var workedHours = week.hours || 0;

            // if (vacationHours > 16) {
            if (vacationHours >= 40) {
                v = workedHours ? 'size40' : 'sizeFull';
                w = workedHours ? 'size40' : 'size0';
            } else if (vacationHours > 8) {
                v = workedHours ? 'size16' : 'size40';
                w = workedHours ? 'size24' : 'size40';
            } else if (vacationHours > 0) {
                v = 'size8';
                w = 'sizeFull';
            } else {
                v = 'size0';
                w = 'sizeFull';
            }

            if (vacation && vacationHours) {
                return v;
            }

            return w;
        },

        getDate: function (dateStr) {
            return dateStr.isoWeekday(5).format('DD.MM');
        },

        calculateStatistics: function () {
            var el = this.$el;
            var startTime = new Date();
            var count = function (search) {
                return el.find(search).length;
            };
            var self = this;

            async.parallel({
                free: function (callback) {
                    var free = count('.red.active');
                    callback(null, free);
                },

                almostFree: function (callback) {
                    var almostFree = count('.pink.active');
                    callback(null, almostFree);
                },

                partiallyBusy: function (callback) {
                    var partiallyBusy = count('.yellow.active');
                    callback(null, partiallyBusy);
                },

                fullyBusy: function (callback) {
                    var busy = count('.green.active');
                    callback(null, busy);
                },

                overworked: function (callback) {
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
            var project = td.attr('data-project');
            var dateByWeek = td.attr('data-date');
            var employee = tr.attr('data-employee');
            var table = this.$el.find('#dashboardBody');
            var allRows = table.find('[data-employee="' + employee + '"]');
            var tds = allRows.find('[data-date="' + dateByWeek + '"]:not([data-project="' + project + '"])');
            var queryData;

            if (!project) {
                return false;
            }

            queryData = {
                project   : project,
                dateByWeek: dateByWeek,
                employee  : employee
            };

            dataService.getData('/wTrack/dash', queryData, function (response) {
                var err;

                if (!response.error) {
                    return new VacationDashEdit({
                        tr            : tr,
                        tds           : tds,
                        dateByWeek    : dateByWeek,
                        project       : project,
                        customer      : response.customer,
                        projectmanager: response.projectmanager,
                        wTracks       : response.wTracks
                    });
                }
                err = response && response.error ? response.error.statusText : 'Some error';
                App.render({
                    type   : 'error',
                    message: err
                });
            });
        },

        findDataPickers: function () {
            this.$startDate = $('#startDate');
            this.$endDate = $('#endDate');
        },

        changeDateRange: function (dateArray) {
            var dashCollection;
            var year;
            var week;
            var filter;

            if (!dateArray || !dateArray.length) {
                App.render({
                    type   : 'error',
                    message: 'Can\'t change date filter to null'
                });
            }

            this.startTime = new Date();

            year = moment().isoWeekYear();
            week = moment().isoWeek();

            this.dateByWeek = year * 100 + week;

            filter = this.filter || custom.retriveFromCash('DashVacation.filter') || {};
            filter.date = {
                value: dateArray
            };

            dashCollection = this.dashCollection = this.fetchData({
                filter: filter
            });
            dashCollection.unbind();
            dashCollection.on('reset sort', this.render, this);

            this.filter = filter;

            custom.cacheToApp('DashVacation.filter', this.filter);
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

        hideDateRange: function () {
            var targetEl = $('.frameDetail');

            targetEl.addClass('hidden');
        },

        render: function () {
            var $currentEl = this.$el;
            var dashboardData = this.dashCollection;
            var filter = this.filter || custom.retriveFromCash('DashVacation.filter');
            var weeksArr;
            var self = this;
            var statictics;
            var url = '#tinyERP/DashBoardVacation';

            App.filtersObject.filter = filter || {};

            if ('toJSON' in dashboardData) {
                dashboardData.unbind();
                dashboardData = dashboardData.toJSON();
            }

            $('title').text(this.contentHeader);

            custom.cacheToApp('dashboardVacation', this.dashCollection);

            weeksArr = custom.retriveFromCash('vacationDashWeeksArr');

            $currentEl.html(self.template({
                weeks         : weeksArr,
                dashboardData : dashboardData,
                leadComparator: self.leadComparator,
                getCellClass  : self.getCellClass,
                getCellSize   : self.getCellSize,
                getHeadClass  : self.getHeadClass,
                isWorking     : self.isWorking,
                self          : self
            }));

            statictics = new StatisticsView({});

            this.statisticsView$ = statictics;
            $currentEl.append("<div id='timeRecivingDataFromServer'>Created in " + (new Date() - this.startTime) + ' ms</div>');
            this.calculateStatistics();

            /* this.findDataPickers(); */

            if (!this.filterView) {
                if (!App || !App.filtersObject || !App.filtersObject.filtersValues || !App.filtersObject.filtersValues.DashVacation) {
                    custom.getFiltersValues({contentType: 'DashVacation'}, this.renderFilter(this.baseFilter));
                } else {
                    this.renderFilter(this.baseFilter);
                }
            }

            return this;
        },

        renderFilter: function (baseFilter) {
            var self = this;

            this.filterView = new FilterView({
                el         : $('#searchContainer'),
                contentType: 'DashVacation'
            });

            this.filterView.bind('filter', function (filter) {
                if (baseFilter) {
                    filter[baseFilter.name] = baseFilter.value;
                }
                self.showFilteredPage(filter);
            });

            this.filterView.bind('defaultFilter', function (filter) {
                if (baseFilter) {
                    filter[baseFilter.name] = baseFilter.value;
                }
                self.showFilteredPage({});
            });

            this.filterView.render();
        }
    });

    return View;
});
