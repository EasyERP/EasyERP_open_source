define([
    'jQuery',
    'Underscore',
    'text!templates/Pagination/PaginationTemplate.html',
    'text!templates/supplierPayments/list/ListHeader.html',
    'text!templates/supplierPayments/list/ListHeader.html',
    'text!templates/supplierPayments/list/cancelEdit.html',
    'views/selectView/selectView',
    'views/supplierPayments/CreateView',
    'views/Filter/filterView',
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
    'helpers',
    'constants'
], function ($, _, paginationTemplate, listTemplate, ListHeaderForWTrack, cancelEdit, selectView, CreateView, FilterView, CurrentModel, ListItemView, ListTotalView, paymentCollection, EditCollection, dataService, populate, async, keyCodes, ListViewBase, helpers, CONSTANTS) {
    'use strict';

    var PaymentListView = ListViewBase.extend({
        listTemplate     : listTemplate,
        ListItemView     : ListItemView,
        contentCollection: paymentCollection,
        contentType      : 'supplierPayments', // needs in view.prototype.changeLocationHash
        modelId          : null,
        $listTable       : null,
        editCollection   : null,
        changedModels    : {},
        responseObj      : {},
        cancelEdit       : cancelEdit,
        hasPagination    : true,

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
            this.CurrentModel = CurrentModel;

            this.startTime = options.startTime;
            this.collection = options.collection;
            this.parrentContentId = options.collection.parrentContentId;
            this.sort = options.sort;
            this.filter = options.filter;
            this.page = options.collection.currentPage;
            this.contentCollection = paymentCollection;

            ListViewBase.prototype.initialize.call(this, options);
        },

        bindingEventsToEditedCollection: function (context) {
            if (context.editCollection) {
                context.editCollection.unbind();
            }

            context.editCollection = new EditCollection(context.collection.toJSON());
            context.editCollection.on('saved', context.savedNewModel, context);
            context.editCollection.on('updated', context.updatedOptions, context);
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
            var changedAttr;
            var supplier;
            var editModel;

            var element = _.find(this.responseObj[elementType], function (el) {
                return el._id === id;
            });

            if (modelId) {
                editModel = this.editCollection.get(modelId) || {};

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

            this.hide(e);
            this.setEditable(targetElement);

            return false;
        },

        editRow: function (e) {
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
                el.html("<input class='editing' type='text' value=''" + tempContainer + 'readonly/>');
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
                el.html("<input class='editing' type='text' value='" + tempContainer + "' style='width:'" + width + "px'>");

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

        saveItem: function () {
            var model;
            var errors = this.$el.find('.errorContent');
            var id;
            var i;
            var keys = Object.keys(this.changedModels);

            this.setChangedValueToModel();

            for (i = keys.length - 1; i >= 0; i--) {
                id = keys[i];
                model = this.editCollection.get(id) || this.collection.get(id);
                model.changed = this.changedModels[id];
                model.changed.differenceAmount = parseFloat(model.changed.paidAmount || model.paidAmount) - parseFloat(model.changed.paid || model.paid);
            }

            if (errors.length) {
                return;
            }

            this.editCollection.save();
            this.changedModels = {};

            this.deleteEditable();
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

            $currentEl.append(new ListTotalView({
                element : this.$el.find('#listTable'),
                cellSpan: 6,
                wTrack  : true
            }).render());

            // self.renderFilter(self);

            // self.renderPagination($currentEl, self);

            dataService.getData(CONSTANTS.URLS.EMPLOYEES_GETFORDD, null, function (employees) {
                employees = _.map(employees.data, function (employee) {
                    employee.name = employee.name.first + ' ' + employee.name.last;

                    return employee;
                });

                self.responseObj['#employee'] = employees;
            });

            dataService.getData(CONSTANTS.URLS.BONUSTYPE_FORDD, null, function (bonusTypes) {
                self.responseObj['#bonusType'] = bonusTypes.data;
            });

            setTimeout(function () {
                self.editCollection = new EditCollection(self.collection.toJSON());
                self.editCollection.on('saved', self.savedNewModel, self);
                self.editCollection.on('updated', self.updatedOptions, self);

                self.$listTable = $('#listTable');
            }, 10);

            // $currentEl.append("<div id='timeRecivingDataFromServer'>Created in " + (new Date() - this.startTime) + ' ms</div>');
        }
    });

    return PaymentListView;
});
