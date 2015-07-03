define([
        'text!templates/Vacation/list/ListHeader.html',
        'text!templates/Holiday/list/cancelEdit.html',
        'views/Holiday/CreateView',
        'views/Vacation/list/ListItemView',
        'models/VacationModel',
        'collections/Vacation/filterCollection',
        'collections/Vacation/editCollection',
        'common',
        'dataService',
        'constants',
        'async',
        'moment',
        'populate'
    ],

    function (listTemplate, cancelEdit, createView, listItemView, vacationModel, vacationCollection, editCollection, common, dataService, CONSTANTS, async, moment, populate) {
        var VacationListView = Backbone.View.extend({
            el: '#content-holder',
            defaultItemsNumber: null,
            listLength: null,
            filter: null,
            sort: null,
            newCollection: null,
            page: null, //if reload page, and in url is valid page
            contentType: CONSTANTS.VACATION,//needs in view.prototype.changeLocationHash
            viewType: 'list',//needs in view.prototype.changeLocationHash
            changedModels: {},
            holidayId: null,
            editCollection: null,
            responseObj: {},
            monthElement: null,
            yearElement: null,

            initialize: function (options) {
                this.startTime = options.startTime;
                this.collection = options.collection;
                _.bind(this.collection.showMore, this.collection);
                this.filter = options.filter ? options.filter : {};
                this.sort = options.sort ? options.sort : {};
                this.defaultItemsNumber = this.collection.namberToShow || 50;
                this.newCollection = options.newCollection;
                this.deleteCounter = 0;
                this.page = options.collection.page;
                this.render();
                this.getTotalLength(null, this.defaultItemsNumber, this.filter);
                this.contentCollection = vacationCollection;
                this.daysCount;

            },

            events: {
                "click .newSelectList li.miniStylePagination .next:not(.disabled)": "nextSelect",
                "click .newSelectList li.miniStylePagination .prev:not(.disabled)": "prevSelect",
                "click td.editable": "editRow",
                "click .current-selected": "showNewCurrentSelect",
                "click .newSelectList li:not(.miniStylePagination)": "chooseOption",
                "click .oe_sortable": "goSort",
                "change .editable ": "setEditable",
                "click": "hideNewSelect"
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
                var checkbox = savedRow.find('input[type=checkbox]');
                var editedEl = savedRow.find('.editing');
                var editedCol = editedEl.closest('td');

                modelObject = modelObject.success;

                if (modelObject) {
                    modelId = modelObject._id;
                    savedRow.attr("data-id", modelId);
                    checkbox.val(modelId);
                    savedRow.removeAttr('id');
                }

                this.hideSaveCancelBtns();
                editedCol.text(editedEl.val());
                editedEl.remove();
                this.resetCollection(modelObject);
            },

            resetCollection: function (model) {
                if (model && model._id) {
                    model = new vacationModel(model);
                    this.collection.add(model);
                } else {
                    this.collection.set(this.editCollection.models, { remove: false });
                }
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

                for (var id in this.changedModels) {
                    model = this.editCollection.get(id);
                    model.changed = this.changedModels[id];
                }
                this.editCollection.save();
            },

            setChangedValueToModel: function(){
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
                        if(!editVacationModel.id){
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
                var array = ['Vacation', 'Personal', 'Sick', 'Education'];

                array = _.map(array, function(element) {
                    element = {
                        name: element
                    };
                    element._id = element.name.charAt(0);

                    return element;
                });
                content.responseObj['#vacType'] = array;
            },

            monthForDD: function (content) {
                var array = [];

                for (var i=0; i<12; i++) {
                    array.push({
                        _id: moment().month(i).format('M'),
                        name: moment().month(i).format('MMMM')
                    });
                }

                content.responseObj['#monthSelect'] = array;

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

            editRow: function (e, prev, next) {
                var self = this;

                var el = $(e.target);
                var tr = $(e.target).closest('tr');
                var holidayId = tr.data('id');
                var colType = el.data('type');
                var isSelect = colType !== 'input' && el.prop("tagName") !== 'INPUT';
                var tempContainer;
                var width;

                if (holidayId && el.prop('tagName') !== 'INPUT') {
                    if (this.holidayId) {
                        this.setChangedValueToModel();
                    }
                    this.holidayId = holidayId;
                }


                if (isSelect) {
                    populate.showSelect(e, prev, next, this);
                } else {
                    tempContainer = el.text();
                    width = el.width() - 6;
                    el.html('<input class="editing" type="text" value="' + tempContainer + '"  maxLength="255" style="width:' + width + 'px">');
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

            fetchSortCollection: function (sortObject) {
                this.sort = sortObject;
                this.collection = new vacationCollection({
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
            },

            goSort: function (e) {
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

            getTotalLength: function (currentNumber, itemsNumber, filter) {
                dataService.getData('/holiday/totalCollectionLength', {
                    contentType: this.contentType,
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
                    //context.pageElementRender(response.count, itemsNumber, page);//prototype in main.js
                }, this);
            },

            renderdSubHeader: function (currentEl) {
                var subHeaderContainer;

                var month;
                var year;

                var date;

                var daysInMonth;
                var dateDay;
                var daysRow = '';
                var daysNumRow = '';

                subHeaderContainer = currentEl.find('.subHeaderHolder');

                month = this.monthElement.attr('data-content');
                year = this.yearElement.text();

                date = moment([year, month - 1, 1]);
                daysInMonth = date.daysInMonth();
                dateDay = date;

                for ( var i = 1; i <= daysInMonth; i++ ) {
                    daysRow += '<th>' + dateDay.format('ddd') + '</th>';
                    daysNumRow += '<th>' + i + '</th>';
                    dateDay = date.add(1, 'd');
                }

                daysRow = '<tr class="subHeaderHolder">' + daysRow + '</tr>';

                daysNumRow = '<tr class="subHeaderHolder"><th class="oe_sortable" data-sort="employee.name">Employee Name</th><th>Department</th>' + daysNumRow +'<th>Total Days</th></tr>';

                this.daysCount = daysInMonth;

                var columnContainer = $('#columnForDays');
                var width = 80/daysInMonth;

                columnContainer.html('');

                for (var i=daysInMonth; i>0; i--) {
                    columnContainer.append('<col width="' + width + '%">');
                }

                $(subHeaderContainer[0]).attr('colspan', daysInMonth-12);
                $(subHeaderContainer[1]).replaceWith(daysRow);
                $(subHeaderContainer[2]).replaceWith(daysNumRow);
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

            changedDataOptions: function() {
                var month = this.monthElement.attr('data-content');
                var year = this.yearElement.text();

                var serchObject = {
                    month: month,
                    year: year
                };
                this.collection.showMore(serchObject);
            },

            chooseOption: function (e) {
                e.preventDefault();
                var target = $(e.target);
                var closestTD = target.closest("td");
                var targetElement = closestTD.length ? closestTD : target.closest("th").find('a');
                var tr = target.closest("tr");
                var modelId = tr.data('id');
                var id = target.attr("id");
                var attr = targetElement.attr("id") || targetElement.data("content");
                var elementType = '#' + attr;
                var element = _.find(this.responseObj[elementType], function (el) {
                    return el._id === id;
                });
                var editSalaryModel;

                if (modelId) {
                    editSalaryModel = this.editCollection.get(modelId);;
                }

                if (elementType === '#monthSelect') {
                    targetElement.attr('data-content', target.attr('id'));
                    this.monthElement = targetElement;
                    this.startTime = new Date();
                    this.changedDataOptions();
                    this.renderdSubHeader(this.$el);
                }

                if (elementType === '#employee') {
                    tr.find('[data-content="employee"]').text(element.name);

                    editSalaryModel.set({
                        employee: {
                            _id: element._id,
                            name: target.text()
                        }
                    });
                }

                if (elementType === '#vacType') {
                    targetElement.text(element._id);
                    targetElement.addClass(element._id);

                    editSalaryModel.set({
                        employee: {
                            _id: element._id,
                            name: target.text()
                        }
                    });
                }

                targetElement.text(target.text());

                this.hideNewSelect();
                this.setEditable(targetElement);

                return false;
            },

            render: function () {
                $('.ui-dialog ').remove();
                var self = this;
                var currentEl = this.$el;

                var month = {};
                month.number = this.startTime.getMonth() + 1;
                month.name = moment(this.startTime).format('MMMM');
                var year = this.startTime.getFullYear();

                currentEl.html('');
                currentEl.append(_.template(listTemplate, {options: {month: month, year: year}}));

                this.monthElement = currentEl.find('#monthSelect');
                this.yearElement = currentEl.find('#yearSelect');

                this.renderdSubHeader(currentEl);

                currentEl.append(new listItemView({
                    collection: this.collection,
                    daysCount: this.daysCount
                }).render());//added two parameters page and items number

                this.filterEmployeesForDD(this);
                this.vacationTypeForDD(this);
                this.monthForDD(this);

                setTimeout(function () {
                    self.editCollection = new editCollection(self.collection.toJSON());
                    self.editCollection.on('saved', self.savedNewModel, self);
                    self.editCollection.on('updated', self.updatedOptions, self);

                    self.$listTable = $('#listTable');
                }, 10);

                currentEl.append("<div id='timeRecivingDataFromServer'>Created in " + (new Date() - this.startTime) + " ms</div>");
            },

            renderContent: function () {
                var currentEl = this.$el;
                var tBody = currentEl.find('#listTable');
                $("#top-bar-deleteBtn").hide();
                $('#check_all').prop('checked', false);
                tBody.empty();
                var itemView = new listItemView({
                    collection: this.collection,
                    page: currentEl.find("#currentShowPage").val(),
                    itemsNumber: currentEl.find("span#itemsNumber").text()
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
                holder.find("#listTable").empty();
                var itemView = new listItemView({
                    collection: newModels,
                    daysCount: this.daysCount
                });//added two parameters page and items number
                holder.append(itemView.render());

                itemView.undelegateEvents();
                var pagenation = holder.find('.pagination');
                if (newModels.length !== 0) {
                    pagenation.show();
                } else {
                    pagenation.hide();
                }
                $("#top-bar-deleteBtn").hide();
                $('#check_all').prop('checked', false);
                holder.find('#timeRecivingDataFromServer').remove();
                holder.append("<div id='timeRecivingDataFromServer'>Created in " + (new Date() - this.startTime) + " ms</div>");
            },

            createItem: function () {
                var now = new Date();
                var startData = {
                    date: now
                };

                var model = new vacationModel(startData, { parse: true });

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

                async.each(edited, function (el, cb) {
                    var tr = $(el).closest('tr');
                    var rowNumber = tr.find('[data-content="number"]').text();
                    var id = tr.data('id');
                    var template = _.template(cancelEdit);
                    var model;

                    if (!id) {
                        return cb('Empty id');
                    }

                    model = collection.get(id);
                    model = model.toJSON();
                    model.index = rowNumber;
                    tr.replaceWith(template({ holiday: model }));
                    cb();
                }, function (err) {
                    if (!err) {
                        self.editCollection = new editCollection(collection.toJSON());
                        self.hideSaveCancelBtns();
                    }
                });
            }

        });

        return VacationListView;
    });
