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
        editCollection   : EditCollection,
        contentCollection: contentCollection,
        contentType      : 'journal',
        changedModels    : {},
        responseObj      : {},
        cancelEdit       : cancelEdit,

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
            var tr = target.parents('tr');
            var id = target.attr('id');
            var modelId = tr.attr('data-id');
            var attr = targetElement.data('content');
            var elementType = '#' + attr;
            var changedAttr;

            var element = _.find(this.responseObj[elementType], function (el) {
                return el._id === id;
            });

            var editModel = this.editCollection.get(modelId) || this.collection.get(modelId);

            if (!this.changedModels[modelId]) {
                if (!editModel.id) {
                    this.changedModels[modelId] = editModel.attributes;
                } else {
                    this.changedModels[modelId] = {};
                }
            }

            changedAttr = this.changedModels[modelId];

            if (attr === 'transaction') {
                changedAttr.transaction = $.trim(target.text());
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
                debitAccount = debitAccount.data;
                self.responseObj['#debitAccount'] = debitAccount;
                self.responseObj['#creditAccount'] = debitAccount;
            });

            this.responseObj['#transaction'] = [{
                _id : 'invoice',
                name: 'Invoice'
            }, {
                _id : 'payment',
                name: 'Payment'
            }, {
                _id : 'accrual',
                name: 'Accrual'
            },{
                _id : 'writeoff',
                name: 'WriteOff'
            }];

            setTimeout(function () {
                self.editCollection = new EditCollection(self.collection.toJSON());
                self.editCollection.on('saved', self.savedNewModel, self);
                self.editCollection.on('error', self.errorFunction, self);
                self.editCollection.on('updated', self.updatedOptions, self);

                self.$listTable = $currentEl.find('#listTable');
            }, 10);

        }

    });

    return ListView;
});
