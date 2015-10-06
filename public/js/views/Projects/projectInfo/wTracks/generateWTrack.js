define(["text!templates/Projects/projectInfo/wTracks/generate.html",
		"text!templates/Projects/projectInfo/wTracks/wTrackPerEmployee.html",
		'views/Projects/projectInfo/wTracks/wTrackPerEmployee',
		'populate',
		'dataService'
	],
	function (generateTemplate, wTrackPerEmployeeTemplate, wTrackPerEmployee, populate, dataService) {
		"use strict";
		var CreateView = Backbone.View.extend({
			template                 : _.template(generateTemplate),
			wTrackPerEmployeeTemplate: _.template(wTrackPerEmployeeTemplate),
			responseObj              : {},

			events: {
				"click .newSelectList li:not(.miniStylePagination,.generateType)" : "chooseOption",
				"click .current-selected"                                         : "showNewSelect",
				"click .newSelectList li.miniStylePagination"                     : "notHide",
				"click .newSelectList li.miniStylePagination .next:not(.disabled)": "nextSelect",
				"click .newSelectList li.miniStylePagination .prev:not(.disabled)": "prevSelect",
				"click #addNewEmployeeRow"                                        : "addNewEmployeeRow",
				"click a.generateType"                                            : "generateType",
				"click"                                                           : "hideNewSelect"
			},

			stopDefaultEvents: function (e) {
				e.stopPropagation();
				e.preventDefault();
			},

			initialize: function (options) {
				this.model = options.model;

				this.render();
			},

			generateType: function (e) {
				var targetEl = $(e.target);
				var td = targetEl.closest('td');
				var ul = td.find('.generateType');

				ul.removeClass('hidden');
				ul.addClass('newSelectList');

				this.stopDefaultEvents(e);


			},

			addNewEmployeeRow: function (e) {
				this.stopDefaultEvents(e);

				var target = $(e.target);
				//var wTrackPerEmployeeContainer = this.$el.find('#wTrackItemsHolder');
				var parrent = target.closest('tbody');
				var parrentRow = parrent.find('.productItem').last();
				var rowId = parrentRow.attr("data-id");
				var trEll = parrent.find('tr.productItem');
				var elem = this.wTrackPerEmployeeTemplate({
					year : 2015,
					month: 10,
					week : 40
				});
				var errors = this.$el.find('.errorContent');

				if ((rowId === undefined || rowId !== 'false') && errors.length === 0) {
					if (!trEll.length) {
						parrent.prepend(elem);
						return this.bindDataPicker(elem);
					}

					$(trEll[trEll.length - 1]).after(elem);
					this.bindDataPicker(elem);
				}


			},

			bindDataPicker: function () {
				var dataPickerContainers = $('.datapicker');

				dataPickerContainers.datepicker({
					dateFormat : "d M, yy",
					changeMonth: true,
					changeYear : true
				}).removeClass('datapicker');

				/*dataPickerContainers.each(function(){
				 $(this).datepicker({
				 dateFormat : "d M, yy",
				 changeMonth: true,
				 changeYear : true
				 }).removeClass('datapicker');
				 });*/
			},

			generateItems: function () {

			},

			hideDialog: function () {
				$(".edit-dialog").remove();
			},

			showNewSelect: function (e, prev, next) {
				var targetEl = $(e.target);
				var content = targetEl.closest('td').attr('data-content');
				var tr;
				var department;

				/*if(content === 'employee'){
				 tr = targetEl.closest('tr');
				 department = tr.find('td[data-content="department"]').attr('data-id');

				 populate.employeesByDep({
				 e: e,
				 prev: prev,
				 next: next,
				 context: this,
				 department: department
				 });

				 return false;
				 }*/

				populate.showSelect(e, prev, next, this);

				return false;
			},

			nextSelect: function (e) {
				this.showNewSelect(e, false, true);
			},

			prevSelect: function (e) {
				this.showNewSelect(e, true, false);
			},

			chooseOption: function (e) {
				var target = $(e.target);
				var targetElement = target.parents("td");
				var tr = target.parents("tr");
				var id = target.attr("id");
				var attr = targetElement.attr("id") || targetElement.data("content");
				var elementType = '#' + attr;
				var departmentContainer;
				var selectorContainer;

				var element = _.find(this.responseObj[elementType], function (el) {
					return el._id === id;
				});

				targetElement.attr('data-id', id);
				selectorContainer = targetElement.find('a.current-selected');

				if (elementType === '#employee') {
					departmentContainer = tr.find('[data-content="department"]');
					departmentContainer.find('a.current-selected').text(element.department.name);
					departmentContainer.removeClass('errorContent');

					tr.attr('data-id', id);
				}

				targetElement.removeClass('errorContent');

				selectorContainer.text(target.text());

				this.hideNewSelect();

				return false;
			},

			hideNewSelect: function () {
				$(".newSelectList").remove();
			},

			render: function () {
				var thisEl = this.$el;
				var project = this.model.toJSON();
				var dialog = this.template({
					project: project
				});
				var self = this;

				this.$el = $(dialog).dialog({
					dialogClass: "edit-dialog",
					width      : 1200,
					title      : "Generate weTrack",
					buttons    : {
						save  : {
							text : "Generate",
							class: "btn",
							id   : "generateBtn",
							click: self.generateItems()
						},
						cancel: {
							text : "Cancel",
							class: "btn",
							click: function () {
								self.hideDialog();
							}
						}
					}
				});

				//ToDo Refactor hardcoded Employee ...

				dataService.getData("/employee/getForDD", null, function (employees) {
					employees = _.map(employees.data, function (employee) {
						employee.name = employee.name.first + ' ' + employee.name.last;

						return employee;
					});

					self.responseObj['#employee'] = employees;
				});
				dataService.getData("/department/getForDD", null, function (departments) {
					departments = _.map(departments.data, function (department) {
						department.name = department.departmentName;

						return department;
					});

					self.responseObj['#department'] = departments;
				});

				thisEl.find('#expectedDate').datepicker({
					dateFormat : "d M, yy",
					changeMonth: true,
					changeYear : true
				});
			}
		});
		return CreateView;
	});