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
], function (Backbone, $, _, ListViewBase, listTemplate, cancelEdit, CreateView, ListItemView, CurrentModel, contentCollection, EditCollection, common, dataService, populate, async, CONSTANTS, keyCodes) {
    'use strict';

    var bonusTypeListView = ListViewBase.extend({
        contentType  : CONSTANTS.BONUSTYPE,
        viewType     : 'list',
        responseObj  : {},
        listTemplate : listTemplate,
        ListItemView : ListItemView,
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
            'click .stageSelect'                               : 'showNewSelect',
            'click td.editable'                                : 'editRow',
            click                                              : 'hideItemsNumber',
            'change .editable '                                : 'setEditable',
            'click .newSelectList li:not(.miniStylePagination)': 'chooseOption'
        },

        editRow: function (e) {
            var el = $(e.target);
            var tr = $(e.target).closest('tr');
            var Ids = tr.data('id');
            var colContent = el.data('content');
            var isType = (colContent === 'bonusType');
            var isPercent = (colContent === 'isPercent');
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

                el.find('.editing').keydown(function (event) {
                    var code = event.keyCode;

                    if (keyCodes.isEnter(code)) {
                        self.setChangedValueToModel();
                    } else if (!isName && !keyCodes.isDigit(code) && !keyCodes.isBspaceAndDelete(code) && !keyCodes.isDecimalDot(code)) {
                        event.preventDefault();
                    }
                });
            }

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
            targetElement.removeClass('errorContent');

            changedAttr = this.changedModels[modelId];
            targetElement.attr('data-id', id);

            if (targetElement.attr('data-content') === 'bonusType') {
                datacontent = 'bonusType';
            } else {
                datacontent = 'isPercent';
            }

            changedAttr[datacontent] = target.text();

            this.hide(e);
            this.setEditable(targetElement);

            return false;
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

            return this;
        }
    });

    return bonusTypeListView;
});

