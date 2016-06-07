define([
    'Backbone',
    'jQuery',
    'Underscore',
    'views/listViewBase',
    'text!templates/monthHours/list/listHeader.html',
    'views/monthHours/CreateView',
    'views/monthHours/list/ListItemView',
    'models/MonthHoursModel',
    'collections/monthHours/filterCollection',
    'collections/monthHours/editCollection',
    'common',
    'dataService',
    'populate',
    'async',
    'constants',
    'text!templates/monthHours/list/cancelEdit.html',
    'helpers'
], function (Backbone, $, _, listViewBase, listTemplate, CreateView, ListItemView, currentModel, contentCollection, EditCollection, common, dataService, populate, async, CONSTANTS, cancelEdit, helpers) {
    var monthHoursListView = listViewBase.extend({
        CreateView   : CreateView,
        listTemplate : listTemplate,
        ListItemView : ListItemView,
        contentType  : CONSTANTS.MONTHHOURS,
        responseObj  : {},
        changedModels: {},

        initialize: function (options) {
            $(document).off('click');

            this.CreateView = CreateView;

            this.startTime = options.startTime;
            this.collection = options.collection;
            this.parrentContentId = options.collection.parrentContentId;
            this.sort = options.sort;
            this.filter = options.filter;
            this.page = options.collection.currentPage;
            this.contentCollection = contentCollection;

            this.render();
        },

        events: {
            'click td.editable'    : 'editRow',
            'click .oe_sortable'   : 'goSort',
            'change .editable'     : 'setEditable',
            'keydown input.editing': 'keyDown'
        },

        keyDown: function (e) {
            if (e.which === 13) {
                if (navigator.userAgent.indexOf('Firefox') > -1) {
                    this.setEditable(e);
                }

                this.setChangedValueToModel();
            }

        },

        setChangedValueToModel: function () {
            var editedElement = this.$listTable.find('.editing');
            var editedCol;
            var editedElementRowId;
            var editedElementContent;
            var editedElementValue;
            var editModel;

            if (editedElement.length) {
                editedCol = editedElement.closest('td');
                editedElementRowId = editedElement.closest('tr').data('id');
                editedElementContent = editedCol.data('content');
                editedElementValue = editedElement.val();

                editedElementValue = editedElementValue.replace(/\s+/g, '');

                editModel = this.editCollection.get(editedElementRowId);

                if (!this.changedModels[editedElementRowId]) {
                    this.changedModels[editedElementRowId] = {};
                }

                this.changedModels[editedElementRowId][editedElementContent] = editedElementValue;

                if (editedElementContent !== 'year') {
                    editedCol.text(helpers.currencySplitter(editedElementValue));
                } else {
                    editedCol.text(editedElementValue);
                }
                editedElement.remove();
            }
        },

        setEditable: function (td) {
            if (!td.parents) {
                td = $(td.target).closest('td');
            }

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

        editRow: function (e, prev, next) {
            var self = this;
            var el = $(e.target);
            var tr = $(e.target).closest('tr');
            var mothHoursId = tr.data('id');
            var colType = el.data('type');
            var isSelect = colType !== 'input' && el.prop('tagName') !== 'INPUT';
            var tempContainer;
            var width;
            var month = parseInt(tr.find('[data-content="month"]').text(), 10);
            var year = parseInt(tr.find('[data-content="year"]').text(), 10);
            var changedModels;
            var estimatedHours;
            var adminBudget;
            var adminSalaryBudget;
            var vacationBudget;
            var idleBudget;
            var actualHours;
            var sumBudget;
            var hours;
            var editModel;

            if (mothHoursId && el.prop('tagName') !== 'INPUT') {
                if (this.modelId) {
                    this.setChangedValueToModel();
                }
                this.modelId = mothHoursId;
            }

            if (isSelect) {
                populate.showSelect(e, prev, next, this);
            } else if (year && month) {
                dataService.getData('journalEntries/getExpenses', {
                    month: month,
                    year : year
                }, function (result) {
                    var adminExpenses = result.adminExpenses;
                    var vacationExpenses = result.vacationExpenses;
                    var idleExpenses = result.idleExpenses;
                    var adminSalary = result.adminSalary;
                    var actualHours = result.actualHours;

                    if (result.error) {
                        return alert('error');
                    }

                    if (tr.find('.editing').length) {
                        tr.find('[data-content="adminBudget"]').find('.editing').val(helpers.currencySplitter((adminExpenses / 100).toFixed(2)));
                        tr.find('[data-content="vacationBudget"]').find('.editing').val(helpers.currencySplitter((vacationExpenses / 100).toFixed(2)));
                        tr.find('[data-content="idleBudget"]').find('.editing').val(helpers.currencySplitter((idleExpenses / 100).toFixed(2)));
                        tr.find('[data-content="adminSalaryBudget"]').find('.editing').val(helpers.currencySplitter((adminSalary / 100).toFixed(2)));
                        tr.find('[data-content="actualHours"]').find('.editing').val(helpers.currencySplitter(actualHours.toFixed()));
                    } else {
                        tr.find('[data-content="adminBudget"]').text(helpers.currencySplitter((adminExpenses / 100).toFixed(2)));
                        tr.find('[data-content="vacationBudget"]').text(helpers.currencySplitter((vacationExpenses / 100).toFixed(2)));
                        tr.find('[data-content="idleBudget"]').text(helpers.currencySplitter((idleExpenses / 100).toFixed(2)));
                        tr.find('[data-content="adminSalaryBudget"]').text(helpers.currencySplitter((adminSalary / 100).toFixed(2)));
                        tr.find('[data-content="actualHours"]').text(helpers.currencySplitter(actualHours.toFixed()));
                    }

                    changedModels = self.changedModels[mothHoursId] || {};

                    if (!self.changedModels[mothHoursId]) {
                        self.changedModels[mothHoursId] = {};
                    }

                    self.changedModels[mothHoursId].adminBudget = parseFloat((adminExpenses / 100).toFixed(2));
                    self.changedModels[mothHoursId].vacationBudget = parseFloat((vacationExpenses / 100).toFixed(2));
                    self.changedModels[mothHoursId].idleBudget = parseFloat((idleExpenses / 100).toFixed(2));
                    self.changedModels[mothHoursId].adminSalaryBudget = parseFloat((adminSalary / 100).toFixed(2));
                    self.changedModels[mothHoursId].actualHours = actualHours;

                    editModel = self.editCollection.get(mothHoursId);

                    estimatedHours = changedModels.estimatedHours || editModel.get('estimatedHours');
                    adminBudget = changedModels.adminBudget || editModel.get('adminBudget');
                    adminSalaryBudget = changedModels.adminSalaryBudget || editModel.get('adminSalaryBudget');
                    vacationBudget = changedModels.vacationBudget || editModel.get('vacationBudget');
                    idleBudget = changedModels.idleBudget || editModel.get('idleBudget');
                    actualHours = changedModels.actualHours || editModel.get('actualHours');
                    hours = actualHours || estimatedHours;
                    sumBudget = parseFloat(adminExpenses) + parseFloat(vacationExpenses) + parseFloat(idleExpenses) + parseFloat(adminSalary);

                    if (isFinite(sumBudget / 100 / actualHours)) {
                        self.changedModels[mothHoursId].overheadRate = sumBudget / 100 / actualHours;
                        tr.find('[data-content="overheadRate"]').text(helpers.currencySplitter(self.changedModels[mothHoursId].overheadRate.toFixed(2)));
                    } else {
                        self.changedModels[mothHoursId].overheadRate = 0;
                        tr.find('[data-content="overheadRate"]').text(0);
                    }

                    tempContainer = el.text();
                    width = el.width() - 6;
                    el.html('<input class="editing" type="text" value="' + tempContainer + '"  style="width:' + width + 'px">');
                });
            } else {
                tempContainer = el.text();
                width = el.width() - 6;
                el.html('<input class="editing" type="text" value="' + tempContainer + '"  style="width:' + width + 'px">');
            }

            return false;
        },

        saveItem: function () {
            var self = this;
            var model;
            var errors = this.$el.find('.errorContent');
            var keys = Object.keys(this.changedModels);

            var filled = true;

            $('.editable').each(function (index, elem) {
                if (!$(elem).html()) {
                    filled = false;
                    return false;
                }
            });

            if (!filled) {
                return App.render({type: 'error', message: 'Fill all fields please'});
            }

            this.setChangedValueToModel();

            keys.forEach(function (id) {
                model = self.editCollection.get(id) || self.collection.get(id);
                model.changed = self.changedModels[id];
            });

            if (errors.length) {
                return;
            }
            this.editCollection.save();

            keys.forEach(function (id) {
                delete self.changedModels[id];
                self.editCollection.remove(id);
            });
        },

        render: function () {
            var self;
            var $currentEl;

            $('.ui-dialog ').remove();

            self = this;
            $currentEl = this.$el;

            $currentEl.html('');
            $currentEl.append(_.template(listTemplate));
            $currentEl.append(new ListItemView({
                collection : this.collection,
                page       : this.page,
                itemsNumber: this.collection.namberToShow
            }).render()); // added two parameters page and items number

            this.renderPagination($currentEl, this);

            $currentEl.append("<div id='timeRecivingDataFromServer'>Created in " + (new Date() - this.startTime) + " ms</div>");

            setTimeout(function () {
                self.editCollection = new EditCollection(self.collection.toJSON());
                self.editCollection.on('saved', self.savedNewModel, self);
                self.editCollection.on('updated', self.updatedOptions, self);

                self.$listTable = $('#listTable');
            }, 10);

            return this;
        },

        setChangedValue: function () {
            if (!this.changed) {
                this.changed = true;
                this.showSaveCancelBtns();
            }
        },

        isNewRow: function () {
            var newRow = $('#false');

            return !!newRow.length;
        },

        createItem: function () {
            var startData = {};

            var model = new currentModel(startData);

            startData.cid = model.cid;

            if (!this.isNewRow()) {
                this.showSaveCancelBtns();
                this.editCollection.add(model);

                new CreateView(startData);
            }

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

        cancelChanges: function () {
            var self = this;
            var edited = this.edited;
            var collection = this.collection;
            var copiedCreated;
            var dataId;

            async.each(edited, function (el, cb) {
                var tr = $(el).closest('tr');
                var trId = tr.attr('id');
                var rowNumber = tr.find('[data-content="number"]').text();
                var id = tr.attr('data-id');
                var template = _.template(cancelEdit);
                var model;

                if (!id || (id.length < 24)) {
                    self.hideSaveCancelBtns();
                    return cb('Empty id');
                }

                model = collection.get(id);
                model = model.toJSON();
                model.startNumber = rowNumber;

                if (!trId) {
                    tr.replaceWith(template({model: model, currencySplitter: helpers.currencySplitter}));
                } else {
                    tr.remove();
                }
                cb();
            }, function (err) {
                self.hideSaveCancelBtns();
                if (!err) {
                    self.editCollection = new EditCollection(collection.toJSON());
                    self.editCollection.on('saved', self.savedNewModel, self);
                    self.editCollection.on('updated', self.updatedOptions, self);
                }
            });

            copiedCreated = this.$el.find('#false');
            dataId = copiedCreated.attr('data-id');
            this.editCollection.remove(dataId);
            delete this.changedModels[dataId];
            copiedCreated.remove();

            this.createdCopied = false;

            self.changedModels = {};
        }

    });

    return monthHoursListView;
});
