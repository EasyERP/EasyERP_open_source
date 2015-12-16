/**
 * Created by soundstorm on 21.05.15.
 */
define([
        'text!templates/Pagination/PaginationTemplate.html',
        'text!templates/PayrollPayments/list/ListHeader.html',
        'views/Filter/FilterView',
        'views/PayrollPayments/DialogView',
        'models/PaymentModel',
        'views/PayrollPayments/list/ListItemView',
        'views/PayrollPayments/list/ListTotalView',
        'collections/PayrollPayments/filterCollection',
        'collections/PayrollPayments/editCollection',
        'dataService',
        'populate',
        'async'
    ],
    function (paginationTemplate, listTemplate, filterView, DialogView, currentModel, listItemView, listTotalView, paymentCollection, editCollection, dataService, populate, async) {
        "use strict";

        var PaymentListView = Backbone.View.extend({
            el                 : '#content-holder',
            contentType        : 'PayrollPayments',//needs in view.prototype.changeLocationHash
            viewType           : 'list',//needs in view.prototype.changeLocationHash
            collectionLengthUrl: '/payment/salary/totalCollectionLength',
            changedModels      : {},
            responseObj        : {},

            events: {
                "click .newSelectList li.miniStylePagination .next:not(.disabled)": "nextSelect",
                "click .newSelectList li.miniStylePagination .prev:not(.disabled)": "prevSelect",
                "click .itemsNumber"                                              : "switchPageCounter",
                "click .showPage"                                                 : "showPage",
                "change #currentShowPage"                                         : "showPage",
                "click #previousPage"                                             : "previousPage",
                "click #nextPage"                                                 : "nextPage",
                "click .checkbox"                                                 : "checked",
                "click td.editable"                                               : "editRow",
                "mouseover .currentPageList"                                      : "itemsNumber",
                "click"                                                           : "hideItemsNumber",
                "click #firstShowPage"                                            : "firstPage",
                "click #lastShowPage"                                             : "lastPage",
                "click .oe_sortable"                                              : "goSort",
                "change .editable "                                               : "setEditable",
                "click .newSelectList li:not(.miniStylePagination)"               : "chooseOption",
                "focusout .editing"                                               : "onChangeInput",
                "click td:not(.notForm )"                                         : "showDialog"
            },

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
                this.contentCollection = paymentCollection;
            },

            showNewSelect: function (e, prev, next) {
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
                var targetLink = targetElement.find("a");
                var tr = target.parents("tr");
                var modelId = tr.attr('data-id');
                var id = target.attr("id");
                var attr = targetElement.attr("id") || targetElement.attr("data-content");
                var changedAttr;
                var editModel;

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

                targetLink.attr("class", "currentSelected");
                changedAttr.workflow = target.text();

                if (target.attr('data-id') === 'Paid') {
                    targetLink.addClass('done');
                } else {
                    targetLink.addClass('new');
                }
                targetLink.text(target.text());

                this.hideNewSelect();
                this.setEditable(targetElement);

                return false;
            },

            hideNewSelect: function (e) {
                $(".newSelectList").remove();
            },

            isNewRow: function () {
                var newRow = $('#false');

                return !!newRow.length;
            },

            clearNewSelects: function () {
                this.$el.find('ul.newSelectList').remove();
            },

            editRow: function (e, prev, next) {
                var self = this;
                var ul;
                var el = $(e.target);
                var tr = el.closest('tr');
                var td = el.closest('td');
                var modelId = tr.attr('data-id');
                var colType = el.attr('data-type');
                var isDTPicker = colType !== 'input' && el.prop("tagName") !== 'INPUT' && el.data('content') === 'date';
                var tempContainer;
                var width;
                var isWorkflow = td.attr('data-content') === 'workflow';
                var isSelect = colType !== 'input' && el.prop("tagName") !== 'INPUT';
                var editingEl;
                var dataContent;

                if (modelId && el.prop('tagName') !== 'INPUT') {
                    if (this.modelId) {
                        this.setChangedValueToModel();
                    }
                    this.modelId = modelId;
                }

                if (isDTPicker) {
                    tempContainer = (el.text()).trim();
                    el.html('<input class="editing" type="text" value="' + tempContainer + '">');
                    el.find('.editing').datepicker({
                        dateFormat : "d M, yy",
                        changeMonth: true,
                        changeYear : true,
                        onChanged  : self.setChangedValue()
                    }).addClass('datepicker');
                } else if (isWorkflow) {
                    this.clearNewSelects();

                    ul = "<ul class='newSelectList'>" + "<li data-id='Paid'>Paid</li>" + "<li data-id='Draft'>Draft</li></ul>";
                    el.append(ul);
                } else if (isSelect) {
                    populate.showSelect(e, prev, next, this);
                } else {
                    tempContainer = el.text();
                    width = el.width() - 6;
                    el.html('<input class="editing" type="number" value="' + tempContainer + '"  style="width:' + width + 'px">');

                    dataContent = $(el).attr('data-content');
                    editingEl = $(el).find('.editing');

                    if (dataContent === 'month') {
                        editingEl.attr({
                            "min"      : 1,
                            "max"      : 12,
                            "maxLength": 2
                        });
                    } else if (dataContent === 'year') {
                        editingEl.attr({
                            "min"      : 1980,
                            "maxLength": 4
                        });
                    }
                }

                return false;
            },

            onKeyUpInput: function (e) {
                var element = e.target;

                if (element.maxLength && element.value.length > element.maxLength) {
                    element.value = element.value.slice(0, element.maxLength);
                }
            },

            onChangeInput: function (e) {
                var element = e.target;
                var max = parseInt(element.max);
                var min = parseInt(element.min);
                var value = parseInt(element.value);

                if (max && value > max) {
                    element.value = max;
                }

                if (min && value < min) {
                    element.value = min;
                }
            },

            setChangedValue: function () {
                if (!this.changed) {
                    this.changed = true;
                    this.showSaveCancelBtns()
                }
            },

            saveItem: function () {
                var model;
                var modelJSON;

                this.setChangedValueToModel();

                for (var id in this.changedModels) {
                    model = this.editCollection.get(id);
                    modelJSON = model.toJSON();
                    model.changed = this.changedModels[id];
                    model.changed.differenceAmount = this.changedModels[id].paidAmount - this.changedModels[id].paid;
                }
                this.editCollection.save();
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

            resetCollection: function (model) {
                if (model && model._id) {
                    model = new currentModel(model);
                    this.collection.add(model);
                } else {
                    this.collection.set(this.editCollection.models, {remove: false});
                }
                this.bindingEventsToEditedCollection(this);
            },

            bindingEventsToEditedCollection: function (context) {
                if (context.editCollection) {
                    context.editCollection.unbind();
                }
                context.editCollection = new editCollection(context.collection.toJSON());
                context.editCollection.on('saved', context.savedNewModel, context);
                context.editCollection.on('updated', context.updatedOptions, context);
            },

            createItem: function () {
                var now = new Date();
                var cid;
                var year = now.getFullYear();
                var month = now.getMonth() + 1;
                var startData = {
                    year : year,
                    month: month
                };

                var model = new currentModel(startData);
                cid = model.cid;

                startData.cid = cid;

                if (!this.isNewRow()) {
                    this.showSaveCancelBtns();
                    this.editCollection.add(model);

                    new createView(startData);
                }

                this.changed = true;
                this.createdItem = true;
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

            setChangedValueToModel: function () {
                var editedElement = this.$listTable.find('.editing');
                var editedCol;
                var editedElementRowId;
                var editedElementContent;
                var editedElementValue;
                var editPaymentModel;

                if (editedElement.length) {
                    editedCol = editedElement.closest('td');
                    editedElementRowId = editedElement.closest('tr').attr('data-id');
                    editedElementContent = editedCol.attr('data-content');
                    editedElementValue = editedElement.val();

                    editPaymentModel = this.collection.get(editedElementRowId);

                    if (!this.changedModels[editedElementRowId]) {
                        if (editPaymentModel && editPaymentModel.id) {
                            this.changedModels[editedElementRowId] = editPaymentModel.attributes;
                        } else {
                            this.changedModels[editedElementRowId] = {};
                        }
                    }

                    this.changedModels[editedElementRowId][editedElementContent] = editedElementValue;

                    editedCol.text(editedElementValue);
                    editedElement.remove();
                }
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

            isEditRows: function () {
                var edited = this.$listTable.find('.edited');

                this.edited = edited;

                return !!edited.length;
            },

            showPage: function (event) {
                event.preventDefault();
                this.showP(event, {filter: this.filter, newCollection: this.newCollection, sort: this.sort});
            },

            switchPageCounter: function (event) {
                event.preventDefault();
                this.startTime = new Date();
                var itemsNumber = event.target.textContent;
                this.defaultItemsNumber = itemsNumber;
                this.getTotalLength(null, itemsNumber, this.filter);
                this.collection.showMore({
                    count        : itemsNumber,
                    page         : 1,
                    filter       : this.filter,
                    newCollection: this.newCollection
                });
                this.page = 1;
                $("#top-bar-deleteBtn").hide();
                $('#check_all').prop('checked', false);
                this.changeLocationHash(1, itemsNumber, this.filter);
            },

            previousPage: function (event) {
                event.preventDefault();
                $('#check_all').prop('checked', false);
                $("#top-bar-deleteBtn").hide();
                this.prevP({
                    sort            : this.sort,
                    filter          : this.filter,
                    newCollection   : this.newCollection,
                    parrentContentId: this.parrentContentId
                });
                dataService.getData('/supplierPayments/totalCollectionLength', {
                    filter          : this.filter,
                    newCollection   : this.newCollection,
                    parrentContentId: this.parrentContentId,
                    contentType     : this.contentType
                }, function (response, context) {
                    context.listLength = response.count || 0;
                }, this);
            },

            nextPage: function (event) {
                event.preventDefault();
                $('#check_all').prop('checked', false);
                $("#top-bar-deleteBtn").hide();
                this.nextP({
                    sort            : this.sort,
                    filter          : this.filter,
                    newCollection   : this.newCollection,
                    parrentContentId: this.parrentContentId

                });

                dataService.getData('/supplierPayments/totalCollectionLength', {
                    contentType     : this.contentType,
                    filter          : this.filter,
                    newCollection   : this.newCollection,
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
                    sort         : this.sort,
                    filter       : this.filter,
                    newCollection: this.newCollection
                });
                dataService.getData('/supplierPayments/totalCollectionLength', {
                    contentType  : this.contentType,
                    filter       : this.filter,
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
                    sort         : this.sort,
                    filter       : this.filter,
                    newCollection: this.newCollection
                });
                dataService.getData('/supplierPayments/totalCollectionLength', {
                    contentType  : this.contentType,
                    filter       : this.filter,
                    newCollection: this.newCollection
                }, function (response, context) {
                    context.listLength = response.count || 0;
                }, this);
            },  //end first last page in paginations

            checked: function () {
                if (this.collection.length > 0) {
                    var checkLength = $("input.checkbox:checked").length;

                    if ($("input.checkbox:checked").length > 0) {
                        $("#top-bar-deleteBtn").show();
                        $('#check_all').prop('checked', false);

                        if (checkLength == this.collection.length) {
                            $('#check_all').prop('checked', true);
                        }
                    }
                    else {
                        $("#top-bar-deleteBtn").hide();
                        $('#check_all').prop('checked', false);
                    }
                }
            },

            itemsNumber: function (e) {
                $(e.target).closest("button").next("ul").toggle();
                return false;
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

            goSort: function (e) {
                var target$ = $(e.target);
                var currentParrentSortClass = target$.attr('class');
                var sortClass = currentParrentSortClass.split(' ')[1];
                var sortConst = 1;
                var sortBy = target$.attr('data-sort');
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

            fetchSortCollection: function (sortObject) {
                this.sort = sortObject;
                this.collection = new paymentCollection({
                    viewType        : 'list',
                    sort            : sortObject,
                    page            : this.page,
                    count           : this.defaultItemsNumber,
                    filter          : this.filter,
                    parrentContentId: this.parrentContentId,
                    contentType     : this.contentType,
                    newCollection   : this.newCollection
                });
                this.collection.bind('reset', this.renderContent, this);
                this.collection.bind('showmore', this.showMoreContent, this);
            },

            getTotalLength: function (currentNumber, itemsNumber, filter) {
                dataService.getData(this.collectionLengthUrl, {
                    contentType  : this.contentType,
                    currentNumber: currentNumber,
                    filter       : filter,
                    newCollection: this.newCollection
                }, function (response, context) {
                    var page;
                    var length;

                    if (!response.error) {
                        page = context.page || 1;
                        length = context.listLength = response.count || 0;

                        if (itemsNumber * (page - 1) > length) {
                            context.page = page = Math.ceil(length / itemsNumber);
                            context.fetchSortCollection(context.sort);
                            context.changeLocationHash(page, context.defaultItemsNumber, filter);
                        }
                        context.pageElementRender(response.count, itemsNumber, page);//prototype in main.js
                    }
                }, this);
            },

            showMoreContent: function (newModels) {
                var holder = this.$el;
                var itemView;
                var pagenation;

                holder.find("#listTable").empty();
                itemView = new listItemView({
                    collection : newModels,
                    page       : holder.find("#currentShowPage").val(),
                    itemsNumber: holder.find("span#itemsNumber").text()
                });//added two parameters page and items number

                holder.append(itemView.render());

                holder.append(new listTotalView({element: holder.find("#listTable"), cellSpan: 6}).render());

                itemView.undelegateEvents();

                pagenation = holder.find('.pagination');

                if (newModels.length !== 0) {
                    pagenation.show();
                } else {
                    pagenation.hide();
                }

                this.filterView.renderFilterContent();

                $("#top-bar-deleteBtn").hide();
                $('#check_all').prop('checked', false);

                holder.find('#timeRecivingDataFromServer').remove();
                holder.append("<div id='timeRecivingDataFromServer'>Created in " + (new Date() - this.startTime) + " ms</div>");
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

                $currentEl.append(new listTotalView({element: tBody, cellSpan: 6}).render());

                var pagenation = this.$el.find('.pagination');
                if (this.collection.length === 0) {
                    pagenation.hide();
                } else {
                    pagenation.show();
                }
            },

            render: function (options) {
                var self = this;
                var $currentEl = this.$el;
                var pagenation;

                $('.ui-dialog ').remove();

                $currentEl.html('');
                $currentEl.append(_.template(listTemplate));
                $currentEl.append(new listItemView({
                    collection : this.collection,
                    page       : this.page,
                    itemsNumber: this.collection.namberToShow
                }).render());

                $currentEl.append(new listTotalView({element: this.$el.find("#listTable"), cellSpan: 6}).render());

                $('#check_all').click(function () {
                    $(':checkbox').prop('checked', this.checked);

                    if ($("input.checkbox:checked").length > 0) {
                        $("#top-bar-deleteBtn").show();
                    } else {
                        $("#top-bar-deleteBtn").hide();
                    }
                });

                $currentEl.append(_.template(paginationTemplate));

                pagenation = this.$el.find('.pagination');

                if (this.collection.length === 0) {
                    pagenation.hide();
                } else {
                    pagenation.show();
                }

                dataService.getData("/employee/getForDD", null, function (employees) {
                    employees = _.map(employees.data, function (employee) {
                        employee.name = employee.name.first + ' ' + employee.name.last;

                        return employee
                    });

                    self.responseObj['#employee'] = employees;
                });

                dataService.getData("/bonusType/getForDD", null, function (bonusTypes) {
                    self.responseObj['#bonusType'] = bonusTypes.data;
                });

                setTimeout(function () {
                    self.editCollection = new editCollection(self.collection.toJSON());
                    self.editCollection.on('saved', self.savedNewModel, self);
                    self.editCollection.on('updated', self.updatedOptions, self);

                    self.$listTable = $('#listTable');
                }, 10);

                $(document).on("click", function (e) {
                    self.hideNewSelect(e);
                });

                $currentEl.append("<div id='timeRecivingDataFromServer'>Created in " + (new Date() - this.startTime) + " ms</div>");
            },

            showFilteredPage: function (filter) {
                var itemsNumber = $("#itemsNumber").text();
                this.filter = filter;

                this.startTime = new Date();
                this.newCollection = false;

                $("#top-bar-deleteBtn").hide();
                $('#check_all').prop('checked', false);

                this.changeLocationHash(1, itemsNumber, filter);
                this.collection.showMore({count: itemsNumber, page: 1, filter: filter});
                this.getTotalLength(null, itemsNumber, filter);
            },

            deleteItems: function () {
                var $currentEl = this.$el;
                var that = this;
                var mid = 60;
                var model;
                var localCounter = 0;
                var count = $("#listTable input:checked").length;
                var answer;
                var value;

                this.collectionLength = this.collection.length;

                if (!this.changed) {
                    answer = confirm("Really DELETE items ?!");

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
                                    wait   : true,
                                    success: function () {
                                        that.listLength--;
                                        localCounter++;

                                        if (index === count - 1) {
                                            that.triggerDeleteItemsRender(localCounter);
                                        }
                                    },
                                    error  : function (model, res) {
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

            deleteItemsRender: function (deleteCounter, deletePage) {
                var pagenation;
                var holder;

                dataService.getData(this.collectionLengthUrl, {
                    filter       : this.filter,
                    newCollection: this.newCollection
                }, function (response, context) {
                    context.listLength = response.count || 0;
                }, this);
                this.deleteRender(deleteCounter, deletePage, {
                    filter          : this.filter,
                    newCollection   : this.newCollection,
                    parrentContentId: this.parrentContentId
                });

                holder = this.$el;

                if (deleteCounter !== this.collectionLength) {
                    var created = holder.find('#timeRecivingDataFromServer');
                    created.before(new listItemView({
                        collection : this.collection,
                        page       : holder.find("#currentShowPage").val(),
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

            cancelChanges: function () {
                var self = this;
                var edited = this.edited;
                var collection = this.collection;
                var editedCollectin = this.editCollection;
                var copiedCreated;
                var dataId;
                var createItem;

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

                if (this.createdItem) {
                    createItem = this.$el.find('#false');
                    dataId = createItem.data('id');
                    this.editCollection.remove(dataId);
                    delete this.changedModels[dataId];
                    createItem.remove();

                    this.createdItem = false;
                }
            },

            savedNewModel: function (modelObject) {
                var savedRow = this.$listTable.find('#false');
                var modelId;
                var checkbox = savedRow.find('input[type=checkbox]');
                var editedEl = savedRow.find('.editing');
                var editedCol = editedEl.closest('td');

                savedRow.find('[data-content="employee"]').removeClass('editable');
                savedRow.find('[data-content="bonusType"]').removeClass('editable');

                if (modelObject) {
                    modelId = modelObject._id;
                    savedRow.attr("data-id", modelId);
                    checkbox.val(modelId);
                    savedRow.removeAttr('id');
                }

                this.hideSaveCancelBtns();
                editedCol.text(editedEl.val());
                editedEl.remove();
                this.changedModels = {};
                this.resetCollection(modelObject);
            },

            showDialog: function (e) {
                var targetEl = $(e.target);
                var tr = targetEl.closest('tr');
                var id = tr.attr('data-id');
                var requestedUrl = 'payment/' + id;

                dataService.getData(requestedUrl, null, function (response) {
                    if (!response.error) {
                        return new DialogView(response.success);
                    } else {
                        App.render({
                            type   : 'error',
                            message: 'Something went wrong'
                        });
                    }
                });
            }
        });

        return PaymentListView;
    })
;