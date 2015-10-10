define(["text!templates/Projects/projectInfo/wTracks/generate.html",
		'populate',
		'dataService',
		'moment',
		'common'
	],
	function (generateTemplate, populate, dataService, moment, common) {
		"use strict";
		var CreateView = Backbone.View.extend({
				template                 : _.template(generateTemplate),
				wTrackPerEmployeeTemplate: _.template(wTrackPerEmployeeTemplate),
				responseObj              : {},

				events: {

				},

				keyDown: function (e) {
					if (e.which === 13) {
						this.setChangedValueToModel();
					}
				},

				stopDefaultEvents: function (e) {
					e.stopPropagation();
					e.preventDefault();
				},

				initialize: function (options) {
					this.render();
				},

				hideDialog: function () {
					$(".edit-dialog").remove();
				},

				chooseOption: function (e) {
					var target = $(e.target);
					var targetElement = target.parents("td");
					var tr = target.parents("tr");
					var modelId = tr.attr('data-id');
					var id = target.attr("id");
					var attr = targetElement.attr("id") || targetElement.attr("data-content");
					var elementType = '#' + attr;
					var departmentContainer;
					var selectorContainer;
					var endDateDP;
					var endDateInput;
					var endDateTD;

					var element = _.find(this.responseObj[elementType], function (el) {
						return el._id === id;
					});

					var editWtrackModel = this.resultArray[modelId];
					var employee;
					var department;

					targetElement.attr('data-id', id);
					selectorContainer = targetElement.find('a.current-selected');

					if (elementType === '#employee') {
						departmentContainer = tr.find('[data-content="department"]');
						departmentContainer.find('a.current-selected').text(element.department.name);
						departmentContainer.removeClass('errorContent');

						employee = {
							_id : element._id,
							name: element.name
						};
						department = {
							_id           : element.department._id,
							departmentName: element.department.name
						}

						editWtrackModel.employee = employee;
						editWtrackModel.department = department;

					} else {
						targetElement.find('a').text(target.text());
						endDateTD = tr.find('.endDateTD');
						endDateDP = endDateTD.find('.endDateDP');
						endDateInput = endDateTD.find('.endDateInput');

						if (target.attr('data-content') === 'byDate') {
							endDateDP.removeClass('hidden');
							endDateInput.addClass('hidden');
							endDateTD.attr('data-content', 'endDate');
						} else if (target.attr('data-content') === 'byHours') {
							endDateInput.removeClass('hidden');
							endDateDP.addClass('hidden');
							endDateTD.attr('data-content', 'hours');
						}
					}

					targetElement.removeClass('errorContent');

					selectorContainer.text(target.text());

					this.hideNewSelect();

					return false;
				}
				,

				hideNewSelect: function () {
					$(".newSelectList:not('.generateTypeUl')").remove();
					$(".generateTypeUl").hide();
				}
				,

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
								click: self.generateItems
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

					this.$listTable = $('#rawTable tbody');

					return this;
				}
			})
			;
		return CreateView;
	})
;