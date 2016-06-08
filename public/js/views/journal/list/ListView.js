define([
    'jQuery',
    'Underscore',
    'views/listViewBase',
    'views/selectView/selectView',
    'text!templates/journal/list/cancelEdit.html',
    'text!templates/journal/list/ListHeader.html',
    'text!templates/journal/list/ListTemplate.html',
    'views/journal/list/ListItemView',
    'views/journal/CreateView',
    'models/JournalModel',
    'collections/journal/filterCollection',
    'collections/journal/editCollection',
    'dataService',
    'async'
], function ($, _, listViewBase, SelectView, cancelEdit, listHeaderTemplate, listTemplate, ListItemView, CreateView, CurrentModel, contentCollection, EditCollection, dataService, async) {
    'use strict';

    var ListView = listViewBase.extend({
        listTemplate     : listTemplate,
        ListItemView     : ListItemView,
        CurrentModel     : CurrentModel,
        EditCollection   : EditCollection,
        contentCollection: contentCollection,
        contentType      : 'journal',
        changedModels    : {},
        responseObj      : {},

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
            'click td.editable'                                : 'editRow',
            'click .newSelectList li:not(.miniStylePagination)': 'chooseOption',
            'change .editable'                                 : 'setEditable',
            'click .checkbox'                                  : 'checked',
            'keydown input.editing '                           : 'keyDown'
        },

        setChangedValueToModel: function () {
            var editedElement = this.$listTable.find('.editing');
            var editedCol;
            var editedElementRowId;
            var editedElementContent;
            var editedElementValue;

            if (editedElement.length) {
                editedCol = editedElement.closest('td');
                editedElementRowId = editedElement.closest('tr').data('id');
                editedElementContent = editedCol.data('content');
                editedElementValue = editedElement.val();

                if (!this.changedModels[editedElementRowId]) {
                    this.changedModels[editedElementRowId] = {};
                }

                if (editedElementContent === 'name') {
                    if (!editedElementValue.length) {
                        editedElement.addClass('errorContent');

                        return App.render({
                            type   : 'error',
                            message: "Journal Name field can't be empty."
                        });
                    }

                    editedElement.removeClass('errorContent');
                }

                this.changedModels[editedElementRowId][editedElementContent] = editedElementValue;

                editedCol.text(editedElementValue);
                editedElement.remove();
            }
        },

        chooseOption: function (e) {
            var target = $(e.target);
            var targetElement = target.parents('td');
            var tr = target.parents('tr');
            var id = target.attr('id');
            var modelId = tr.attr('data-id');
            var attr = targetElement.data('content');
            var elementType = '#' + attr;
            var changedAttr;

            var element = _.find(this.responseObj[elementType], function (el) {
                return el._id === id;
            });

            var editModel = this.EditCollection.get(modelId) || this.collection.get(modelId);

            if (!this.changedModels[modelId]) {
                if (!editModel.id) {
                    this.changedModels[modelId] = editModel.attributes;
                } else {
                    this.changedModels[modelId] = {};
                }
            }

            changedAttr = this.changedModels[modelId];

            if (attr === 'transaction') {
                changedAttr.transaction = target.text();
            } else if (attr === 'debitAccount') {
                changedAttr.debitAccount = element._id;
            } else if (attr === 'creditAccount') {
                changedAttr.creditAccount = element._id;
            }

            targetElement.text(target.text());

            this.hide(e);
            this.setEditable(targetElement);

            return false;
        },

        render: function () {
            var $currentEl;
            var itemView;
            var self = this;
            var template;

            $('.ui-dialog ').remove();

            $('#top-bar-deleteBtn').hide();

            template = _.template(listTemplate);
            $currentEl = this.$el;

            $currentEl.html('');
            $currentEl.html(_.template(listHeaderTemplate));

            this.hideSaveCancelBtns();

            itemView = new ListItemView({
                collection : this.collection,
                itemsNumber: this.collection.namberToShow
            });

            $currentEl.append(itemView.render());// added two parameters page and items number

            this.renderPagination($currentEl, this);

            $currentEl.append('<div id="timeRecivingDataFromServer">Created in ' + (new Date() - this.startTime) + ' ms</div>');

            dataService.getData('/chartOfAccount/getForDd', {}, function (debitAccount) {
                debitAccount = _.map(debitAccount.data, function (debit) {
                    debit.name = debit.name;
                    debit._id = debit._id;
                    return debit;
                });
                self.responseObj['#debitAccount'] = debitAccount;
                self.responseObj['#creditAccount'] = debitAccount;
            });

            this.responseObj['#transaction'] = [{
                _id : 'Invoice',
                name: 'Invoice'
            }, {
                _id : 'Payment',
                name: 'Payment'
            }, {
                _id : 'Accrual',
                name: 'Accrual'
            }];

            setTimeout(function () {
                self.EditCollection = new EditCollection(self.collection.toJSON());
                self.EditCollection.on('saved', self.savedNewModel, self);
                self.EditCollection.on('error', self.errorFunction, self);
                self.EditCollection.on('updated', self.updatedOptions, self);

                self.$listTable = $currentEl.find('#listTable');
            }, 10);

        }

    });

    return ListView;
});
