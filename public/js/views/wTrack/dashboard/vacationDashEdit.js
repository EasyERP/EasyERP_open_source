define(["text!templates/wTrack/dashboard/vacationDashEdit.html",
        'models/wTrackModel',
        'moment',
        'async',
        'common'
    ],
    function (template, wTrackModel, moment, async, common) {
        "use strict";
        var CreateView = Backbone.View.extend({
            template   : _.template(template),
            responseObj: {},
            dateByWeek : null,
            row        : null,

            events: {
                "click td.editable"     : "editRow",
                "keydown input.editing ": "keyDown"
            },

            initialize: function (options) {
                _.bindAll(this, "saveItem");

                this.dateByWeek = options.dateByWeek;
                this.tds = options.tds;
                this.row = options.tr;
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

            asyncLoadImgs: function (model) {
                var currentModel = model.id ? model.toJSON() : model;
                var id = currentModel._id;
                var pm = currentModel.projectmanager && currentModel.projectmanager._id ? currentModel.projectmanager._id : currentModel.projectmanager;
                var customer = currentModel.customer && currentModel.customer._id ? currentModel.customer._id : currentModel.customer;

                if (pm) {
                    common.getImagesPM([pm], "/getEmployeesImages", "#" + id, function (result) {
                        var res = result.data[0];

                        $(".miniAvatarPM").attr("data-id", res._id).find("img").attr("src", res.imageSrc);
                    });
                }

                if (customer) {
                    common.getImagesPM([customer], "/getCustomersImages", "#" + id, function (result) {
                        var res = result.data[0];

                        $(".miniAvatarCustomer").attr("data-id", res._id).find("img").attr("src", res.imageSrc);
                    });
                }
            },

            saveItem: function (e) {
                var Model = wTrackModel.extend({
                    //redefine defaults for proper putch backEnd model;
                    defaults: {}
                });
                var self = this;
                var thisEl = this.$el;
                var table = thisEl.find('#wTrackEditTable');
                var inputEditing = table.find('input.editing');
                var data = [];
                var rows = table.find('tr');
                var totalWorked = 0;
                var project = thisEl.find('#project').text();

                if (inputEditing.length) {
                    this.autoCalc(null, inputEditing);
                }

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

                    worked = retriveText(worked);
                    totalWorked += parseInt(worked);
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
                            project    : project
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
                var totalHours = options.totalWorked;
                var targetEmployeeContainer = this.row.find('td.wTrackInfo[data-date="' + this.dateByWeek + '"]');
                var hoursContainer = targetEmployeeContainer.find('span.projectHours');
                var targetTdIndex = this.row.find('td').index(targetEmployeeContainer);
                var employeeId = this.row.attr('data-employee');

                hoursContainer.text(totalHours);

                this.getDataForCellClass(targetTdIndex, employeeId, totalHours);
            },

            hideNewSelect: function () {
                $(".newSelectList:not('.generateTypeUl')").remove();
                $(".generateTypeUl").hide();
            },

            autoCalc: function (e, targetEl) {
                targetEl = targetEl || $(e.target);

                var isInput = targetEl.prop("tagName") === 'INPUT';
                var tr = targetEl.closest('tr');
                var edited = tr.find('input.edited');
                var days = tr.find('.autoCalc');
                var editedCol = edited.closest('td');
                var worked = 0;
                var value;
                var calcEl;
                var workedEl = tr.find('[data-content="worked"]');

                function appplyDefaultValue(el) {
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

                    value = appplyDefaultValue(calcEl);

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

            getDataForCellClass: function (updatedTdIndex, employeeId, totalHours) {
                var table = $('#dashboardBody');
                var targetRow = table.find('[data-id="' + employeeId + '"]');
                var targetTd = targetRow.find('td').eq(updatedTdIndex);
                var hoursSpan = targetTd.find('span.vacationHours');
                var vacationSpan = targetTd.find('span.vacation');
                var holidaysSpan = targetTd.find('span.viewCount');
                var prevText = hoursSpan.text();
                var slashPos = prevText.indexOf('/');
                var text;
                var vacationHours = vacationSpan.text();
                var holidays = holidaysSpan.text();
                var vacationSpanClass = 'vacation ';
                var hoursSpanClass = 'vacationHours ';

                var year = moment().isoWeekYear();
                var week = moment().isoWeek();
                var dateByWeek = year * 100 + week;

                var classString;

                var isInActiveClass = targetTd.hasClass('inactive');
                var isVacationClass = targetTd.hasClass('withVacation');

                var otherHours = this.tds.find('span.projectHours');

                otherHours.each(function () {
                    var el = $(this);

                    totalHours += parseInt(el.text()) || 0;
                });

                if (vacationHours) {
                    vacationHours = parseInt(vacationHours);

                    if (isNaN(vacationHours)) {
                        vacationHours = 0;
                    }
                }

                if (holidays) {
                    holidays = parseInt(holidays);
                }

                text = totalHours + ' ' + prevText.substring(slashPos);
                hoursSpan.text(text);

                classString = this.getCellClass(dateByWeek, vacationHours, holidays, totalHours, isInActiveClass, isVacationClass);
                vacationSpanClass += this.getCellSize(totalHours, vacationHours, true);
                hoursSpanClass += this.getCellSize(totalHours, vacationHours);

                hoursSpan.removeClass();
                vacationSpan.removeClass();
                hoursSpan.addClass(hoursSpanClass);
                vacationSpan.addClass(vacationSpanClass);

                targetTd.removeClass();
                targetTd.addClass(classString);
            },

            getCellClass: function (dateByWeek, vacations, holidays, hours, isInActiveClass, isVacationClass) {
                var s = "dashboardWeek ";
                var startHours;

                if (isVacationClass) {
                    s += 'withVacation ';
                }

                hours = hours || 0;
                holidays = holidays || 0;
                vacations = vacations || 0;

                startHours = hours;
                hours = hours + vacations + holidays * 8;

                if (hours > 40) {
                    s += "dgreen ";
                } else if (hours > 35) {
                    s += "green ";
                } else if (hours > 19) {
                    s += "yellow ";
                } else if (hours > 8) {
                    s += startHours ? "pink " : ((dateByWeek >= this.dateByWeek) ? "red" : "");
                } else if (dateByWeek >= this.dateByWeek) {
                    s += "red ";
                }
                if (dateByWeek === this.dateByWeek) {
                    s += "active ";
                }
                if (isInActiveClass) {
                    s += "inactive ";
                }

                return s;
            },

            getCellSize: function (workedHours, vacationHours, inVacation) {
                var v = '';
                var w = '';

                vacationHours = vacationHours || 0;
                workedHours = workedHours || 0;

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

                if (inVacation && vacationHours) {
                    return v;
                } else {
                    return w;
                }
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

                this.asyncLoadImgs(data);

                return this;
            }
        });
        return CreateView;
    })
;