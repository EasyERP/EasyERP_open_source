define([
    'jQuery',
    'Underscore',
    'views/listViewBase',
    'text!templates/ChartOfAccount/list/ListHeader.html',
    'text!templates/ChartOfAccount/list/ListTemplate.html',
    'text!templates/ChartOfAccount/list/cancelEdit.html',
    'text!templates/ChartOfAccount/list/rowTempl.html',
    'views/ChartOfAccount/CreateView',
    'views/ChartOfAccount/list/ListItemView',
    'collections/ChartOfAccount/filterCollection',
    'collections/ChartOfAccount/editCollection',
    'models/chartOfAccount',
    'populate'
], function ($, _, ListViewBase, listHeaderTemplate, listTemplate, cancelEdit, rowTempl, CreateView, ListItemView, ContentCollection, EditCollection, CurrentModel, populate) {
    'use strict';

    var ProjectsListView = ListViewBase.extend({
        el            : '#content-holder',
        contentType   : 'ChartOfAccount',
        listTemplate  : listTemplate,
        ListItemView  : ListItemView,
        editCollection: EditCollection,
        CurrentModel  : CurrentModel,
        changedModels : {},
        cancelEdit    : cancelEdit,
        responseObj   : {},

        events: {
            'click td.editable'                                : 'editRow',
            'change .editable'                                 : 'setEditable',
            'keydown input.editing '                           : 'keyDown',
            'click .newSelectList li:not(.miniStylePagination)': 'chooseOption',
            'click .current-selected'                          : 'showNewSelect',
            'click .checkBudget'                               : 'changeBudgeted'
        },

        initialize: function (options) {
            $(document).off('click');

            this.CreateView = CreateView;
            this.editCollection = EditCollection;

            this.startTime = options.startTime;
            this.collection = options.collection;
            this.parrentContentId = options.collection.parrentContentId;
            this.sort = options.sort;
            this.filter = options.filter;
            this.page = options.collection.currentPage;
            this.ContentCollection = ContentCollection;

            ListViewBase.prototype.initialize.call(this, options);
        },

        chooseOption: function (e) {
            var target = $(e.target);
            var closestA = target.closest('a');
            var targetElement = target.parents('td');
            var tr = target.parents('tr');
            var modelId = tr.attr('data-id');
            var attr = targetElement.data('content');
            var changedAttr;

            var editModel = this.editCollection.get(modelId) || this.collection.get(modelId);

            if (!this.changedModels[modelId]) {
                if (!editModel.id) {
                    this.changedModels[modelId] = editModel.attributes;
                } else {
                    this.changedModels[modelId] = {};
                }
            }

            changedAttr = this.changedModels[modelId];
            if (attr === 'category') {

                changedAttr.category = target.attr('id');
                closestA.text(target.text());
            } else {
                targetElement.text(target.text());
            }

            this.hide(e);
            this.setEditable(targetElement);

            return false;
        },

        bindingEventsToEditedCollection: function (context) {
            if (context.editCollection) {
                context.editCollection.unbind();
            }

            context.editCollection = new EditCollection(context.collection.toJSON());
            context.editCollection.on('saved', context.savedNewModel, context);
            context.editCollection.on('updated', context.updatedOptions, context);
        },

        changeBudgeted: function (e) {
            e.stopPropagation();

            $(e.target).addClass('editing');
            this.setEditable($(e.target));
            this.setChangedValueToModel(true);
        },

        setChangedValueToModel: function (budgeted) {
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

                if (editedElementContent === 'budgeted') {
                    budgeted = true;
                }

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

                if (budgeted) {
                    editedElementValue = editedElement.closest('tr').find('.checkBudget').prop('checked');
                    this.changedModels[editedElementRowId][editedElementContent] = editedElementValue;

                    return false;
                }

                this.changedModels[editedElementRowId][editedElementContent] = $.trim(editedElementValue);

                editedCol.text(editedElementValue);
                editedElement.remove();
            }
        },

        saveItem: function () {
            var model;
            var code;
            var account;
            var id;
            var errors;
            var keys;
            var i;

            this.setChangedValueToModel();

            errors = this.$el.find('.errorContent');
            keys = Object.keys(this.changedModels);

            for (i = keys.length - 1; i >= 0; i--) {
                id = keys[i];
                model = this.editCollection.get(id) || this.collection.get(id);
                if (model) {
                    model.changed = this.changedModels[id];
                    code = parseInt(this.changedModels[id].code, 10) || model.get('code');
                    account = this.changedModels[id].account || model.get('account');
                    model.changed.name = code.toString() + ' ' + account;
                }
            }

            if (errors.length) {
                return;
            }
            this.editCollection.save();

            for (i = keys.length - 1; i >= 0; i--) {
                id = keys[i];
                delete this.changedModels[id];
                this.editCollection.remove(id);
            }

            this.deleteEditable();
        },

        editRow: function (e) {
            var el = $(e.target);
            var tr = $(e.target).closest('tr');
            var trId = tr.data('id');
            var colType = el.data('type');
            var isSelect = colType !== 'input' && el.prop('tagName') !== 'INPUT';
            var tempContainer;
            var width;

            e.stopPropagation();

            if (el.attr('id') === 'selectInput') {
                return false;
            }

            if (trId && el.prop('tagName') !== 'INPUT') {
                this.modelId = trId;
                this.setChangedValueToModel();
            }

            if (isSelect) {
                this.showNewSelect(e);
            } else {
                tempContainer = el.text();
                width = el.width() - 6;
                el.html("<input class='editing' type='text' value='" + tempContainer + " ' style='width:'" + width + "px'>");
            }

            return false;
        },

        render: function () {
            var self = this;
            var $currentEl;
            var itemView;
            var rowTemplate = _.template(rowTempl);
            var filteredCollection = [];
            var i = 0;
            var subArray = [];

            $currentEl = this.$el;

            $currentEl.html('');
            $currentEl.html(_.template(listHeaderTemplate));

            itemView = new ListItemView({
                collection : this.collection,
                itemsNumber: this.collection.namberToShow
            });

            $currentEl.append(itemView.render()); // added two parameters page and items number

            filteredCollection = _.filter(this.collection.toJSON(), function (el) {
                return el.subAccount;
            });

            filteredCollection.forEach(function (elem) {
                var el = $currentEl.find('[data-id="' + elem.subAccount + '"]');
                var dataIndex = parseInt(el.attr('data-index'), 10) + 1;

                el.after(rowTemplate({el: elem, classValue: 'child' + dataIndex, index: dataIndex}));

                if (!el.length) {
                    subArray.push(elem);
                }
            });

            do {
                subArray.forEach(function (elem, ind) {
                    var el = $currentEl.find('[data-id="' + elem.subAccount + '"]');
                    var dataIndex = parseInt(el.attr('data-index'), 10) + 1;

                    el.after(rowTemplate({el: elem, classValue: 'child' + dataIndex, index: dataIndex}));

                    if (el.length) {
                        subArray.splice(ind, 1);
                    }
                });
            } while (subArray.length);

            this.hideSaveCancelBtns();

            // this.renderPagination($currentEl);

            populate.get('#accountsCategory', '/accountsCategories/getAll', {}, 'name', this, true, true);

            setTimeout(function () {
                self.editCollection = new EditCollection(self.collection.toJSON());

                self.editCollection.on('saved', self.savedNewModel, self);
                self.editCollection.on('error', self.errorFunction, self);
                self.editCollection.on('updated', self.updatedOptions, self);
            }, 10);

            return this;
        }
    });

    return ProjectsListView;
})
;
