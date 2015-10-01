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
				"click .newSelectList li.miniStylePagination": "notHide",
				"click .newSelectList li.miniStylePagination .next:not(.disabled)": "nextSelect",
				"click .newSelectList li.miniStylePagination .prev:not(.disabled)": "prevSelect",
				"click #addNewEmployeeRow"                         : "addNewEmployeeRow",
				"click"                                            : "hideNewSelect"
			},

			initialize: function (options) {
				this.model = options.model;

				this.render();
			},

			//ToDo remove this.default table after success generate

			addNewEmployeeRow: function (e) {
				e.preventDefault();
				e.stopPropagation();

				var target = $(e.target);
				var wTrackPerEmployeeContainer = this.$el.find('#wTrackItemsHolder');
				var parrent = target.closest('tbody');
				var parrentRow = parrent.find('.productItem').last();
				var rowId = parrentRow.attr("data-id");
				var trEll = parrent.find('tr.productItem');
				var elem;

				/*if (rowId === undefined || rowId !== 'false') {
					if (!trEll.length) {
						return parrent.prepend(_.template(ProductInputContent));
					}
					$(trEll[trEll.length - 1]).after(_.template(ProductInputContent));
				}

				this.default = wTrackPerEmployeeContainer.find('#rawTable');*/

				elem = this.wTrackPerEmployeeTemplate({
					year    : 2015,
					month   : 10,
					week    : 40
				});

				parrent.append(
					elem
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
				var modelId = tr.attr('data-id');
				var id = target.attr("id");
				var attr = targetElement.attr("id") || targetElement.data("content");
				var elementType = '#' + attr;
				var projectManager;
				var assignedContainer;
				var project;
				var employee;
				var department;
				var changedAttr;
				var wTrackId = tr.data('id');
				var week;
				var year;

				var element = _.find(this.responseObj[elementType], function (el) {
					return el._id === id;
				});

				/*var editWtrackModel = this.editCollection.get(modelId) ? this.editCollection.get(modelId) : this.collection.get(modelId);

				if (!this.changedModels[modelId]) {
					if (!editWtrackModel.id) {
						this.changedModels[modelId] = editWtrackModel.attributes;
					} else {
						this.changedModels[modelId] = {};
					}
				}

				changedAttr = this.changedModels[modelId];*/

				if (elementType === '#project') {

					projectManager = element.projectmanager.name;
					assignedContainer = tr.find('[data-content="assigned"]');
					assignedContainer.text(projectManager);
					targetElement.attr('data-id', id);

					tr.find('[data-content="workflow"]').text(element.workflow.name);
					tr.find('[data-content="customer"]').text(element.customer.name);

					project = _.clone(editWtrackModel.get('project'));
					project._id = element._id;
					project.projectName = element.projectName;
					project.workflow._id = element.workflow._id;
					project.workflow.name = element.workflow.name;
					project.customer._id = element.customer._id;
					project.customer.name = element.customer.name;

					project.projectmanager.name = element.projectmanager.name;
					project.projectmanager._id = element.projectmanager._id;

					//changedAttr.project = project;

				} else if (elementType === '#employee') {
					tr.find('[data-content="department"]').text(element.department.name);

					/*employee = _.clone(editWtrackModel.get('employee'));
					department = _.clone(editWtrackModel.get('department'));

					employee._id = element._id;
					employee.name = target.text();

					department._id = element.department._id;
					department.departmentName = element.department.name;

					changedAttr.employee = employee;
					changedAttr.department = department;*/

					tr.find('[data-content="department"]').removeClass('errorContent');
				} else if (elementType === '#department') {
					department = _.clone(editWtrackModel.get('department'));
					department._id = element._id;
					department.departmentName = element.departmentName;

					//changedAttr.department = department;
				} else if (elementType === '#week') {
					week = $(e.target).text();

					//changedAttr.week = week;
				} else if (elementType === '#year') {
					year = $(e.target).text();

					//changedAttr.year = year;
				}

				targetElement.removeClass('errorContent');

				targetElement.text(target.text());

				this.hideNewSelect();
				//this.setEditable(targetElement);

				return false;
			},

			hideNewSelect: function () {
				$(".newSelectList").remove();
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