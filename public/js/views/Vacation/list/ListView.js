define([
        "Backbone",
        "jQuery",
        "Underscore",
        'text!templates/Vacation/list/ListHeader.html',
        'text!templates/Vacation/list/cancelEdit.html',
        'text!templates/Vacation/list/ListTotal.html',
        'views/selectView/selectView',
        'views/Vacation/CreateView',
        'views/Vacation/list/ListItemView',
        'models/VacationModel',
        'collections/Vacation/filterCollection',
        'collections/Vacation/editCollection',
        'common',
        'dataService',
        'constants',
        'async',
        'moment'
    ],

    function (Backbone, $, _, listTemplate, cancelEdit, listTotal, selectView, createView, listItemView, vacationModel, vacationCollection, editCollection, common, dataService, CONSTANTS, async, moment) {
        var VacationListView = Backbone.View.extend({
            el                : '#content-holder',
            defaultItemsNumber: null,
            listLength        : null,
            filter            : null,
            sort              : null,
            newCollection     : null,
            page              : null, //if reload page, and in url is valid page
            contentType       : CONSTANTS.VACATION,//needs in view.prototype.changeLocationHash
            viewType          : 'list',//needs in view.prototype.changeLocationHash
            changedModels     : {},
            holidayId         : null,
            editCollection    : null,
            responseObj       : {},
            monthElement      : null,
            yearElement       : null,

            initialize: function (options) {
                this.startTime = options.startTime;
                this.collection = options.collection;
                _.bind(this.collection.showMore, this.collection);
                this.filter = options.filter ? options.filter : {};
                this.sort = options.sort ? options.sort : {};
                this.defaultItemsNumber = this.collection.namberToShow || 100;
                this.newCollection = options.newCollection;
                this.deleteCounter = 0;
                this.page = options.collection.page;
                this.render();
                this.getTotalLength(null, this.defaultItemsNumber, this.filter);
                this.contentCollection = vacationCollection;
                this.daysCount;
            },

            events: {
                "click .trash"                                                    : "deleteItemPressed",
                //"blur td.editable input"                                          : "hideInput",
                "click td.editable, .current-selected"                            : "showNewSelect",
                "click .newSelectList li:not(.miniStylePagination)"               : "chooseOption",
                "click .oe_sortable"                                              : "goSort",
                "change .editable "                                               : "setEditable",
                "click"                                                           : "hideNewSelect"
            },

            hideNewSelect: function () {
               // $(".newSelectList").remove();
                var editingDates = this.$el.find('.editing');

                editingDates.each(function () {
                    $(this).parent().text($(this).val());
                    $(this).remove();
                });

                this.$el.find('.newSelectList').hide();

                if (this.selectView) {
                    this.selectView.remove();
                }
            },

            deleteItemPressed             : function (e) {
                e.stopPropagation();
                e.preventDefault();
                var target = $(e.target);
                var tr = target.closest("tr");
                var modelId = tr.attr('data-id');
                this.deleteItem(modelId);

            },

            savedNewModel: function (modelObject) {
                var savedRow = this.$listTable.find('#false');
                var modelId;

                modelObject = modelObject.success;

                if (modelObject) {
                    this.responseObj['#employee'] = this.responseObj['#employee'].filter(function (item) {
                        return item.name !== modelObject.employee.name
                    });
                    modelId = modelObject._id;
                    savedRow.attr("data-id", modelId);
                    savedRow.removeAttr('id');
                }

                this.changedModels = {};

                $(savedRow).find('.edited').removeClass('edited');

                this.hideSaveCancelBtns();
                this.resetCollection(modelObject);
            },

            bindingEventsToEditedCollection: function (context) {
                if (context.editCollection) {
                    context.editCollection.unbind();
                }
                context.editCollection = new editCollection(context.collection.toJSON());
                context.editCollection.on('saved', context.savedNewModel, context);
                context.editCollection.on('updated', context.updatedOptions, context);
            },

            resetCollection: function (model) {
                if (model && model._id) {
                    model = new vacationModel(model);
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

                    if (!model.id && !model.changed.vacArray) {
                        this.deleteItem(id);
                    }
                }
                this.editCollection.save();
            },

            setChangedValueToModel: function () {
                var editedElement = this.$listTable.find('.editing');
                var editedCol;
                var editedElementRowId;
                var editedElementContent;
                var editedElementValue;
                var editVacationModel;

                if (editedElement.length) {
                    editedCol = editedElement.closest('td');
                    editedElementRowId = editedElement.closest('tr').data('id');
                    editedElementContent = editedCol.data('content');
                    editedElementValue = editedElement.val();

                    editVacationModel = this.editCollection.get(editedElementRowId);

                    if (!this.changedModels[editedElementRowId]) {
                        if (!editVacationModel.id) {
                            this.changedModels[editedElementRowId] = editVacationModel.attributes;
                        } else {
                            this.changedModels[editedElementRowId] = {};
                        }
                    }

                    this.changedModels[editedElementRowId][editedElementContent] = editedElementValue;

                    editedCol.text(editedElementValue);
                    editedElement.remove();
                }
            },

            vacationTypeForDD: function (content) {
                var array = ['&nbsp', 'Vacation', 'Personal', 'Sick', 'Education'];
                var firstChar;

                array = _.map(array, function (element) {
                    element = {
                        name: element
                    };
                    firstChar = element.name.charAt(0);
                    if (firstChar !== '&') {
                        element._id = firstChar;
                    } else {
                        element._id = '';
                    }

                    return element;
                });
                content.responseObj['#vacType'] = array;
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
            yearForDD : function (content) {
                dataService.getData('/vacation/getYears', {}, function (response, context) {
                    context.responseObj['#yearSelect'] = response;
                }, content)
            },

            filterEmployeesForDD: function (content) {
                var currentNames = [];
                this.collection.forEach(function (element) {
                    var employee = element.attributes.employee;
                    currentNames.push(employee.name);
                });

                dataService.getData(CONSTANTS.URLS.EMPLOYEES_GETFORDD, null, function (data) {
                    var employees = [];
                    _.each(data.data, function (employee) {
                        employee.name = employee.name.first + ' ' + employee.name.last;
                        if (!~currentNames.indexOf(employee.name)) {
                            employees.push(employee);
                        }
                    });

                    content.responseObj['#employee'] = employees;
                });
            },

           /* hideInput: function (e) {
                var target = $(e.target);

                target.hide();
            },*/

            showNewSelect: function (e) {

                var $target = $(e.target);

                e.stopPropagation();

                if ($target.attr('id') === 'selectInput') {
                    return false;
                }

                if (this.selectView) {
                    this.selectView.remove();
                }

                if ($target.hasClass('current-selected')){

                    this.selectView = new selectView({
                        e          : e,
                        responseObj: this.responseObj,
                        number     : 12
                    });
                    $target.append(this.selectView.render().el);

                } else {

                    this.selectView = new selectView({
                        e          : e,
                        responseObj: this.responseObj
                    });

                    $target.append(this.selectView.render().el);
                    $target.find('input').show();

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

            goSort: function (e) {
                var target = $(e.target);
                var currentParrentSortClass = target.attr('class');
                var sortClass = currentParrentSortClass.split(' ')[1];
                var dataSort = target.attr('data-sort').split('.');
                var sortConst = 1;
                var collection;

                collection = this.collection.toJSON();

                if (!sortClass) {
                    target.addClass('sortDn');
                    sortClass = "sortDn";
                }
                switch (sortClass) {
                    case "sortDn":
                    {
                        target.parent().find("th").removeClass('sortDn').removeClass('sortUp');
                        target.removeClass('sortDn').addClass('sortUp');
                        sortConst = -1;
                    }
                        break;
                    case "sortUp":
                    {
                        target.parent().find("th").removeClass('sortDn').removeClass('sortUp');
                        target.removeClass('sortUp').addClass('sortDn');
                        sortConst = 1;
                    }
                        break;
                }

                this.collection.sortByOrder(dataSort[0], dataSort[1], sortConst);

                this.renderTable(collection);
            },

            renderTable: function (collection) {
                var self = this;
                var itemView;

                collection.forEach(function (document) {
                    document = self.getVacDaysCount(document);
                    return document;
                });

                this.$el.find("#listTable").html('');
                itemView = new listItemView({
                    collection: collection
                });
                this.$el.append(itemView.render());
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

            renderdSubHeader: function ($currentEl) {
                var subHeaderContainer;

                var month;
                var year;

                var date;

                var daysInMonth;
                var dateDay;
                var daysRow = '';
                var daysNumRow = '';

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

                daysRow = '<tr class="subHeaderHolder borders">' + daysRow + '</tr>';

                daysNumRow = '<tr class="subHeaderHolder borders"><th class="oe_sortable" data-sort="employee.name">Employee Name</th>' +
                '<th class="oe_sortable" data-sort="department.departmentName">Department</th>' + daysNumRow + '<th>Total Days</th></tr>';

                this.daysCount = daysInMonth;

                var columnContainer = $('#columnForDays');
                var width = 80 / daysInMonth;

                columnContainer.html('');

                for (var i = daysInMonth; i > 0; i--) {
                    columnContainer.append('<col width="' + width + '%">');
                }

                $(subHeaderContainer[0]).attr('colspan', daysInMonth - 12);
                $(subHeaderContainer[1]).replaceWith(daysRow);
                $(subHeaderContainer[2]).replaceWith(daysNumRow);
            },

            /*nextSelect: function (e) {
                this.showNewSelect(e, false, true);
            },

            prevSelect: function (e) {
                this.showNewSelect(e, true, false);
            },*/

            /*showNewSelect: function (e, prev, next) {
                e.stopPropagation();
                populate.showSelect(e, prev, next, this);

                return false;
            },
*/
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

                return !array.length;
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
                var attr = targetElement.attr("id") || targetElement.data("content");
                var elementType = '#' + attr;
                var element = _.find(this.responseObj[elementType], function (el) {
                    return el._id === id;
                });
                //ToDo refactor
                var delHTML = '<span title="Delete" class="trash icon" style="display: inline">1</span>';

                var editVacationModel;
                var employee;
                var department;
                var changedAttr;
                var dayIndex;
                var dayTotalElement;

                var findEmployee;

                if (modelId) {
                    editVacationModel = this.editCollection.get(modelId);

                    if (!this.changedModels[modelId]) {
                        if (!editVacationModel.id) {
                            this.changedModels[modelId] = editVacationModel.attributes;
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
                    this.renderdSubHeader(this.$el);
                }

                if (elementType === '#employee') {
                    //findEmployee = self.collection.filter(function (model) {
                    //    return model.get('employee')._id === element._id;
                    //});
                    //
                    //if (findEmployee.length > 0) {
                    //    tr.remove();
                    //    self.hideSaveCancelBtns();
                    //    self.changedModels[modelId]
                    //    alert(CONSTANTS.RESPONSES.DOUBLE_EMPLOYEE_VACATION);
                    //    return false;
                    //}

                    tr.find('[data-content="employee"]').html(delHTML + element.name);
                    tr.find('.department').text(element.department.departmentName);

                    employee = element._id;

                    department = element.department._id;

                    changedAttr.employee = employee;
                    changedAttr.department = department;
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

                if (elementType === '#vacType') {
                    dayIndex = targetElement.attr('data-dayID');
                    dayTotalElement = $('#day' + dayIndex);

                    targetElement.text(element._id);

                    if (changedAttr && !changedAttr.vacArray) {
                        changedAttr.vacArray = _.clone(editVacationModel.toJSON().vacArray);
                        if (!changedAttr.vacArray) {
                            changedAttr.vacArray = new Array(this.daysCount);
                        }
                    }

                    if (targetElement.text() === '') {
                        if (!this.checkEmptyArray(changedAttr.vacArray)) {
                            checkDay(targetElement, element._id);
                            delete(changedAttr.vacArray[dayIndex]);
                            if (this.checkEmptyArray(changedAttr.vacArray)) {
                                this.deleteItem(modelId);
                            }
                        }
                    } else {
                        checkDay(targetElement, element._id);
                        changedAttr.vacArray[dayIndex] = targetElement.text();
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

            render: function () {
                $('.ui-dialog ').remove();

                var self = this;
                var $currentEl = this.$el;
                var collection;

                var year = this.startTime.getFullYear();
                var month = {};

                var listTotalEl;

                month.number = this.startTime.getMonth() + 1;
                month.name = moment(this.startTime).format('MMMM');

                $currentEl.html('');
                $currentEl.append(_.template(listTemplate, {options: {month: month, year: year}}));

                this.monthElement = $currentEl.find('#monthSelect');
                this.yearElement = $currentEl.find('#yearSelect');

                this.renderdSubHeader($currentEl);

                collection = this.collection.toJSON();

                this.renderTable(collection);

                listTotalEl = this.$el.find('#listTotal');

                listTotalEl.html('');
                listTotalEl.append(_.template(listTotal, {array: this.getTotal(collection)}));

                this.filterEmployeesForDD(this);
                this.vacationTypeForDD(this);
                this.monthForDD(this);
                this.yearForDD(this);

                setTimeout(function () {
                    self.bindingEventsToEditedCollection(self);

                    self.$listTable = $('#listTable');
                }, 10);

                $(document).on("click", function (e) {
                    self.hideNewSelect();
                });

                $currentEl.append("<div id='timeRecivingDataFromServer'>Created in " + (new Date() - this.startTime) + " ms</div>");
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
                var collection = newModels.toJSON();
                var listTotalEl;

                this.editCollection = new editCollection(collection);

                this.renderTable(collection);

                listTotalEl = holder.find('#listTotal');

                listTotalEl.html('');
                listTotalEl.append(_.template(listTotal, {array: this.getTotal(collection)}));

                this.filterEmployeesForDD(this);
                this.hideSaveCancelBtns();

                holder.find('#timeRecivingDataFromServer').remove();
                holder.append("<div id='timeRecivingDataFromServer'>Created in " + (new Date() - this.startTime) + " ms</div>");
            },

            createItem: function () {
                var startData = {
                    daysCount : this.daysCount,
                    employee  : {},
                    department: {},
                    month     : this.monthElement.attr('data-content'),
                    year      : this.yearElement.text()
                };

                var model = new vacationModel(startData);

                startData.cid = model.cid;

                if (!this.isNewRow()) {
                    this.showSaveCancelBtns();
                    this.editCollection.add(model);

                    new createView(startData);
                }
            },

            isNewRow: function () {
                var newRow = $('#false');

                return !!newRow.length;
            },

            deleteItemsRender: function (deleteCounter, deletePage) {

                this.renderTable(this.collection.toJSON());

                this.editCollection.reset(this.collection.models);
                this.hideSaveCancelBtns();
            },

            deleteItems: function () {
                if (this.changed) {
                    this.cancelChanges();
                }
            },

            deleteItem: function (id) {
                var self = this;
                var model;
                var mid = 39;

                var answer = confirm("Do You want to DELETE item ?!");

                if (answer === true) {
                    if (id.length < 24) {
                        this.editCollection.remove(id);
                        delete this.changedModels[id];
                        self.deleteItemsRender(1, 1);
                    } else {
                        model = this.collection.get(id);
                        model.destroy({
                            headers: {
                                mid: mid
                            },
                            wait   : true,
                            success: function () {
                                delete self.changedModels[id];
                                self.deleteItemsRender(1, 1);
                            },
                            error  : function (model, res) {
                                if (res.status === 403 && index === 0) {
                                    App.render({
                                        type: 'error',
                                        message: "You do not have permission to perform this action"
                                    });
                                }
                                self.deleteItemsRender(1, 1);

                            }
                        });
                    }
                }

            },

            getVacDaysCount: function (model) {
                var array = _.compact(model.vacArray);

                model.countVacationDays = array.length;
                return model;
            },

            cancelChanges: function () {
                var self = this;
                var edited = this.edited;
                var collection = this.collection;
                var listTotalEl;

                async.each(edited, function (el, cb) {
                    var tr = $(el).closest('tr');
                    var id = tr.data('id');
                    var template = _.template(cancelEdit);
                    var model;

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

                    model = collection.get(id);
                    model = self.getVacDaysCount(model.toJSON());
                    tr.replaceWith(template({vacation: model}));
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

        return VacationListView;
    });
