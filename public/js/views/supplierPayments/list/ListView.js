/**
 * Created by soundstorm on 21.05.15.
 */
define([
        'text!templates/Pagination/PaginationTemplate.html',
        'text!templates/supplierPayments/list/ListHeader.html',
        'text!templates/supplierPayments/forWTrack/ListHeader.html',
        'text!templates/supplierPayments/forWTrack/cancelEdit.html',
        'views/selectView/selectView',
        'views/supplierPayments/CreateView',
        'views/Filter/FilterView',
        'models/PaymentModel',
        'views/supplierPayments/list/ListItemView',
        'views/supplierPayments/list/ListTotalView',
        'collections/supplierPayments/filterCollection',
        'collections/supplierPayments/editCollection',
        'dataService',
        'populate',
        'async',
        'helpers/keyCodeHelper',
        'views/listViewBase',
        'helpers'
    ],
    function (paginationTemplate, listTemplate, ListHeaderForWTrack, cancelEdit, selectView, createView, filterView, currentModel, listItemView, listTotalView, paymentCollection, editCollection, dataService, populate, async, keyCodes, ListViewBase,helpers) {
        var PaymentListView = ListViewBase.extend({
            createView              : createView,
            listTemplate            : listTemplate,
            listItemView            : listItemView,
            contentCollection       : paymentCollection,
            filterView              : filterView,
            contentType             : 'supplierPayments',//needs in view.prototype.changeLocationHash
            modelId                 : null,
            $listTable              : null,
            editCollection          : null,
            totalCollectionLengthUrl: '/payment/supplier/totalCollectionLength',
            changedModels           : {},
            responseObj             : {},

            events: {
                "click td.editable"                                               : "editRow",
                "change .editable"                                               : "setEditable",
                "click .newSelectList li:not(.miniStylePagination)"               : "chooseOption",
                "focusout .editing"                                               : "onChangeInput",
                "keydown .editing"                                                : "onKeyDownInput"
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

            chooseOption: function (e) {
                var target = $(e.target);
                var targetElement = target.parents("td");
                var targetW = targetElement.find("a");
                var tr = target.parents("tr");
                var modelId = tr.attr('data-id');
                var id = target.attr("id");
                var attr = targetElement.attr("id") || targetElement.attr("data-content");
                var elementType = '#' + attr;
                var workflow;
                var changedAttr;
                var supplier;
                var editModel;

                var element = _.find(this.responseObj[elementType], function (el) {
                    return el._id === id;
                });

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

                if (elementType === '#employee') {

                    tr.find('[data-content="employee"]').text(element.name);

                    //supplier = _.clone(editModel.get('supplier'));

                    supplier = element._id;

                    changedAttr.supplier = supplier;
                } else if (elementType === '#bonusType') {
                    tr.find('[data-content="bonusType"]').text(element.name);
                    changedAttr.paymentRef = target.text();
                } else if (elementType === '#workflow') {
                    targetW.attr("class", "currentSelected");
                    changedAttr.workflow = target.text();
                    if (target.attr('data-id') === 'Paid') {
                        targetW.addClass('done');
                    } else {
                        targetW.addClass('new');
                    }
                }
                targetW.text(target.text());

                this.hidePagesPopup(e);
                this.setEditable(targetElement);

                return false;
            },

            isNewRow: function () {
                var newRow = $('#false');

                return !!newRow.length;
            },

            editRow: function (e, prev, next) {
                var self = this;

                var ul;
                var el = $(e.target);
                var tr = $(e.target).closest('tr');
                var td = $(e.target).closest('td');
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
                    el.html('<input class="editing" type="text" value="' + tempContainer + '" readonly>');
                    el.find('.editing').datepicker({
                        dateFormat : "d M, yy",
                        changeMonth: true,
                        changeYear : true,
                        onChanged  : self.setChangedValue()
                    }).addClass('datepicker');
                } else if (isWorkflow) {
                    ul = "<ul class='newSelectList'>" + "<li data-id='Paid'>Paid</li>" + "<li data-id='Draft'>Draft</li></ul>";
                    el.append(ul);
                } else if (isSelect) {
                    this.showNewSelect(e);
                    return false;
                } else {
                    tempContainer = el.text();
                    width = el.width() - 6;
                    el.html('<input class="editing" type="text" value="' + tempContainer + '"  style="width:' + width + 'px">');


                    dataContent = el.attr('data-content');
                    editingEl = el.find('.editing');

                    if (dataContent === 'month') {
                        editingEl.attr("maxLength", "2");
                    } else if (dataContent === 'year') {
                        editingEl.attr("maxLength", "4");
                    }
                }

                return false;
            },

            recalcTotal: function () {
                var paid = 0;
                var amount = 0;
                _.each(this.collection.toJSON(), function (model) {
                    paid += parseFloat(model.paid);
                    amount += parseFloat(model.paidAmount);
                });
                this.$el.find('#totalPaid').text(helpers.currencySplitter(paid.toFixed(2)));
                this.$el.find('#totalAmount').text(helpers.currencySplitter(amount.toFixed(2)));
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

            onKeyDownInput: function (e) {
                var code = e.keyCode;
                if (keyCodes.isEnter(e.keyCode)) {
                    this.setChangedValueToModel();
                } else if ( !keyCodes.isDigitOrDecimalDot(code) && !keyCodes.isBspaceAndDelete(code) ){
                    e.preventDefault();
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

                 //   editPaymentModel = this.collection.get(editedElementRowId);

                    if (!this.changedModels[editedElementRowId]) {
                        /*if (editPaymentModel && editPaymentModel.id) {  // took off for correct work of this.collection
                            this.changedModels[editedElementRowId] = editPaymentModel.attributes;
                        } else {*/
                            this.changedModels[editedElementRowId] = {};
                        /*}*/
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

            render: function (options) {
                $('.ui-dialog ').remove();

                var self = this;
                var $currentEl = this.$el;

                $currentEl.html('');
                $currentEl.append(_.template(ListHeaderForWTrack));
                $currentEl.append(new listItemView({
                    collection : this.collection,
                    page       : this.page,
                    itemsNumber: this.collection.namberToShow
                }).render());

                $currentEl.append(new listTotalView({
                    element : this.$el.find("#listTable"),
                    cellSpan: 6,
                    wTrack  : true
                }).render());

                self.renderFilter(self);


                self.renderCheckboxes();

                self.renderPagination($currentEl, self);

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

                /*$(document).on("click", function (e) {  // on lisViewBase exist
                    self.hidePagesPopup(e);
                });*/

                $currentEl.append("<div id='timeRecivingDataFromServer'>Created in " + (new Date() - this.startTime) + " ms</div>");
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
                    var rowNumber = tr.find('.centerCell').text();
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
                    tr.replaceWith(template({model: model, currencySplitter : helpers.currencySplitter})); // added for work properly
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
            deleteItems: function () {  // method from listViewBase,  cancelChanges added
                var that = this;
                var mid = 39;
                var model;
                var localCounter = 0;
                var listTableCheckedInput;
                var count;
                listTableCheckedInput = $("#listTable").find("input:checked");

                count = listTableCheckedInput.length;
                this.collectionLength = this.collection.length;
                if(!this.createdItem){
                $.each(listTableCheckedInput, function (index, checkbox) {
                    model = that.collection.get(checkbox.value);
                    model.destroy({
                        headers: {
                            mid: mid
                        },
                        wait   : true,
                        success: function () {
                            that.listLength--;
                            localCounter++;
                            count--;
                            if (count === 0) {
                                if (this.hasAlphabet) {
                                    common.buildAphabeticArray(that.collection, function (arr) {
                                        $("#startLetter").remove();
                                        that.alphabeticArray = arr;
                                        $('#searchContainer').after(_.template(aphabeticTemplate, {
                                            alphabeticArray   : that.alphabeticArray,
                                            selectedLetter    : (that.selectedLetter == "" ? "All" : that.selectedLetter),
                                            allAlphabeticArray: that.allAlphabeticArray
                                        }));
                                        var currentLetter = (that.filter) ? that.filter.letter : null;
                                        if (currentLetter) {
                                            $('#startLetter').find('a').each(function () {
                                                var target = $(this);
                                                if (target.text() == currentLetter) {
                                                    target.addClass("current");
                                                }
                                            });
                                        }
                                    });
                                }

                                that.deleteCounter = localCounter;
                                that.deletePage = $("#currentShowPage").val();
                                that.deleteItemsRender(that.deleteCounter, that.deletePage);
                            }
                        },
                        error  : function (model, res) {
                            if (res.status === 403 && index === 0) {
                                App.render({
                                    type: 'error',
                                    message: "You do not have permission to perform this action"
                                });
                            }
                            that.listLength--;
                            count--;
                            if (count === 0) {
                                that.deleteCounter = localCounter;
                                that.deletePage = $("#currentShowPage").val();
                                that.deleteItemsRender(that.deleteCounter, that.deletePage);

                            }
                        }
                    });
                });
                }
                this.cancelChanges();
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
            }
        });

        return PaymentListView;
    })
;