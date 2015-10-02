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
				"click .newSelectList li:not(.miniStylePagination)"               : "chooseOption",
				"click .current-selected"                                         : "showNewSelect",
				"click .newSelectList li.miniStylePagination"                     : "notHide",
				"click .newSelectList li.miniStylePagination .next:not(.disabled)": "nextSelect",
				"click .newSelectList li.miniStylePagination .prev:not(.disabled)": "prevSelect",
				"click #addNewEmployeeRow"                                        : "addNewEmployeeRow",
				"click"                                                           : "hideNewSelect"
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



				if (rowId === undefined || rowId !== 'false') {
					if (!trEll.length) {
						return parrent.prepend(elem);
					}
					$(trEll[trEll.length - 1]).after(elem);
				}

				//this.default = wTrackPerEmployeeContainer.find('#rawTable');
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
				var id = target.attr("id");
				var attr = targetElement.attr("id") || targetElement.data("content");
				var elementType = '#' + attr;

				var element = _.find(this.responseObj[elementType], function (el) {
					return el._id === id;
				});

				tr.attr('data-id', id);

				if (elementType === '#employee') {
					tr.find('[data-content="department"]').text(element.department.name);

					tr.find('[data-content="department"]').removeClass('errorContent');
				}

				targetElement.removeClass('errorContent');

				targetElement.text(target.text());

				this.hideNewSelect();

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