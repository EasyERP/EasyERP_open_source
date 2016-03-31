define([
    'Backbone',
    'jQuery',
    'Underscore',
    'views/selectView/selectView',
    'views/wTrack/list/createJob',
    'text!templates/wTrack/dashboard/CreatewTrackTemplate.html',
    'models/wTrackModel',
    'moment',
    'async',
    'common',
    'dataService',
    'helpers/employeeHelper',
    'helpers/keyCodeHelper'
], function (Backbone, $, _, selectView, CreateJob, template, WTrackModel, moment, async, common, dataService, employeeHelper, keyCodes) {
    'use strict';
    var CreateView = Backbone.View.extend({
        template   : _.template(template),
        responseObj: {},
        dateByWeek : null,
        row        : null,

        events: {
            'click .stageSelect'                               : 'showNewSelect',
            'click td.editable:not(.disabled)'                 : 'editRow',
            'click td.disabled'                                : 'notify',
            'keydown input.editing'                            : 'keyDown',
            'keyup input.editing'                              : 'onKeyUpInput',
            'click .newSelectList li:not(.miniStylePagination)': 'chooseOption',
            click                                              : 'removeInputs'
        },

        initialize: function (options) {
            var self = this;
            var month;
            var year;
            var dateByMonth;
            var body;

            App.startPreload();

            _.bindAll(self, 'saveItem');

            self.dateByWeek = options.dateByWeek;
            self.tds = options.tds;
            self.row = options.tr;
            year = parseInt(self.dateByWeek.slice(0, 4), 10);
            self.week = parseInt(self.dateByWeek.slice(4), 10);
            month = moment().isoWeekYear(year).isoWeek(self.week).day(1).month() + 1;
            self.startMonth = month;
            self.startYear = moment().isoWeekYear(year).isoWeek(self.week).day(1).year();
            self.endMonth = moment().isoWeekYear(year).isoWeek(self.week).day(6).month() + 1;
            self.endYear = moment().isoWeekYear(year).isoWeek(self.week).day(6).year();
            dateByMonth = year * 100 + month;
            self.employee = options.employee;
            self.department = options.department;
            body = {
                year : year,
                month: month,
                week : self.week,

                department: {
                    _id           : self.department,
                    departmentName: options.departmentName
                },

                employee: {
                    _id : self.employee,
                    name: options.employeeName
                },

                dateByWeek : parseInt(self.dateByWeek, 10),
                dateByMonth: dateByMonth
            };

            options.nonWorkingDays = {
                workingHours: 0
            };

            self.wTrack = new WTrackModel(body);
            options.wTrack = self.wTrack;

            employeeHelper.getNonWorkingDaysByWeek(year, self.week, null, options.employee, self.wTrack,
                function (nonWorkingDays, self) {
                    options.nonWorkingDays = nonWorkingDays;
                    self.render(options);
                }, self);

        },

        keyDown: function (e) {  // validation from generateWTrack, need keydown instead of keypress in case of enter key
            if (keyCodes.isBspDelTabEscEnt(e.keyCode) || keyCodes.isArrowsOrHomeEnd(e.keyCode)) {
                if (e.which === 13) {
                    this.autoCalc(e);
                }
                return;
            }
            if (e.shiftKey || !keyCodes.isDigit(e.keyCode)) {
                e.preventDefault();
            }
        },

        onKeyUpInput: function (e) { // max 12 hours in cell
            var element = e.target;

            if ($(element).val() > 12) {
                $(element).val(12);
            }
        },

        notify: function () {
            App.render({
                type   : 'notify',
                message: 'This day from another month'
            });
        },

        stopDefaultEvents: function (e) {
            e.stopPropagation();
            e.preventDefault();
        },

        hideDialog: function () {
            $('.edit-dialog').remove();
        },

        asyncLoadImgs: function (model) {
            var self = this;
            var currentModel = model.id ? model.toJSON() : model;
            var id = currentModel._id;
            var pm = currentModel.projectmanager && currentModel.projectmanager._id ? currentModel.projectmanager._id : currentModel.projectmanager;
            var customer = currentModel.customer && currentModel.customer._id ? currentModel.customer._id : currentModel.customer;
            var fullName;

            if (pm) {
                fullName = currentModel.projectmanager && currentModel.projectmanager.name ? currentModel.projectmanager.name.first + ' ' + currentModel.projectmanager.name.last : '';
                self.$el.find('#projectManager').text(fullName);

                common.getImagesPM([pm], '/getEmployeesImages', '#' + id, function (result) {
                    var res = result.data[0];

                    self.$el.find('.miniAvatarPM').attr('data-id', res._id).find('img').attr('src', res.imageSrc);
                });
            }

            if (customer) {
                fullName = currentModel.customer && currentModel.customer.name ? currentModel.customer.name.first + ' ' + currentModel.customer.name.last : '';
                self.$el.find('#customer').text(fullName);

                common.getImagesPM([customer], '/getCustomersImages', '#' + id, function (result) {
                    var res = result.data[0];

                    self.$el.find('.miniAvatarCustomer').attr('data-id', res._id).find('img').attr('src', res.imageSrc);
                });
            }
        },

        saveItem: function () {
            var Model = WTrackModel.extend({
                defaults: {}
            });
            var self = this;
            var thisEl = this.$el;
            var table = thisEl.find('#wTrackCreateTable');
            var inputEditing = table.find('input.editing');
            var rows = table.find('tr');
            var count = rows.length - 1;

            rows.each(function (index) {
                var target = $(this);
                var id = target.attr('data-id');
                var jobs = target.find('[data-content="jobs"]');
                var monEl = target.find('[data-content="1"]');
                var tueEl = target.find('[data-content="2"]');
                var wenEl = target.find('[data-content="3"]');
                var thuEl = target.find('[data-content="4"]');
                var friEl = target.find('[data-content="5"]');
                var satEl = target.find('[data-content="6"]');
                var sunEl = target.find('[data-content="7"]');
                var worked = target.find('[data-content="worked"]');
                var month = target.find('[data-content="month"]');
                var year = target.find('[data-content="year"]');
                var dateByMonth;
                var mo;
                var tu;
                var we;
                var th;
                var fr;
                var sa;
                var su;
                var m;
                var y;
                var wTrack;
                var model;
                var project;

                function retriveText(el) {
                    var child = el.children('input');

                    if (child.length) {
                        return child.val();
                    }

                    return el.text() || 0;
                }

                mo = retriveText(monEl);
                tu = retriveText(tueEl);
                we = retriveText(wenEl);
                th = retriveText(thuEl);
                fr = retriveText(friEl);
                sa = retriveText(satEl);
                su = retriveText(sunEl);
                m = retriveText(month);
                y = retriveText(year);

                dateByMonth = y * 100 + parseInt(m, 10);
                project = self.$el.find('#project').attr('data-id');

                if (self.$el.find('.error').length || self.$el.find('.errorContent').length) {
                    return App.render({
                        type   : 'error',
                        message: 'Please, select all information first.'
                    });
                }

                if (inputEditing.length) {
                    self.autoCalc(null, inputEditing);
                }

                worked = retriveText(worked);
                wTrack = {
                    _id        : id,
                    1          : mo,
                    2          : tu,
                    3          : we,
                    4          : th,
                    5          : fr,
                    6          : sa,
                    7          : su,
                    jobs       : jobs.attr('data-id'),
                    worked     : worked,
                    project    : project,
                    month      : m,
                    year       : y,
                    dateByWeek : self.dateByWeek,
                    dateByMonth: dateByMonth,
                    employee   : self.employee,
                    department : self.department,
                    week       : self.week
                };

                model = new Model(wTrack);

                model.save(null, {
                    success: function () {
                        if (count === index) {
                            return self.hideDialog();
                        }
                    },
                    error  : function (err) {
                        App.render({
                            type   : 'error',
                            message: err.text
                        });
                    }
                });
            });
        },

        autoCalc: function (e, targetEl) {
            var isInput;
            var trs;
            var edited;
            var editedCol;
            var value;
            var calcEl;

            if (e || targetEl) {
                targetEl = targetEl || $(e.target);

                isInput = targetEl.prop('tagName') === 'INPUT';
                trs = targetEl.closest('tr');
                edited = trs.find('input.edited');
                editedCol = edited.closest('td');
            } else {
                trs = this.$tableBody.find('tr');
            }

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

                return value || '0';
            }

            trs.each(function () {
                var tr = $(this);
                var days = tr.find('.autoCalc');
                var worked = 0;
                var _value;
                var workedEl;
                var i;

                workedEl = tr.find('[data-content="worked"]');

                for (i = days.length - 1; i >= 0; i--) {
                    calcEl = $(days[i]);

                    value = appplyDefaultValue(calcEl);

                    if (isInput) {
                        editedCol = targetEl.closest('td');
                        edited = targetEl;
                    }

                    worked += parseInt(value, 10);
                }

                if (edited) {
                    _value = parseInt(edited.val(), 10);

                    if (isNaN(_value)) {
                        _value = 0;
                    }

                    editedCol.text(_value);
                    edited.remove();
                }

                workedEl.text(worked);
            });
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
            var self = this;
            var el = $(e.target);
            var td = el.closest('td');
            var tr = el.closest('tr');
            var isHours = td.hasClass('hours');
            var input = tr.find('input.editing');
            var content = el.data('content');
            var tempContainer;
            var width;
            var value;
            var insertedInput;
            var colType = el.data('type');
            var isSelect = colType !== 'input' && el.prop('tagName') !== 'INPUT';

            $('.newSelectList').hide();

            if (isSelect) {
                if (content === 'jobs') {
                    if (self.project) {
                        dataService.getData('/jobs/getForDD', {
                            projectId: self.project,
                            all      : true
                        }, function (jobs) {

                            self.responseObj['#jobs'] = jobs;

                            tr.find('[data-content="jobs"]').addClass('editable');
                            // populate.showSelect(e, prev, next, self);
                            self.showNewSelect(e);
                            return false;
                        });
                    } else {
                        App.render({
                            type   : 'error',
                            message: 'Please, choose project first.'
                        });
                    }

                } else {
                    // populate.showSelect(e, prev, next, this);
                    this.showNewSelect(e);
                    return false;
                }
            } else if (content === 'month') {
                if (this.startMonth === this.endMonth) {
                    return false;
                }

                el.append('<ul class="newSelectList"><li>' + this.startMonth + '</li><li>' + this.endMonth + '</li></ul>');

            } else if (content === 'year') {
                if (this.startYear === this.endYear) {
                    return false;
                }

                el.append('<ul class="newSelectList"><li>' + this.startYear + '</li><li>' + this.endYear + '</li></ul>');
            } else {
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
            }

            return false;
        },

        removeInputs: function (e) {
            var self = this;

            if (this.selectView) {
                this.selectView.remove();
            }

            this.$el.find('.editing').each(function (el) {
                var $el = $(this);
                var val = $el.val();

                $el.closest('td').text(val);
                self.autoCalc($el);
                $el.remove();
            });

        },

        chooseOption: function (e) {
            var self = this;
            var target = $(e.target);
            var targetElement = target.parents('td');
            var jobs = {};
            var tr;
            var id;
            var attr;
            var elementType;
            var element;
            var project;

            if (!targetElement.length) {
                targetElement = target.parents('span');
            }


            tr = target.parents('tr');
            id = target.attr('id');
            attr = targetElement.data('content');
            elementType = '#' + attr;


            element = _.find(this.responseObj[elementType], function (el) {
                return el._id === id;
            });

            if (id !== 'createJob') {
                if (elementType === '#jobs') {

                    jobs = element._id;

                    targetElement.attr('data-id', jobs);
                    tr.find('[data-content="jobs"]').removeClass('errorContent');
                } else if (elementType === '#project') {
                    project = element._id;
                    this.project = project;

                    targetElement.attr('data-id', project);
                    targetElement.removeClass('error');

                    dataService.getData('/jobs/getForDD', {
                        projectId: project,
                        all      : true
                    }, function (jobs) {
                        var $jobs = self.$el.find('[data-content="jobs"]');
                        var job = jobs ? jobs[0] : {name: 'Empty'};
                        var jobId = job._id;

                        $jobs.text(job.name);
                        $jobs.attr('data-id', jobId);

                        if (jobId) {
                            $jobs.removeClass('errorContent');
                        }
                    });

                    this.asyncLoadImgs(element);
                }
                targetElement.removeClass('errorContent');

                targetElement.text(target.text());

            } else if (id === 'createJob') {
                self.generateJob(e);
            }

            this.hideNewSelect();

            return false;
        },

        generateJob: function () {
            var model = this.project;

            new CreateJob({
                model    : model,
                createJob: true
            });

            return false;
        },

        showNewSelect: function (e) {
            var $target = $(e.target);
            e.stopPropagation();

            if ($target.attr('id') === 'selectInput') {
                return false;
            }

            if (this.selectView) {
                this.selectView.remove();
            }

            this.selectView = new selectView({
                e          : e,
                responseObj: this.responseObj
            });

            $target.append(this.selectView.render().el);

            return false;
        },

        hideNewSelect: function () {
            if (this.selectView) {
                this.selectView.remove();
            }
        },

        render: function (data) {
            var self = this;
            var formString;

            data.wTrack = data.wTrack.toJSON();
            formString = this.template(data);

            dataService.getData('/project/getForWtrack', {inProgress: true}, function (projects) {
                projects = _.map(projects.data, function (project) {
                    project.name = project.projectName;

                    return project;
                });

                self.responseObj['#project'] = projects;

                App.stopPreload();
            });

            this.$el = $(formString).dialog({
                closeOnEscape: false,
                autoOpen     : true,
                resizable    : false,
                title        : 'Edit Project',
                dialogClass  : 'edit-dialog',
                width        : '900px',
                buttons      : {
                    save  : {
                        text : 'Save',
                        class: 'btn',
                        click: self.saveItem
                    },
                    cancel: {
                        text : 'Cancel',
                        class: 'btn',
                        click: self.hideDialog
                    }
                }
            });

            this.delegateEvents(this.events);

            this.asyncLoadImgs(data);

            this.$tableBody = $('#wTrackCreateTable');
            this.autoCalc();

            return this;
        }
    });
    return CreateView;
})
;