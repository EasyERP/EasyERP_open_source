define(["text!templates/wTrack/dashboard/vacationDashEdit.html",
		'populate',
		'dataService',
		'moment',
		'common'
	],
	function (template, populate, dataService, moment, common) {
		"use strict";
		var CreateView = Backbone.View.extend({
				template                 : _.template(template),
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
					this.render(options);
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
						};

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

				render: function (data) {
					var formString = this.template(data);
					var self = this;

					this.$el = $(formString).dialog({
						closeOnEscape: false,
						autoOpen: true,
						resizable: false,
						title: "Edit Project",
						dialogClass: "edit-project-dialog",
						width: "900px",
						buttons: {
							save: {
								text: "Save",
								class: "btn",
								click: self.saveItem
							},
							cancel: {
								text: "Cancel",
								class: "btn",
								click: self.hideDialog
							},
							delete: {
								text: "Delete",
								class: "btn",
								click: self.deleteItem
							}
						}
					});

					return this;
				}
			})
			;
		return CreateView;
	})
;