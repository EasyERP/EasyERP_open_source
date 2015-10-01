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
				"click .newSelectList li:not(.miniStylePagination)": "chooseOption",
				"click .current-selected"                          : "showNewSelect",
				"click #addNewEmployeeRow"                          : "addNewEmployeeRow",
				"click"                                            : "hideNewSelect"
			},

			initialize: function (options) {
				this.model = options.model;

				this.render();
			},

			//ToDo remove this.default table after success generate

			addNewEmployeeRow: function(){
				var wTrackPerEmployeeContainer = this.$el.find('#productItemsHolder');

				wTrackPerEmployeeContainer.append(
					new wTrackPerEmployee().render({
						employee: {
							_id: 'testEmploee12345'
						},
						year    : 2015,
						month   : 10,
						week    : 40
					}).el
				);
			},

			generateItems: function () {

			},

			hideDialog: function () {
				$(".edit-dialog").remove();
			},

			showNewSelect: function (e, prev, next) {
				populate.showSelect(e, prev, next, this);
				return false;
			},

			chooseOption: function (e) {
				var targetEl = $(e.target);
				var text = targetEl.text();

				targetEl.parents("dd").find(".current-selected").text(text).attr("data-id", targetEl.attr("id"));
				$(".newSelectList").hide();
			},

			hideNewSelect: function () {
				$(".newSelectList").hide();
			},

			render: function () {
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

			}
		});
		return CreateView;
	});