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
            'click .current-selected'                          : 'showNewSelect'
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

            this.render();
        },

        chooseOption: function (e) {
            var target = $(e.target);
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
            if (attr === 'type') {

                changedAttr.type = target.attr('id');
            }

            targetElement.text(target.text());

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
            var keys = Object.keys(this.changedModels);
            var i;

            for (i = keys.length - 1; i >= 0; i--) {
                id = keys[i];
                model = this.editCollection.get(id) || this.collection.get(id);
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
            this.editCollection.save();

            for (i = keys.length - 1; i >= 0; i--) {
                id = keys[i];
                delete this.changedModels[id];
                this.editCollection.remove(id);
            }

            this.deleteEditable();
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

            populate.get('#accountTypeDd', '/accountTypes/getForDD', {}, 'name', this, true, true);

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
});
