define([
    'jQuery',
    'Underscore',
    'text!templates/Pagination/PaginationTemplate.html',
    'text!templates/DividendPayments/list/ListTemplate.html',
    'text!templates/DividendPayments/list/ListHeader.html',
    'text!templates/supplierPayments/list/cancelEdit.html',
    'views/selectView/selectView',
    'views/supplierPayments/CreateView',
    'views/Filter/FilterView',
    'models/PaymentModel',
    'views/DividendPayments/list/ListItemView',
    'views/DividendPayments/list/ListTotalView',
    'collections/DividendPayments/filterCollection',
    'collections/DividendPayments/editCollection',
    'dataService',
    'populate',
    'async',
    'helpers/keyCodeHelper',
    'views/listViewBase',
    'helpers',
    'constants'
], function ($, _,
             paginationTemplate,
             listTemplate,
             ListHeaderForWTrack,
             cancelEdit,
             selectView,
             CreateView,
             filterView,
             CurrentModel,
             ListItemView,
             listTotalView,
             paymentCollection,
             EditCollection,
             dataService,
             populate,
             async,
             keyCodes,
             ListViewBase,
             helpers,
             CONSTANTS) {
    var PaymentListView = ListViewBase.extend({
        listTemplate     : listTemplate,
        ListItemView     : ListItemView,
        contentCollection: paymentCollection,
        filterView       : filterView,
        contentType      : 'DividendPayments',
        modelId          : null,
        $listTable       : null,
        EditCollection   : null,
        changedModels    : {},
        responseObj      : {},

        events: {
            'click td.editable'                                : 'editRow',
            'change .editable'                                 : 'setEditable',
            'click .newSelectList li:not(.miniStylePagination)': 'chooseOption',
            'focusout .editing'                                : 'onChangeInput',
            'keydown .editing'                                 : 'onKeyDownInput'
        },

        initialize: function (options) {
            $(document).off('click');

            this.CreateView = CreateView;

            this.startTime = options.startTime;
            this.collection = options.collection;
            this.parrentContentId = options.collection.parrentContentId;
            this.sort = options.sort;
            this.filter = options.filter;
            this.page = options.collection.currentPage;
            this.contentCollection = paymentCollection;

            this.render();
        },

        chooseOption: function (e) {
            var target = $(e.target);
            var targetElement = target.parents('td');
            var targetW = targetElement.find('a');
            var tr = target.parents('tr');
            var modelId = tr.attr('data-id');
            var id = target.attr('id');
            var attr = targetElement.attr('id') || targetElement.attr('data-content');
            var elementType = '#' + attr;
            var workflow;
            var changedAttr;
            var supplier;
            var editModel;

            var element = _.find(this.responseObj[elementType], function (el) {
                return el._id === id;
            });

            if (modelId) {
                editModel = this.EditCollection.get(modelId);

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

                supplier = element._id;

                changedAttr.supplier = supplier;
            } else if (elementType === '#bonusType') {
                tr.find('[data-content="bonusType"]').text(element.name);
                changedAttr.paymentRef = target.text();
            } else if (elementType === '#workflow') {
                targetW.attr('class', 'currentSelected');
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
            var isDTPicker = colType !== 'input' && el.prop('tagName') !== 'INPUT' && el.data('content') === 'date';
            var tempContainer;
            var width;
            var isWorkflow = td.attr('data-content') === 'workflow';
            var isSelect = colType !== 'input' && el.prop('tagName') !== 'INPUT';
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
                el.html("<input class='editing' type='text' value='" + tempContainer + " ' readonly>");
                el.find('.editing').datepicker({
                    dateFormat : 'd M, yy',
                    changeMonth: true,
                    changeYear : true,
                    onChanged  : self.setChangedValue()
                }).addClass('datepicker');
            } else if (isWorkflow) {
                ul = "<ul class='newSelectList'>' + '<li data-id='Paid'>Paid</li>' + '<li data-id='Draft'>Draft</li></ul>";
                el.append(ul);
            } else if (isSelect) {
                this.showNewSelect(e);
                return false;
            } else {
                tempContainer = el.text();
                width = el.width() - 6;
                el.html("<input class='editing' type='text' value='" + tempContainer + "'  style='width:" + width + "px' > ");

                dataContent = el.attr('data-content');
                editingEl = el.find('.editing');

                if (dataContent === 'month') {
                    editingEl.attr('maxLength', '2');
                } else if (dataContent === 'year') {
                    editingEl.attr('maxLength', '4');
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
            } else if (!keyCodes.isDigitOrDecimalDot(code) && !keyCodes.isBspaceAndDelete(code)) {
                e.preventDefault();
            }
        },

        onChangeInput: function (e) {
            var element = e.target;
            var max = parseInt(element.max, 10);
            var min = parseInt(element.min, 10);
            var value = parseInt(element.value, 10);

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
                this.showSaveCancelBtns();
            }
        },

        saveItem: function () {
            var self = this;
            var model;
            var errors = this.$el.find('.errorContent');
            var keys = Object.keys(this.changedModels);
            var changedModelsId;

            this.setChangedValueToModel();

            keys.forEach(function (id) {
                changedModelsId = self.changedModels[id];
                model = self.EditCollection.get(id) || self.collection.get(id);
                model.changed = changedModelsId;
                model.changed.differenceAmount = parseFloat(changedModelsId.paidAmount) - parseFloat(changedModelsId.paid);
            });

            if (errors.length) {
                return;
            }

            this.EditCollection.save();

            keys.forEach(function (id) {
                delete self.changedModels[id];
                self.EditCollection.remove(id);
            });
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
                model = new CurrentModel(model);
                this.collection.add(model);
            } else {
                this.collection.set(this.EditCollection.models, {remove: false});
            }
            this.bindingEventsToEditedCollection(this);
        },

        bindingEventsToEditedCollection: function (context) {
            if (context.EditCollection) {
                context.EditCollection.unbind();
            }
            context.EditCollection = new EditCollection(context.collection.toJSON());
            context.EditCollection.on('saved', context.savedNewModel, context);
            context.EditCollection.on('updated', context.updatedOptions, context);
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

            var model = new CurrentModel(startData);
            cid = model.cid;

            startData.cid = cid;

            if (!this.isNewRow()) {
                this.showSaveCancelBtns();
                this.EditCollection.add(model);

                new CreateView(startData);
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
            var editModel;
            var editValue;

            if (editedElement.length) {
                editedCol = editedElement.closest('td');
                editedElementRowId = editedElement.closest('tr').data('id');
                editedElementContent = editedCol.data('content');
                editedElementValue = editedElement.val();

                if (editedElementRowId.length >= 24) {
                    editModel = this.collection.get(editedElementRowId) || this.EditCollection.get(editedElementRowId);
                    editValue = editModel.get(editedElementContent);

                    if (editedElementValue !== editValue) {
                        if (!this.changedModels[editedElementRowId]) {
                            this.changedModels[editedElementRowId] = {};
                        }
                        this.changedModels[editedElementRowId][editedElementContent] = editedElementValue;
                    }
                } else {
                    if (!this.changedModels[editedElementRowId]) {
                        this.changedModels[editedElementRowId] = {};
                    }
                    this.changedModels[editedElementRowId][editedElementContent] = editedElementValue;
                }
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

        render: function () {
            var self = this;
            var $currentEl = this.$el;

            $('.ui-dialog ').remove();

            $currentEl.html('');
            $currentEl.append(_.template(ListHeaderForWTrack));
            $currentEl.append(new ListItemView({
                collection : this.collection,
                page       : this.page,
                itemsNumber: this.collection.namberToShow
            }).render());

            $currentEl.append(new listTotalView({
                element : this.$el.find('#listTable'),
                cellSpan: 4,
                wTrack  : true
            }).render());

            self.renderFilter(self);
            
            self.renderPagination($currentEl, self);

            dataService.getData(CONSTANTS.URLS.EMPLOYEES_GETFORDD, null, function (employees) {
                employees = _.map(employees.data, function (employee) {
                    employee.name = employee.name.first + ' ' + employee.name.last;

                    return employee;
                });

                self.responseObj['#employee'] = employees;
            });

            dataService.getData('/bonusType/getForDD', null, function (bonusTypes) {
                self.responseObj['#bonusType'] = bonusTypes.data;
            });

            setTimeout(function () {
                self.EditCollection = new EditCollection(self.collection.toJSON());
                self.EditCollection.on('saved', self.savedNewModel, self);
                self.EditCollection.on('updated', self.updatedOptions, self);

                self.$listTable = $('#listTable');
            }, 10);

            $currentEl.append('<div id="timeRecivingDataFromServer">Created in ' + (new Date() - this.startTime) + ' ms</div>');
        },

        triggerDeleteItemsRender: function (deleteCounter) {
            this.deleteCounter = deleteCounter;
            this.deletePage = $('#currentShowPage').val();

            this.deleteItemsRender(deleteCounter, this.deletePage);
        },

        cancelChanges: function () {
            var self = this;
            var edited = this.edited;
            var collection = this.collection;
            var createItem;
            var dataId;

            async.each(edited, function (el, cb) {
                var tr = $(el).closest('tr');
                var rowNumber = tr.find('[data-content="number"]').text();
                var id = tr.attr('data-id');
                var template = _.template(cancelEdit);
                var model;

                if (!id || id.length < 24) {
                    return cb('Empty id');
                }

                model = self.EditCollection.get(id) || collection.get(id);
                model = model.toJSON();
                model.startNumber = rowNumber;
                tr.replaceWith(template({model: model, currencySplitter: helpers.currencySplitter}));

                delete self.changedModels[id];

                cb();
            }, function (err) {
                if (!err) {
                    self.bindingEventsToEditedCollection(self);
                }
                self.hideSaveCancelBtns();
            });

            if (this.createdItem) {
                createItem = this.$el.find('#false');
                dataId = createItem.data('id');
                this.EditCollection.remove(dataId);
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
            listTableCheckedInput = $('#listTable').find('input:checked');

            count = listTableCheckedInput.length;
            this.collectionLength = this.collection.length;
            if (!this.createdItem) {
                async.eachSeries(listTableCheckedInput, function (checkbox, cb) {
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

                                that.deleteCounter = localCounter;
                                that.deletePage = $('#currentShowPage').val();
                                that.deleteItemsRender(that.deleteCounter, that.deletePage);
                            }

                            cb();
                        },

                        error: function (model, res) {
                            if (res.status === 403/* && index === 0 comment after unit tests */) {
                                App.render({
                                    type   : 'error',
                                    message: 'You do not have permission to perform this action'
                                });
                            }
                            that.listLength--;
                            count--;
                            if (count === 0) {
                                that.deleteCounter = localCounter;
                                that.deletePage = $('#currentShowPage').val();
                                that.deleteItemsRender(that.deleteCounter, that.deletePage);

                            }

                            cb();
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
                savedRow.attr('data-id', modelId);
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
});
