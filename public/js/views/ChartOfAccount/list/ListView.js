define([
    'jQuery',
    'Underscore',
    'views/listViewBase',
    'text!templates/ChartOfAccount/list/ListHeader.html',
    'text!templates/ChartOfAccount/list/ListTemplate.html',
    'text!templates/ChartOfAccount/list/cancelEdit.html',
    'views/ChartOfAccount/CreateView',
    'views/ChartOfAccount/list/ListItemView',
    'collections/ChartOfAccount/filterCollection',
    'collections/ChartOfAccount/EditCollection',
    'models/chartOfAccount'
], function ($, _, ListViewBase, listHeaderTemplate, listTemplate, cancelEdit, CreateView, ListItemView, ContentCollection, EditCollection, CurrentModel) {
    'use strict';

    var ProjectsListView = ListViewBase.extend({
        el            : '#content-holder',
        contentType   : 'ChartOfAccount',
        listTemplate  : listTemplate,
        ListItemView  : ListItemView,
        EditCollection: EditCollection,
        CurrentModel  : CurrentModel,
        changedModels : {},

        events: {
            'click td.editable'                                : 'editRow',
            'change .editable'                                 : 'setEditable',
            'keydown input.editing '                           : 'keyDown',
            'click .newSelectList li:not(.miniStylePagination)': 'chooseOption'
        },

        initialize: function (options) {
            $(document).off('click');

            this.CreateView = CreateView;
            this.EditCollection = EditCollection;

            this.startTime = options.startTime;
            this.collection = options.collection;
            this.parrentContentId = options.collection.parrentContentId;
            this.sort = options.sort;
            this.filter = options.filter;
            this.page = options.collection.currentPage;
            this.ContentCollection = ContentCollection;

            this.render();
        },

        chooseOption: function (e) {
            var target = $(e.target);
            var targetElement = target.parents('td');
            var tr = target.parents('tr');
            var modelId = tr.attr('data-id');
            var attr = targetElement.data('content');
            var changedAttr;

            var editModel = this.EditCollection.get(modelId) || this.collection.get(modelId);

            if (!this.changedModels[modelId]) {
                if (!editModel.id) {
                    this.changedModels[modelId] = editModel.attributes;
                } else {
                    this.changedModels[modelId] = {};
                }
            }

            changedAttr = this.changedModels[modelId];
            if (attr === 'accountType') {

                changedAttr.accountType = target.text();
            }

            targetElement.text(target.text());

            this.hideNewSelect();
            this.setEditable(targetElement);

            return false;
        },

        setChangedValueToModel: function () {
            var editedElement = this.$el.find('.editing');
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

                this.changedModels[editedElementRowId][editedElementContent] = editedElementValue;

                if (editedElementContent === 'code') {
                    editedElementValue = parseInt(editedElementValue, 10);

                    if (isNaN(editedElementValue)) {
                        editedCol.addClass('errorContent');
                        editedElementValue = '';
                    } else {
                        editedCol.removeClass('errorContent');
                    }
                }

                this.changedModels[editedElementRowId][editedElementContent] = editedElementValue;

                editedCol.text(editedElementValue);
                editedElement.remove();
            }
        },

        saveItem: function () {
            var model;
            var code;
            var account;
            var id;
            var errors = this.$el.find('.errorContent');

            for (id in this.changedModels) {
                model = this.EditCollection.get(id) || this.collection.get(id);
                if (model) {
                    model.changed = this.changedModels[id];
                    code = this.changedModels[id].code || model.get('code');
                    account = this.changedModels[id].account || model.get('account');
                    model.changed.name = code + ' ' + account;
                }
            }

            if (errors.length) {
                return;
            }
            this.EditCollection.save();

            for (id in this.changedModels) {
                delete this.changedModels[id];
                this.EditCollection.remove(id);
            }

            this.deleteEditable();
        },

        render: function () {
            var self = this;
            var $currentEl;
            var itemView;
            $currentEl = this.$el;

            $currentEl.html('');
            $currentEl.html(_.template(listHeaderTemplate));

            itemView = new ListItemView({
                collection : this.collection,
                itemsNumber: this.collection.namberToShow
            });

            $currentEl.append(itemView.render());// added two parameters page and items number

            this.hideSaveCancelBtns();

            this.renderPagination($currentEl);

            setTimeout(function () {
                self.EditCollection = new EditCollection(self.collection.toJSON());

                self.EditCollection.on('saved', self.savedNewModel, self);
                self.EditCollection.on('error', self.errorFunction, self);
                self.EditCollection.on('updated', self.updatedOptions, self);
            }, 10);

            return this;
        }
    });

    return ProjectsListView;
});
