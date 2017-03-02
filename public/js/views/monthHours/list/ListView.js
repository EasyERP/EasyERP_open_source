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
    'helpers',
    'helpers/keyCodeHelper'
], function (Backbone, $, _, listViewBase, listTemplate, CreateView, ListItemView, CurrentModel, contentCollection, EditCollection, common, dataService, populate, async, CONSTANTS, cancelEdit, helpers, keyCodes) {
    var monthHoursListView = listViewBase.extend({
        CreateView   : CreateView,
        listTemplate : listTemplate,
        ListItemView : ListItemView,
        contentType  : CONSTANTS.MONTHHOURS,
        responseObj  : {},
        changedModels: {},
        cancelEdit   : cancelEdit,
        hasPagination: true,

        initialize: function (options) {
            $(document).off('click');

            this.CreateView = CreateView;
            this.CurrentModel = CurrentModel;

            this.startTime = options.startTime;
            this.collection = options.collection;
            this.parrentContentId = options.collection.parrentContentId;
            this.sort = options.sort;
            this.filter = options.filter;
            this.page = options.collection.currentPage;
            this.contentCollection = contentCollection;

            listViewBase.prototype.initialize.call(this, options);
        },

        events: {
            'click td.editable'    : 'editRow',
            'click .oe_sortable'   : 'goSort',
            'change .editable'     : 'setEditable',
            //'change .editing'      : 'onChangeInput',
            'keydown input.editing': 'keyDown'
        },

        keyDown: function (e) {
            var code = e.keyCode;
            if (keyCodes.isEnter(e.keyCode)) {
                if (navigator.userAgent.indexOf('Firefox') > -1) {
                    this.setEditable(e);
                }
                this.setChangedValueToModel();
            } else if (!keyCodes.isDigitOrDecimalDot(code) && !keyCodes.isBspaceAndDelete(code)) {
                e.preventDefault();
            }
        },

        saveItem: function () {
            var model;
            var id;
            var errors;

            this.setChangedValueToModel();

            errors = this.$el.find('.errorContent');

            for (id in this.changedModels) {
                model = this.editCollection.get(id) || this.collection.get(id);
                model.changed = this.changedModels[id];
            }

            if (errors.length) {
                return false;
            }

            this.editCollection.save();
            this.changedModels = {};

            this.deleteEditable();
        },

        createItem: function () {
            var CreateView = this.CreateView || Backbone.View.extend({});
            var startData = {};
            var cid;
            var model;

            this.CurrentModel = this.CurrentModel || Backbone.Model.extend();
            model = new this.CurrentModel();

            cid = model.cid;

            startData.cid = cid;

            if (this.editCollection) {
                this.changed = true;
                this.showSaveCancelBtns();
                this.editCollection.add(model);
            }

            return new CreateView(model);
        },

        onChangeInput: function ($element) {
            var max = parseInt($element.attr('data-max'), 10);
            var min = parseInt($element.attr('data-min'), 10);
            var value = parseInt($element.val(), 10);

            if (max && value > max) {
                $element.val(max);
            }

            if (min && value < min) {
                $element.val(min);
            }
        },

        bindingEventsToEditedCollection: function (context) {
            if (context.editCollection) {
                context.editCollection.unbind();
            }

            context.editCollection = new EditCollection(context.collection.toJSON());
            context.editCollection.on('saved', context.savedNewModel, context);
            context.editCollection.on('updated', context.updatedOptions, context);
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
                editedElementRowId = editedElement.closest('tr').attr('data-id');
                editedElementContent = editedCol.data('content');

                editModel = this.editCollection.get(editedElementRowId);

                if (!this.changedModels[editedElementRowId]) {
                    this.changedModels[editedElementRowId] = {};
                }

                this.onChangeInput(editedElement);

                editedElementValue = editedElement.val();

                editedElementValue = editedElementValue.replace(/\s+/g, '');

                this.changedModels[editedElementRowId][editedElementContent] = editedElementValue;

                if (editedElementValue) {
                    editedCol.removeClass('errorContent');
                }

                if (editedElementContent !== 'year') {
                    editedCol.text(helpers.currencySplitter(editedElementValue));
                } else {
                    editedCol.text(editedElementValue);
                }
                editedElement.remove();
            }
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
            var adminExpenses;
            var vacationExpenses;
            var idleExpenses;
            var adminSalary;
            var marketingBudget;
            var dataContent;
            var editingEl;

            e.stopPropagation();

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
                    adminExpenses = result.adminExpenses;
                    vacationExpenses = result.vacationExpenses;
                    idleExpenses = result.idleExpenses;
                    adminSalary = result.adminSalary;
                    actualHours = result.actualHours;
                    marketingBudget = result.marketingBudget;

                    if (result.error) {
                        return App.render({message: 'Some error'});
                    }

                    if (tr.find('.editing').length) {
                        tr.find('[data-content="adminBudget"]').find('.editing').val(helpers.currencySplitter((adminExpenses / 100).toFixed(2)));
                        tr.find('[data-content="vacationBudget"]').find('.editing').val(helpers.currencySplitter((vacationExpenses / 100).toFixed(2)));
                        tr.find('[data-content="idleBudget"]').find('.editing').val(helpers.currencySplitter((idleExpenses / 100).toFixed(2)));
                        tr.find('[data-content="adminSalaryBudget"]').find('.editing').val(helpers.currencySplitter((adminSalary / 100).toFixed(2)));
                        tr.find('[data-content="marketingBudget"]').find('.editing').val(helpers.currencySplitter((marketingBudget / 100).toFixed(2)));
                        tr.find('[data-content="actualHours"]').find('.editing').val(helpers.currencySplitter(actualHours.toFixed()));
                    } else {
                        tr.find('[data-content="adminBudget"]').text(helpers.currencySplitter((adminExpenses / 100).toFixed(2)));
                        tr.find('[data-content="vacationBudget"]').text(helpers.currencySplitter((vacationExpenses / 100).toFixed(2)));
                        tr.find('[data-content="idleBudget"]').text(helpers.currencySplitter((idleExpenses / 100).toFixed(2)));
                        tr.find('[data-content="marketingBudget"]').text(helpers.currencySplitter((marketingBudget / 100).toFixed(2)));
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
                    self.changedModels[mothHoursId].marketingBudget = parseFloat((marketingBudget / 100).toFixed(2));
                    self.changedModels[mothHoursId].actualHours = actualHours;

                    editModel = self.editCollection.get(mothHoursId);

                    estimatedHours = changedModels.estimatedHours || editModel.get('estimatedHours');
                    adminBudget = changedModels.adminBudget || editModel.get('adminBudget');
                    adminSalaryBudget = changedModels.adminSalaryBudget || editModel.get('adminSalaryBudget');
                    vacationBudget = changedModels.vacationBudget || editModel.get('vacationBudget');
                    idleBudget = changedModels.idleBudget || editModel.get('idleBudget');
                    marketingBudget = changedModels.marketingBudget || editModel.get('marketingBudget');
                    actualHours = changedModels.actualHours || editModel.get('actualHours');
                    hours = actualHours || estimatedHours;
                    sumBudget = parseFloat(adminExpenses) + parseFloat(vacationExpenses) + parseFloat(idleExpenses) + parseFloat(adminSalary) + parseFloat(marketingBudget);

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

                    dataContent = el.attr('data-content');
                    editingEl = el.find('.editing');

                    if (dataContent === 'month') {
                        editingEl.attr('maxLength', '2');
                        editingEl.attr('data-max', 12);
                        editingEl.attr('data-min', 1);
                    } else if ((dataContent === 'year') || (dataContent === 'hours')) {
                        editingEl.attr('maxLength', '4');
                    }
                });
            } else if (colType) {
                tempContainer = el.text();
                width = el.width() - 6;
                el.html('<input class="editing" type="text" value="' + tempContainer + '"  style="width:' + width + 'px">');

                dataContent = el.attr('data-content');
                editingEl = el.find('.editing');

                if (dataContent === 'month') {
                    editingEl.attr('maxLength', '2');
                    editingEl.attr('data-max', 12);
                    editingEl.attr('data-min', 1);
                } else if ((dataContent === 'year') || (dataContent === 'hours')) {
                    editingEl.attr('maxLength', '4');
                }
            }

            return false;
        },

        savedNewModel: function (modelObject) {
            var savedRow = this.$el.find('#listTable').find('#false');
            var modelId;
            var checkbox = savedRow.find('input[type=checkbox]');

            if (modelObject) {
                modelId = modelObject._id;
                savedRow.attr('data-id', modelId);
                checkbox.val(modelId);
                checkbox.attr('id', modelId);
                savedRow.removeAttr('id');
            }

            this.hideSaveCancelBtns();
            this.resetCollection(modelObject);
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

            // this.renderPagination($currentEl, this);

            // $currentEl.append("<div id='timeRecivingDataFromServer'>Created in " + (new Date() - this.startTime) + ' ms</div>');

            setTimeout(function () {
                self.editCollection = new EditCollection(self.collection.toJSON());
                self.editCollection.on('saved', self.savedNewModel, self);
                self.editCollection.on('updated', self.updatedOptions, self);

                self.$listTable = $('#listTable');
            }, 10);

            return this;
        }
    });

    return monthHoursListView;
});
