define([
    'Backbone',
    'Underscore',
    'jQuery',
    'views/listViewBase',
    'views/selectView/selectView',
    'text!templates/wTrack/list/ListHeader.html',
    'text!templates/wTrack/list/cancelEdit.html',
    'text!templates/wTrack/list/forWeek.html',
    'views/wTrack/CreateView',
    'views/wTrack/list/ListItemView',
    'views/salesInvoices/wTrack/CreateView',
    'models/wTrackModel',
    'collections/wTrack/filterCollection',
    'collections/wTrack/editCollection',
    'views/wTrack/list/createJob',
    'common',
    'dataService',
    'populate',
    'async',
    'custom',
    'moment',
    'constants',
    'helpers/keyCodeHelper',
    'helpers/employeeHelper',
    'helpers/overTime',
    'helpers/isOverTime'
], function (Backbone,
             _,
             $,
             ListViewBase,
             SelectView,
             listTemplate,
             cancelEdit,
             forWeek,
             CreateView,
             ListItemView,
             WTrackCreateView,
             CurrentModel,
             ContentCollection,
             EditCollection,
             CreateJob,
             common,
             dataService,
             populate,
             async,
             custom,
             moment,
             CONSTANTS,
             keyCodes,
             employeeHelper,
             setOverTime,
             isOverTime) {
    'use strict';

    var wTrackListView = ListViewBase.extend({
        CreateView       : CreateView,
        listTemplate     : listTemplate,
        ListItemView     : ListItemView,
        ContentCollection: ContentCollection,
        setOverTime      : setOverTime,
        cancelEdit       : cancelEdit,
        contentType      : 'wTrack',
        responseObj      : {},
        wTrackId         : null, // need for edit rows in listView
        $listTable       : null, // cashedJqueryEllemnt
        editCollection   : null,
        selectedProjectId: [],
        genInvoiceEl     : null,
        hasPagination    : true,
        exportToCsvUrl   : '/wTrack/exportToCsv',
        exportToXlsxUrl  : '/wTrack/exportToXlsx',
        CurrentModel     : CurrentModel,

        initialize: function (options) {
            this.startTime = options.startTime;
            this.collection = options.collection;
            this.filter = options.filter;
            this.sort = options.sort;
            this.newCollection = options.newCollection;
            this.deleteCounter = 0;
            this.page = options.collection.currentPage;

            this.changedModels = {};

            ListViewBase.prototype.initialize.call(this, options);

            this.ContentCollection = ContentCollection;
            this.stages = [];
        },

        events: {
            'click .stageSelect'                               : 'showNewSelect',
            'click tr.enableEdit td.editable:not(.disabled)'   : 'editRow',
            'click td.disabled'                                : 'notify',
            'click .newSelectList li:not(.miniStylePagination)': 'chooseOption',
            'change .autoCalc'                                 : 'autoCalc',
            'change .editable'                                 : 'setEditable',
            'keydown input.editing'                            : 'keyDown',
            click                                              : 'removeInputs'
        },

        removeInputs: function () {
            // this.setChangedValueToModel();
            if (this.selectView) {
                this.selectView.remove();
            }
        },

        validateRow: function ($tr, cb) {
            var wTrackId = $tr.attr('data-id');
            var edited = !!$tr.attr('data-edited');
            var wTrack = this.editCollection.get(wTrackId) || this.collection.get(wTrackId);

            if (!edited) {
                this.checkVacHolMonth($tr, wTrack, cb);
            }
        },

        generateJob: function (e) {
            var target = $(e.target);
            var id = target.closest('tr').attr('data-id');
            var wTrackModel = this.editCollection.get(id) || this.collection.get(id);
            var model = this.projectModel || wTrackModel.get('project');
            var projectsDdContainer = $('#projectDd');

            if (!model) {
                projectsDdContainer.css('color', 'red');

                return App.render({
                    type   : 'error',
                    message: CONSTANTS.SELECTP_ROJECT
                });
            }

            new CreateJob({
                model     : model,
                wTrackView: this
            });

            return false;
        },

        generatedWtracks: function () {
            var self = this;
            var tr = this.$listTable.find('.false');
            var projectId = tr.find('[data-content="project"]').attr('data-id');

            dataService.getData('/jobs/getForDD', {projectId: projectId, all: true}, function (jobs) {

                self.responseObj['#jobs'] = jobs;

                tr.find('[data-content="jobs"]').addClass('editable');
            });
        },

        keyDown: function (e) {
            var code = e.which;
            var $target = $(e.target);
            var $tr = $target.closest('tr');
            var $td = $target.closest('td');
            var isOvertime = $tr.hasClass('overtime');
            var holiday = $td.is('.H, .V, .P, .S, .E, [data-content="6"], [data-content="7"]');

            if (!isOvertime && holiday && keyCodes.isDigit(code) && code !== 48 && code !== 96) {
                App.render({
                    type   : 'error',
                    message: 'You can input only "0". Please create Overtime tCard for other values.'
                });
                return false;
            }

            $tr.attr('data-edited', true);

            if (keyCodes.isEnter(code)) {
                this.autoCalc(e);
                // this.calculateCost(e, this.wTrackId);
                this.setChangedValueToModel();
                this.showSaveCancelBtns();

                e.stopPropagation();
            } else if (!keyCodes.isDigitOrDecimalDot(code) && !keyCodes.isBspaceAndDelete(code)) {
                e.preventDefault();
            } else {
                this.setEditable($td);
            }
        },

        copyRow: function (e) {
            var self = this;
            var checkedRows = this.$el.find('.checkbox:checked:not(#checkAll)');
            var length = checkedRows.length;
            var selectedWtrack;
            var target;
            var id;
            var row;
            var model;
            var _model;
            var tdsArr;
            var cid;
            var hours;
            var message;
            var projectWorkflow;
            var i;

            this.$el.find('#checkAll').prop('checked', false);

            this.hideDeleteBtnAndUnSelectCheckAll(e);

            this.changed = true;
            this.createdCopied = true;

            for (i = length - 1; i >= 0; i--) {
                selectedWtrack = checkedRows[i];
                target = $(selectedWtrack);
                id = target.val();
                row = target.closest('tr');
                model = self.collection.get(id) ? self.collection.get(id) : self.editCollection.get(id);
                hours = (model && model.changed && model.changed.worked) ? model.changed.worked : model.get('worked');
                $(selectedWtrack).attr('checked', false);
                projectWorkflow = $.trim(row.find('[data-content="workflow"]').text());

                if ((model.toJSON().workflow && model.toJSON().workflow.name !== 'Closed') || (projectWorkflow !== 'Closed')) {
                    model.set({
                        isPaid : false,
                        amount : 0,
                        cost   : 0,
                        revenue: 0
                    });
                    model = model.toJSON();

                    delete model._id;

                    _model = new CurrentModel(model);

                    this.showSaveCancelBtns();
                    this.editCollection.add(_model);

                    cid = _model.cid;

                    if (!this.changedModels[cid]) {
                        this.changedModels[cid] = model;
                    }

                    this.$el.find('#listTable').prepend('<tr class="false enableEdit" data-id="' + cid + '">' + row.html() + '</tr>');
                    row = this.$el.find('.false');

                    tdsArr = row.find('td');
                    $(tdsArr[0]).find('input').val(cid);
                    $(tdsArr[1]).text('New');
                } else {
                    message = "You can't copy tCard with closed project.";
                    App.render({
                        type   : 'error',
                        message: message
                    });
                }
            }
        },

        autoCalc: function (e, $tr) {
            var worked = 0;
            var $el;
            var input;
            var days;
            var wTrackId;
            var value;
            var calcEl;
            var workedEl;
            var i;

            if (e) {
                $el = $(e.target);
            }

            if (!$el && !$tr) {
                input = this.$listTable.find('input.editing');
                $tr = input.closest('tr');
            }

            $tr = $tr || $el.closest('tr');
            input = input || $tr.find('input.editing');
            days = $tr.find('.autoCalc');
            wTrackId = $tr.attr('data-id');
            workedEl = $tr.find('[data-content="worked"]');

            function eplyDefaultValue(el) {
                var value = el.text();

                if (value === '') {
                    if (el.children('input').length) {
                        value = input.val() || '0'; // in case of empty input

                    } else {
                        value = '0';
                    }
                }

                return value;
            }

            for (i = days.length - 1; i >= 0; i--) {
                calcEl = $(days[i]);

                value = eplyDefaultValue(calcEl);

                worked += parseInt(value, 10);
            }

            workedEl.text(worked);

            if (!this.changedModels[wTrackId]) {
                this.changedModels[wTrackId] = {};
            }

            this.changedModels[wTrackId].worked = worked;
        },

        setChangedValueToModel: function ($tr) {
            var editedElement = this.$listTable.find('.editing');
            var $editedCol;
            var editedElementRowId;
            var editedElementContent;
            var editedElementValue;
            var self = this;
            var $days;
            var weeks;

            function funcForWeek(cb) {
                var year = editedElement.closest('tr').find('[data-content="year"]').text();
                var weeks = custom.getWeeks(editedElementValue, year);

                cb(null, weeks);
            }

            if (navigator.userAgent.indexOf('Firefox') >= 0) {
                this.setEditable(editedElement);
            }

            if ($tr) {
                editedElementRowId = $tr.attr('data-id');
                $days = $tr.find('td.autoCalc');

                if (!this.changedModels[editedElementRowId]) {
                    this.changedModels[editedElementRowId] = {};
                }

                $days.each(function () {
                    var $el = $(this);
                    var day = $el.attr('data-content');
                    var value = $el.text() || 0;

                    self.changedModels[editedElementRowId][day] = value;
                });

            } else if (editedElement.length) {
                $editedCol = editedElement.closest('td');
                $tr = editedElement.closest('tr');
                editedElementRowId = $tr.attr('data-id');
                editedElementContent = $editedCol.data('content');
                editedElementValue = editedElement.val();

                // editWtrackModel = this.editCollection.get(editedElementRowId);

                if (!this.changedModels[editedElementRowId]) {
                    this.changedModels[editedElementRowId] = {};
                }

                this.changedModels[editedElementRowId][editedElementContent] = editedElementValue;

                if (editedElementContent === 'month') {
                    async.parallel([funcForWeek], function (err, result) {
                        if (err) {
                            console.log(err);
                        }

                        weeks = result[0];
                        editedElement.closest('tr').find('[data-content="week"]').text(weeks[0].week);
                        $editedCol.text(editedElementValue);
                        editedElement.remove();

                        self.changedModels[editedElementRowId].week = weeks[0].week;

                        self.checkVacHolMonth($tr, false, function () {
                            self.setChangedValueToModel($tr);
                        });
                    });
                } else {
                    $editedCol.text(editedElementValue);
                    editedElement.remove();
                }

            }
        },

        getData: function (cb) {
            var self = this;
            var getProjects;
            var getEmployees;
            var getDepartments;
            var parallelTasks;

            getProjects = function (pCb) {
                dataService.getData(CONSTANTS.URLS.PROJECTS_GET_FOR_WTRACK, {inProgress: true}, function (res) {
                    self.responseObj['#project'] = res.data;
                    pCb();
                });
            };

            getEmployees = function (pCb) {
                dataService.getData(CONSTANTS.URLS.EMPLOYEES_GETFORDD, {devDepartments: true}, function (employees) {
                    employees = _.map(employees.data, function (employee) {
                        employee.name = employee.name.first + ' ' + employee.name.last;

                        return employee;
                    });

                    self.responseObj['#employee'] = employees;
                    pCb();
                });
            };

            getDepartments = function (pCb) {
                dataService.getData(CONSTANTS.URLS.DEPARTMENTS_FORDD, {devDepartments: true}, function (departments) {
                    departments = _.map(departments.data, function (department) {
                        department.name = department.name;

                        return department;
                    });

                    self.responseObj['#department'] = departments;
                    pCb();
                });
            };

            parallelTasks = [getProjects, getEmployees, getDepartments];

            async.parallel(parallelTasks, cb);

        },

        // is overwritten because this logic is more complex
        editRow: function (e) {
            var el = $(e.target);
            var $td = el.closest('td');
            var self = this;
            var $tr = $(e.target).closest('tr');
            var isEdited = !!$tr.attr('data-edited');
            var $input = $tr.find('td:not([data-content="month"]) input.editing');
            var wTrackId = $tr.attr('data-id');
            var colType = el.data('type');
            var content = el.data('content');
            var isSelect = colType !== 'input' && el.prop('tagName') !== 'INPUT';
            var isWeek = el.attr('data-content') === 'week';
            var isType = el.attr('data-content') === 'type';
            var isYear = el.attr('data-content') === 'year';
            var isMonth = el.attr('data-content') === 'month';
            var isDay = el.hasClass('autoCalc');
            var isOvertime = $tr.hasClass('overtime');
            var month = $tr.find('[data-content="month"]').text() || $tr.find('.editing').val();
            var year = $tr.find('[data-content="year"]').text() || $tr.find('.editing').val();
            var validateRowFunc;

            var editCb = function () {
                var maxValue = 100;
                var tempContainer;
                var width;
                var value;
                var insertedInput;
                var weeks;
                var template;
                var currentYear;
                var previousYear;
                var nextYear;
                var maxlength;
                var projectId = $tr.find('[data-content="project"]').attr('data-id');
                var holiday = $td.is('.H, .V, .P, .S, .E, [data-content="6"], [data-content="7"]');

                if ($td.hasClass('disabled')) {
                    return false;
                }

                year = year.slice(0, 4);

                /* if (!isOvertime && holiday) {
                 App.render({
                 type   : 'error',
                 message: 'Please create Overtime tCard'
                 });
                 return false;
                 } */

                if (wTrackId && el.prop('tagName') !== 'INPUT') {
                    this.wTrackId = wTrackId;
                    this.setChangedValueToModel();
                }

                if (el.hasClass('editing')) {  // added in case of double click on el
                    return false;
                }

                if (isSelect) {
                    if (content === 'jobs') {
                        if (!projectId && !projectId.length) {
                            App.render({
                                type   : 'error',
                                message: 'Please choose a project before'
                            });

                            return false;
                        }
                        dataService.getData('/jobs/getForDD', {
                            projectId: projectId,
                            all      : true
                        }, function (jobs) {
                            self.responseObj['#jobs'] = jobs;
                            self.showNewSelect(e);
                            return false;
                        });
                    } else if (isType) {
                        el.append('<ul class="newSelectList"><li>OR</li><li>OT</li></ul>');

                        return false;
                    } else {
                        this.showNewSelect(e);
                        return false;
                    }
                } else if (isWeek) {
                    weeks = custom.getWeeks(month, year);

                    template = _.template(forWeek);

                    el.append(template({
                        weeks: weeks
                    }));

                    // this.calculateCost(e, wTrackId);
                } else if (isYear) {
                    currentYear = parseInt(moment().year(), 10);
                    previousYear = currentYear - 1;
                    nextYear = currentYear + 1;

                    width = el.width() - 6;
                    el.append('<ul class="newSelectList"><li>' + previousYear + '</li><li>' + currentYear + '</li><li>' + nextYear + '</li></ul>');

                    //  this.calculateCost(e, wTrackId);
                } else if (el.attr('id') === 'selectInput') {
                    return false;
                } else {
                    tempContainer = el.text();
                    width = el.width() - 6;
                    el.html('<input class="editing" type="text" value="' + tempContainer + '"  maxLength="4" style="width:' + width + 'px">');

                    insertedInput = el.find('input');
                    insertedInput.focus();

                    isOverTime(el);
                    insertedInput[0].setSelectionRange(0, insertedInput.val().length);

                    this.autoCalc(e);
                    /* if (wTrackId) {
                     this.calculateCost(e, wTrackId);
                     }*/
                }

                return false;
            };

            if (!$input.length && isDay && !isEdited) {
                validateRowFunc = function (cb) {
                    self.validateRow($tr, editCb);

                    if (typeof cb === 'function') {
                        cb();
                    }
                };

            } else {
                validateRowFunc = function (cb) {
                    editCb();

                    if (typeof cb === 'function') {
                        cb();
                    }
                };
            }

            editCb = editCb.bind(this);
            this.getData = this.getData.bind(this);

            e.stopPropagation();

            if (this.responseObj && !this.responseObj['#project']) {
                App.startPreload();
                async.waterfall([this.getData, validateRowFunc], function () {
                });
            } else {
                validateRowFunc();
            }

            App.stopPreload();

        },

        notify: function () {
            App.render({
                type   : 'notify',
                message: 'This day from another month'
            });
        },

        chooseOption: function (e) {
            var self = this;
            var target = $(e.target);
            var textVal = target.text();
            var targetElement = target.parents('td');
            var tr = target.parents('tr');
            var modelId = tr.attr('data-id');
            var id = target.attr('id');
            var attr = targetElement.attr('id') || targetElement.data('content');
            var elementType = '#' + attr;
            var jobs = {};
            var salesManager;
            var assignedContainer;
            var project;
            var employee;
            var department;
            var changedAttr;
            var week;
            var year;
            var $job;

            var element = _.find(this.responseObj[elementType], function (el) {
                return el._id === id;
            });

            var editWtrackModel = this.editCollection.get(modelId) || this.collection.get(modelId);
            var needCheckVacHol = elementType === '#employee' || elementType === '#week' || elementType === '#year';

            if (!this.changedModels[modelId]) {
                if (!editWtrackModel.id) {
                    this.changedModels[modelId] = editWtrackModel.attributes;
                } else {
                    this.changedModels[modelId] = {};
                }
            }

            changedAttr = this.changedModels[modelId];

            if (id !== 'createJob') {

                if (elementType === '#project') {
                    this.projectModel = element;

                    salesManager = element.salesmanager ? element.salesmanager.name.first + ' ' + element.salesmanager.name.last : '';
                    assignedContainer = tr.find('[data-content="assigned"]');
                    assignedContainer.text(salesManager);
                    targetElement.attr('data-id', id);
                    $job = tr.find('[data-content="jobs"]');
                    $job.text('');

                    tr.find('[data-content="workflow"]').text(element.workflow.name);
                    tr.find('[data-content="customer"]').text(element.customer && element.customer.name ? element.customer.name.first + ' ' + element.customer.name.last : '');

                    project = element._id;

                    changedAttr.project = project;

                    dataService.getData('/jobs/getForDD', {projectId: project, all: true}, function (jobs) {
                        var _job = jobs ? jobs[0] : {name: ''};

                        _job = _job || {name: ''};
                        self.responseObj['#jobs'] = jobs;

                        $job.text(_job.name);

                        if (!_job._id) {
                            $job.addClass('errorContent editable');
                            $job.removeAttr('data-id');
                        } else {
                            $job.removeClass('errorContent');
                            $job.addClass('editable');
                            $job.attr('data-id', _job._id);

                            changedAttr.jobs = _job._id;
                        }
                    });

                } else if (elementType === '#jobs') {
                    jobs = element._id;

                    changedAttr.jobs = jobs;

                    tr.find('[data-content="jobs"]').removeClass('errorContent');
                } else if (elementType === '#type') {
                    changedAttr._type = textVal === 'OT' ? 'overtime' : 'ordinary';
                    this.setOverTime(textVal, tr);
                } else if (elementType === '#employee') {
                    tr.find('[data-content="department"]').text(element.department.name);

                    employee = element._id;

                    department = element.department._id;

                    changedAttr.employee = employee;
                    changedAttr.department = department;

                    targetElement.attr('data-id', employee);

                    // this.calculateCost(e, wTrackId);
                    tr.find('[data-content="department"]').removeClass('errorContent');
                } else if (elementType === '#department') {
                    department = element._id;

                    changedAttr.department = department;
                } else if (elementType === '#week') {
                    changedAttr.week = textVal;
                } else if (elementType === '#year') {
                    changedAttr.year = textVal;
                }

                targetElement.removeClass('errorContent');
                targetElement.text(textVal);
            } else if (id === 'createJob') {
                self.generateJob(e);
            }

            this.hide(e);
            this.setEditable(targetElement);

            if (needCheckVacHol) {
                this.checkVacHolMonth(tr, editWtrackModel, function () {
                    self.setChangedValueToModel(tr);
                });
            }

            return false;
        },

        checkVacHolMonth: function ($targetTr, wTrack, cb) {
            // todo add spiner load
            var self = this;
            var $employee = $targetTr.find('[data-content="employee"]');
            var employeeId = $employee.attr('data-id');
            var year = $targetTr.find('[data-content="year"]').text();
            var month = $targetTr.find('[data-content="month"]').text();
            var week = $targetTr.find('[data-content="week"]').text();
            var dateByWeek = year * 100 + parseInt(week, 10);
            var _$days = $targetTr.find('.autoCalc');

            _$days.removeClass();
            _$days.addClass('editable autoCalc');

            if (wTrack && wTrack.get('dateByWeek') !== dateByWeek) {
                wTrack = null;
            }

            employeeHelper.getNonWorkingDaysByWeek(year, week, month, employeeId, wTrack,
                function (nonWorkingDays, self) {
                    var days = Object.keys(nonWorkingDays);
                    var length = days.length - 1;
                    var prevValue;
                    var isOverTime;
                    var _class;
                    var isDefaultHours;
                    var $el;
                    var day;
                    var value;
                    var i;

                    for (i = length; i >= 0; i--) {
                        day = days[i];
                        _class = '';

                        if (day) {
                            value = nonWorkingDays[day];
                            $el = $targetTr.find('[data-content="' + day + '"]');
                            isOverTime = $el.closest('tr').hasClass('overtime');
                            isDefaultHours = day !== '7' && day !== '6' /* && value === '' */ && _class !== 'disabled' && !wTrack;

                            if (value) {

                                if (!isFinite(value)) {
                                    _class = value;
                                    value = 0;
                                }

                                $el.addClass(_class);

                                if (_class !== 'disabled') {
                                    if (!isOverTime) { // in case of rewriting existing values for OT
                                        prevValue = $el.text();
                                        prevValue = parseFloat(prevValue);
                                        if (isFinite(prevValue) && prevValue !== value) {
                                            self.setChangedValueToModel();
                                            self.showSaveCancelBtns();
                                        }
                                        $el.text(value);
                                    }
                                } else {
                                    $el.text('');
                                }
                            } else if (isDefaultHours) {
                                $el.text(8);
                            } else {
                                $el.text('');
                            }
                        }
                    }

                    self.autoCalc(null, $targetTr);

                    if (cb && typeof cb === 'function') {
                        cb();
                    }
                }, self);
        },

        bindingEventsToEditedCollection: function (context) {
            if (context.editCollection) {
                context.editCollection.unbind();
            }

            context.editCollection = new EditCollection(context.collection.toJSON());
            context.collection.bind('resetEditCollection', context.resetEditCollection, context);
            context.editCollection.on('saved', context.savedNewModel, context);
            context.editCollection.on('updated', context.updatedOptions, context);
        },

        savedNewModel: function (modelObjects) {
            var $savedRow = this.$listTable.find(".false[data-id='" + modelObjects.cid + "']"); // additional selector for finding old row by cid (in case of multiply copying)
            var $checkbox = $savedRow.find('input[type=checkbox]');
            var modelId;
            var self = this;

            // modelObject = modelObject.success;

            if (modelObjects) { // now only one element from list? because we hav ot checkbox
                modelId = modelObjects._id;
                $savedRow.attr('data-id', modelId);
                $savedRow.removeClass('false');
                $checkbox.val(modelId);
                $savedRow.removeAttr('id');
                delete self.changedModels[modelObjects.cid];

                this.editCollection.remove(modelObjects.cid);
            }

            delete modelObjects.cid;

            this.changedModels = {};

            this.hideSaveCancelBtns();
            // this.hideOvertime();
            this.resetCollection(modelObjects);
        },

        resetCollection: function (model) {
            if (model && model._id) {
                model = new this.CurrentModel(model);

                this.collection.add(model);
                this.editCollection.add(model);
            } else {
                this.collection.set(this.editCollection.models, {remove: false});
            }
        },

        createItem: function () {
            var now = new Date();
            var year = now.getFullYear();
            var month = now.getMonth() + 1;
            var week = now.getWeek();
            // var rate = 3;
            var startData = {
                year        : year,
                month       : month,
                week        : week,
                // rate        : rate,
                projectModel: null,
                _type       : 'ordinary'
            };

            // this.$el.find('#overtime').show();

            var model = new CurrentModel(startData);

            startData.cid = model.cid;

            if (!this.isNewRow()) {
                this.showSaveCancelBtns();
                this.editCollection.add(model);

                new this.CreateView(startData);
            } else {
                App.render({
                    type   : 'notify',
                    message: 'Please confirm or discard changes befor create a new item'
                });
            }

            this.createdCopied = true;
            this.changed = true;
        },

        getAutoCalcField: function (idTotal, dataRow, money) {
            var footerRow = this.$el.find('#listFooter');

            var checkboxes = this.$el.find('#listTable .checkbox:checked');

            var totalTd = $(footerRow).find('#' + idTotal);
            var rowTdVal = 0;
            var row;
            var rowTd;

            $(checkboxes).each(function (index, element) {
                row = $(element).closest('tr');
                rowTd = row.find('[data-content="' + dataRow + '"]');

                rowTdVal += parseFloat(rowTd.html() || 0) * 100;
            });

            if (money) {
                totalTd.text((rowTdVal / 100).toFixed(2));
            } else {
                totalTd.text(rowTdVal / 100);
            }
        },

        hideDeleteBtnAndUnSelectCheckAll: function () {
            $('#top-bar-deleteBtn').hide();
            $('#top-bar-generateBtn').hide();
            $('#top-bar-copyBtn').hide();
            $('#top-bar-createBtn').show();

            this.$el.find('#checkAll').prop('checked', false);
        },

        setAllTotalVals: function (e) {
            // e.stopPropagation();

            this.getAutoCalcField('hours', 'worked');
            this.getAutoCalcField('monHours', '1');
            this.getAutoCalcField('tueHours', '2');
            this.getAutoCalcField('wedHours', '3');
            this.getAutoCalcField('thuHours', '4');
            this.getAutoCalcField('friHours', '5');
            this.getAutoCalcField('satHours', '6');
            this.getAutoCalcField('sunHours', '7');
        },

        render: function () {
            var self = this;
            var $currentEl = this.$el;
            var pagenation;
            var checkedInputs;
            var allInputs;

            $currentEl.html('');
            $currentEl.append(_.template(listTemplate));
            $currentEl.append(new ListItemView({
                collection: this.collection,
                page      : this.page
            }).render());// added two parameters page and items number

            // this.renderPagination($currentEl, this);

            // $currentEl.append("<div id='timeRecivingDataFromServer'>Created in " + (new Date() - this.startTime) + " ms</div>");

            // this.renderFilter();

            setTimeout(function () {
                self.bindingEventsToEditedCollection(self);
                self.$listTable = $('#listTable');
            }, 10);

            this.copyEl = $('#top-bar-copyBtn');
            this.$saveBtn = $('#top-bar-saveBtn');

            return this;
        }
    });

    return wTrackListView;
});
