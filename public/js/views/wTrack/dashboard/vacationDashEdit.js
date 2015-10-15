define(["text!templates/wTrack/dashboard/vacationDashEdit.html",
		'models/wTrackModel',
		'async'
	],
	function (template, wTrackModel, async) {
		"use strict";
		var CreateView = Backbone.View.extend({
				template   : _.template(template),
				responseObj: {},

				events: {
					"click td.editable"     : "editRow",
					"keydown input.editing ": "keyDown"
				},

				initialize: function (options) {
					_.bindAll(this, "saveItem");

					this.render(options);
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

				hideDialog: function () {
					$(".edit-dialog").remove();
				},

				saveItem: function (e) {
					var Model = wTrackModel.extend({
						//redefine defaults for proper putch backEnd model;
						defaults: {}
					});
					var self = this;
					var thisEl = this.$el;
					var table = thisEl.find('#wTrackEditTable');
					var data = [];
					var rows = table.find('tr');
					var totalWorked = 0;
					var employee;
					var project = thisEl.find('#');

					function retriveText(el) {
						var child = el.children('input');

						if (child.length) {
							return child.val();
						}

						return el.text() || 0;
					}

					rows.each(function () {
						var model;
						var target = $(this);
						var id = target.attr('data-id');
						var monEl = target.find('[data-content="1"]');
						var tueEl = target.find('[data-content="2"]');
						var wenEl = target.find('[data-content="3"]');
						var thuEl = target.find('[data-content="4"]');
						var friEl = target.find('[data-content="5"]');
						var satEl = target.find('[data-content="6"]');
						var sunEl = target.find('[data-content="7"]');
						var worked = target.find('[data-content="worked"]');
						var mo = retriveText(monEl);
						var tu = retriveText(tueEl);
						var we = retriveText(wenEl);
						var th = retriveText(thuEl);
						var fr = retriveText(friEl);
						var sa = retriveText(satEl);
						var su = retriveText(sunEl);
						var wTrack;

						if (!employee) {
							employee = target.find('[data-content="employee"]').text();
						}

						worked = retriveText(worked);
						totalWorked += worked;
						wTrack = {
							_id   : id,
							1     : mo,
							2     : tu,
							3     : we,
							4     : th,
							5     : fr,
							6     : sa,
							7     : su,
							worked: worked
						};

						model = new Model(wTrack);
						data.push(model);
					});

					async.each(data, function (model, eachCb) {
						model.save(null, {
							patch  : true,
							success: function (model) {
								eachCb(null, model);
							},
							error  : function (model, response) {
								eachCb(response);
							}
						});
					}, function (err) {
						if (!err) {
							self.updateDashRow({
								totalWorked: totalWorked,
								employee   : employee
							});

							return self.hideDialog();
						}

						App.render({
							type   : 'error',
							message: err.text
						});
					});
				},

				updateDashRow: function (options) {

				},

				hideNewSelect: function () {
					$(".newSelectList:not('.generateTypeUl')").remove();
					$(".generateTypeUl").hide();
				},

				autoCalc: function (e) {
					var targetEl = $(e.target);
					var isInput = targetEl.prop("tagName") === 'INPUT';
					var tr = targetEl.closest('tr');
					var edited = tr.find('input.edited');
					var days = tr.find('.autoCalc');
					var editedCol = edited.closest('td');
					var worked = 0;
					var value;
					var calcEl;
					var workedEl = tr.find('[data-content="worked"]');

					function eplyDefaultValue(el) {
						var value = el.text();
						var children = el.children('input');

						if (value === '' || undefined) {
							if (children.length) {
								value = children.val();
							} else {
								value = '0';
							}
						}

						return value;
					};

					for (var i = days.length - 1; i >= 0; i--) {
						calcEl = $(days[i]);

						value = eplyDefaultValue(calcEl);

						if (value === undefined && isInput) {
							editedCol = targetEl.closest('td');
							edited = targetEl;
						}

						worked += parseInt(value);
					}

					editedCol.text(edited.val());
					edited.remove();

					workedEl.text(worked);
				},

				autoHoursPerDay: function (e) {
					var targetEl = $(e.target);
					var isInput = targetEl.prop("tagName") === 'INPUT';
					var tr = targetEl.closest('tr');
					var edited = tr.find('input.editing');
					var days = tr.find('.autoCalc');
					var editedCol = edited.closest('td');
					var worked = edited.val();
					var value;
					var intValue;
					var calcEl;
					var workedEl = tr.find('[data-content="worked"]');

					if (worked) {
						intValue = worked / 7;
						intValue = Math.floor(intValue);

						for (var i = days.length - 1; i >= 0; i--) {
							value = worked - intValue;
							calcEl = $(days[i]);

							if (value <= 0 || ((value - intValue) > 0 && (value - intValue) < intValue)) {
								calcEl.val(value);
							} else {

								calcEl.val(intValue);
							}
						}
					}

					editedCol.text(edited.val());
					edited.remove();

					workedEl.text(worked);
				},

				editRow: function (e) {
					$(".newSelectList").hide();

					var el = $(e.target);
					var td = el.closest('td');
					var tr = el.closest('tr');
					var isHours = td.hasClass('hours');
					var input = tr.find('input.editing');
					var wTrackId = tr.data('id');
					var content = el.data('content');
					var tempContainer;
					var width;
					var value;
					var insertedInput;

					input.removeClass('editing');
					input.addClass('edited');

					tempContainer = el.text();
					width = el.width() - 6;
					el.html('<input class="editing" type="text" value="' + tempContainer + '"  maxLength="4" style="width:' + width + 'px">');

					insertedInput = el.find('input');
					insertedInput.focus();
					insertedInput[0].setSelectionRange(0, insertedInput.val().length);

					if (input.length && !isHours) {
						if (!input.val()) {
							input.val(0);
						}

						this.autoCalc(e);
					}
					/*else if (isHours) {
					 this.autoHoursPerDay(e);
					 }*/

					return false;
				},

				render: function (data) {
					var formString = this.template(data);
					var self = this;

					this.$el = $(formString).dialog({
						closeOnEscape: false,
						autoOpen     : true,
						resizable    : false,
						title        : "Edit Project",
						dialogClass  : "edit-dialog",
						width        : "900px",
						buttons      : {
							save  : {
								text : "Save",
								class: "btn",
								click: self.saveItem
							},
							cancel: {
								text : "Cancel",
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