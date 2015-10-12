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
					"click td.editable"     : "editRow",
					"change .autoCalc"      : "autoCalc",
					"change .editable "     : "setEditable",
					"keydown input.editing ": "keyDown"
				},

				keyDown: function (e) {
					if (e.which === 13) {
						this.autoCalc(e);
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

				hideNewSelect: function () {
					$(".newSelectList:not('.generateTypeUl')").remove();
					$(".generateTypeUl").hide();
				},

				autoCalc: function (e) {
					/*var el = $(e.target);
					 var tr = $(e.target).closest('tr');
					 var input = tr.find('input.editing');
					 var days = tr.find('.autoCalc');
					 var wTrackId = tr.data('id');
					 var worked = 0;
					 var value;
					 var calcEl;
					 var editWtrackModel;
					 var workedEl = tr.find('[data-content="worked"]');
					 var revenueEl = tr.find('[data-content="revenue"]');
					 var rateEl = tr.find('[data-content="rate"]');
					 var rateVal;
					 var revenueVal;

					 function eplyDefaultValue(el) {
					 var value = el.text();

					 if (value === '') {
					 if (el.children('input').length) {
					 value = input.val();
					 } else {
					 value = '0';
					 }
					 }

					 return value;
					 };

					 for (var i = days.length - 1; i >= 0; i--) {
					 calcEl = $(days[i]);

					 value = eplyDefaultValue(calcEl);

					 worked += parseInt(value);
					 }

					 rateVal = parseFloat(eplyDefaultValue(rateEl));
					 revenueVal = parseFloat(worked * rateVal).toFixed(2);

					 revenueEl.text(revenueVal);

					 editWtrackModel = this.editCollection.get(wTrackId);

					 workedEl.text(worked);
					 //editWtrackModel.set('worked', worked);

					 if (!this.changedModels[wTrackId]) {
					 this.changedModels[wTrackId] = {};
					 }

					 this.changedModels[wTrackId].worked = worked;
					 this.changedModels[wTrackId].revenue = revenueVal;*/

					alert('autocalc');
				},

				editRow: function (e) {
					$(".newSelectList").hide();

					var el = $(e.target);
					var tr = $(e.target).closest('tr');
					var wTrackId = tr.data('id');
					var content = el.data('content');
					var tempContainer;
					var width;
					var value;
					var insertedInput;

					tempContainer = el.text();
					width = el.width() - 6;
					el.html('<input class="editing" type="text" value="' + tempContainer + '"  maxLength="4" style="width:' + width + 'px">');

					insertedInput = el.find('input');
					insertedInput.focus();
					insertedInput[0].setSelectionRange(0, insertedInput.val().length);

					this.autoCalc(e);

					return false;
				},

				setEditable: function (td) {
					var tr;

					if (!td.parents) {
						td = $(td.target).closest('td');
					}

					tr = td.parents('tr');

					/*tr.addClass('edited');*/
					td.addClass('edited');

					if (this.isEditRows()) {
						this.setChangedValue();
					}

					return false;
				},

				render: function (data) {
					var formString = this.template(data);
					var self = this;

					this.$el = $(formString).dialog({
						closeOnEscape: false,
						autoOpen: true,
						resizable: false,
						title: "Edit Project",
						dialogClass: "edit-dialog",
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