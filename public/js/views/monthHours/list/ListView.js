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
], function (Backbone, $, _, listViewBase, listTemplate, CreateView, ListItemView, CurrentModel, contentCollection, EditCollection, common, dataService, populate, async, CONSTANTS, cancelEdit, helpers) {
    var monthHoursListView = listViewBase.extend({
        CreateView   : CreateView,
        listTemplate : listTemplate,
        ListItemView : ListItemView,
        contentType  : CONSTANTS.MONTHHOURS,
        responseObj  : {},
        changedModels: {},
        cancelEdit   : cancelEdit,

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
                editedElementValue = editedElement.val();

                editedElementValue = editedElementValue.replace(/\s+/g, '');

                editModel = this.editCollection.get(editedElementRowId);

                if (!this.changedModels[editedElementRowId]) {
                    this.changedModels[editedElementRowId] = {};
                }

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

            $currentEl.append("<div id='timeRecivingDataFromServer'>Created in " + (new Date() - this.startTime) + ' ms</div>');

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
