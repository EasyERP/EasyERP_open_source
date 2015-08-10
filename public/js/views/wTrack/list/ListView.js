define([
        'text!templates/wTrack/list/ListHeader.html',
        'text!templates/wTrack/list/cancelEdit.html',
        'views/wTrack/CreateView',
        'views/wTrack/list/ListItemView',
        'views/wTrack/EditView',
        'views/salesInvoice/wTrack/CreateView',
        'models/wTrackModel',
        'models/UsersModel',
        'collections/wTrack/filterCollection',
        'collections/wTrack/editCollection',
        'views/Filter/FilterView',
        'common',
        'dataService',
        'populate',
        'async',
        'custom'
    ],

    function (listTemplate, cancelEdit, createView, listItemView, editView, wTrackCreateView, currentModel, usersModel, contentCollection, EditCollection, filterView, common, dataService, populate, async, custom) {
        var wTrackListView = Backbone.View.extend({
            el: '#content-holder',
            defaultItemsNumber: null,
            listLength: null,
            filter: null,
            sort: null,
            newCollection: null,
            page: null,
            contentType: 'wTrack',
            viewType: 'list',
            responseObj: {},
            wTrackId: null, //need for edit rows in listView
            collectionLengthUrl: '/wTrack/totalCollectionLength',
            $listTable: null, //cashedJqueryEllemnt
            editCollection: null,
            selectedProjectId: [],
            genInvoiceEl: null,
            copyEl: null,
            changedModels: {},

            initialize: function (options) {
                this.startTime = options.startTime;
                this.collection = options.collection;
                this.filter = options.filter;
                this.sort = options.sort;
                this.defaultItemsNumber = this.collection.namberToShow || 50;
                this.newCollection = options.newCollection;
                this.deleteCounter = 0;
                this.page = options.collection.page;

                this.render();

                this.getTotalLength(null, this.defaultItemsNumber, this.filter);
                this.contentCollection = contentCollection;
                this.stages = [];
                this.allTotalVals = {
                    hours: 0,
                    monHours: 0,
                    tueHours: 0,
                    wedHours: 0,
                    thuHours: 0,
                    friHours: 0,
                    satHours: 0,
                    sunHours: 0,
                    revenue: 0,
                    cost: 0,
                    profit: 0,
                    amount: 0
                }
            },

            events: {
                "click .itemsNumber": "switchPageCounter",
                "click .showPage": "showPage",
                "change #currentShowPage": "showPage",
                "click #previousPage": "previousPage",
                "click #nextPage": "nextPage",
                "click .checkbox": "checked",
                "click .stageSelect": "showNewSelect",
                "click .newSelectList li.miniStylePagination .next:not(.disabled)": "nextSelect",
                "click .newSelectList li.miniStylePagination .prev:not(.disabled)": "prevSelect",
                "click td.editable": "editRow",
                //"mouseover #itemsButton": "itemsNumber",
                "mouseover .currentPageList": "itemsNumber",
                "click": "hideItemsNumber",
                "click #firstShowPage": "firstPage",
                "click #lastShowPage": "lastPage",
                "click .oe_sortable": "goSort",
                "click .newSelectList li:not(.miniStylePagination)": "chooseOption",
                "change .autoCalc": "autoCalc",
                "change .editable ": "setEditable",
                "keydown input.editing ": "keyDown",
                "click .saveFilterButton": "saveFilter",
                "click .removeFilterButton": "removeFilter",
                "change .listCB": "setAllTotalVals"
            },

            keyDown: function (e) {
                if (e.which === 13) {
                    this.autoCalc(e);
                    this.calculateCost(e, this.wTrackId);
                    this.setChangedValueToModel();
                }
            },

            generateInvoice: function (e) {
                var selectedWtracks = this.$el.find('input.listCB:checked');
                var wTracks = [];
                var self = this;
                var project;
                var assigned;
                var customer;
                var total = 0;

                async.each(selectedWtracks, function (el, cb) {
                    var id = $(el).val();
                    var model = self.collection.get(id);
                    var revenue = model.get('revenue').replace('$', '');

                    revenue = parseFloat(revenue);

                    total += revenue;

                    if (!project) {
                        project = model.get('project');
                        assigned = project.projectmanager;
                        customer = project.customer;
                    }

                    wTracks.push(model.toJSON());
                    cb();
                }, function (err) {
                    if (!err) {
                        new wTrackCreateView({
                            wTracks: wTracks,
                            project: project,
                            assigned: assigned,
                            customer: customer,
                            total: total
                        });
                    }
                });
            },

            copyRow: function (e) {
                $('#top-bar-generateBtn').hide();
                $('#top-bar-copyBtn').hide();

                this.changed = true;
                this.createdCopied = true;

                var selectedWtrack = this.$el.find('input.listCB:checked:not(#check_all)')[0];
                var self = this;
                var target = $(selectedWtrack);
                var id = target.val();
                var row = target.closest('tr');
                var model = self.collection.get(id);
                var _model;
                var tdsArr;
                var cid;

                $(selectedWtrack).attr('checked', false);

                model = model.toJSON();
                delete model._id;
                _model = new currentModel(model);

                this.showSaveCancelBtns();
                this.editCollection.add(_model);

                cid = _model.cid;

                if (!this.changedModels[cid]) {
                    this.changedModels[cid] = model;
                }

                this.$el.find('#listTable').prepend('<tr id="false" data-id="' + cid + '">' + row.html() + '</tr>');
                row = this.$el.find('#false');

                tdsArr = row.find('td');
                $(tdsArr[0]).find('input').val(cid);
                $(tdsArr[1]).text(cid);
            },

            nextSelect: function (e) {
                this.showNewSelect(e, false, true);
            },
            prevSelect: function (e) {
                this.showNewSelect(e, true, false);
            },

            autoCalc: function (e) {
                var el = $(e.target);
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

                for (var i = days.length - 1; i >= 0; i--) {
                    calcEl = $(days[i]);
                    value = calcEl.text();

                    if (value === '') {
                        if (calcEl.children('input').length) {
                            value = input.val();
                        } else {
                            value = '0';
                        }
                    }

                    worked += parseInt(value);
                }

                rateVal = parseFloat(rateEl.text());
                revenueVal = parseFloat(worked * rateVal).toFixed(2);

                revenueEl.text(revenueVal);

                editWtrackModel = this.editCollection.get(wTrackId);
                workedEl.text(worked);
                //editWtrackModel.set('worked', worked);

                if (!this.changedModels[wTrackId]) {
                    this.changedModels[wTrackId] = {};
                }

                this.changedModels[wTrackId].worked = worked;
                this.changedModels[wTrackId].revenue = revenueVal;
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

            isEditRows: function () {
                var edited = this.$listTable.find('.edited');

                this.edited = edited;

                return !!edited.length;
            },

            setChangedValueToModel: function () {
                var editedElement = this.$listTable.find('.editing');
                var editedCol;
                var editedElementRowId;
                var editedElementContent;
                var editedElementValue;
                var editWtrackModel;

                if (/*wTrackId !== this.wTrackId &&*/ editedElement.length) {
                    editedCol = editedElement.closest('td');
                    editedElementRowId = editedElement.closest('tr').data('id');
                    editedElementContent = editedCol.data('content');
                    editedElementValue = editedElement.val();

                    editWtrackModel = this.editCollection.get(editedElementRowId);

                    if (!this.changedModels[editedElementRowId]) {
                        this.changedModels[editedElementRowId] = {};
                    }

                    this.changedModels[editedElementRowId][editedElementContent] = editedElementValue;

                    editedCol.text(editedElementValue);
                    editedElement.remove();
                }
            },

            editRow: function (e, prev, next) {
                $(".newSelectList").hide();

                var el = $(e.target);
                var tr = $(e.target).closest('tr');
                var wTrackId = tr.data('id');
                var colType = el.data('type');
                var isSelect = colType !== 'input' && el.prop("tagName") !== 'INPUT';
                var tempContainer;
                var width;
                var editedElement;

                if (wTrackId && el.prop('tagName') !== 'INPUT') {
                    if (this.wTrackId) {
                        editedElement = this.$listTable.find('.editing');
                        this.setChangedValueToModel();
                    }
                    this.wTrackId = wTrackId;
                    this.setChangedValueToModel();
                }


                if (isSelect) {
                    populate.showSelect(e, prev, next, this);
                } else {
                    tempContainer = el.text();
                    width = el.width() - 6;
                    el.html('<input class="editing" type="text" value="' + tempContainer + '"  maxLength="4" style="width:' + width + 'px">');

                    this.autoCalc(e);
                    var value = _.bind(this.calculateCost, this);
                    value(e, wTrackId);
                }

                return false;
            },

            calculateCost: function (e, wTrackId) {
                var self = this;
                var expenseCoefficient;
                var baseSalaryValue;
                var editWtrackModel;
                var fixedExpense;
                var costElement;
                var employeeId;
                var trackWeek;
                var month;
                var hours;
                var calc;
                var year;

                var tr = $(e.target).closest('tr');

                if (!this.changedModels[wTrackId]) {
                    this.changedModels[wTrackId] = {};
                }

                costElement = $(e.target).closest('tr').find('[data-content="cost"]');

                if (wTrackId.length < 24) {
                    employeeId = this.changedModels[wTrackId].employee._id;

                    month = tr.find('[data-content="month"]').text();
                    year = tr.find('[data-content="year"]').text();
                    trackWeek = tr.find('[data-content="worked"]').text();

                } else {
                    editWtrackModel = this.editCollection.get(wTrackId);

                    employeeId = editWtrackModel.attributes.employee._id;
                    month = tr.find('[data-content="month"]').text();
                    year = tr.find('[data-content="year"]').text();
                    trackWeek = tr.find('[data-content="worked"]').text();
                }

                async.parallel([getBaseSalary, getMonthData], function callback(err, results) {
                    var baseSalaryLength = results[0].length;

                    if (err || (baseSalaryLength === 0)) {
                        costElement.text('');
                        costElement.addClass('money');
                        costElement.text('0.00');

                        self.changedModels[wTrackId].cost = 0;

                        return 0;
                    }

                    baseSalaryValue = parseFloat(results[0][0].employeesArray.baseSalary);
                    expenseCoefficient = parseFloat(results[1][0].expenseCoefficient);
                    fixedExpense = parseInt(results[1][0].fixedExpense);
                    hours = parseInt(results[1][0].hours);

                    calc = ((((baseSalaryValue * expenseCoefficient) + fixedExpense) / hours) * trackWeek).toFixed(2);

                    costElement.text('');
                    costElement.addClass('money');
                    costElement.text(calc);

                    self.changedModels[wTrackId].cost = parseFloat(calc) * 100;

                    return calc;
                });

                function getBaseSalary(callback) {

                    dataService.getData('/salary/list', {
                        month: month,
                        year: year,
                        _id: employeeId
                    }, function (response, context) {

                        if (response.error) {
                            return callback(response.error);
                        }

                        callback(null, response);

                    }, this);

                }

                function getMonthData(callback) {

                    dataService.getData('/monthHours/list', {month: month, year: year}, function (response, context) {

                        if (response.error) {
                            return callback(response.error);
                        }

                        callback(null, response);

                    }, this);
                }


                return false;
            },

            chooseOption: function (e) {
                var target = $(e.target);
                var targetElement = target.parents("td");
                var tr = target.parents("tr");
                var modelId = tr.data('id');
                var id = target.attr("id");
                var attr = targetElement.attr("id") || targetElement.data("content");
                var elementType = '#' + attr;
                var projectManager;
                var assignedContainer;
                var project;
                var employee;
                var department;
                var changedAttr;
                var wTrackId = tr.data('id');
                var value;

                var element = _.find(this.responseObj[elementType], function (el) {
                    return el._id === id;
                });

                var editWtrackModel = this.editCollection.get(modelId);

                if (!this.changedModels[modelId]) {
                    if (!editWtrackModel.id) {
                        this.changedModels[modelId] = editWtrackModel.attributes;
                    } else {
                        this.changedModels[modelId] = {};
                    }
                }

                changedAttr = this.changedModels[modelId];

                if (elementType === '#project') {

                    projectManager = element.projectmanager.name.first + ' ' + element.projectmanager.name.last;
                    assignedContainer = tr.find('[data-content="assigned"]');
                    assignedContainer.text(projectManager);
                    targetElement.attr('data-id', id);

                    tr.find('[data-content="workflow"]').text(element.workflow.name);
                    tr.find('[data-content="customer"]').text(element.customer.name.first + ' ' + element.customer.name.last);

                    project = _.clone(editWtrackModel.get('project'));
                    project._id = element._id;
                    project.projectName = element.projectName;
                    project.workflow._id = element.workflow._id;
                    project.workflow.name = element.workflow.name;
                    project.customer._id = element.customer._id;
                    project.customer.name = element.customer.name.first + ' ' + element.customer.name.last;

                    project.projectmanager.name = element.projectmanager.name.first + ' ' + element.projectmanager.name.last;
                    project.projectmanager._id = element.projectmanager._id;

                    changedAttr.project = project;

                } else if (elementType === '#employee') {
                    tr.find('[data-content="department"]').text(element.department.departmentName);

                    employee = _.clone(editWtrackModel.get('employee'));
                    department = _.clone(editWtrackModel.get('department'));

                    employee._id = element._id;
                    employee.name = target.text();

                    department._id = element.department._id;
                    department.departmentName = element.department.departmentName;

                    changedAttr.employee = employee;
                    changedAttr.department = department;

                    value = _.bind(this.calculateCost, this);
                    value(e, wTrackId);

                    tr.find('[data-content="department"]').removeClass('errorContent');
                } else if (elementType === '#department') {
                    department = _.clone(editWtrackModel.get('department'));
                    department._id = element._id;
                    department.departmentName = element.departmentName;

                    changedAttr.department = department;
                }

                targetElement.removeClass('errorContent');

                targetElement.text(target.text());

                this.hideNewSelect();
                this.setEditable(targetElement);

                return false;
            },

            saveItem: function () {
                var model;

                var errors = this.$el.find('.errorContent');

                for (var id in this.changedModels) {
                    model = this.editCollection.get(id);
                    model.changed = this.changedModels[id];
                }

                if (errors.length) {
                    return
                }
                this.editCollection.save();
            },

            savedNewModel: function (modelObject) {
                var savedRow = this.$listTable.find('#false');
                var modelId;
                var checkbox = savedRow.find('input[type=checkbox]');

                modelObject = modelObject.success;

                if (modelObject) {
                    modelId = modelObject._id;
                    savedRow.attr("data-id", modelId);
                    checkbox.val(modelId);
                    savedRow.removeAttr('id');
                }

                this.hideSaveCancelBtns();
                this.resetCollection(modelObject);
            },

            resetCollection: function (model) {
                if (model && model._id) {
                    model = new currentModel(model);
                    this.collection.add(model);
                } else {
                    this.collection.set(this.editCollection.models, {remove: false});
                }
            },

            updatedOptions: function () {
                this.hideSaveCancelBtns();
                this.resetCollection();
            },

            fetchSortCollection: function (sortObject) {
                this.sort = sortObject;
                this.collection = new contentCollection({
                    viewType: 'list',
                    sort: sortObject,
                    page: this.page,
                    count: this.defaultItemsNumber,
                    filter: this.filter,
                    parrentContentId: this.parrentContentId,
                    contentType: this.contentType,
                    newCollection: this.newCollection
                });
                this.collection.bind('reset', this.renderContent, this);
                this.collection.bind('showmore', this.showMoreContent, this);
            },

            goSort: function (e) {
                if (this.isNewRow()) {
                    return false;
                }

                var target$ = $(e.target);
                var currentParrentSortClass = target$.attr('class');
                var sortClass = currentParrentSortClass.split(' ')[1];
                var sortConst = 1;
                var sortBy = target$.data('sort');
                var sortObject = {};

                this.collection.unbind('reset');
                this.collection.unbind('showmore');

                if (!sortClass) {
                    target$.addClass('sortDn');
                    sortClass = "sortDn";
                }

                switch (sortClass) {
                    case "sortDn":
                    {
                        target$.parent().find("th").removeClass('sortDn').removeClass('sortUp');
                        target$.removeClass('sortDn').addClass('sortUp');
                        sortConst = 1;
                    }
                        break;
                    case "sortUp":
                    {
                        target$.parent().find("th").removeClass('sortDn').removeClass('sortUp');
                        target$.removeClass('sortUp').addClass('sortDn');
                        sortConst = -1;
                    }
                        break;
                }
                sortObject[sortBy] = sortConst;
                this.fetchSortCollection(sortObject);
                this.changeLocationHash(1, this.defaultItemsNumber);
                this.getTotalLength(null, this.defaultItemsNumber, this.filter);
            },

            hideItemsNumber: function (e) {
                var el = e.target;

                this.$el.find(".allNumberPerPage, .newSelectList").hide();
                if (!el.closest('.search-view')) {
                    $('.search-content').removeClass('fa-caret-up');
                    this.$el.find(".filterOptions, .filterActions, .search-options, .drop-down-filter").hide();
                }
                ;
            },

            showNewSelect: function (e, prev, next) {
                populate.showSelect(e, prev, next, this);

                return false;
            },

            hideNewSelect: function (e) {
                $(".newSelectList").remove();
            },

            itemsNumber: function (e) {
                $(e.target).closest("button").next("ul").toggle();
                return false;
            },

            getTotalLength: function (currentNumber, itemsNumber, filter) {
                dataService.getData(this.collectionLengthUrl, {
                    currentNumber: currentNumber,
                    filter: filter,
                    newCollection: this.newCollection
                }, function (response, context) {
                    var page = context.page || 1;
                    var length = context.listLength = response.count || 0;

                    if (itemsNumber * (page - 1) > length) {
                        context.page = page = Math.ceil(length / itemsNumber);
                        context.fetchSortCollection(context.sort);
                        context.changeLocationHash(page, context.defaultItemsNumber, filter);
                    }

                    context.pageElementRender(response.count, itemsNumber, page);//prototype in main.js
                }, this);
            },

            render: function () {

                var self = this;
                var currentEl = this.$el;
                var pagenation;
                var FilterView;
                var checkedInputs;
                var allInputs;

                currentEl.html('');
                currentEl.append(_.template(listTemplate));
                currentEl.append(new listItemView({
                    collection: this.collection,
                    page: this.page,
                    itemsNumber: this.collection.namberToShow
                }).render());//added two parameters page and items number

                $(document).on("click", function (e) {
                    self.hideItemsNumber(e);
                });

                pagenation = this.$el.find('.pagination');

                if (this.collection.length === 0) {
                    pagenation.hide();
                } else {
                    pagenation.show();
                }
                currentEl.append("<div id='timeRecivingDataFromServer'>Created in " + (new Date() - this.startTime) + " ms</div>");

                $('#check_all').click(function () {
                    allInputs = $('.listCB');
                    allInputs.prop('checked', this.checked);
                    checkedInputs = $("input.listCB:checked");

                    if (checkedInputs.length > 0) {
                        self.allTotalVals = {
                            hours: 0,
                            monHours: 0,
                            tueHours: 0,
                            wedHours: 0,
                            thuHours: 0,
                            friHours: 0,
                            satHours: 0,
                            sunHours: 0,
                            revenue: 0,
                            cost: 0,
                            profit: 0,
                            amount: 0
                        };

                        $("#top-bar-deleteBtn").show();
                    } else {
                        $("#top-bar-deleteBtn").hide();
                    }

                    allInputs.trigger("change");

                    self.genInvoiceEl.hide();
                    self.copyEl.hide();
                });

                dataService.getData("/project/getForWtrack", null, function (projects) {
                    projects = _.map(projects.data, function (project) {
                        project.name = project.projectName;

                        return project
                    });

                    self.responseObj['#project'] = projects;
                });

                dataService.getData("/employee/getForDD", null, function (employees) {
                    employees = _.map(employees.data, function (employee) {
                        employee.name = employee.name.first + ' ' + employee.name.last;

                        return employee
                    });

                    self.responseObj['#employee'] = employees;
                });

                dataService.getData("/department/getForDD", null, function (departments) {
                    departments = _.map(departments.data, function (department) {
                        department.name = department.departmentName;

                        return department
                    });

                    self.responseObj['#department'] = departments;
                });

                dataService.getData('/wTrack/getFilterValues', null, function (values) {
                    /*values[0].departments = _.map(values[0].departments, function (department) {
                     department.name = department.departmentName;

                     return department
                     });*/

                    FilterView = new filterView({
                        //collection: values[0].departments,
                        customCollection: values,
                        wTrack: true
                    });

                    // Filter custom event listen ------begin
                    FilterView.bind('filter', function () {

                        self.showFilteredPage()
                    });
                    FilterView.bind('defaultFilter', function () {
                        self.showFilteredPage();
                    });
                    // Filter custom event listen ------end
                });

                setTimeout(function () {
                    /*self.editCollection = new EditCollection(self.collection.toJSON());
                     self.editCollection.on('saved', self.savedNewModel, self);
                     self.editCollection.on('updated', self.updatedOptions, self);*/
                    self.bindingEventsToEditedCollection(self);
                    self.$listTable = $('#listTable');
                }, 10);

                this.genInvoiceEl = $('#top-bar-generateBtn');
                this.copyEl = $('#top-bar-copyBtn');

                return this;
            },

            bindingEventsToEditedCollection: function (context) {
                if (context.editCollection) {
                    context.editCollection.unbind();
                }
                context.editCollection = new EditCollection(context.collection.toJSON());
                context.editCollection.on('saved', context.savedNewModel, context);
                context.editCollection.on('updated', context.updatedOptions, context);
            },

            setChangedValue: function () {
                if (!this.changed) {
                    this.changed = true;
                    this.showSaveCancelBtns()
                }
            },

            renderContent: function () {
                var currentEl = this.$el;
                var tBody = currentEl.find('#listTable');
                var itemView;
                var pagenation;

                $("#top-bar-deleteBtn").hide();
                $('#check_all').prop('checked', false);

                tBody.empty();

                itemView = new listItemView({
                    collection: this.collection,
                    page: currentEl.find("#currentShowPage").val(),
                    itemsNumber: currentEl.find("span#itemsNumber").text()
                });

                tBody.append(itemView.render());

                pagenation = this.$el.find('.pagination');

                if (this.collection.length === 0) {
                    pagenation.hide();
                } else {
                    pagenation.show();
                    this.editCollection.reset(this.collection.models);
                }
            },

            previousPage: function (event) {
                event.preventDefault();
                $('#check_all').prop('checked', false);
                $("#top-bar-deleteBtn").hide();

                this.prevP({
                    sort: this.sort,
                    filter: this.filter,
                    newCollection: this.newCollection,
                    parrentContentId: this.parrentContentId
                });
                dataService.getData(this.collectionLengthUrl, {
                    filter: this.filter,
                    newCollection: this.newCollection,
                    parrentContentId: this.parrentContentId
                }, function (response, context) {
                    context.listLength = response.count || 0;
                }, this);
            },

            nextPage: function (event) {
                event.preventDefault();
                $('#check_all').prop('checked', false);
                $("#top-bar-deleteBtn").hide();
                this.nextP({
                    sort: this.sort,
                    filter: this.filter,
                    newCollection: this.newCollection,
                    parrentContentId: this.parrentContentId
                });

                dataService.getData(this.collectionLengthUrl, {
                    filter: this.filter,
                    newCollection: this.newCollection,
                    parrentContentId: this.parrentContentId
                }, function (response, context) {
                    context.listLength = response.count || 0;
                }, this);
            },

            firstPage: function (event) {
                event.preventDefault();
                $('#check_all').prop('checked', false);
                $("#top-bar-deleteBtn").hide();
                this.firstP({
                    sort: this.sort,
                    filter: this.filter,
                    newCollection: this.newCollection
                });
                dataService.getData(this.collectionLengthUrl, {
                    filter: this.filter,
                    newCollection: this.newCollection
                }, function (response, context) {
                    context.listLength = response.count || 0;
                }, this);
            },

            lastPage: function (event) {
                event.preventDefault();
                $('#check_all').prop('checked', false);
                $("#top-bar-deleteBtn").hide();
                this.lastP({
                    sort: this.sort,
                    filter: this.filter,
                    newCollection: this.newCollection
                });
                dataService.getData(this.collectionLengthUrl, {
                    filter: this.filter,
                    newCollection: this.newCollection
                }, function (response, context) {
                    context.listLength = response.count || 0;
                }, this);
            },  //end first last page in paginations

            switchPageCounter: function (event) {
                event.preventDefault();
                this.startTime = new Date();
                var itemsNumber = event.target.textContent;
                this.defaultItemsNumber = itemsNumber;
                this.getTotalLength(null, itemsNumber, this.filter);
                this.collection.showMore({
                    count: itemsNumber,
                    page: 1,
                    filter: this.filter,
                    newCollection: this.newCollection
                });
                this.page = 1;
                $("#top-bar-deleteBtn").hide();
                $('#check_all').prop('checked', false);
                this.changeLocationHash(1, itemsNumber, this.filter);
            },

            showFilteredPage: function () {
                var itemsNumber = $("#itemsNumber").text();
                ;
                var checkedElements = this.$el.find('input:checkbox:checked');
                var chosen = this.$el.find('.chosen');

                var logicAndStatus = this.$el.find('#logicCondition')[0].checked;
                var defaultFilterStatus = this.$el.find('#defaultFilter')[0].checked;

                this.startTime = new Date();
                this.newCollection = false;
                this.filter = custom.getFiltersValues(chosen, defaultFilterStatus, logicAndStatus);

                $("#top-bar-deleteBtn").hide();
                $('#check_all').prop('checked', false);

                this.changeLocationHash(1, itemsNumber, this.filter);
                this.collection.showMore({count: itemsNumber, page: 1, filter: this.filter});
                this.getTotalLength(null, itemsNumber, this.filter);
            },

            saveFilter: function () {
                var currentUser = new usersModel(App.currentUser);
                var subMenu = $('#submenu-holder').find('li.selected').text();
                var key;
                var filterObj = {};
                var mid = 39;

                key = subMenu.trim();

                filterObj['filter'] = {};
                filterObj['filter'] = this.filter;
                filterObj['key'] = key;

                currentUser.changed = filterObj;

                currentUser.save(
                    filterObj,
                    {
                        headers: {
                            mid: mid
                        },
                        wait: true,
                        patch: true,
                        validate: false,
                        success: function (model) {
                            console.log('Filter was saved to db');
                        },
                        error: function (model, xhr) {
                            console.error(xhr);
                        },
                        editMode: false
                    }
                );
                if (!App.currentUser.savedFilters) {
                    App.currentUser.savedFilters = {};
                }
                App.currentUser.savedFilters['wTrack'] = filterObj.filter;

            },

            removeFilter: function () {
                var currentUser = new usersModel(App.currentUser);
                var subMenu = $('#submenu-holder').find('li.selected').text();
                var key;
                var filterObj = {};
                var mid = 39;

                key = subMenu.trim();
                filterObj['key'] = key;

                currentUser.changed = filterObj;

                currentUser.save(
                    filterObj,
                    {
                        headers: {
                            mid: mid
                        },
                        wait: true,
                        patch: true,
                        validate: false,
                        success: function (model) {
                            console.log('Filter was remover from db');
                        },
                        error: function (model, xhr) {
                            console.error(xhr);
                        },
                        editMode: false
                    }
                );

                this.clearFilter();

                if (App.currentUser.savedFilters['wTrack']) {
                    delete App.currentUser.savedFilters['wTrack'];
                }
            },

            clearFilter: function () {
                this.$el.find('.filterValues').empty();
                this.$el.find('.filter-icons').removeClass('active');
                this.$el.find('.chooseOption').children().remove();
                this.$el.find('.filterOptions').removeClass('chosen');
                this.$el.find(".filterOptions, .filterActions").hide();

                $.each($('.drop-down-filter input'), function (index, value) {
                    value.checked = false
                });

                this.showFilteredPage();
            },

            showPage: function (event) {
                event.preventDefault();
                this.showP(event, {filter: this.filter, newCollection: this.newCollection, sort: this.sort});
            },

            showMoreContent: function (newModels) {
                var holder = this.$el;
                var itemView;
                var pagenation;

                holder.find("#listTable").empty();
                itemView = new listItemView({
                    collection: newModels,
                    page: holder.find("#currentShowPage").val(),
                    itemsNumber: holder.find("span#itemsNumber").text()
                });//added two parameters page and items number

                holder.append(itemView.render());

                itemView.undelegateEvents();

                pagenation = holder.find('.pagination');

                if (newModels.length !== 0) {
                    pagenation.show();
                } else {
                    pagenation.hide();
                }

                $("#top-bar-deleteBtn").hide();
                $('#check_all').prop('checked', false);

                holder.find('#timeRecivingDataFromServer').remove();
                holder.append("<div id='timeRecivingDataFromServer'>Created in " + (new Date() - this.startTime) + " ms</div>");

                this.editCollection.reset(this.collection.models);
            },

            goToEditDialog: function (e) {
                e.preventDefault();

                var id = $(e.target).closest("tr").data("id");
                var model = new currentModel({validate: false});

                model.urlRoot = '/quotation/form/' + id;
                model.fetch({
                    success: function (model) {
                        new editView({model: model});
                    },
                    error: function () {
                        alert('Please refresh browser');
                    }
                });
            },

            isNewRow: function () {
                var newRow = $('#false');

                return !!newRow.length;
            },

            createItem: function () {
                var now = new Date();
                var year = now.getFullYear();
                var month = now.getMonth() + 1;
                var week = now.getWeek();
                var rate = 3;
                var startData = {
                    year: year,
                    month: month,
                    week: week,
                    rate: rate
                };

                var model = new currentModel(startData);

                startData.cid = model.cid;

                if (!this.isNewRow()) {
                    this.showSaveCancelBtns();
                    this.editCollection.add(model);

                    new createView(startData);
                }

                this.createdCopied = true;
                this.changed = true;
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

            checkProjectId: function (e, checkLength) {
                var totalCheckLength = $("input.checkbox:checked").length;
                var ellement = e.target;
                var checked = ellement.checked;
                var targetEl = $(ellement);
                var tr = targetEl.closest('tr');
                var wTrackId = tr.data('id');
                var model = this.collection.get(wTrackId);
                var projectContainer = tr.find('td[data-content="project"]');
                var projectId = projectContainer.data('id');

                if (checkLength === 1) {
                    this.copyEl.show();
                } else {
                    this.copyEl.hide();
                }

                if (!checkLength || !model || model.get('isPaid')) {
                    this.selectedProjectId = [];
                    this.genInvoiceEl.hide();

                    return false;
                }

                if (checked) {
                    this.selectedProjectId.push(projectId);
                } else if (totalCheckLength > 0 && this.selectedProjectId.length > 1) {
                    this.selectedProjectId = _.without(this.selectedProjectId, projectId);
                }

                this.selectedProjectId = _.uniq(this.selectedProjectId);

                if (this.selectedProjectId.length !== 1) {
                    this.genInvoiceEl.hide();
                } else {
                    this.genInvoiceEl.show();
                }
            },

            getAutoCalcField: function (e, idTotal, dataRow, operation, money) {

                var row = e.closest('tr');
                var footerRow = this.$el.find('#listFooter');

                var totalTd = $(footerRow).find('#' + idTotal);
                var rowTd = $(row).find('[data-content="' + dataRow + '"]');
                var rowTdVal = parseFloat(rowTd.text());

                var result;

                if (operation) {
                    result = this.allTotalVals[idTotal] + rowTdVal * 100;
                } else {
                    result = this.allTotalVals[idTotal] - rowTdVal * 100;
                }

                this.allTotalVals[idTotal] = result;

                if (money) {
                    totalTd.text((result / 100).toFixed(2));
                } else {
                    totalTd.text(result / 100);
                }
            },

            setAllTotalVals: function (e) {
                e = e.target;
                var status = e.checked;

                if (status) {
                    this.getAutoCalcField(e, 'hours', 'worked', true);
                    this.getAutoCalcField(e, 'monHours', '1', true);
                    this.getAutoCalcField(e, 'tueHours', '2', true);
                    this.getAutoCalcField(e, 'wedHours', '3', true);
                    this.getAutoCalcField(e, 'thuHours', '4', true);
                    this.getAutoCalcField(e, 'friHours', '5', true);
                    this.getAutoCalcField(e, 'satHours', '6', true);
                    this.getAutoCalcField(e, 'sunHours', '7', true);
                    this.getAutoCalcField(e, 'revenue', 'revenue', true, true);
                    this.getAutoCalcField(e, 'cost', 'cost', true, true);
                    this.getAutoCalcField(e, 'profit', 'profit', true, true);
                    this.getAutoCalcField(e, 'amount', 'amount', true, true);
                } else {
                    this.getAutoCalcField(e, 'hours', 'worked');
                    this.getAutoCalcField(e, 'monHours', '1');
                    this.getAutoCalcField(e, 'tueHours', '2');
                    this.getAutoCalcField(e, 'wedHours', '3');
                    this.getAutoCalcField(e, 'thuHours', '4');
                    this.getAutoCalcField(e, 'friHours', '5');
                    this.getAutoCalcField(e, 'satHours', '6');
                    this.getAutoCalcField(e, 'sunHours', '7');
                    this.getAutoCalcField(e, 'revenue', 'revenue', false, true);
                    this.getAutoCalcField(e, 'cost', 'cost', false, true);
                    this.getAutoCalcField(e, 'profit', 'profit', false, true);
                    this.getAutoCalcField(e, 'amount', 'amount', false, true);
                }
            },

            checked: function (e) {

                if (this.collection.length > 0) {
                    var checkLength = $("input.listCB:checked").length;

                    this.checkProjectId(e, checkLength);

                    if (checkLength > 0) {
                        $("#top-bar-deleteBtn").show();
                        if (checkLength === this.collection.length) {
                            $('#check_all').prop('checked', true);
                        }
                    } else {
                        $("#top-bar-deleteBtn").hide();
                        $('#check_all').prop('checked', false);
                    }
                }
            },

            deleteItemsRender: function (deleteCounter, deletePage) {
                var pagenation;
                var holder;

                dataService.getData(this.collectionLengthUrl, {
                    filter: this.filter,
                    newCollection: this.newCollection
                }, function (response, context) {
                    context.listLength = response.count || 0;
                }, this);
                this.deleteRender(deleteCounter, deletePage, {
                    filter: this.filter,
                    newCollection: this.newCollection,
                    parrentContentId: this.parrentContentId
                });

                holder = this.$el;

                if (deleteCounter !== this.collectionLength) {
                    var created = holder.find('#timeRecivingDataFromServer');
                    created.before(new listItemView({
                        collection: this.collection,
                        page: holder.find("#currentShowPage").val(),
                        itemsNumber: holder.find("span#itemsNumber").text()
                    }).render());//added two parameters page and items number
                }

                pagenation = this.$el.find('.pagination');

                if (this.collection.length === 0) {
                    pagenation.hide();
                } else {
                    pagenation.show();
                }

                this.editCollection.reset(this.collection.models);
            },

            triggerDeleteItemsRender: function (deleteCounter) {
                this.deleteCounter = deleteCounter;
                this.deletePage = $("#currentShowPage").val();
                this.deleteItemsRender(deleteCounter, this.deletePage);
            },

            deleteItems: function () {
                var currentEl = this.$el;
                var that = this,
                    mid = 39,
                    model;
                var localCounter = 0;
                var count = $("#listTable input:checked").length;
                this.collectionLength = this.collection.length;

                if (!this.changed) {
                    var answer = confirm("Realy DELETE items ?!");
                    var value;

                    if (answer === true) {
                        $.each($("#listTable input:checked"), function (index, checkbox) {
                            value = checkbox.value;

                            if (value.length < 24) {
                                that.editCollection.remove(value);
                                that.editCollection.on('remove', function () {
                                    this.listLength--;
                                    localCounter++;

                                    if (index === count - 1) {
                                        that.triggerDeleteItemsRender(localCounter);
                                    }

                                }, that);
                            } else {

                                model = that.collection.get(value);
                                model.destroy({
                                    headers: {
                                        mid: mid
                                    },
                                    wait: true,
                                    success: function () {
                                        that.listLength--;
                                        localCounter++;

                                        if (index === count - 1) {
                                            that.triggerDeleteItemsRender(localCounter);
                                        }
                                    },
                                    error: function (model, res) {
                                        if (res.status === 403 && index === 0) {
                                            alert("You do not have permission to perform this action");
                                        }
                                        that.listLength--;
                                        localCounter++;
                                        if (index == count - 1) {
                                            if (index === count - 1) {
                                                that.triggerDeleteItemsRender(localCounter);
                                            }
                                        }

                                    }
                                });
                            }
                        });
                    }
                } else {
                    this.cancelChanges();
                }
            },

            cancelChanges: function () {
                var self = this;
                var edited = this.edited;
                var collection = this.collection;
                var editedCollectin = this.editCollection;
                var copiedCreated;
                var dataId;

                async.each(edited, function (el, cb) {
                    var tr = $(el).closest('tr');
                    var rowNumber = tr.find('[data-content="number"]').text();
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
                    model = model.toJSON();
                    model.startNumber = rowNumber;
                    tr.replaceWith(template({model: model}));
                    cb();
                }, function (err) {
                    if (!err) {
                        /*self.editCollection = new EditCollection(collection.toJSON());*/
                        self.bindingEventsToEditedCollection(self);
                        self.hideSaveCancelBtns();
                    }
                });

                if (this.createdCopied) {
                    copiedCreated = this.$el.find('#false');
                    dataId = copiedCreated.data('id');
                    this.editCollection.remove(dataId);
                    delete this.changedModels[dataId];
                    copiedCreated.remove();

                    this.createdCopied = false;
                }
            }
        });

        return wTrackListView;
    });
