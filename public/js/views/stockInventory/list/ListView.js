define([
    'Backbone',
    'jQuery',
    'Underscore',
    'views/listViewBase',
    'text!templates/stockInventory/list/listHeader.html',
    'views/stockInventory/list/ListItemView',
    'views/stockInventory/list/ListTotalView',
    'views/stockInventory/ReceiveView',
    'models/stockInventoryModel',
    'collections/stockInventory/filterCollection',
    'constants'
], function (Backbone, $, _, ListViewBase, listTemplate, ListItemView, ListTotalView, ReceiveView, CurrentModel, contentCollection, CONSTANTS) {
    'use strict';

    var bonusTypeListView = ListViewBase.extend({
        viewType     : 'list',
        responseObj  : {},
        listTemplate : listTemplate,
        ListItemView : ListItemView,
        contentType  : CONSTANTS.STOCKINVENTORY,
        changedModels: {},
        hasPagination: true,

        initialize: function (options) {
            $(document).off('click');

            this.CurrentModel = CurrentModel;

            this.startTime = options.startTime;
            this.collection = options.collection;
            this.parrentContentId = options.collection.parrentContentId;
            this.sort = options.sort;
            this.filter = options.filter;
            this.page = options.collection.currentPage;
            this.contentCollection = contentCollection;

            ListViewBase.prototype.initialize.call(this, options);

            this.render();
        },

        events: {
            'click .stageSelect'                               : 'showNewSelect',
            'click td.editable'                                : 'editRow',
            'click .transferLocation'                          : 'gotoTransfer',
            click                                              : 'hideItemsNumber',
            'change .editable '                                : 'setEditable',
            'click .newSelectList li:not(.miniStylePagination)': 'chooseOption'
        },

        gotoTransfer : function (e) {
            var tr = $(e.target).closest('tr');
            var id = tr.data('id');
            var model = this.collection.get(id);

            e.preventDefault();

            return new ReceiveView({
                model         : model
            });
        },

        recalcTotal : function (){
            this.ListTotalView.renderSum();
        },

        render: function () {
            var $currentEl = this.$el;

            $('.ui-dialog ').remove();

            $currentEl.html('');
            $currentEl.append(_.template(listTemplate));

            this.ListTotalView = new ListTotalView({element: this.$el.find('#listTable'), cellSpan: 11});

            $currentEl.append(new ListItemView({
                collection : this.collection,
                page       : this.page,
                itemsNumber: this.collection.numberToShow
            }).render());

            $currentEl.append( this.ListTotalView.render());

            return this;
        }
    });

    return bonusTypeListView;
});

