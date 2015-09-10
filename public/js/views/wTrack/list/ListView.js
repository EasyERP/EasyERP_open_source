define([
        'text!templates/Pagination/PaginationTemplate.html',
        'text!templates/wTrack/list/ListHeader.html',
        'text!templates/wTrack/list/cancelEdit.html',
        'views/wTrack/CreateView',
        'views/wTrack/list/ListItemView',
        'views/wTrack/EditView',
        'views/salesInvoice/wTrack/CreateView',
        'models/wTrackModel',
        'collections/wTrack/filterCollection',
        'collections/wTrack/editCollection',
        'views/Filter/FilterView',
        'common',
        'dataService',
        'populate',
        'async',
        'custom',
        'moment'
    ],

    function (paginationTemplate, listTemplate, cancelEdit, createView, listItemView, editView, wTrackCreateView, currentModel, contentCollection, EditCollection, filterView, common, dataService, populate, async, custom, moment) {
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
                this.defaultItemsNumber = this.collection.namberToShow || 100;
                this.newCollection = options.newCollection;
                this.deleteCounter = 0;
                this.page = options.collection.page;

                this.render();

                this.getTotalLength(null, this.defaultItemsNumber, this.filter);
                this.contentCollection = contentCollection;
                this.stages = [];
                this.filterView;
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
                "mouseover .currentPageList": "itemsNumber",
                "click": "hideItemsNumber",
                "click #firstShowPage": "firstPage",
                "click #lastShowPage": "lastPage",
                "click .oe_sortable": "goSort",
                "click .newSelectList li:not(.miniStylePagination)": "chooseOption",
                "change .autoCalc": "autoCalc",
                "change .editable ": "setEditable",
                "keydown input.editing ": "keyDown",
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
                    var reven = model.get('revenue');

                    if (typeof(reven) != 'number') {
                        model.set({revenue: parseFloat(reven) * 100});
                    }

                    var revenue = reven.toString().replace('$', '');

                    revenue = parseFloat(revenue);

                    if (typeof(reven) === 'number') {
                        revenue = revenue / 100;
                    }

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

            hideGenerateCopy: function () {
                $('#top-bar-generateBtn').hide();
                $('#top-bar-copyBtn').hide();
            },

            copyRow: function (e) {
                this.hideGenerateCopy();

                this.changed = true;
                this.createdCopied = true;
                var checkedRows = this.$el.find('input.listCB:checked:not(#check_all)');
                var length = checkedRows.length;


                for (var i = length - 1; i >= 0; i--) {
                    var selectedWtrack = checkedRows[i];
                    var self = this;
                    var target = $(selectedWtrack);
                    var id = target.val();
                    var row = target.closest('tr');
                    var model = self.collection.get(id) ? self.collection.get(id) : self.editCollection.get(id);
                    var _model;
                    var tdsArr;
                    var cid;

                    $(selectedWtrack).attr('checked', false);

                    model.set({"isPaid": false});
                    model.set({"amount": 0});
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
                    $(tdsArr[20]).find('span').text('Unpaid');
                    $(tdsArr[20]).find('span').addClass('unDone');
                    $(tdsArr[24]).text(0);
                    $(tdsArr[1]).text(cid);
                }
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

                    //editWtrackModel = this.editCollection.get(editedElementRowId);

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
                var content = el.data('content');
                var isSelect = colType !== 'input' && el.prop("tagName") !== 'INPUT';
                var tempContainer;
                var width;
                var editedElement;
                var value;
                var insertedInput;

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

                    insertedInput = el.find('input');
                    insertedInput.focus();
                    insertedInput[0].setSelectionRange(0, insertedInput.val().length);

                    this.autoCalc(e);
                    this.calculateCost(e, wTrackId);
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
                var profit = tr.find('[data-content="profit"]');
                var revenueVal = tr.find('[data-content="revenue"]').text();
                var profitVal = tr.find('[data-content="profit"]').text();


                if (!this.changedModels[wTrackId]) {
                    this.changedModels[wTrackId] = {};
                }

                costElement = $(e.target).closest('tr').find('[data-content="cost"]');

                if (wTrackId.length < 24) {
                    employeeId = this.changedModels[wTrackId].employee._id;

                    month = (tr.find('[data-content="month"]').text()) ? tr.find('[data-content="month"]').text() : tr.find('.editing').val();
                    year = (tr.find('[data-content="year"]').text()) ? tr.find('[data-content="year"]').text() : tr.find('.editing').val();
                    trackWeek = tr.find('[data-content="worked"]').text();

                } else {
                    editWtrackModel = this.editCollection.get(wTrackId);

                    employeeId = editWtrackModel.attributes.employee._id;
                    month = (tr.find('[data-content="month"]').text()) ? tr.find('[data-content="month"]').text() : tr.find('.editing').val();
                    year = (tr.find('[data-content="year"]').text()) ? tr.find('[data-content="year"]').text() : tr.find('.editing').val();
                    trackWeek = tr.find('[data-content="worked"]').text();
                }

                async.parallel([getBaseSalary, getMonthData], function callback(err, results) {
                    var baseSalary = results[0];
                    var coefficients = results[1][0];

                    if (err || !baseSalary || !coefficients) {
                        costElement.text('');
                        costElement.addClass('money');
                        costElement.text('0.00');

                        profitVal = (parseFloat(revenueVal) - 0).toFixed(2);
                        profit.text(profitVal);

                        self.changedModels[wTrackId].cost = 0;
                        self.changedModels[wTrackId].profit = parseFloat(profitVal) * 100;
                        ;

                        return 0;
                    }

                    baseSalaryValue = parseFloat(baseSalary);
                    expenseCoefficient = parseFloat(coefficients.expenseCoefficient);
                    fixedExpense = parseInt(coefficients.fixedExpense);
                    hours = parseInt(coefficients.hours);

                    calc = ((((baseSalaryValue * expenseCoefficient) + fixedExpense) / hours) * trackWeek).toFixed(2);

                    costElement.text('');
                    costElement.addClass('money');
                    costElement.text(calc);


                    profitVal = (parseFloat(revenueVal) - parseFloat(calc)).toFixed(2);
                    profit.text(profitVal);

                    self.changedModels[wTrackId].cost = parseFloat(calc) * 100;
                    self.changedModels[wTrackId].profit = parseFloat(profitVal) * 100;

                    return calc;
                });

                function getBaseSalary(callback) {
                    var employeeSalary;

                    dataService.getData('/salary/getByMonth',
                        {
                            month: month,
                            year: year,
                            _id: employeeId
                        }, function (response, context) {

                            if (response.error) {
                                return callback(response.error);
                            }

                            callback(null, response.data);

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

                    projectManager = element.projectmanager.name;
                    assignedContainer = tr.find('[data-content="assigned"]');
                    assignedContainer.text(projectManager);
                    targetElement.attr('data-id', id);

                    tr.find('[data-content="workflow"]').text(element.workflow.name);
                    tr.find('[data-content="customer"]').text(element.customer.name);

                    project = _.clone(editWtrackModel.get('project'));
                    project._id = element._id;
                    project.projectName = element.projectName;
                    project.workflow._id = element.workflow._id;
                    project.workflow.name = element.workflow.name;
                    project.customer._id = element.customer._id;
                    project.customer.name = element.customer.name;

                    project.projectmanager.name = element.projectmanager.name;
                    project.projectmanager._id = element.projectmanager._id;

                    changedAttr.project = project;

                } else if (elementType === '#employee') {
                    tr.find('[data-content="department"]').text(element.department.name);

                    employee = _.clone(editWtrackModel.get('employee'));
                    department = _.clone(editWtrackModel.get('department'));

                    employee._id = element._id;
                    employee.name = target.text();

                    department._id = element.department._id;
                    department.departmentName = element.department.name;

                    changedAttr.employee = employee;
                    changedAttr.department = department;

                    this.calculateCost(e, wTrackId);

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
                    this.$el.find('.search-options').addClass('hidden');
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

                currentEl.append(_.template(paginationTemplate));

                pagenation = this.$el.find('.pagination');

                if (this.collection.length === 0) {
                    pagenation.hide();
                } else {
                    pagenation.show();
                }
                currentEl.append("<div id='timeRecivingDataFromServer'>Created in " + (new Date() - this.startTime) + " ms</div>");

                $('#check_all').click(function () {
                    var checkLength;

                    allInputs = $('.listCB');
                    allInputs.prop('checked', this.checked);
                    checkedInputs = $("input.listCB:checked");

                    if (self.collection.length > 0) {
                        checkLength = checkedInputs.length;

                        self.checkProjectId($('#check_all'), checkLength);

                        if (checkLength > 0) {
                            $("#top-bar-deleteBtn").show();

                            if (checkLength === self.collection.length) {
                                $('#check_all').prop('checked', true);
                            }
                        } else {
                            $("#top-bar-deleteBtn").hide();
                            $('#check_all').prop('checked', false);
                        }
                    }

                    self.setAllTotalVals();
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

                self.filterView = new filterView({
                    contentType: self.contentType
                });

                self.filterView.bind('filter', function (filter) {
                    self.showFilteredPage(filter);
                });
                self.filterView.bind('defaultFilter', function () {
                    self.showFilteredPage({});
                });

                self.filterView.render();

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

            showFilteredPage: function (filter) {
                var itemsNumber = $("#itemsNumber").text();
                this.filter = filter;

                this.startTime = new Date();
                this.newCollection = false;
                //this.filter = custom.getFiltersValues(chosen, defaultFilterStatus, logicAndStatus);

                $("#top-bar-deleteBtn").hide();
                $('#check_all').prop('checked', false);

                this.changeLocationHash(1, itemsNumber, filter);
                this.collection.showMore({count: itemsNumber, page: 1, filter: filter});
                this.getTotalLength(null, itemsNumber, filter);
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

                this.editCollection.reset(this.collection.models);
                this.filterView.renderFilterContent();

                holder.find('#timeRecivingDataFromServer').remove();
                holder.append("<div id='timeRecivingDataFromServer'>Created in " + (new Date() - this.startTime) + " ms</div>");
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
                var checked = ellement ? ellement.checked : true;
                var targetEl = $(ellement);
                var tr = targetEl.closest('tr');
                var wTrackId = tr.attr('data-id');
                var model = this.collection.get(wTrackId);
                var projectContainer = tr.find('td[data-content="project"]');
                var projectId = projectContainer.data('id');

                if (checkLength > 1) {
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

            getAutoCalcField: function (idTotal, dataRow, money) {
                var footerRow = this.$el.find('#listFooter');

                var checkboxes = this.$el.find('#listTable .listCB:checked');

                var totalTd = $(footerRow).find('#' + idTotal);
                var rowTdVal = 0;
                var row;
                var rowTd;

                $(checkboxes).each(function (index, element) {
                    row = $(element).closest('tr');
                    rowTd = row.find('[data-content="' + dataRow + '"]')

                    rowTdVal += parseFloat(rowTd.html()) * 100;
                })

                if (money) {
                    totalTd.text((rowTdVal / 100).toFixed(2));
                } else {
                    totalTd.text(rowTdVal / 100);
                }
            },

            setAllTotalVals: function () {
                this.getAutoCalcField('hours', 'worked');
                this.getAutoCalcField('monHours', '1');
                this.getAutoCalcField('tueHours', '2');
                this.getAutoCalcField('wedHours', '3');
                this.getAutoCalcField('thuHours', '4');
                this.getAutoCalcField('friHours', '5');
                this.getAutoCalcField('satHours', '6');
                this.getAutoCalcField('sunHours', '7');
                this.getAutoCalcField('revenue', 'revenue', true);
                this.getAutoCalcField('cost', 'cost', true);
                this.getAutoCalcField('profit', 'profit', true);
                this.getAutoCalcField('amount', 'amount', true);
            },

            checked: function (e) {
                var checkLength;

                if (this.collection.length > 0) {
                    checkLength = $("input.listCB:checked").length;

                    this.checkProjectId(e, checkLength);

                    if (checkLength > 0) {
                        $("#top-bar-deleteBtn").show();
                        $('#check_all').prop('checked', false);
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

                this.hideGenerateCopy();
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
