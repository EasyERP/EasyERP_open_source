/**
 * Created by Roman on 17.06.2015.
 */
define([
    'text!templates/Revenue/index.html',
    'text!templates/Revenue/weeksArray.html',
    'text!templates/Revenue/tableByDep.html',
    'text!templates/Revenue/bySalesByDep.html',
    'text!templates/Revenue/perWeek.html',
    'text!templates/Revenue/paidBySales.html',
    'text!templates/Revenue/paidBySalesItems.html',
    'text!templates/Revenue/projectBySalesItems.html',
    'text!templates/Revenue/unpaidBySales.html',
    'text!templates/Revenue/monthsArray.html',
    'text!templates/Revenue/perMonth.html',
    'text!templates/Revenue/perMonthInt.html',
    'text!templates/Revenue/tableSold.html',
    'text!templates/Revenue/hoursByDepItem.html',
    'text!templates/Revenue/hoursByDepTotal.html',
    'text!templates/Revenue/bonusBySales.html',
    'text!templates/Revenue/tableAllBonusByMonth.html',
    'text!templates/Revenue/allBonusByMonth.html',
    'text!templates/Revenue/perMonthForAllBonus.html',
    'text!templates/Revenue/hoursSold.html',
    'models/Revenue',
    'moment',
    'dataService',
    'async',
    'custom',
    'd3',
    'constants',
    'helpers'
], function (mainTemplate, weeksArray, tableByDep, bySalesByDep, perWeek, paidBySales, paidBySalesItems, projectBySalesItems, unpaidBySales, monthsArray, perMonth, perMonthInt, tableSold, hoursByDepItem, hoursByDepTotal, bonusBySales, allBonus, allBonusByMonth, perMonthForAllBonus, hoursSold, RevenueModel, moment, dataService, async, custom, d3, CONSTANTS, helpers) {
    var View = Backbone.View.extend({
        el: '#content-holder',

        contentType: CONSTANTS.REVENUE,

        template: _.template(mainTemplate),
        weeksArrayTemplate: _.template(weeksArray),
        monthsArrayTemplate: _.template(monthsArray),
        bySalesByDepTemplate: _.template(bySalesByDep),
        tableByDepTemplate: _.template(tableByDep),
        bySalesPerWeekTemplate: _.template(perWeek),
        bySalesPerMonthTemplate: _.template(perMonth),
        bySalesPerMonthIntTemplate: _.template(perMonthInt),
        paidBySalesTemplate: _.template(paidBySales),
        paidBySalesItemsTemplate: _.template(paidBySalesItems),
        projectBySalesItemsTemplate: _.template(projectBySalesItems),
        tableSoldTemplate: _.template(tableSold),
        hoursByDepTemplate: _.template(hoursByDepItem),
        hoursByDepTotalTemplate: _.template(hoursByDepTotal),
        bonusBySalesTemplate: _.template(bonusBySales),
        allBonusTemplate: _.template(allBonus),
        allBonusByMonth: _.template(allBonusByMonth),
        perMonthForAllBonus: _.template(perMonthForAllBonus),
        hoursSoldByMonth: _.template(hoursSold),

        paidUnpaidDateRange: {},

        $currentStartWeek: null,
        $revenueBySales: null,

        events: {
            'change #currentStartWeek': 'changeWeek',
            'click .ui-spinner-button': 'changeWeek',
            'click .clickToShow': 'showBonus'
        },

        initialize: function () {
            var self = this;
            var currentWeek = moment().week();
            var nowMonth = parseInt(moment().week(currentWeek).format("MM"));
            this.revenueTotal = _.after(2, self.changeRevenue);
            this.model = new RevenueModel();
            this.listenTo(this.model, 'change:currentYear', this.changeYear);
            this.listenTo(this.model, 'change:currentStartWeek', this.changeWeek);
            this.listenTo(this.model, 'change:weeksArr', this.changeWeeksArr);
            this.listenTo(this.model, 'change:bySalesData', this.changeBySalesData);
            this.listenTo(this.model, 'change:byDepData', this.changeByDepData);
            this.listenTo(this.model, 'change:paidBySales', this.changePaidBySalesData);
            this.listenTo(this.model, 'change:unpaidBySales', this.changeUnpaidBySalesData);
            this.listenTo(this.model, 'change:cancelledBySales', this.changeCancelledBySalesData);
            this.listenTo(this.model, 'change:projectBySales', this.changeProjectBySales);
            this.listenTo(this.model, 'change:employeeBySales', this.changeEmployeeBySales);

            this.listenTo(this.model, 'change:allBonusByMonth', this.changeAllBonusByMonth);
            this.listenTo(this.model, 'change:uncalcBonus', this.changeUnCalcBonusByMonth);
            this.listenTo(this.model, 'change:calcBonus', this.changeCalcBonusByMonth);
            this.listenTo(this.model, 'change:revenueTotal', this.revenueTotal);
            /**this.listenTo(this.model, 'change:paidBonus', this.changeHoursByDep);
             this.listenTo(this.model, 'change:balanceBonus', this.changeHoursByDep);*/

            var currentStartWeek = currentWeek - 6;
            var currentYear = moment().weekYear();
            var currentMonth = parseInt(moment().week(currentStartWeek).format("MM"));

            this.changeWeek = _.debounce(this.updateWeek, 500);

            dataService.getData('/employee/bySales', null, function (employess) {
                self.render(employess);
                self.model.set({
                    currentStartWeek: currentStartWeek,
                    currentYear: currentYear,
                    currentMonth: currentMonth
                });
                self.$currentStartWeek.val(currentStartWeek);
            });

            this.monthArr = [];
            this.paidUnpaidDateRange.endDate = currentYear * 100 + nowMonth;

            this.calculateCurrentMonthArr(nowMonth, currentYear);
        },

        getDate: function (num) {
            return moment().day("Monday").week(num).format("DD.MM");
        },

        getModelValue: function (attr) {
            return this.model.get(attr);
        },

        updateWeek: function () {
            var modelData;
            var currentStartWeek = parseInt(this.$currentStartWeek.val());
            var currentWeek = currentStartWeek + 6;
            var currentYear = this.model.get('currentYear');
            var newCurrMonth;
            var yearOfMonth;

            if (currentStartWeek || currentStartWeek === 0) {
                if (currentStartWeek > 53) {
                    currentStartWeek = 1;
                    currentYear += 1;
                }
                if (currentStartWeek < 1) {
                    currentStartWeek = 53;
                    currentYear -= 1;
                }
            }
            if (currentYear < 2014) {
                currentYear = 2014;
            }

            newCurrMonth = parseInt(moment().week(currentWeek).format("MM"));

            if (currentStartWeek === 1) {
                yearOfMonth = currentYear - 1;
            } else {
                yearOfMonth = currentYear;
            }

            modelData = {
                currentStartWeek: currentStartWeek,
                currentYear: currentYear,
                yearOfMonth: yearOfMonth,
                newCurrMonth: newCurrMonth
            };

            this.calculateCurrentMonthArr(newCurrMonth, currentYear);

            this.model.set(modelData);

            return false;
        },

        calculateCurrentMonthArr: function (nowMonth, currentYear) {
            this.monthArr = [];
            this.paidUnpaidDateRange.endDate = currentYear * 100 + nowMonth;

            for (var i = 0; i < 12; i++) {
                if (nowMonth - i <= 0) {
                    this.paidUnpaidDateRange.startDate = (currentYear - 1) * 100 + (nowMonth - i + 12);
                    this.monthArr.push({
                        month: nowMonth - i + 12,
                        year: currentYear - 1
                    });
                } else {
                    this.monthArr.push({
                        month: nowMonth - i,
                        year: currentYear
                    });
                }
            }

            this.monthArr = _.sortBy(this.monthArr, function (monthObject) {
                return monthObject.year * 100 + monthObject.month
            });

            this.fetchPaidBySales();
            this.fetchUnpaidBySales();
            this.fetchCancelledBySales();
            this.fetchProjectBySales();
            this.fetchEmployeeBySales();
            this.fetchAllBonusByMonth();
            this.fetchUncalcBonus();
            this.fetchCalcBonus();
            /*
             this.fetchPaidBonus();
             this.fetchBalanceBonus();*/
        },

        changeWeek: function () {
            var prevVal = this.model.previous('currentStartWeek');
            var weekVal = this.model.get('currentStartWeek');

            if (prevVal === 53 || prevVal === 1) {
                this.$currentStartWeek.val(weekVal);
            }

            this.sendRequest();
        },

        changeYear: function () {
            var thisEl = this.$el;
            var year = thisEl.find('#currentYear');
            var yearVal = this.model.get('currentYear');

            year.text(yearVal);
        },

        changeWeeksArr: function () {
            var self = this;
            this.weekArr = this.getModelValue('weeksArr');

            if (!this.rendered) {
                return setTimeout(function () {
                    self.changeWeeksArr();
                }, 10);
            }
            this.$revenueBySales = this.$el.find('div.revenueBySales');
            this.$revenueBySales.html(this.weeksArrayTemplate({weeksArr: this.weekArr}));
        },

        sendRequest: function () {
            var model = this.model.toJSON();
            var weeksArr = [];
            var week;

            if (model.currentMonth !== model.newCurrMonth) {
                model.currentMonth = model.newCurrMonth;
            }

            for (var i = 0; i <= 13; i++) {
                if (model.currentStartWeek + i > 53) {
                    week = model.currentStartWeek + i - 53;
                    weeksArr.push({
                        lastDate: this.getDate(week),
                        week: week,
                        year: model.currentYear + 1
                    });
                } else {
                    week = model.currentStartWeek + i;
                    weeksArr.push({
                        lastDate: this.getDate(week),
                        week: week,
                        year: model.currentYear
                    });
                }
            }

            this.fetchBySales();
            this.fetchByDeps();
            // this.fetchAllBonusByMonth();
            // this.fetchUncalcBonus();
            // this.fetchCalcBonus();
            // this.fetchTotalHours();
            //this.fetchHoursSold();

            this.model.set('weeksArr', weeksArr);

            custom.cashToApp('weeksArr', weeksArr);
        },

        fetchBySales: function () {
            var self = this;
            var data = {
                week: this.model.get('currentStartWeek'),
                year: this.model.get('currentYear')
            };

            dataService.getData('/revenue/bySales', data, function (bySalesData) {
                self.model.set('bySalesData', bySalesData);
                self.model.trigger('change:bySalesData');
            });
        },

        fetchByDeps: function () {
            var self = this;
            var data = {
                week: this.model.get('currentStartWeek'),
                year: this.model.get('currentYear')
            };

            dataService.getData('/revenue/byDepartment', data, function (byDepData) {
                self.model.set('byDepData', byDepData);
                self.model.trigger('change:byDepData');
            });
        },

        fetchPaidBySales: function () {
            var self = this;
            var data = this.paidUnpaidDateRange;

            dataService.getData('/revenue/paidwtrack', data, function (byDepData) {
                self.model.set('paidBySales', byDepData);
                self.model.trigger('change:paidBySales');
                self.model.trigger('change:revenueTotal');
            });
        },

        fetchUnpaidBySales: function () {
            var self = this;
            var data = this.paidUnpaidDateRange;

            dataService.getData('/revenue/unpaidwtrack', data, function (byDepData) {
                self.model.set('unpaidBySales', byDepData);
                self.model.trigger('change:unpaidBySales');
                self.model.trigger('change:revenueTotal');
            });
        },

        fetchCancelledBySales: function () {
            var self = this;
            var data = this.paidUnpaidDateRange;

            dataService.getData('/revenue/cancelledWtrack', data, function (byDepData) {
                self.model.set('cancelledBySales', byDepData);
                self.model.trigger('change:cancelledBySales');
            });
        },

        fetchProjectBySales: function () {
            var self = this;
            var data = this.paidUnpaidDateRange;

            //ToDo Request
            dataService.getData('/revenue/projectBySales', data, function (byDepData) {
                self.model.set('projectBySales', byDepData);
                self.model.trigger('change:projectBySales');
            });
        },

        fetchEmployeeBySales: function () {
            var self = this;
            var data = this.paidUnpaidDateRange;

            //ToDo Request
            dataService.getData('/revenue/employeeBySales', data, function (byDepData) {
                self.model.set('employeeBySales', byDepData);
                self.model.trigger('change:employeeBySales');
            });
        },

        fetchAllBonusByMonth: function () {
            var self = this;
            var data = this.paidUnpaidDateRange;

            dataService.getData('/revenue/allBonus', data, function (allBonus) {
                self.model.set('allBonusByMonth', allBonus);
                self.model.trigger('change:allBonusByMonth');
            });
        },

        fetchUncalcBonus: function () {
            var self = this;
            var data = this.paidUnpaidDateRange;

            dataService.getData('/revenue/uncalcBonus', data, function (uncalcBonus) {
                self.model.set('uncalcBonus', uncalcBonus);
                self.model.trigger('change:uncalcBonus');
            });
        },

        fetchCalcBonus: function () {
            var self = this;
            var data = this.paidUnpaidDateRange;

            //ToDo Request
            dataService.getData('/revenue/calcBonus', data, function (calcBonus) {
                self.model.set('calcBonus', calcBonus);
                self.model.trigger('change:calcBonus');
            });
        },

        /*fetchPaidBonus: function () {
         var self = this;
         var data = this.paidUnpaidDateRange;

         //ToDo Request
         dataService.getData('/revenue/paidBonus', data, function (paidBonus) {
         self.model.set('paidBonus', paidBonus);
         self.model.trigger('change:paidBonus');
         });
         },

         fetchBalanceBonus: function () {
         var self = this;
         var data = this.paidUnpaidDateRange;

         //ToDo Request
         dataService.getData('/revenue/balanceBonus', data, function (balanceBonus) {
         self.model.set('balanceBonus', balanceBonus);
         self.model.trigger('change:balanceBonus');
         });
         },*/

        changeBySalesData: function () {
            var self = this;
            var weeksArr = this.model.get('weeksArr');
            var bySalesByDep = this.model.get('bySalesData');
            var target = self.$el.find('#tableBySales');
            var targetTotal = self.$el.find('[data-content="totalBySales"]');

            var bySalesByDepPerWeek = {};
            var tempPerWeek;
            var globalTotal = 0;

            async.each(this.employees, function (employee, cb) {
                var employeeId = employee._id;
                var employeeContainer = target.find('[data-id="' + employeeId + '"]');

                var byWeekData;
                var total;
                var bySalesByDepPerEmployee;


                bySalesByDepPerEmployee = _.find(bySalesByDep, function (el) {
                    return el._id === employeeId;
                });


                if (bySalesByDepPerEmployee) {
                    byWeekData = _.groupBy(bySalesByDepPerEmployee.root, 'week');
                    total = bySalesByDepPerEmployee.total;
                    globalTotal += total;
                    employeeContainer.html(self.bySalesByDepTemplate({
                        weeksArr: weeksArr,
                        byWeekData: byWeekData,
                        total: total,
                        bySalesByDepPerWeek: bySalesByDepPerWeek,
                        currencySplitter: helpers.currencySplitter
                    }));
                }
                cb();
            }, function (err) {
                if (err) {
                    alert(err);
                }

                for (var i = bySalesByDep.length - 1; i >= 0; i--) {
                    tempPerWeek = bySalesByDep[i].root;

                    tempPerWeek.forEach(function (weekResult) {
                        var key = weekResult.week;

                        if (!bySalesByDepPerWeek[key]) {
                            bySalesByDepPerWeek[key] = weekResult.revenue;
                        } else {
                            bySalesByDepPerWeek[key] += weekResult.revenue;
                        }
                    });
                }

                targetTotal.html(self.bySalesPerWeekTemplate({
                    weeksArr: weeksArr,
                    bySalesByDepPerWeek: bySalesByDepPerWeek,
                    globalTotal: globalTotal,
                    currencySplitter: helpers.currencySplitter
                }));

                return false;
            });
        },

        changeByDepData: function () {
            var self = this;
            var weeksArr = this.model.get('weeksArr');
            var bySalesByDep = this.model.get('byDepData');

            var target = self.$el.find('#tableByDep');
            var targetTotal;

            var bySalesByDepPerWeek = {};
            var tempPerWeek;
            var globalTotal = 0;

            this.departments = [];

            for (var i = bySalesByDep.length - 1; i >= 0; i--) {
                this.departments.push(bySalesByDep[i]._id);

                tempPerWeek = bySalesByDep[i].root;

                tempPerWeek.forEach(function (weekResult) {
                    var key = weekResult.week;

                    if (!bySalesByDepPerWeek[key]) {
                        bySalesByDepPerWeek[key] = weekResult.revenue;
                    } else {
                        bySalesByDepPerWeek[key] += weekResult.revenue;
                    }
                });
            }

            target.html(this.tableByDepTemplate({departments: this.departments}));
            target.find('div.revenueBySales').html(this.weeksArrayTemplate({weeksArr: this.weekArr}));
            targetTotal = $(self.$el.find('[data-content="totalByDep"]'));

            async.each(this.departments, function (department, cb) {
                var target = $('#tableByDep').find('[data-id="' + department + '"]');

                var byWeekData;
                var total;
                var bySalesByDepPerEmployee;


                bySalesByDepPerEmployee = _.find(bySalesByDep, function (el) {
                    return el._id === department;
                });


                if (bySalesByDepPerEmployee) {
                    byWeekData = _.groupBy(bySalesByDepPerEmployee.root, 'week');
                    total = bySalesByDepPerEmployee.total;
                    globalTotal += total;

                    target.html(self.bySalesByDepTemplate({
                        weeksArr: weeksArr,
                        byWeekData: byWeekData,
                        total: total,
                        bySalesByDepPerWeek: bySalesByDepPerWeek,
                        currencySplitter: helpers.currencySplitter
                    }));
                }
                cb();
            }, function (err) {
                if (err) {
                    alert(err);
                }

                targetTotal.html(self.bySalesPerWeekTemplate({
                    weeksArr: weeksArr,
                    bySalesByDepPerWeek: bySalesByDepPerWeek,
                    globalTotal: globalTotal,
                    currencySplitter: helpers.currencySplitter
                }));

                self.completeDep();

                return false;
            });
        },

        changePaidBySalesData: function () {
            var self = this;
            var paidBySales = this.model.get('paidBySales');
            var monthArr = this.monthArr;
            var target = self.$el.find('#tablePaidBySales');
            var targetTotal;
            var monthContainer;

            var bySalesByDepPerWeek = {};
            var tempPerMonth;
            var globalTotal = 0;

            target.html(this.paidBySalesTemplate({
                employees: self.employees,
                content: 'totalPaidBySales',
                className: 'totalPaid',
                headName: 'Paid WTrack'
            }));
            //target.find('div.revenueBySales').html(this.weeksArrayTemplate({weeksArr: this.weekArr}));
            targetTotal = $(self.$el.find('[data-content="totalPaidBySales"]'));
            monthContainer = target.find('.monthContainer');
            monthContainer.html(this.monthsArrayTemplate({monthArr: monthArr}));

            async.each(this.employees, function (employee, cb) {
                var employeeId = employee._id;
                var employeeContainer = target.find('[data-id="' + employeeId + '"]');

                var byMonthData;
                var total;
                var bySalesByDepPerEmployee;


                bySalesByDepPerEmployee = _.find(paidBySales, function (el) {
                    return el._id === employeeId;
                });


                if (bySalesByDepPerEmployee) {
                    byMonthData = _.groupBy(bySalesByDepPerEmployee.root, 'month');
                    total = bySalesByDepPerEmployee.total;
                    globalTotal += total;

                    employeeContainer.html(self.paidBySalesItemsTemplate({
                        monthArr: monthArr,
                        byMonthData: byMonthData,
                        total: total,
                        currencySplitter: helpers.currencySplitter
                    }));
                }
                cb();
            }, function (err) {

                if (err) {
                    alert(err);
                }

                for (var i = paidBySales.length - 1; i >= 0; i--) {
                    tempPerMonth = paidBySales[i].root;

                    tempPerMonth.forEach(function (weekResult) {
                        var key = weekResult.month;

                        if (!bySalesByDepPerWeek[key]) {
                            bySalesByDepPerWeek[key] = weekResult.revenue;
                        } else {
                            bySalesByDepPerWeek[key] += weekResult.revenue;
                        }
                    });
                }

                targetTotal.html(self.bySalesPerMonthTemplate({
                    monthArr: monthArr,
                    bySalesByDepPerWeek: bySalesByDepPerWeek,
                    globalTotal: globalTotal,
                    totalName: 'Paid Total',
                    currencySplitter: helpers.currencySplitter
                }));

                return false;
            });
        },

        changeCancelledBySalesData: function () {
            var self = this;
            var unpaidBySales = this.model.get('cancelledBySales');
            var monthArr = this.monthArr;
            var target = self.$el.find('#tableCancelledBySales');
            var targetTotal;
            var monthContainer;

            var bySalesByDepPerWeek = {};
            var tempPerMonth;
            var globalTotal = 0;

            target.html(this.paidBySalesTemplate({
                employees: self.employees,
                content: 'totalCancelledBySales',
                className: 'totalCancelled',
                headName: 'Write Off'
            }));
            target.find('div.revenueBySales').html(this.weeksArrayTemplate({weeksArr: this.weekArr}));
            targetTotal = $(self.$el.find('[data-content="totalCancelledBySales"]'));
            monthContainer = target.find('.monthContainer');
            monthContainer.html(this.monthsArrayTemplate({monthArr: monthArr}));

            async.each(this.employees, function (employee, cb) {
                var employeeId = employee._id;
                var employeeContainer = target.find('[data-id="' + employeeId + '"]');

                var byMonthData;
                var total;
                var bySalesByDepPerEmployee;


                bySalesByDepPerEmployee = _.find(unpaidBySales, function (el) {
                    return el._id === employeeId;
                });


                if (bySalesByDepPerEmployee) {
                    byMonthData = _.groupBy(bySalesByDepPerEmployee.root, 'month');
                    total = bySalesByDepPerEmployee.total;
                    globalTotal += total;

                    employeeContainer.html(self.paidBySalesItemsTemplate({
                        monthArr: monthArr,
                        byMonthData: byMonthData,
                        total: total,
                        currencySplitter: helpers.currencySplitter
                    }));
                }
                cb();
            }, function (err) {

                if (err) {
                    alert(err);
                }

                for (var i = unpaidBySales.length - 1; i >= 0; i--) {
                    tempPerMonth = unpaidBySales[i].root;
                    tempPerMonth.forEach(function (weekResult) {
                        var key = weekResult.month;

                        if (!bySalesByDepPerWeek[key]) {
                            bySalesByDepPerWeek[key] = weekResult.revenue;
                        } else {
                            bySalesByDepPerWeek[key] += weekResult.revenue;
                        }
                    });
                }

                targetTotal.html(self.bySalesPerMonthTemplate({
                    monthArr: monthArr,
                    bySalesByDepPerWeek: bySalesByDepPerWeek,
                    globalTotal: globalTotal,
                    totalName: 'Write Off Total',
                    currencySplitter: helpers.currencySplitter
                }));

                return false;
            });
        },

        changeUnpaidBySalesData: function () {
            var self = this;
            var unpaidBySales = this.model.get('unpaidBySales');
            var monthArr = this.monthArr;
            var target = self.$el.find('#tableUnpaidBySales');
            var targetTotal;
            var monthContainer;

            var bySalesByDepPerWeek = {};
            var tempPerMonth;
            var globalTotal = 0;

            target.html(this.paidBySalesTemplate({
                employees: self.employees,
                content: 'totalUnPaidBySales',
                className: 'totalUnpaid',
                headName: 'Unpaid WTrack'
            }));
            /* target.find('div.revenueBySales').html(this.weeksArrayTemplate({weeksArr: this.weekArr}));*/
            targetTotal = $(self.$el.find('[data-content="totalUnPaidBySales"]'));
            monthContainer = target.find('.monthContainer');
            monthContainer.html(this.monthsArrayTemplate({monthArr: monthArr}));

            async.each(this.employees, function (employee, cb) {
                var employeeId = employee._id;
                var employeeContainer = target.find('[data-id="' + employeeId + '"]');

                var byMonthData;
                var total;
                var bySalesByDepPerEmployee;


                bySalesByDepPerEmployee = _.find(unpaidBySales, function (el) {
                    return el._id === employeeId;
                });


                if (bySalesByDepPerEmployee) {
                    byMonthData = _.groupBy(bySalesByDepPerEmployee.root, 'month');
                    total = bySalesByDepPerEmployee.total;
                    globalTotal += total;

                    employeeContainer.html(self.paidBySalesItemsTemplate({
                        monthArr: monthArr,
                        byMonthData: byMonthData,
                        total: total,
                        currencySplitter: helpers.currencySplitter
                    }));
                }
                cb();
            }, function (err) {

                if (err) {
                    alert(err);
                }

                for (var i = unpaidBySales.length - 1; i >= 0; i--) {
                    tempPerMonth = unpaidBySales[i].root;

                    tempPerMonth.forEach(function (weekResult) {
                        var key = weekResult.month;

                        if (!bySalesByDepPerWeek[key]) {
                            bySalesByDepPerWeek[key] = weekResult.revenue;
                        } else {
                            bySalesByDepPerWeek[key] += weekResult.revenue;
                        }
                    });
                }

                targetTotal.html(self.bySalesPerMonthTemplate({
                    monthArr: monthArr,
                    bySalesByDepPerWeek: bySalesByDepPerWeek,
                    globalTotal: globalTotal,
                    totalName: 'UnPaid Total',
                    currencySplitter: helpers.currencySplitter
                }));

                return false;
            });
        },

        changeRevenue: function(){
            var self = this;
            var unpaidBySales = this.model.get('unpaidBySales');
            var paidBySales = this.model.get('paidBySales');
            var monthArr = this.monthArr;
            var target = self.$el.find('#revenueTotal');
            var targetTotal;
            var monthContainer;
            var revenueTotal = [];

            var bySalesByDepPerWeek = {};
            var tempPerMonth;
            var globalTotal = 0;

            paidBySales.forEach(function(emp){
                var employee = {};

                employee._id = emp._id;
                employee.root = [];
                employee.total = 0;

                unpaidBySales.forEach(function(unpaidEmp){

                    if (employee._id === unpaidEmp._id){
                        employee.total = emp.total + unpaidEmp.total;


                        emp.root.forEach(function(element){
                            var rootEl = {};

                            rootEl.employee = element._id;
                            rootEl.dateByMonth = element.dateByMonth;
                            rootEl.month = element.month;
                            rootEl.year = element.year;
                            rootEl.revenue = element.revenue;

                            unpaidEmp.root.forEach(function(unpaidEl){
                                if (element.dateByMonth[0] === unpaidEl.dateByMonth[0]){
                                    rootEl.revenue += unpaidEl.revenue;
                                }
                            });
                            employee.root.push(rootEl);
                        });
                    }

                });

                revenueTotal.push(employee);
            });

            target.html(this.paidBySalesTemplate({
                employees: self.employees,
                content: 'revenueTotal',
                className: 'revenueTotal',
                headName: 'Revenue'
            }));

            targetTotal = $(self.$el.find('[data-content="revenueTotal"]'));
            monthContainer = target.find('.monthContainer');
            monthContainer.html(this.monthsArrayTemplate({monthArr: monthArr}));

            async.each(this.employees, function (employee, cb) {
                var employeeId = employee._id;
                var employeeContainer = target.find('[data-id="' + employeeId + '"]');

                var byMonthData;
                var total;
                var bySalesByDepPerEmployee;


                bySalesByDepPerEmployee = _.find(revenueTotal, function (el) {
                    return el._id === employeeId;
                });


                if (bySalesByDepPerEmployee) {
                    byMonthData = _.groupBy(bySalesByDepPerEmployee.root, 'month');
                    total = bySalesByDepPerEmployee.total;
                    globalTotal += total;

                    employeeContainer.html(self.paidBySalesItemsTemplate({
                        monthArr: monthArr,
                        byMonthData: byMonthData,
                        total: total,
                        currencySplitter: helpers.currencySplitter
                    }));
                }
                cb();
            }, function (err) {

                if (err) {
                    alert(err);
                }

                for (var i = revenueTotal.length - 1; i >= 0; i--) {
                    tempPerMonth = revenueTotal[i].root;

                    tempPerMonth.forEach(function (weekResult) {
                        var key = weekResult.month;

                        if (!bySalesByDepPerWeek[key]) {
                            bySalesByDepPerWeek[key] = weekResult.revenue;
                        } else {
                            bySalesByDepPerWeek[key] += weekResult.revenue;
                        }
                    });
                }

                targetTotal.html(self.bySalesPerMonthTemplate({
                    monthArr: monthArr,
                    bySalesByDepPerWeek: bySalesByDepPerWeek,
                    globalTotal: globalTotal,
                    totalName: 'Revenue Total',
                    currencySplitter: helpers.currencySplitter
                }));

                return false;
            });
        },

        changeProjectBySales: function () {
            var self = this;
            var projectBySales = this.model.get('projectBySales');
            var monthArr = this.monthArr;
            var target = self.$el.find('#tableProjectBySales');
            var targetTotal;
            var monthContainer;

            var bySalesByDepPerWeek = {};
            var tempPerMonth;
            var globalTotal = 0;

            target.html(this.paidBySalesTemplate({
                employees: self.employees,
                content: 'totalProjectBySales',
                className: 'totalProject',
                headName: 'Project by Sales',
                currencySplitter: helpers.currencySplitter
            }));

            targetTotal = $(self.$el.find('[data-content="totalProjectBySales"]'));
            monthContainer = target.find('.monthContainer');
            monthContainer.html(this.monthsArrayTemplate({monthArr: monthArr}));

            async.each(self.employees, function (employee, cb) {
                var employeeId = employee._id;
                var employeeContainer = target.find('[data-id="' + employeeId + '"]');

                var byMonthData;
                var total;
                var bySalesByDepPerEmployee;


                bySalesByDepPerEmployee = _.find(projectBySales, function (el) {
                    return el._id === employeeId;
                });


                if (bySalesByDepPerEmployee) {
                    byMonthData = _.groupBy(bySalesByDepPerEmployee.root, 'month');
                    total = bySalesByDepPerEmployee.total;
                    globalTotal += total;

                    employeeContainer.html(self.projectBySalesItemsTemplate({
                        monthArr: monthArr,
                        byMonthData: byMonthData,
                        total: total,
                        currencySplitter: helpers.currencySplitter
                    }));
                }
                cb();
            }, function (err) {

                if (err) {
                    alert(err);
                }

                for (var i = projectBySales.length - 1; i >= 0; i--) {
                    tempPerMonth = projectBySales[i].root;

                    tempPerMonth.forEach(function (weekResult) {
                        var key = weekResult.month;

                        if (!bySalesByDepPerWeek[key]) {
                            bySalesByDepPerWeek[key] = weekResult.projectCount;
                        } else {
                            bySalesByDepPerWeek[key] += weekResult.projectCount;
                        }
                    });
                }

                targetTotal.html(self.bySalesPerMonthIntTemplate({
                    monthArr: monthArr,
                    bySalesByDepPerWeek: bySalesByDepPerWeek,
                    globalTotal: globalTotal,
                    totalName: 'Projects Total',
                    currencySplitter: helpers.currencySplitter
                }));

                return false;
            });
        },

        changeEmployeeBySales: function () {
            var self = this;
            var employeeBySales = this.model.get('employeeBySales');
            var monthArr = this.monthArr;
            var target = self.$el.find('#tableEmployeeBySales');
            var targetTotal;
            var monthContainer;

            var bySalesByDepPerWeek = {};
            var tempPerMonth;
            var globalTotal = 0;

            target.html(this.paidBySalesTemplate({
                employees: self.employees,
                content: 'totalEmployeeBySales',
                className: 'totalEmployee',
                headName: 'Employee by Sales'
            }));
            targetTotal = $(self.$el.find('[data-content="totalEmployeeBySales"]'));
            monthContainer = target.find('.monthContainer');
            monthContainer.html(this.monthsArrayTemplate({monthArr: monthArr}));

            async.each(self.employees, function (employee, cb) {
                var employeeId = employee._id;
                var employeeContainer = target.find('[data-id="' + employeeId + '"]');

                var byMonthData;
                var total;
                var bySalesByDepPerEmployee;


                bySalesByDepPerEmployee = _.find(employeeBySales, function (el) {
                    return el._id === employeeId;
                });


                if (bySalesByDepPerEmployee) {
                    byMonthData = _.groupBy(bySalesByDepPerEmployee.root, 'month');
                    total = bySalesByDepPerEmployee.total;
                    globalTotal += total;

                    employeeContainer.html(self.projectBySalesItemsTemplate({
                        monthArr: monthArr,
                        byMonthData: byMonthData,
                        total: total,
                        currencySplitter: helpers.currencySplitter
                    }));
                }
                cb();
            }, function (err) {

                if (err) {
                    alert(err);
                }

                for (var i = employeeBySales.length - 1; i >= 0; i--) {
                    tempPerMonth = employeeBySales[i].root;

                    tempPerMonth.forEach(function (weekResult) {
                        var key = weekResult.month;

                        if (! bySalesByDepPerWeek[key]) {
                            bySalesByDepPerWeek[key] = weekResult.projectCount;
                        } else {
                            bySalesByDepPerWeek[key] += weekResult.projectCount;
                        }
                    });
                }

                targetTotal.html(self.bySalesPerMonthIntTemplate({
                    monthArr: monthArr,
                    bySalesByDepPerWeek: bySalesByDepPerWeek,
                    globalTotal: globalTotal,
                    totalName: 'Employee Total',
                    currencySplitter: helpers.currencySplitter
                }));

                return false;
            });
        },

        showBonus: function (e) {
            var target = $(e.target);
            var tergetText = target.prev().text();
            var id = target.closest('div').attr('data-value');
            var dataVal = target.closest('div').attr('data-cont');
            var table = this.$el.find('#' + dataVal);
            var bonusRows = table.find("[data-value='" + id + "bonus']");


            var bonusCells = table.find("#" + id + " .divRow");

            bonusCells.toggle();
            bonusRows.toggle();
            bonusRows.children().toggle();

            if (tergetText === '+') {
                target.prev().text('-');
            } else {
                target.prev().text('+');
            }

        },
        changeAllBonusByMonth: function () {
            var self = this;
            var allBonus = this.model.get('allBonusByMonth');
            var monthArr = this.monthArr;
            var target = self.$el.find('#totalAllBonus');
            var targetTotal;
            var monthContainer;
            var bySalesPerMonth = {};
            var tempPerMonth;
            var globalTotal = 0;
            var employee = [];
            var bonusRows;

            async.each(allBonus, function (element, cb) {
                var obj = {};
                var keys;

                obj.bonus = {};
                obj._id = element._id;
                obj.name = element.name;
                keys = Object.keys(element);

                keys.forEach(function (key) {
                    if (typeof element[key] === 'object') {
                        obj.bonus = Object.keys(element[key]);
                        obj.bonus.splice(0, 1);
                    }
                });

                employee.push(obj);
            });


            target.html(this.allBonusTemplate({
                employees: employee,
                content: 'totalAllBonus',
                className: 'totalByAllBonus',
                headName: 'All Bonus'
            }));
            targetTotal = $(self.$el.find('[data-content="totalAllBonus"]'));
            monthContainer = target.find('.monthContainer');
            monthContainer.html(this.monthsArrayTemplate({monthArr: monthArr}));

            async.each(allBonus, function (element, cb) {
                var employeeId = element._id;
                var employeeContainer = target.find('[data-id="' + employeeId + '"]');
                var total;

                if (allBonus) {
                    total = element.total;
                    globalTotal += total;

                    employeeContainer.html(self.allBonusByMonth({
                        content: 'totalAllBonus',
                        bonus: employee,
                        monthArr: monthArr,
                        byMonthData: element,
                        total: total,
                        currencySplitter: helpers.currencySplitter
                    }));
                }

                cb();
            }, function (err) {

                if (err) {
                    alert(err);
                }

                for (var i = allBonus.length - 1; i >= 0; i--) {
                    tempPerMonth = allBonus[i];

                    monthArr.forEach(function (monthResult) {
                        var key = monthResult.year * 100 + monthResult.month;

                        if (!bySalesPerMonth[key]) {
                            if (tempPerMonth[key]) {
                                bySalesPerMonth[key] = tempPerMonth[key]['total'];
                            }
                        } else {
                            bySalesPerMonth[key] += tempPerMonth[key]['total'];
                        }
                    });
                }

                targetTotal.html(self.perMonthForAllBonus({
                    content: 'totalAllBonus',
                    monthArr: monthArr,
                    perMonth: bySalesPerMonth,
                    globalTotal: globalTotal,
                    totalName: 'Bonus Total',
                    currencySplitter: helpers.currencySplitter
                }));

                bonusRows = $.find("[data-val='totalAllBonus']");

                bonusRows.forEach(function (bonusRow) {
                    $(bonusRow).toggle();
                });

                return false;
            });
        },

        changeUnCalcBonusByMonth: function () {
            var self = this;
            var allBonus = this.model.get('uncalcBonus');
            var monthArr = this.monthArr;
            var target = self.$el.find('#totalUncalcBonus');
            var targetTotal;
            var monthContainer;
            var bySalesPerMonth = {};
            var tempPerMonth;
            var globalTotal = 0;
            var employee = [];
            var bonusRows;

            async.each(allBonus, function (element, cb) {
                var obj = {};
                var keys;

                obj.bonus = {};
                obj._id = element._id;
                obj.name = element.name;
                keys = Object.keys(element);

                keys.forEach(function (key) {
                    if (typeof element[key] === 'object') {
                        obj.bonus = Object.keys(element[key]);
                        obj.bonus.splice(0, 1);
                    }
                });

                employee.push(obj);
            });


            target.html(this.allBonusTemplate({
                employees: employee,
                content: 'totalUncalcBonus',
                className: 'totalUncalcBonus',
                headName: 'Uncalc Bonus'
            }));
            targetTotal = $(self.$el.find('[data-content="totalUncalcBonus"]'));
            monthContainer = target.find('.monthContainer');
            monthContainer.html(this.monthsArrayTemplate({monthArr: monthArr}));

            async.each(allBonus, function (element, cb) {
                var employeeId = element._id;
                var employeeContainer = target.find('[data-id="' + employeeId + '"]');
                var total;

                if (allBonus) {
                    total = element.total;
                    globalTotal += total;

                    employeeContainer.html(self.allBonusByMonth({
                        content: 'totalUncalcBonus',
                        bonus: employee,
                        monthArr: monthArr,
                        byMonthData: element,
                        total: total,
                        currencySplitter: helpers.currencySplitter
                    }));
                }

                cb();
            }, function (err) {

                if (err) {
                    alert(err);
                }

                for (var i = allBonus.length - 1; i >= 0; i--) {
                    tempPerMonth = allBonus[i];

                    monthArr.forEach(function (monthResult) {
                        var key = monthResult.year * 100 + monthResult.month;

                        if (!bySalesPerMonth[key]) {
                            if (tempPerMonth[key]) {
                                bySalesPerMonth[key] = tempPerMonth[key]['total'];
                            }
                        } else {
                            bySalesPerMonth[key] += tempPerMonth[key]['total'];
                        }
                    });
                }

                targetTotal.html(self.perMonthForAllBonus({
                    content: 'totalUncalcBonus',
                    monthArr: monthArr,
                    perMonth: bySalesPerMonth,
                    globalTotal: globalTotal,
                    totalName: 'Uncalc Bonus Total',
                    currencySplitter: helpers.currencySplitter
                }));

                bonusRows = $.find("[data-val='totalUncalcBonus']");

                bonusRows.forEach(function (bonusRow) {
                    $(bonusRow).toggle();
                });

                return false;
            });
        },

        changeCalcBonusByMonth: function () {
            var self = this;
            var allBonus = this.model.get('calcBonus');
            var monthArr = this.monthArr;
            var target = self.$el.find('#totalCalcBonus');
            var targetTotal;
            var monthContainer;
            var bySalesPerMonth = {};
            var tempPerMonth;
            var globalTotal = 0;
            var employee = [];
            var bonusRows;

            async.each(allBonus, function (element, cb) {
                var obj = {};
                var keys;

                obj.bonus = {};
                obj._id = element._id;
                obj.name = element.name;
                keys = Object.keys(element);

                keys.forEach(function (key) {
                    if (typeof element[key] === 'object') {
                        obj.bonus = Object.keys(element[key]);
                        obj.bonus.splice(0, 1);
                    }
                });

                employee.push(obj);
            });


            target.html(this.allBonusTemplate({
                employees: employee,
                content: 'totalCalcBonus',
                className: 'totalCalcBonus',
                headName: 'Calc Bonus'
            }));
            targetTotal = $(self.$el.find('[data-content="totalCalcBonus"]'));
            monthContainer = target.find('.monthContainer');
            monthContainer.html(this.monthsArrayTemplate({monthArr: monthArr}));

            async.each(allBonus, function (element, cb) {
                var employeeId = element._id;
                var employeeContainer = target.find('[data-id="' + employeeId + '"]');
                var total;

                if (allBonus) {
                    total = element.total;
                    globalTotal += total;

                    employeeContainer.html(self.allBonusByMonth({
                        content: 'totalCalcBonus',
                        bonus: employee,
                        monthArr: monthArr,
                        byMonthData: element,
                        total: total,
                        currencySplitter: helpers.currencySplitter
                    }));
                }

                cb();
            }, function (err) {

                if (err) {
                    alert(err);
                }

                for (var i = allBonus.length - 1; i >= 0; i--) {
                    tempPerMonth = allBonus[i];

                    monthArr.forEach(function (monthResult) {
                        var key = monthResult.year * 100 + monthResult.month;

                        if (!bySalesPerMonth[key]) {
                            if (tempPerMonth[key]) {
                                bySalesPerMonth[key] = tempPerMonth[key]['total'];
                            }
                        } else {
                            bySalesPerMonth[key] += tempPerMonth[key]['total'];
                        }
                    });
                }

                targetTotal.html(self.perMonthForAllBonus({
                    content: 'totalCalcBonus',
                    monthArr: monthArr,
                    perMonth: bySalesPerMonth,
                    globalTotal: globalTotal,
                    totalName: 'Calc Bonus Total',
                    currencySplitter: helpers.currencySplitter
                }));

                bonusRows = $.find("[data-val='totalCalcBonus']");

                bonusRows.forEach(function (bonusRow) {
                    $(bonusRow).toggle();
                });

                return false;
            });
        },

        completeDep: function () {
            var self = this;
            var data = [];
            var data2 = [];
            var data3 = [];
            var data4 = [];
            var maxdata = 0;
            var weeksArr = this.model.get('weeksArr');
            var weekLength = weeksArr.length;
            var dataByDep = _.groupBy(self.model.get('byDepData'), '_id');
            var keys = Object.keys(dataByDep);
            var keysLength = keys.length - 1;
            var height = 150;
            var width = $('.chartContainer').width() - 140;
            var chart;
            var x;
            var y;
            var yAxis;
            var line;

            for (var i = keysLength; i >= 0; i--) {
                dataByDep[keys[i]] = _.groupBy(dataByDep[keys[i]][0].root, 'week');
            }

            for (var j = 0; j < weekLength; j++) {
                var b;
                if (dataByDep['Android']) {
                    b = dataByDep['Android'][weeksArr[j].week] ? dataByDep['Android'][weeksArr[j].week][0].revenue : 0;
                } else {
                    b = 0;
                }
                if (maxdata < b)maxdata = b;
                data.push({
                    Revenue: b,
                    week: weeksArr[j].week
                });

                if (dataByDep['iOS']) {
                    b = dataByDep['iOS'][weeksArr[j].week] ? dataByDep['iOS'][weeksArr[j].week][0].revenue : 0;
                } else {
                    b = 0;
                }
                if (maxdata < b)maxdata = b;
                data2.push({
                    Revenue: b,
                    week: weeksArr[j].week
                });

                if (dataByDep['WP']) {
                    b = dataByDep['WP'][weeksArr[j].week] ? dataByDep['WP'][weeksArr[j].week][0].revenue : 0;
                } else {
                    b = 0;
                }
                if (maxdata < b)maxdata = b;
                data3.push({
                    Revenue: b,
                    week: weeksArr[j].week
                });

                if (dataByDep['Web']) {
                    b = dataByDep['Web'][weeksArr[j].week] ? dataByDep['Web'][weeksArr[j].week][0].revenue : 0;
                } else {
                    b = 0;
                }
                if (maxdata < b)maxdata = b;
                data4.push({
                    Revenue: b,
                    week: weeksArr[j].week
                });
            }

            $('#chart').empty();
            chart = d3.select("#chart")
                .attr("width", width)
                .attr("height", height + 12)
                .append("g")
                .attr("transform", "translate(60,0)");

            x = d3.scale.ordinal().rangeRoundBands([0, width], 0.2);
            x.domain(data.map(function (d) {
                return d.week;
            }));

            y = d3.scale.linear().range([height, 0]);
            y.domain([0, maxdata + 0.1 * maxdata]);

            line = d3.svg.line().x(function (d) {
                return x(d.week) + x.rangeBand() / 2;
            }).y(function (d) {
                return y(d.Revenue);
            });

            yAxis = d3.svg.axis().scale(y).orient("left").tickFormat(d3.format("d")).ticks(4).tickFormat(d3.format("m"));

            chart.append("g").attr("class", "y axis").call(yAxis);
            chart.select(".y.axis").selectAll(".tick").selectAll("line").attr("x1", 1300);
            chart.select(".y.axis").selectAll(".tick").selectAll("text").text(function (d) {
                d = d.toString();
                return d = d.substring(0, d.length - 3) + " " + d.substring(d.length - 3, d.length);
            });
            chart.append("path")
                .datum(data)
                .attr("class", "line2")
                .attr("transform", "translate(-60,0)")
                .attr("d", line);

            chart.selectAll(".circle2")
                .data(data)
                .enter()
                .append("circle")
                .attr("class", "circle2")
                .attr("transform", "translate(-60,0)")
                .attr("cx", function (d) {
                    return x(d.week) + x.rangeBand() / 2;
                })
                .attr("cy", function (d) {
                    return y(d.Revenue);
                })
                .attr("r", function (d) {
                    return 4;
                })
                .style("stroke-width", "1.2");

            chart.append("path")
                .datum(data2)
                .attr("class", "line3")
                .attr("transform", "translate(-60,0)")
                .attr("d", line);
            chart.selectAll(".circle3")
                .data(data2)
                .enter()
                .append("circle")
                .attr("class", "circle3")
                .attr("transform", "translate(-60,0)")
                .attr("cx", function (d) {
                    return x(d.week) + x.rangeBand() / 2;
                })
                .attr("cy", function (d) {
                    return y(d.Revenue);
                })
                .attr("r", function (d) {
                    return 4;
                })
                .style("stroke-width", "1.2");

            chart.append("path")
                .datum(data3)
                .attr("class", "line4")
                .attr("transform", "translate(-60,0)")
                .attr("d", line);
            chart.selectAll(".circle4")
                .data(data3)
                .enter()
                .append("circle")
                .attr("class", "circle4")
                .attr("transform", "translate(-60,0)")
                .attr("cx", function (d) {
                    return x(d.week) + x.rangeBand() / 2;
                })
                .attr("cy", function (d) {
                    return y(d.Revenue);
                })
                .attr("r", function (d) {
                    return 4;
                })
                .style("stroke-width", "1.2");


            chart.append("path")
                .datum(data4)
                .attr("class", "line5")
                .attr("transform", "translate(-60,0)")
                .attr("d", line);
            chart.selectAll(".circle5")
                .data(data4)
                .enter()
                .append("circle")
                .attr("class", "circle5")
                .attr("transform", "translate(-60,0)")
                .attr("cx", function (d) {
                    return x(d.week) + x.rangeBand() / 2;
                })
                .attr("cy", function (d) {
                    return y(d.Revenue);
                })
                .attr("r", function (d) {
                    return 4;
                })
                .style("stroke-width", "1.2");
        },

        render: function (employees) {
            $('title').text(this.contentType);

            var self = this;
            var thisEl = this.$el;
            var model = this.model.toJSON();

            this.employees = employees;

            model.employees = employees;

            this.$el.html(this.template(model));

            this.$el.find("#currentStartWeek").spinner({
                min: 0,
                max: 54
            });

            this.$currentStartWeek = thisEl.find('#currentStartWeek');
            this.$revenueBySales = thisEl.find('.revenueBySales');

            this.rendered = true;

            return this;
        }
    });

    return View;
});