define([
        'views/listViewBase',
        'text!templates/Capacity/list/listHeader.html',
        'text!templates/Capacity/list/cancelEdit.html',
        'text!templates/Vacation/list/ListTotal.html',
        'text!templates/Capacity/list/departmentRows.html',
        'text!templates/Capacity/list/ListTemplate.html',
        "text!templates/Capacity/CreateTemplate.html",
        'models/Capacity',
        'collections/Capacity/filterCollection',
        'collections/Capacity/editCollection',
        'collections/Capacity/departmentCollection',
        'common',
        'dataService',
        'constants',
        'async',
        'moment',
        'populate',
        'custom'
    ],

    function (listViewBase, listHeaderTemplate, cancelEdit, listTotal, departmentListTemplate, listTemplate, createTemplate, currentModel, filterCollection, editCollection, departmentCollection, common, dataService, CONSTANTS, async, moment, populate, custom) {
        var CapacityListView = listViewBase.extend({
            el                : '#content-holder',
            defaultItemsNumber: null,
            listLength        : null,
            filter            : null,
            sort              : null,
            newCollection     : null,
            page              : null, //if reload page, and in url is valid page
            contentType       : CONSTANTS.CAPACITY,//needs in view.prototype.changeLocationHash
            viewType          : 'list',//needs in view.prototype.changeLocationHash
            changedModels     : {},
            holidayId         : null,
            editCollection    : null,
            responseObj       : {},
            monthElement      : null,
            yearElement       : null,
            vacations         : null,

            events: {
                "click .createBtn"                                                : "createItem",
                "click .newSelectList li.miniStylePagination .next:not(.disabled)": "nextSelect",
                "click .newSelectList li.miniStylePagination .prev:not(.disabled)": "prevSelect",
                "click td.editable"                                               : "editRow",
                "click .current-selected"                                         : "showNewCurrentSelect",
                "click .newSelectList li:not(.miniStylePagination)"               : "chooseOption",
                "click .oe-sortable"                                              : "goSort",
                "change .editable "                                               : "setEditable",
                "click"                                                           : "hideNewSelect",
                "click .departmentRow td"                                         : "capacityClick",
                "click .checkbox"                                                 : "checked"
            },

            initialize: function (options) {
                this.startTime = options.startTime;
                this.capacityObject = options.collection.toJSON()[0].capacityObject;
                this.departmentObject = options.collection.toJSON()[0].departmentObject;
                _.bind(this.collection.showMore, this.collection);
                this.render();
                this.daysCount;
                this.departmentsCollections = {};
                this.sortConst = 1;
            },

            showNewCurrentSelect: function (e, prev, next) {
                populate.showSelect(e, prev, next, this, 12);
            },

            hideNewSelect: function () {
                $(".newSelectList").remove();
            },

            savedNewModel: function (modelObject) {
                var savedRow = this.$listTable.find('#false');
                var modelId;

                modelObject = modelObject.success;

                if (modelObject) {
                    modelId = modelObject._id;
                    savedRow.attr("data-id", modelId);
                    savedRow.removeAttr('id');
                }

                this.changedModels = {};

                $(savedRow).find('.edited').removeClass('edited');

                this.hideSaveCancelBtns();
                this.resetCollection(modelObject);
            },

            bindingEventsToEditedCollection: function (context, collection) {
                if (!context.editCollection) {
                    context.editCollection = new editCollection(collection);
                } else {
                    context.editCollection.unbind();
                    context.editCollection.add(collection);
                }

                context.editCollection.on('saved', context.savedNewModel, context);
                context.editCollection.on('updated', context.updatedOptions, context);
            },

            resetCollection: function (model) {
                if (model && model._id) {
                    model = new currentModel(model);
                    this.collection.add(model);
                } else {
                    for (var id in this.changedModels) {
                        model = this.editCollection.get(id);
                        model.set(this.changedModels[id]);
                    }
                    this.collection.set(this.editCollection.models, {remove: false});
                }
                this.bindingEventsToEditedCollection(this);
            },

            updatedOptions: function () {
                var savedRow = this.$listTable.find('#false');
                var editedEl = savedRow.find('.editing');
                var editedCol = editedEl.closest('td');
                this.hideSaveCancelBtns();

                editedCol.text(editedEl.val());
                editedEl.remove();

                this.resetCollection();
            },

            hideSaveCancelBtns: function () {
                var createBtnEl = $('#top-bar-createBtn');
                var saveBtnEl = $('#top-bar-saveBtn');
                var cancelBtnEl = $('#top-bar-deleteBtn');

                this.changed = false;

                saveBtnEl.hide();
                cancelBtnEl.hide();
                createBtnEl.show();

                return false;
            },

            saveItem: function () {
                var model;

                this.editCollection.on('saved', this.savedNewModel, this);
                this.editCollection.on('updated', this.updatedOptions, this);

                for (var id in this.changedModels) {
                    model = this.editCollection.get(id);
                    model.changed = this.changedModels[id];
                    model.changed.year = this.yearElement.text();
                    model.changed.month = this.monthElement.attr('data-content');
                }
                this.editCollection.save();
            },

            setChangedValueToModel: function () {
                var editedElement = this.$listTable.find('.editing');
                var editedCol;
                var editedElementRow;
                var editedElementRowId;
                var editedElementContent;
                var editedElementValue;
                var editCapacityModel;
                var dayIndex;
                var editedElementOldValue;
                var changedAttr;
                var tdTotalHours;

                if (editedElement.length) {
                    editedCol = editedElement.closest('td');
                    editedElementRow = editedElement.closest('tr');
                    editedElementRowId = editedElementRow.attr('data-id');
                    tdTotalHours = $(editedElementRow).find('.totalHours');
                    editedElementContent = editedCol.data('content');
                    editedElementOldValue = parseInt(editedElement.attr('data-value'));
                    editedElementValue = parseInt(editedElement.val());

                    editedElementValue = isFinite(editedElementValue) ? editedElementValue : null;
                    editedElementOldValue = isFinite(editedElementOldValue) ? editedElementOldValue : null;

                    editCapacityModel = this.editCollection.get(editedElementRowId);

                    if (!this.changedModels[editedElementRowId]) {
                        if (!editCapacityModel.id) {
                            this.changedModels[editedElementRowId] = editCapacityModel.attributes;
                        } else {
                            this.changedModels[editedElementRowId] = {};
                        }
                    }

                    if (editedElementContent === 'capacityValue') {
                        dayIndex = editedCol.attr('data-dayID');

                        changedAttr = this.changedModels[editedElementRowId];

                        editedCol.text(editedElementValue);

                        if (changedAttr && !changedAttr.capacityArray) {
                            changedAttr.capacityArray = _.clone(editCapacityModel.toJSON().capacityArray);

                            if (!changedAttr.capacityMonthTotal) {
                                changedAttr.capacityMonthTotal = editCapacityModel.toJSON().capacityMonthTotal;
                            }

                            if (!changedAttr.capacityArray) {
                                changedAttr.capacityArray = new Array(this.daysCount);
                            }
                        }

                        changedAttr.capacityArray[dayIndex] = editedElementValue;

                        if (editedElementOldValue !== editedElementValue) {
                            changedAttr.capacityMonthTotal = changedAttr.capacityMonthTotal - editedElementOldValue + editedElementValue;
                            tdTotalHours.text(changedAttr.capacityMonthTotal);
                        }
                    }

                    editedElement.remove();
                }
            },

            monthForDD: function (content) {
                var array = [];

                for (var i = 0; i < 12; i++) {
                    array.push({
                        _id : moment().month(i).format('M'),
                        name: moment().month(i).format('MMMM')
                    });
                }

                content.responseObj['#monthSelect'] = array;

            },

            yearForDD: function (content) {
                dataService.getData('/vacation/getYears', {}, function (response, context) {
                    context.responseObj['#yearSelect'] = response;
                }, content)
            },

            filterEmployeesForDD: function (content) {
                dataService.getData("/employee/getForDD", null, function (employees) {
                    employees = _.map(employees.data, function (employee) {
                        employee.name = employee.name.first + ' ' + employee.name.last;

                        return employee
                    });

                    content.responseObj['#employee'] = employees;
                });
            },

            getVacations: function (content, month, year) {

                dataService.getData("/vacation/list", {month: month, year: year}, function (vacations) {

                    content.vacations = vacations;
                });
            },

            hideInput: function (e) {
                var target = $(e.target);

                target.hide();
            },

            editRow: function (e, prev, next) {
                var el = $(e.target);
                var isInput = el.prop("tagName") === 'INPUT';
                var dataContent = el.attr('data-type');
                var tr = $(e.target).closest('tr');
                var capacityId = tr.attr('data-id');
                var tempContainer;
                var insertedInput;

                if (capacityId && !isInput) {
                    if (this.capacityId) {
                        this.setChangedValueToModel();
                    }
                    this.capacityId = capacityId;
                    this.setChangedValueToModel();
                }

                if (!isInput && dataContent === 'input') {
                    tempContainer = el.text();
                    el.html('<input class="editing" type="text" data-value="' + tempContainer + '" value="' + tempContainer + '"  maxLength="2" style="display: block;" \>');

                    insertedInput = el.find('input');
                    insertedInput.focus();
                } else if (dataContent === 'employeeSelect') {
                    populate.showSelect(e, prev, next, this);
                }

                return false;
            },

            setEditable: function (td) {
                var tr;

                if (!td.parents) {
                    td = $(td.target).closest('td');
                }

                tr = td.parents('tr');

                td.addClass('edited');

                if (this.isEditRows()) {
                    this.setChangedValue();
                }

                return false;
            },

            setChangedValue: function () {
                if (!this.changed) {
                    this.changed = true;
                    this.showSaveCancelBtns()
                }
            },

            isEditRows: function () {
                var edited = this.$listTable.find('.edited');

                this.edited = edited;

                return !!edited.length;
            },

            showSaveCancelBtns: function () {
                var createBtnEl = $('#top-bar-createBtn');
                var saveBtnEl = $('#top-bar-saveBtn');
                var cancelBtnEl = $('#top-bar-deleteBtn');

                if (!this.changed) {
                    createBtnEl.hide();
                }
                saveBtnEl.show();
                cancelBtnEl.show();

                return false;
            },

            renderContent: function () {
                var $currentEl = this.$el;
                var tBody = $currentEl.find('#listTable');
                $("#top-bar-deleteBtn").hide();
                $('#check_all').prop('checked', false);
                tBody.empty();
                var itemView = new listItemView({
                    collection : this.collection,
                    page       : $currentEl.find("#currentShowPage").val(),
                    itemsNumber: $currentEl.find("span#itemsNumber").text()
                });
                tBody.append(itemView.render());

                var pagenation = this.$el.find('.pagination');

                if (this.collection.length === 0) {
                    pagenation.hide();
                } else {
                    pagenation.show();
                }
            },

            goSort: function (e) {
                var self = this;
                var target$ = $(e.target);
                var currentParrentSortClass = target$.attr('class');
                var sortClass = currentParrentSortClass.split(' ')[1];
                var keys = Object.keys(this.departmentsCollections);
                var context = {};
                var currentCollection;

                keys.forEach(function (key) {
                    currentCollection = self.departmentsCollections[key];

                    if (!sortClass) {
                        target$.addClass('sortDn');
                        sortClass = "sortDn";
                    }

                    switch (sortClass) {
                        case "sortDn":
                        {
                            target$.parent().find("th").removeClass('sortDn').removeClass('sortUp');
                            target$.removeClass('sortDn').addClass('sortUp');
                            self.sortConst = -1;
                        }
                            break;
                        case "sortUp":
                        {
                            target$.parent().find("th").removeClass('sortDn').removeClass('sortUp');
                            target$.removeClass('sortUp').addClass('sortDn');
                            self.sortConst = 1;
                        }
                            break;
                    }

                    context.self = self;
                    context.key = key;
                    context.currentCollection = currentCollection;

                    currentCollection.on('sort', self.reRenderCapacity, context);

                    currentCollection.sortByOrder(self.sortConst);
                })
            },

            getTotalLength: function (currentNumber, itemsNumber, filter) {
                dataService.getData('/holiday/totalCollectionLength', {
                    contentType  : this.contentType,
                    currentNumber: currentNumber,
                    filter       : filter,
                    newCollection: this.newCollection
                }, function (response, context) {
                    var page = context.page || 1;
                    var length = context.listLength = response.count || 0;
                    if (itemsNumber * (page - 1) > length) {
                        context.page = page = Math.ceil(length / itemsNumber);
                        context.fetchSortCollection(context.sort);
                        context.changeLocationHash(page, context.defaultItemsNumber, filter);
                    }
                    //context.pageElementRender(response.count, itemsNumber, page);//prototype in main.js
                }, this);
            },

            renderSubHeader: function ($currentEl) {
                var subHeaderContainer;

                var month;
                var year;

                var date;

                var daysInMonth;
                var dateDay;
                var daysRow = '';
                var daysNumRow = '';
                var columnContainer;
                var width;
                var weeks;
                var weeksRow = '';
                var curWeek;

                subHeaderContainer = $currentEl.find('.subHeaderHolder');

                month = this.monthElement.attr('data-content');
                year = this.yearElement.text();

                date = moment([year, month - 1, 1]);
                daysInMonth = date.daysInMonth();
                dateDay = date;

                for (var i = 1; i <= daysInMonth; i++) {
                    daysRow += '<th>' + dateDay.format('ddd') + '</th>';
                    daysNumRow += '<th>' + i + '</th>';
                    dateDay = date.add(1, 'd');
                }

                weeks = custom.getWeeks(month, year);

                for (var i = 0; i <= weeks.length - 1; i++) {
                    curWeek = weeks[i];
                    weeksRow += '<th colspan="' + curWeek.daysCount + '">' + curWeek.week + '</th>';
                }

                daysRow = '<tr class="subHeaderHolder borders">' + daysRow + '</tr>';

                daysNumRow = '<tr class="subHeaderHolder borders"><th colspan="2">Department</th><th class="oe-sortable" data-sort="employee.name">Employee</th>' + daysNumRow + '<th>Total Hours</th></tr>';

                weeksRow = '<tr class="subHeaderHolder borders">' + weeksRow + '</tr>';

                this.daysCount = daysInMonth;

                columnContainer = $('#columnForDays');
                width = 80 / daysInMonth;

                columnContainer.html('');

                for (var i = daysInMonth; i > 0; i--) {
                    columnContainer.append('<col width="' + width + '%">');
                }

                $(subHeaderContainer[0]).attr('colspan', daysInMonth - 12);
                $(subHeaderContainer[1]).replaceWith(weeksRow);
                $(subHeaderContainer[2]).replaceWith(daysRow);
                $(subHeaderContainer[3]).replaceWith(daysNumRow);
            },

            nextSelect: function (e) {
                this.showNewSelect(e, false, true);
            },

            prevSelect: function (e) {
                this.showNewSelect(e, true, false);
            },

            showNewSelect: function (e, prev, next) {
                e.stopPropagation();
                populate.showSelect(e, prev, next, this);

                return false;
            },

            changedDataOptions: function () {
                var month = this.monthElement.attr('data-content');
                var year = this.yearElement.attr('data-content');

                var searchObject = {
                    month: month,
                    year : year
                };

                this.changedModels = {};

                this.collection.showMore(searchObject);
            },

            checkEmptyArray: function (array) {

                array = _.compact(array);

                if (array.length) {
                    return false;
                }

                return true;
            },

            chooseOption: function (e) {
                e.preventDefault();
                var self = this;
                var target = $(e.target);
                var closestTD = target.closest("td");
                var targetElement = closestTD.length ? closestTD : target.closest("th").find('a');
                var tr = target.closest("tr");
                var tdTotalDays = $(tr).find('.totalDays');
                var modelId = tr.attr('data-id');
                var id = target.attr("id");
                var attr = targetElement.attr("id") || targetElement.attr("data-content");
                var elementType = '#' + attr;
                var element = _.find(this.responseObj[elementType], function (el) {
                    return el._id === id;
                });
                var editModel;
                var employee;
                var department;
                var changedAttr;
                var dayIndex;
                var dayTotalElement;

                var findEmployee;

                var vacArray = [];
                var vacModel;
                var capacityArrayLength;

                var capacityArray = this.defCapacityArray;
                var totalHours = this.defCapacityMonthTotal;

                var month = parseInt(this.monthElement.attr('data-content'));
                var year = parseInt(this.yearElement.text());

                var currentTd;

                if (modelId) {
                    editModel = this.editCollection.get(modelId);

                    if (!this.changedModels[modelId]) {
                        if (!editModel.id) {
                            this.changedModels[modelId] = editModel.attributes;
                        } else {
                            this.changedModels[modelId] = {};
                        }
                    }

                    changedAttr = this.changedModels[modelId];
                }

                if (elementType === '#monthSelect' || elementType === '#yearSelect') {
                    targetElement.text(target.text());

                    targetElement.attr('data-content', target.attr('id'));
                    if (elementType === '#monthSelect') {
                        this.monthElement = targetElement;
                    } else {
                        this.yearElement = targetElement;
                    }
                    this.startTime = new Date();
                    this.changedDataOptions();
                    this.renderSubHeader(this.$el);
                }

                if (elementType === '#employee') {
                    /*findEmployee = self.edit.filter(function (model) {
                     return model.get('employee')._id === element._id;
                     });

                     if (findEmployee.length > 0) {
                     tr.remove();
                     self.hideSaveCancelBtns();
                     self.changedModels[modelId]
                     alert(CONSTANTS.RESPONSES.DOUBLE_EMPLOYEE_VACATION);
                     return false;
                     }*/

                    tr.find('[data-content="employee"]').text(element.name);

                    employee = _.clone(editModel.get('employee'));

                    if (editModel.get('department')) {
                        department = _.clone(editModel.get('department'));
                    } else {
                        department = this.department;
                    }

                    employee._id = element._id;
                    employee.name = target.text();

                    changedAttr.employee = employee;
                    changedAttr.department = department;

                    vacModel = self.vacations.filter(function (model) {
                        return model.employee._id === element._id && model.month === month && model.year === year;
                    });

                    if (vacModel.length) {
                        vacModel = vacModel[0];
                        changedAttr.vacation = vacModel._id;
                        vacArray = vacModel.vacArray;
                    }

                    capacityArrayLength = capacityArray.length;

                    for (var i = capacityArrayLength - 1; i >= 0; i--) {
                        currentTd = tr.find('[data-dayID="' + i + '"]');

                        if (vacArray && vacArray[i]) {
                            if (capacityArray[i]) {
                                totalHours -= capacityArray[i];
                            }

                            capacityArray[i] = vacArray[i];

                            currentTd.text(vacArray[i])
                            currentTd.addClass(vacArray[i]);
                        } else {
                            currentTd.text(capacityArray[i]);
                        }
                    }

                    changedAttr.capacityArray = capacityArray;
                    changedAttr.capacityMonthTotal = totalHours;

                    tr.find('.totalHours').text(totalHours);
                }

                function checkDay(element, selectedClass) {
                    var className;
                    var employeesCount = dayTotalElement.text() === '' ? 0 : parseInt(dayTotalElement.text());
                    var vacDaysCount = tdTotalDays.text() === '' ? 0 : parseInt(tdTotalDays.text());

                    if (element.hasClass('V')) {
                        className = 'V';
                    } else if (element.hasClass('P')) {
                        className = 'P';
                    } else if (element.hasClass('S')) {
                        className = 'S';
                    } else if (element.hasClass('E')) {
                        className = 'E';
                    }

                    if (className) {
                        if (className !== selectedClass) {
                            element.toggleClass(className);

                            if (selectedClass === '') {
                                element.attr('class', 'editable');
                                vacDaysCount -= 1;
                                employeesCount -= 1;
                            } else {
                                element.toggleClass(selectedClass);
                                element.addClass('selectedType');
                            }
                        }
                    } else {
                        if (selectedClass !== '') {
                            element.toggleClass(selectedClass);
                            element.addClass('selectedType');
                            vacDaysCount += 1;
                            employeesCount += 1;
                        }
                    }

                    tdTotalDays.text(vacDaysCount);
                    !employeesCount ? dayTotalElement.text('') : dayTotalElement.text(employeesCount);

                }

                if (elementType === '#capacityValue') {
                    dayIndex = targetElement.attr('data-dayID');
                    dayTotalElement = $('#day' + dayIndex);

                    targetElement.text(element._id);

                    if (changedAttr && !changedAttr.vacArray) {
                        changedAttr.capacityArray = _.clone(editModel.toJSON().capacityArray);
                        if (!changedAttr.capacityArray) {
                            changedAttr.capacityArray = new Array(this.daysCount);
                        }
                    }

                    if (targetElement.text() === '') {
                        if (!this.checkEmptyArray(changedAttr.capacityArray)) {
                            checkDay(targetElement, element._id);
                            delete(changedAttr.capacityArray[dayIndex]);
                            if (this.checkEmptyArray(changedAttr.capacityArray)) {
                                this.deleteItem(modelId);
                            }
                        }
                    } else {
                        checkDay(targetElement, element._id);
                        changedAttr.capacityArray[dayIndex] = targetElement.text();
                    }
                }

                this.hideNewSelect();
                this.setEditable(targetElement);

                return false;
            },

            getTotal: function (collection) {
                var self = this;
                var totalArray = new Array(this.daysCount);

                async.each(collection, function (document) {

                    for (var i = self.daysCount - 1; i >= 0; i--) {
                        if (document.vacArray[i]) {
                            totalArray[i] = totalArray[i] ? totalArray[i] += 1 : 1;
                        }
                    }

                });

                return totalArray;
            },

            renderDepartmentRows: function () {
                var listTable = this.$el.find("#listTable");
                var departments = [];

                var self = this;

                CONSTANTS.DEPARTMENTS_ORDER.forEach(function (element) {
                    if (self.departmentObject[element]) {
                        departments.push(self.departmentObject[element]);
                    }
                })

                listTable.html('');
                listTable.append(_.template(departmentListTemplate, {
                    departments: departments,
                    daysCount  : this.daysCount
                }));
            },

            renderCapacity: function (row, subNameClass, name) {
                var collection;
                var status = row.find('.departmentCB').prop("checked");

                if (!this.departmentsCollections[name]) {
                    this.departmentsCollections[name] = new departmentCollection(this.capacityObject[name]);
                }

                this.departmentsCollections[name].sortByOrder(this.sortConst);

                collection = this.departmentsCollections[name].toJSON();

                this.bindingEventsToEditedCollection(this, collection);

                $(_.template(listTemplate, {
                    status    : status,
                    collection: collection,
                    subClass  : subNameClass,
                    depName   : name
                })).insertAfter(row);
            },

            reRenderCapacity: function () {
                var that = this.self;
                var name = that.departmentObject[this.key].name;
                var row = that.$el.find('#' + that.departmentObject[this.key]._id);
                var subNameClass = "subRows" + name;
                var subRows = that.$el.find('.' + subNameClass);
                var checkIfVisible = subRows.is(":visible");

                subRows.remove();

                this.currentCollection.off('sort');
                that.renderCapacity(row, subNameClass, name);

                if (!checkIfVisible) {
                    subRows = that.$el.find('.' + subNameClass);
                    subRows.toggle();

                    that.$el.find(".false").remove();
                    that.hideSaveCancelBtns();
                }
            },

            capacityClick: function (e) {
                var target = $(e.target);
                var checkIfCB = target.hasClass("departmentCB");
                var row = target.closest("tr");

                var name = row.attr('data-name');
                var subNameClass = "subRows" + name;

                var subRows = this.$el.find('.' + subNameClass);

                if (subRows.length === 0) {
                    this.renderCapacity(row, subNameClass, name);

                    row.find(".icon.add").toggle();
                } else {
                    if (!checkIfCB) {
                        row.find(".icon.add").toggle();
                        subRows.toggle();

                        this.$el.find(".false").remove();
                        this.hideSaveCancelBtns();
                    } else {
                        subRows.find('.checkbox').prop('checked', target.prop('checked'));
                    }
                }

                if (this.$el.find("input.checkbox:not('.departmentCB'):checked").length > 0) {
                    $("#top-bar-deleteBtn").show();
                } else {
                    $("#top-bar-deleteBtn").hide();
                }
            },

            checked: function (e) {
                var target = $(e.target);
                var tr = target.closest('tr');
                var dataName = tr.attr('data-name');
                var subRowsCheckboxes = this.$el.find('.subRows' + dataName).find('.checkbox:checked');
                var length = this.departmentsCollections[dataName] ? this.departmentsCollections[dataName].length : 0;
                var depRow = this.$el.find('.departmentRow[data-name="' + dataName + '"]');
                var checkDepartment = depRow.find('.departmentCB');

                if (length > 0) {
                    if (subRowsCheckboxes.length > 0) {
                        $("#top-bar-deleteBtn").show();
                        checkDepartment.prop('checked', false);

                        if (subRowsCheckboxes.length === length) {
                            checkDepartment.prop('checked', true);
                        }
                    }
                    else {
                        $("#top-bar-deleteBtn").hide();
                        checkDepartment.prop('checked', false);
                    }
                }
            },

            render: function () {
                $('.ui-dialog ').remove();

                var self = this;
                var $currentEl = this.$el;
                var collection;

                var year = this.startTime.getFullYear();
                var month = {};

                month.number = this.startTime.getMonth() + 1;
                month.name = moment(this.startTime).format('MMMM');

                $currentEl.html('');
                $currentEl.append(_.template(listHeaderTemplate, {options: {month: month, year: year}}));

                this.monthElement = $currentEl.find('#monthSelect');
                this.yearElement = $currentEl.find('#yearSelect');

                this.renderSubHeader($currentEl);

                this.$el.find("#listTable").html('');

                this.renderDepartmentRows(this.departmentObject);

                //listTotalEl = this.$el.find('#listTotal');

                //listTotalEl.html('');
                //listTotalEl.append(_.template(listTotal, {array: this.getTotal(collection)}));

                this.filterEmployeesForDD(this);
                this.monthForDD(this);
                this.yearForDD(this);

                this.getVacations(this, month.number, year);

                this.createDefValues(this, month.number, year);

                setTimeout(function () {
                    self.$listTable = $('#listTable');
                    self.$listTable.find(".icon.add").hide();
                }, 10);

                $(document).on("click", function (e) {
                    self.hideNewSelect();
                });

                $currentEl.append("<div id='timeRecivingDataFromServer'>Created in " + (new Date() - this.startTime) + " ms</div>");
            },

            showFilteredPage: function () {
                var itemsNumber;

                this.startTime = new Date();
                this.newCollection = false;
                var workflowIdArray = [];
                $('.filter-check-list input:checked').each(function () {
                    workflowIdArray.push($(this).val());
                });
                this.filter = this.filter || {};
                this.filter['workflow'] = workflowIdArray;

                itemsNumber = $("#itemsNumber").text();
                $("#top-bar-deleteBtn").hide();
                $('#check_all').prop('checked', false);

                this.changeLocationHash(1, itemsNumber, this.filter);
                this.collection.showMore({count: itemsNumber, page: 1, filter: this.filter});
                this.getTotalLength(null, itemsNumber, this.filter);
            },

            showMoreContent: function (newModels) {
                var holder = this.$el;

                this.capacityObject = newModels.toJSON()[0].capacityObject;
                this.departmentObject = newModels.toJSON()[0].departmentObject;

                this.$el.find("#listTable").html('');

                this.renderDepartmentRows(this.departmentObject);

                /*listTotalEl = holder.find('#listTotal');

                 listTotalEl.html('');
                 listTotalEl.append(_.template(listTotal, {array: this.getTotal(collection)}));*/

                this.hideSaveCancelBtns();

                this.$listTable.find(".icon.add").hide();

                holder.find('#timeRecivingDataFromServer').remove();
                holder.append("<div id='timeRecivingDataFromServer'>Created in " + (new Date() - this.startTime) + " ms</div>");
            },

            createDefValues: function (content, month, year) {
                var dateValue;
                var dayNumber;

                content.defCapacityArray = [];
                content.defCapacityMonthTotal = 0;

                for (var day = this.daysCount - 1; day >= 0; day--) {

                    dateValue = moment([year, month - 1, day + 1]);

                    dayNumber = moment(dateValue).day();

                    if (dayNumber !== 0 && dayNumber !== 6) {
                        content.defCapacityArray[day] = 8;
                        content.defCapacityMonthTotal += 8;
                    } else {
                        content.defCapacityArray[day] = null;
                    }
                }
            },

            createItem: function (e) {
                e.preventDefault();
                e.stopPropagation();

                var template;

                var startData = {
                    daysCount: this.daysCount,
                    employee : {},
                    month    : this.monthElement.attr('data-content'),
                    year     : this.yearElement.text()
                };

                var model;
                var tr = $(e.target).closest('tr');

                startData.department = {
                    _id : tr.attr('id'),
                    name: tr.attr('data-name')
                }

                model = new currentModel(startData);

                startData.cid = model.cid;

                if (!this.isNewRow()) {
                    this.showSaveCancelBtns();
                    this.editCollection.add(model);
                    template = _.template(createTemplate);

                    tr.after(template(startData));
                    this.createDefValues(this, this.monthElement.attr('data-content'), this.yearElement.text());
                }
            },

            isNewRow: function () {
                var newRow = $('#false');

                return !!newRow.length;
            },

            deleteItemsRender: function (tr, id) {

                tr.remove();

                this.editCollection.remove(id);
                this.hideSaveCancelBtns();
            },

            deleteItems: function () {
                var that = this;

                this.collectionLength = this.collection.length;

                if (!this.changed) {
                    var answer = confirm("Really DELETE items ?!");
                    var value;
                    var tr;

                    if (answer === true) {
                        $.each(that.$el.find("input:not('.departmentCB'):checked"), function (index, checkbox) {
                            checkbox = $(checkbox);
                            value = checkbox.attr('id');
                            tr = checkbox.closest('tr');
                            that.deleteItem(tr, value);
                        });
                    }
                } else {
                    this.cancelChanges();
                }
            },

            deleteItem: function (tr, id) {
                var self = this;
                var model;
                var mid = 39;
                var depName;

                if (id.length < 24) {
                    this.editCollection.remove(id);
                    delete this.changedModels[id];
                    self.deleteItemsRender(tr, id);
                } else {
                    depName = tr.attr('data-name');
                    model = _.findWhere(this.capacityObject[depName], {_id: id});
                    model = new currentModel(model);
                    model.destroy({
                        headers: {
                            mid: mid
                        },
                        wait   : true,
                        success: function () {
                            delete self.changedModels[id];
                            self.deleteItemsRender(tr, id);
                        },
                        error  : function (model, res) {
                            if (res.status === 403 && index === 0) {
                                App.render({
                                    type: 'error',
                                    message: "You do not have permission to perform this action"
                                });
                            }
                        }
                    });
                }

            },

            getVacDaysCount: function (model) {
                var array = _.compact(model.capacityArray);

                model.countVacationDays = array.length;
                return model;
            },

            cancelChanges: function () {
                var self = this;
                var edited = this.edited;
                var collection = this.capacityObject;
                var listTotalEl;

                async.each(edited, function (el, cb) {
                    var tr = $(el).closest('tr');
                    var id = tr.data('id');
                    var depName = tr.attr('data-name');
                    var template = _.template(cancelEdit);
                    var model;
                    var subNameClass = "subRows" + depName;

                    if (!id) {
                        return cb('Empty id');
                    } else if (id.length < 24) {
                        tr.remove();
                        model = self.changedModels;

                        if (model) {
                            delete model[id];
                        }

                        return cb();
                    }

                    model = _.findWhere(collection[depName], {_id: id});
                    tr.replaceWith(template({
                        capacity: model,
                        subClass: subNameClass,
                        depName : depName
                    }));
                    cb();
                }, function (err) {
                    if (!err) {
                        self.bindingEventsToEditedCollection(self);
                        self.hideSaveCancelBtns();
                    }
                });

                listTotalEl = this.$el.find('#listTotal');

                listTotalEl.html('');
                listTotalEl.append(_.template(listTotal, {array: this.getTotal(this.collection.toJSON())}));
            }

        });

        return CapacityListView;
    });
