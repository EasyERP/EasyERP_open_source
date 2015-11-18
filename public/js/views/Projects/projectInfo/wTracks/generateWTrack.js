define(["text!templates/Projects/projectInfo/wTracks/generate.html",
        "text!templates/Projects/projectInfo/wTracks/wTrackPerEmployee.html",
        'views/Projects/projectInfo/wTracks/wTrackPerEmployee',
        'collections/Jobs/filterCollection',
        'populate',
        'dataService',
        'moment',
        'common'
    ],
    function (generateTemplate, wTrackPerEmployeeTemplate, wTrackPerEmployee, JobsCollection, populate, dataService, moment, common) {
        "use strict";
        var CreateView = Backbone.View.extend({
                template: _.template(generateTemplate),
                wTrackPerEmployeeTemplate: _.template(wTrackPerEmployeeTemplate),
                responseObj: {},

                events: {
                    "click .newSelectList li:not(.miniStylePagination)": "chooseOption",
                    "click .current-selected": "showNewSelect",
                    "click .newSelectList li.miniStylePagination": "notHide",
                    "click .newSelectList li.miniStylePagination .next:not(.disabled)": "nextSelect",
                    "click .newSelectList li.miniStylePagination .prev:not(.disabled)": "prevSelect",
                    "click #addNewEmployeeRow": "addNewEmployeeRow",
                    "click a.generateType": "generateType",
                    "click td.editable": "editRow",
                    "change .editable ": "setEditable",
                    //"click": "hideNewSelect",
                    'keydown input.editing': 'keyDown'
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

                initialize: function (options) {
                    this.model = options.model;
                    this.wTrackCollection = options.wTrackCollection;
                    this.asyncLoadImgs(this.model);

                    _.bindAll(this, 'generateItems');

                    this.modelJSON = this.model.toJSON();

                    this.resultArray = [];

                    this.jobs = options.jobs ? options.jobs: null;

                    this.jobsCollection = options.jobsCollection;

                    this.createJob = options.createJob;

                    this.render();
                },

                asyncLoadImgs: function (model) {
                    var currentModel = model.toJSON();
                    var id = currentModel._id;

                    common.getImagesPM([currentModel.projectmanager._id], "/getEmployeesImages", "#" + id, function (result) {
                        var res = result.data[0];

                        $(".miniAvatarPM").attr("data-id", res._id).find("img").attr("src", res.imageSrc);
                    });

                    common.getImagesPM([currentModel.customer._id], "/getCustomersImages", "#" + id, function (result) {
                        var res = result.data[0];

                        $(".miniAvatarCustomer").attr("data-id", res._id).find("img").attr("src", res.imageSrc);
                    });
                },

                generateType: function (e) {
                    var targetEl = $(e.target);
                    var td = targetEl.closest('td');
                    var ul = td.find('.newSelectList');

                    ul.show();

                   // this.stopDefaultEvents(e);
                },

                addNewEmployeeRow: function (e) {
                    this.stopDefaultEvents(e);

                    this.setChangedValueToModel();

                    var self = this;

                    var defaultObject = {
                        startDate: '',
                        endDate: '',
                        hours: '',
                        project: {
                            projectName: this.modelJSON.projectName,
                            workflow: this.modelJSON.workflow,
                            customer: this.modelJSON.customer,
                            projectmanager: this.modelJSON.projectmanager,
                            _id: this.modelJSON._id
                        },
                        employee: {},
                        department: {},
                        1: 8,
                        2: 8,
                        3: 8,
                        4: 8,
                        5: 8,
                        6: 0,
                        7: 0,
                        revenue: 120
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
                        year: year,
                        month: month,
                        week: week,
                        id: this.resultArray.length
                    });
                    var errors = this.$el.find('.errorContent');

                    this.resultArray.push(defaultObject);

                    if ((rowId === undefined || rowId !== 'false') && errors.length === 0) {

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

                    dataPickerStartContainers.datepicker({
                        dateFormat: "d M, yy",
                        changeMonth: true,
                        changeYear: true,
                        onSelect: function (text, datPicker) {
                            var targetInput = $(this);
                            var td = targetInput.closest('tr');
                            var endDatePicker = td.find('.endDateDP');
                            var endDate = moment(targetInput.datepicker('getDate'));
                            var endContainer = $(endDatePicker);

                            endDate.add(7, 'days');
                            endDate = endDate.toDate();

                            endContainer.datepicker('option', 'minDate', endDate);

                            self.setChangedValueToModel(targetInput);

                            return false;
                        }
                    }).removeClass('datapicker');

                    dataPickerEndContainers.datepicker({
                        dateFormat: "d M, yy",
                        changeMonth: true,
                        changeYear: true,
                        onSelect: function (text, datPicker) {
                            var targetInput = $(this);

                            self.setChangedValueToModel(targetInput);

                            return false;
                        }
                    }).removeClass('datapicker');
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

                    //var isNotData = $(isInput).hasClass('noPadding') ? true: false;

                    if (wTrackId && !isInput) {
                        this.wTrackId = wTrackId;
                        this.setChangedValueToModel();
                    }

                    if (!isInput) {
                        tempContainer = el.text();
                        width = el.width() - 6;
                        el.html('<input class="editing" type="text" value="' + tempContainer + '"  maxLength="4" style="width:' + width + 'px">');

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
                    var editedElement = elem ||this.$listTable.find('.editing');
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

                        this.resultArray[editedElementRowId][editedElementContent] = editedElementValue;

                        if (!elem) {
                            editedCol.not('.endDateTD').text(editedElementValue);
                            editedElement.not('.endDateInput').remove();
                        }
                    }
                },

                generateItems: function (e) {

                    this.setChangedValueToModel(); // add for setChanges by Hours

                    var errors = this.$el.find('.errorContent');
                    var self = this;
                    var data = JSON.stringify(this.resultArray);
                    var tabs;
                    var activeTab;
                    var dialogHolder;
                    var jobId = self.jobs ? self.jobs._id : null;
                    var jobName = self.jobs ? self.jobs.name : $("#jobName").val();
                    var _id = window.location.hash.split('form/')[1];
                    //var nameRegExp = /^[\w\.@]{3,100}$/;
                    var nameRegExp = /^[a-zA-Z0-9\s][a-zA-Z0-9-,\s\.\/\s]+$/;

                    var filter = {
                        'projectName': {
                            key  : 'project._id',
                            value: [this.modelJSON._id]
                        }
                    };

                    this.stopDefaultEvents(e);

                    if (errors.length) {
                        return
                    }

                    if (nameRegExp.test(jobName)){
                        $.ajax({
                            type: 'Post',
                            url: '/wTrack/generateWTrack',
                            contentType: "application/json",
                            data: data,

                            beforeSend: function (xhr) {
                                xhr.setRequestHeader("createJob", self.createJob);
                                xhr.setRequestHeader("project", self.modelJSON._id);
                                xhr.setRequestHeader("jobid", jobId);
                                xhr.setRequestHeader("jobname", jobName);
                            },

                            success: function () {
                                self.hideDialog();

                                self.wTrackCollection.showMore({count: 50, page: 1, filter: filter});

                                tabs = $(".chart-tabs");
                                activeTab = tabs.find('.active');

                                activeTab.removeClass('active');
                                tabs.find('#wTrackTab').addClass("active");

                                dialogHolder = $(".dialog-tabs-items");
                                dialogHolder.find(".dialog-tabs-item.active").removeClass("active");
                                dialogHolder.find('#weTracks').closest('.dialog-tabs-item').addClass("active");
                            },
                            error: function () {
                                alert('error');
                            }
                        });
                    } else {
                        alert("Please, enter Job name!");
                    }

                },

                hideDialog: function () {
                    $(".edit-dialog").remove();
                },

                showNewSelect: function (e, prev, next) {
                    var targetEl = $(e.target);
                    var content = targetEl.closest('td').attr('data-content');
                    var tr;
                    var department;

                    /*if(content === 'employee'){
                     tr = targetEl.closest('tr');
                     department = tr.find('td[data-content="department"]').attr('data-id');

                     populate.employeesByDep({
                     e: e,
                     prev: prev,
                     next: next,
                     context: this,
                     department: department
                     });

                     return false;
                     }*/

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
                            _id: element._id,
                            name: element.name
                        };
                        department = {
                            _id: element.department._id,
                            departmentName: element.department.name
                        };

                        editWtrackModel.employee = employee;
                        editWtrackModel.department = department;

                    } else if (elementType === '#department'){
                        departmentContainer = tr.find('[data-content="department"]');
                        departmentContainer.find('a.current-selected').text(element.name);
                        departmentContainer.removeClass('errorContent');

                        department = {
                            _id: element._id,
                            departmentName: element.name
                        };

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
                    var project = this.model.toJSON();
                    var dialog = this.template({
                        project: project,
                        jobs:  self.jobs,
                        createJob: self.createJob
                    });

                    this.$el = $(dialog).dialog({
                        dialogClass: "edit-dialog",
                        width: 1200,
                        title: "Generate weTrack",
                        buttons: {
                            save: {
                                text: "Generate",
                                class: "btn",
                                id: "generateBtn",
                                click: self.generateItems
                            },
                            cancel: {
                                text: "Cancel",
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