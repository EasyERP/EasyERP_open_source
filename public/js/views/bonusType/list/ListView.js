define([
    'Backbone',
    'jQuery',
    'Underscore',
    'views/listViewBase',
    'text!templates/bonusType/list/listHeader.html',
    'text!templates/bonusType/cancelEdit.html',
    'views/bonusType/CreateView',
    'views/bonusType/list/ListItemView',
    'models/bonusTypeModel',
    'collections/bonusType/filterCollection',
    'collections/bonusType/editCollection',
    'common',
    'dataService',
    'populate',
    'async',
    'constants',
    'helpers/keyCodeHelper'
], function (Backbone, $, _, ListViewBase, listTemplate, cancelEdit, CreateView, ListItemView, currentModel, contentCollection, EditCollection, common, dataService, populate, async, CONSTANTS, keyCodes) {
    'use strict';

    var bonusTypeListView = ListViewBase.extend({
        contentType  : CONSTANTS.BONUSTYPE,
        viewType     : 'list',
        responseObj  : {},
        createView   : CreateView,
        listTemplate : listTemplate,
        ListItemView : ListItemView,
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
            'click .stageSelect'                               : 'showNewSelect',
            'click td.editable'                                : 'editRow',
            click                                              : 'hideItemsNumber',
            'change .editable '                                : 'setEditable',
            'click .newSelectList li:not(.miniStylePagination)': 'chooseOption'
        },

        setChangedValueToModel: function () {
            var editedElement = this.$listTable.find('.editing');
            var editedCol;
            var editedElementRowId;
            var editedElementContent;
            var editedElementValue;

            if (navigator.userAgent.indexOf('Firefox') > -1) {
                this.setEditable(editedElement);
            }

            if (editedElement.length) {
                editedCol = editedElement.closest('td');
                editedElementRowId = editedElement.closest('tr').data('id');
                editedElementContent = editedCol.data('content');
                editedElementValue = editedElement.val();

                if (!this.changedModels[editedElementRowId]) {
                    this.changedModels[editedElementRowId] = {};
                }
                this.changedModels[editedElementRowId][editedElementContent] = editedElementValue;

                editedCol.text(editedElementValue);
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

        editRow: function (e) {
            var el = $(e.target);
            var tr = $(e.target).closest('tr');
            var Ids = tr.data('id');
            var colContent = el.data('content');
            var isType = (colContent === 'bonusType');
            var isPercent = (colContent === 'isPercent' );
            var self = this;
            var isName = false;
            var prevValue;
            var width;
            var ul;
            var editedElement;

            $('.newSelectList').remove();

            if (el.attr('data-content') === 'name') {
                isName = true;
            }

            if (Ids && el.prop('tagName') !== 'INPUT') {
                if (this.Ids) {
                    editedElement = this.$listTable.find('.editing');
                    this.setChangedValueToModel();
                }
                this.modelId = Ids;
                this.setChangedValueToModel();
            }

            if (isType) {
                ul = "<ul class='newSelectList'>" + "<li data-id='HR'>HR</li>" + "<li data-id='Sales'>Sales</li>" +
                    "<li data-id='PM'>PM</li>" + "<li data-id='Developer'>Developer</li></ul>";
                el.append(ul);
            } else if (isPercent) {
                ul = "<ul class='newSelectList'>" + "<li data-id='true'>true</li>" + "<li data-id='false'>false</li>";
                el.append(ul);
            } else {
                prevValue = el.text();
                width = el.width() - 6;
                el.html('<input class="editing" type="text" value="' + prevValue + '"   style="width:' + width + 'px">');
                if (!isName) {
                    el.find('input').attr('maxlength', '6');
                }

                el.find('.editing').keydown(function (e) {
                    var code = e.keyCode;

                    if (keyCodes.isEnter(code)) {
                        self.setChangedValueToModel();
                    } else if (!isName && !keyCodes.isDigit(code) && !keyCodes.isBspaceAndDelete(code)) {
                        e.preventDefault();
                    }
                });
            }

            return false;
        },

        chooseOption: function (e) {
            var target = $(e.target);
            var targetElement = target.parents('td');
            var tr = target.parents('tr');
            var modelId = tr.data('id');
            var id = targetElement.attr('id');
            var model = this.collection.get(modelId);
            var changedAttr;
            var datacontent;

            this.setEditable(targetElement);

            if (!this.changedModels[modelId]) {
                if (!model.id) {
                    this.changedModels[modelId] = model.attributes;
                } else {
                    this.changedModels[modelId] = {};
                }
            }

            targetElement.text(target.text());

            changedAttr = this.changedModels[modelId];
            targetElement.attr('data-id', id);

            if (targetElement.attr('data-content') === 'bonusType') {
                datacontent = 'bonusType';
            } else {
                datacontent = 'isPercent';
            }

            changedAttr[datacontent] = target.text();

            this.hideNewSelect();
            this.setEditable(targetElement);

            return false;
        },

        saveItem: function () {
            var id;
            var model;
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
            for (id in this.changedModels) {
                model = this.editCollection.get(id);
                model.changed = this.changedModels[id];
            }
            this.editCollection.save();
        },

        render: function () {
            var self = this;
            var $currentEl = this.$el;

            $('.ui-dialog ').remove();

            $currentEl.html('');
            $currentEl.append(_.template(listTemplate));
            $currentEl.append(new ListItemView({
                collection : this.collection,
                page       : this.page,
                itemsNumber: this.collection.numberToShow
            }).render()); // added two parameters page and items number

            this.renderPagination(this.$el);

            setTimeout(function () {
                self.editCollection = new EditCollection(self.collection.toJSON());
                self.editCollection.on('saved', self.savedNewModel, self);
                self.editCollection.on('updated', self.updatedOptions, self);

                self.$listTable = $('#listTable');
            }, 10);

            this.createBtnEl = $('#top-bar-createBtn');
            this.saveBtnEl = $('#top-bar-saveBtn');
            this.cancelBtnEl = $('#top-bar-deleteBtn');

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

            this.showSaveCancelBtns();
            this.editCollection.add(model);

            new CreateView(startData);

            this.changed = true;
        }
    });

    return bonusTypeListView;
});

