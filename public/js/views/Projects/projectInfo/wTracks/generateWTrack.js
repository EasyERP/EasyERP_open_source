define(["text!templates/Projects/projectInfo/wTracks/generate.html",
        "text!templates/Projects/projectInfo/wTracks/wTrackPerEmployee.html",
        'views/Projects/projectInfo/wTracks/wTrackPerEmployee',
        'views/selectView/selectView',
        'collections/Jobs/filterCollection',
        'populate',
        'dataService',
        'moment',
        'common'
    ],
    function (generateTemplate, wTrackPerEmployeeTemplate, wTrackPerEmployee, selectView, JobsCollection, populate, dataService, moment, common) {
        "use strict";
        var CreateView = Backbone.View.extend({
                template                 : _.template(generateTemplate),
                wTrackPerEmployeeTemplate: _.template(wTrackPerEmployeeTemplate),
                responseObj              : {},

                events: {
                    "click .newSelectList li:not(.miniStylePagination)"       : "chooseOption",
                    "click .current-selected"                                 : "showNewSelect",
                    "click #addNewEmployeeRow"                                : "addNewEmployeeRow",
                    "click a.generateType"                                    : "generateType",
                    "click td.editable"                                       : "editRow",
                    "change .editable "                                       : "setEditable",
                    'mouseover tbody tr:not("#addNewItem")'                   : 'showRemove',
                    'mouseleave tbody tr:not("#addNewItem")'                  : 'hideRemove',
                    'click .remove'                                           : 'deleteRow',
                    "keydown input:not(#jobName, #selectInput)"               : "onKeyDownInput",
                    "keyup input:not(#jobName, #selectInput, .hasDatepicker)" : "onKeyUpInput",
                    "click div:not(input.endDateInput)"                       : "hideSelects"
                },

                hideSelects: function (e) {
                    e.stopPropagation();
                    if (this.selectView) {
                        this.selectView.remove();
                    }

                    this.$el.find('.generateTypeUl').hide();

                    this.setChangedValueToModel();
                },

                onKeyDownInput: function (e) {
                    // Allow: backspace, delete, tab, escape, enter, home, end, left, right
                    if ($.inArray(e.keyCode, [46, 8, 9, 27, 13]) !== -1 || (e.keyCode >= 35 && e.keyCode <= 39)) {
                        if (e.which === 13) {
                            this.setChangedValueToModel(e);
                        }
                        return;
                    }

                    if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
                        e.preventDefault();
                    }
                },

                onKeyUpInput: function (e) {
                    var element = e.target;

                    if (element.maxLength && element.value.length > element.maxLength) {
                        element.value = element.value.slice(0, element.maxLength);
                    } else if ($(element).hasClass('editing') && ($(element).attr('id') !== 'inputHours') ){  // added validation for hours fields
                        if ($(element).val() > 24) {
                            $(element).val(24);
                        }
                    } else {
                        if ($(element).attr('id') === 'inputHours') {

                            this.setChangedValueToModel();
                        }
                    }
                },

                keyDown: function (e) {
                    if (e.which === 13) {
                        this.setChangedValueToModel(e);
                    }
                },

                stopDefaultEvents: function (e) {
                    e.stopPropagation();
                    e.preventDefault();
                },

                showRemove: function (e) {
                    var $target = $(e.target);
                    var $tr = $target.closest('tr');
                    var $removeHref = $tr.find('.remove a');

                    $removeHref.removeClass('hidden');
                },

                deleteRow: function (e) {
                    var $target = $(e.target);
                    var $tr = $target.closest('tr');
                    var $removeHref = $tr.find('.remove a');
                    var arrayIndex = $removeHref.attr('id');

                    this.resultArray.splice(arrayIndex, 1);
                    $tr.remove();
                },

                hideRemove: function (e) {
                    var $target = $(e.target);
                    var $tr = $target.closest('tr');
                    var $removeHref = $tr.find('.remove a');

                    $removeHref.addClass('hidden');
                },

                initialize: function (options) {
                    this.model = options.model;
                    this.wTrackCollection = options.wTrackCollection;
                    this.asyncLoadImgs(this.model);
                    this.forQuotationGenerate = !!options.forQuotationGenerate;

                    _.bindAll(this, 'generateItems');

                    this.modelJSON = this.model.id ? this.model.toJSON() : this.model;

                    this.resultArray = [];

                    this.jobs = options.jobs ? options.jobs : null;

                    this.jobsCollection = options.jobsCollection;

                    this.createJob = options.createJob; //? options.createJob : true;
                    this.quotationDialog = options.quotationDialog;

                    this.render();
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

                generateType: function (e) {
                    var targetEl = $(e.target);
                    var td = targetEl.closest('td');
                    var ul = td.find('.newSelectList');

                    ul.show();

                    if (this.selectView) {
                        this.selectView.remove();
                    }

                    this.stopDefaultEvents(e);
                },

                addNewEmployeeRow: function (e) {
                    this.stopDefaultEvents(e);

                    this.setChangedValueToModel();

                    var self = this;

                    var defaultObject = {
                        startDate: '',
                        endDate  : '',
                        hours    : '',
                        project  : this.modelJSON._id,
                        1        : 8,
                        2        : 8,
                        3        : 8,
                        4        : 8,
                        5        : 8,
                        6        : 0,
                        7        : 0
                    };

                    var target = $(e.target);
                    //var wTrackPerEmployeeContainer = this.$el.find('#wTrackItemsHolder');
                    var parrent = target.closest('tbody');
                    var parrentRow = parrent.find('.productItem').last();
                    var rowId = parrentRow.attr("data-id");
                    var trEll = parrent.find('tr.productItem');
                    var date = moment(new Date());
                    var year = date.year();
                    var month = date.month();
                    var week = date.isoWeek();

                    var elem = this.wTrackPerEmployeeTemplate({
                        year : year,
                        month: month,
                        week : week,
                        id   : this.resultArray.length
                    });
                    var errors = this.$el.find('.errorContent');

                    if ((rowId === undefined || rowId !== 'false') && errors.length === 0) {

                        this.resultArray.push(defaultObject);

                        if (!trEll.length) {
                            parrent.prepend(elem);
                            $(".generateTypeUl").hide();

                            return this.bindDataPicker();
                        }

                        $(trEll[trEll.length - 1]).after(elem);
                        $(".generateTypeUl").hide();

                        this.bindDataPicker();
                    }
                },

                bindDataPicker: function () {
                    var dataPickerStartContainers = $('.datapicker.startDate');
                    var dataPickerEndContainers = $('.endDateDP.datapicker');
                    var self = this;
                    var currntYear = parseInt(moment(new Date()).get('year'));
                    var yearRange = (currntYear - 1).toString() + ":" + (currntYear + 1).toString();

                    dataPickerStartContainers.datepicker({
                        dateFormat       : "d M, yy",
                        changeMonth      : true,
                        changeYear       : true,
                        yearRange        : yearRange,
                        onSelect         : function (text, datPicker) {
                            var targetInput = $(this);
                            var tr = targetInput.closest('tr');
                            var endDatePicker = tr.find('.endDateDP');
                            var endDate = moment(targetInput.datepicker('getDate'));
                            var endContainer = $(endDatePicker);

                            endDate.add(6, 'days');
                            endDate = endDate.toDate();

                            endContainer.datepicker('option', 'minDate', endDate);

                            targetInput.parent().removeClass('errorContent');

                            self.setChangedValueToModel(targetInput);

                            self.calculateHours(tr.attr('data-id'));

                            return false;
                        },
                        onChangeMonthYear: function (year, month, inst) {
                            return false;
                        }
                    }).removeClass('datapicker');

                    dataPickerEndContainers.datepicker({
                        dateFormat       : "d M, yy",
                        changeMonth      : true,
                        changeYear       : true,
                        yearRange        : yearRange,
                        onSelect         : function (text, datPicker) {
                            var targetInput = $(this);
                            var tr = targetInput.closest('tr');

                            targetInput.parent().removeClass('errorContent');

                            self.setChangedValueToModel(targetInput);

                            self.calculateHours(tr.attr('data-id'));

                            return false;
                        },
                        onChangeMonthYear: function (year, month, inst) {
                            return false;
                        }
                    }).removeClass('datapicker');
                },

                calculateHours: function (number) {
                    var length = number;
                    var hours;
                    var startDate = moment(new Date(this.resultArray[length].startDate));
                    var endDate = moment(new Date(this.resultArray[length].endDate));
                    var hoursValue = parseInt(this.resultArray[length].hours, 10);
                    var totalPerWeek = 0;
                    var row = this.$el.find("[data-id='" + length + "']");
                    var i;
                    var dayCount = 0;
                    var satWork = false;
                    var sunWork = false;

                    if (row.find('.generateType').text() === 'Hours') {
                        if (isNaN(hoursValue)) {
                            row.find('.totalHours').text('');
                        } else {
                            row.find('.totalHours').text(hoursValue);
                        }

                        return false;
                    }

                    for (i = 7; i >= 1; i--) {
                        var tr = this.$el.find('[data-id="' + number + '"]');
                        var value = parseInt(tr.find('[data-content="' + i + '"]').text(), 10);

                        if (i === 7 && value) {
                            sunWork = true;
                        }

                        if (i === 6 && value) {
                            satWork = true;
                        }

                        if (value) {
                            dayCount++;
                        }
                        totalPerWeek += value;
                    }

                    function workDays(start, end) {
                        var first = start.clone().endOf('week');
                        var last = end.clone().startOf('week');
                        var days = last.diff(first, 'days') * dayCount / 7;
                        var weekFirst = first.day() - start.day();
                        var weekLast = end.day() - last.day();

                        if (satWork) {
                            weekFirst++;
                        }

                        if (sunWork) {
                            weekLast++;
                        }

                        if (dayCount < 7 && start.day() === 0) {
                            --weekFirst;
                        }

                        if (dayCount < 6 && end.day() === 6) {
                            --weekLast;
                        }

                        return ((weekFirst + weekLast + days) * totalPerWeek / dayCount);
                    }

                    hours = workDays(startDate, endDate);

                    if (isFinite(hours)) {
                        this.$el.find("[data-id='" + length + "']").find('.totalHours').text(hours.toFixed());
                    }
                },

                editRow: function (e) {
                    $(".newSelectList").hide();

                    var el = $(e.target);
                    var isInput = el.prop('tagName') === 'INPUT';
                    var tr = $(e.target).closest('tr');
                    var wTrackId = tr.attr('data-id');
                    var content = el.data('content');
                    var tempContainer;
                    var width;
                    var value;
                    var insertedInput;
                    var input;

                    //var isNotData = $(isInput).hasClass('noPadding') ? true: false;

                    if (wTrackId && !isInput) {
                        this.wTrackId = wTrackId;
                        this.setChangedValueToModel();
                    }

                    if (!isInput) {
                        tempContainer = el.text();
                        width = el.width() - 6;
                        el.html('<input class="editing" type="text" value="' + tempContainer + '" style="width:' + width + 'px">');

                        input = this.$el.find('.editing');

                        if (content === "revenue") {
                            input.attr({
                                "maxLength": 6
                            });
                        } else {
                            input.attr({
                                "maxLength": 2
                            });
                        }

                        insertedInput = el.find('input');
                        insertedInput.focus();
                        insertedInput[0].setSelectionRange(0, insertedInput.val().length);
                    }

                    // this.setChangedValueToModel(e);

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

                setChangedValue: function () {
                    if (!this.changed) {
                        this.changed = true;
                    }
                },

                isEditRows: function () {
                    var edited = this.$listTable.find('.edited');

                    this.edited = edited;

                    return !!edited.length;
                },

                setChangedValueToModel: function (elem) {
                    var editedElement = elem || this.$listTable.find('.editing');
                    var editedCol;
                    var editedElementRowId;
                    var editedElementContent;
                    var editedElementValue;

                    if (editedElement.length) {

                        if (editedElement.length > 1) {
                            editedElement = $(editedElement[1]);
                        }

                        editedCol = editedElement.closest('td');
                        editedElementRowId = editedElement.closest('tr').data('id');
                        editedElementContent = editedCol.data('content');
                        editedElementValue = editedElement.val();

                        if (editedElement.attr('id') === 'inputHours') {
                            editedElementValue = parseInt(editedElementValue);
                            this.calculateHours(editedElementRowId);
                        }

                        if (editedElementValue) {
                            editedCol.removeClass('errorContent');
                        } else {
                            editedCol.addClass('errorContent');
                        }

                        this.resultArray[editedElementRowId][editedElementContent] = editedElementValue;

                        if (!elem) {
                            editedCol.not('.endDateTD').text(editedElementValue);
                            editedElement.not('.endDateInput').remove();

                            this.calculateHours(editedElementRowId);
                        }
                    }
                },

                generateItems: function (e) {

                    var self = this;
                    var once = _.once(generateOnce);

                    once();

                    function generateOnce() {
                        self.setChangedValueToModel();// add for setChanges by Hours

                        var errors = self.$el.find('.errorContent');
                        var data = JSON.stringify(self.resultArray);
                        var tabs;
                        var activeTab;
                        var dialogHolder;
                        var jobId = self.jobs ? self.jobs._id : null;
                        var jobName = self.jobs ? self.jobs.name : $("#jobName").val();
                        var _id = window.location.hash.split('form/')[1];
                        var nameRegExp = /^[a-zA-Z0-9\s][a-zA-Z0-9-,\s\.\/\s]+$/;

                        var filter = {
                            'projectName': {
                                key  : 'project._id',
                                value: [_id],
                                type : "ObjectId"
                            }
                        };

                        self.stopDefaultEvents(e);

                        if (errors.length) {
                            return App.render({
                                type   : 'notify',
                                message: 'Please, enter all information first.'
                            });
                        }

                        if (nameRegExp.test(jobName)) {
                            $.ajax({
                                type       : 'Post',
                                url        : '/wTrack/generateWTrack',
                                contentType: "application/json",
                                data       : data,

                                beforeSend: function (xhr) {
                                    xhr.setRequestHeader("createJob", self.createJob);
                                    xhr.setRequestHeader("project", self.modelJSON._id);
                                    xhr.setRequestHeader("jobid", jobId);
                                    xhr.setRequestHeader("jobname", jobName);
                                },

                                success: function () {
                                    self.hideDialog();

                                    if (self.wTrackCollection && self.wTrackCollection.wTrackView) {
                                        self.wTrackCollection.wTrackView.undelegateEvents(); //need refactor
                                    }

                                    if (self.wTrackCollection) {
                                        self.wTrackCollection.showMore({count: 50, page: 1, filter: filter});
                                    }

                                    if (self.quotationDialog) {
                                        return self.quotationDialog.generatedWtracks();
                                    }

                                    App.projectInfo = App.projectInfo || {};
                                    App.projectInfo.currentTab = 'timesheet';

                                    tabs = $(".chart-tabs");
                                    activeTab = tabs.find('.active');

                                    activeTab.removeClass('active');
                                    tabs.find('#' + App.projectInfo.currentTab + 'Tab').addClass("active");

                                    dialogHolder = $(".dialog-tabs-items");
                                    dialogHolder.find(".dialog-tabs-item.active").removeClass("active");
                                    dialogHolder.find('#' + App.projectInfo.currentTab).closest('.dialog-tabs-item').addClass("active");

                                },
                                error  : function () {
                                    App.render({
                                        type   : 'error',
                                        message: 'Some error'
                                    });
                                }
                            });
                        } else {
                            App.render({
                                type   : 'notify',
                                message: 'Please, enter correct Job name!'
                            });
                        }
                    }
                },

                hideDialog: function () {
                    $(".wTrackDialog").remove();
                },

                showNewSelect: function (e, prev, next) {
                    //var targetEl = $(e.target);
                    //var content = targetEl.closest('td').attr('data-content');
                    //
                    //populate.showSelect(e, prev, next, this);
                    var $target = $(e.target);
                    e.stopPropagation();

                    this.$el.find('.generateTypeUl').hide();

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
                        departmentContainer.find('a.current-selected').text(element.department.departmentName);
                        departmentContainer.removeClass('errorContent');

                        employee = element._id;
                        department = element.department._id;

                        editWtrackModel.employee = employee;
                        editWtrackModel.department = department;

                    } else if (elementType === '#department') {
                        departmentContainer = tr.find('[data-content="department"]');
                        departmentContainer.find('a.current-selected').text(element.name);
                        departmentContainer.removeClass('errorContent');

                        department = element._id;

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
                            endDateInput.addClass('editing');
                            endDateDP.addClass('hidden');
                            endDateTD.attr('data-content', 'hours');
                        }
                    }

                    targetElement.removeClass('errorContent');

                    selectorContainer.text(target.text());
                    this.setChangedValueToModel(e);
                    this.hideNewSelect();

                    return false;
                },

                hideNewSelect: function () {
                    $(".newSelectList:not('.generateTypeUl')").remove();
                    $(".generateTypeUl").hide();
                },

                render: function () {
                    var thisEl = this.$el;
                    var self = this;
                    var project = this.model.id ? this.model.toJSON() : this.model;
                    var dialog = this.template({
                        project  : project,
                        jobs     : self.jobs,
                        createJob: self.createJob
                    });

                    if (!project) {
                        return;
                    }

                    this.$el = $(dialog).dialog({
                        dialogClass: "wTrackDialog",
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

                    dataService.getData("/employee/getForDD", {isEmployee: true}, function (employees) {
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