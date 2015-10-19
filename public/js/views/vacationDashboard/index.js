define([
	'text!templates/vacationDashboard/index.html',
	'views/vacationDashboard/statisticsView',
	'collections/Dashboard/vacationDashboard',
	'views/wTrack/dashboard/vacationDashEdit',
	'dataService',
	'async',
	'custom',
	'moment',
	'constants'
], function (mainTemplate, StatisticsView, vacationDashboard, VacationDashEdit, dataService, async, custom, moment, CONSTANTS) {
	var View = Backbone.View.extend({
		el: '#content-holder',

		contentType: CONSTANTS.DASHBOARD_VACATION,

		template : _.template(mainTemplate),
		expandAll: false,

		events: {
			"click .openAll"        : "openAll",
			"click .employeesRow"   : "openEmployee",
			"click .group"          : "openDepartment",
			"click .wTrackInfo"     : "getWtrackInfo"
		},

		initialize: function (options) {
			var dashCollection;
			var startWeek;
			var self = this;
			var year;
			var week;
			var socket = App.socket;

			this.startTime = options.startTime;

			year = moment().isoWeekYear();
			week = moment().isoWeek();

			this.dateByWeek = year * 100 + week;
			this.week = week;
			this.year = year;

			startWeek = self.week - 6;

			if (startWeek >= 0) {
				this.startWeek = startWeek;
			} else {
				this.startWeek = startWeek + 53;
				this.year -= 1;
			}

			dashCollection = this.dashCollection = custom.retriveFromCash('dashboardVacation');

			if (!dashCollection) {
				dashCollection = this.dashCollection = this.fetchData();
				dashCollection.on('reset sort', this.render, this);
			} else {
				this.render();
			}

			year = moment().isoWeekYear();
			week = moment().isoWeek();

			self.dateByWeek = year * 100 + week;
			self.week = week;
			self.year = year;
			startWeek = self.week - 6;

			if (startWeek >= 0) {
				self.startWeek = startWeek;
			} else {
				self.startWeek = startWeek + 53;
				self.year -= 1;
			}
		},

		fetchData: function () {
			var dashCollection;

			dashCollection = new vacationDashboard();
			custom.cashToApp('dashboardVacation', dashCollection);

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
			var firedArr = employee.get('fired');
			var firedLength = firedArr.length;
			var hiredArr = employee.get('hired');
			var year = week.dateByWeek.toString().slice(0, 4);
			var _week = week.dateByWeek.toString().slice(4);

			var _hiredDate;
			var _firedDate;
			var _lastHiredDate = moment(hiredArr[hiredArr.length - 1], 'YYYY-MM-DD');

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

					if (date.isBetween(_hiredDate, _firedDate) || date > _lastHiredDate) {
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

		getDate: function (num) {
			return moment().day("Monday").week(num).format("DD.MM");
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

			var queryData = {
				projectName: projectName,
				dateByWeek : dateByWeek,
				employee   : employee
			};

			dataService.getData('/wTrack/dash', queryData, function (response) {
				var year = dateByWeek.slice(0, 4);
				var week = dateByWeek.slice(4, 6);

				if (!response.error) {
					return new VacationDashEdit({
						tr: tr,
						dateByWeek: dateByWeek,
						projectName   : projectName,
						customer      : response.customer,
						projectmanager: response.projectmanager,
						wTracks       : response.wTracks
					});
				}
			});
		},

		render: function () {
			$('title').text(this.contentType);
			this.dashCollection.unbind();

			var currentEl = this.$el;
			var self = this;
			var weeksArr = custom.retriveFromCash('weeksArr') || [];
			var week;
			var startWeek = this.startWeek;
			var dashboardData = this.dashCollection.toJSON();

			if (!weeksArr || !weeksArr.length) {
				for (var i = 0; i <= 13; i++) {
					if (startWeek + i > 53) {
						week = startWeek + i - 53;
						weeksArr.push({
							lastDate: this.getDate(week),
							week    : week,
							year    : this.year + 1
						});
					} else {
						week = startWeek + i;
						weeksArr.push({
							lastDate: this.getDate(week),
							week    : week,
							year    : this.year
						});
					}
				}

				custom.cashToApp('weeksArr', weeksArr);
			}

			currentEl.html(self.template({
				weeks         : weeksArr,
				dashboardData : dashboardData,
				leadComparator: self.leadComparator,
				getCellClass  : self.getCellClass,
				getCellSize   : self.getCellSize,
				getHeadClass  : self.getHeadClass,
				self          : self
			}));

			var statictics = new StatisticsView({});
			this.statisticsView$ = statictics;
			currentEl.append("<div id='timeRecivingDataFromServer'>Created in " + (new Date() - this.startTime) + " ms</div>");
			this.calculateStatistics();

			return this;
		}
	});

	return View;
});