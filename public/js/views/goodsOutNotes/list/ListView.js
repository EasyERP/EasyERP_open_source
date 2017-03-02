define([
    'Backbone',
    'jQuery',
    'Underscore',
    'views/listViewBase',
    'text!templates/goodsOutNotes/list/ListHeader.html',
    'views/goodsOutNotes/list/ListItemView',
    'collections/goodsOutNotes/filterCollection',
    'models/goodsOutNotesModel',
    'dataService',
    'populate',
    'async',
    'helpers'
], function (Backbone, $, _, ListViewBase, listTemplate, ListItemView, paymentCollection, CurrentModel, dataService, populate, async, helpers) {
    'use strict';

    var PaymentListView = ListViewBase.extend({

        listTemplate     : listTemplate,
        ListItemView     : ListItemView,
        contentType      : 'goodsOutNotes', // needs in view.prototype.changeLocationHash
        modelId          : null,
        $listTable       : null,
        editCollection   : null,
        contentCollection: paymentCollection,
        changedModels    : {},
        responseObj      : {},
        template         : _.template(listTemplate),
        hasPagination    : true,

        events: {
            'change .editable '                                : 'setEditable',
            'click .newSelectList li:not(.miniStylePagination)': 'chooseOption'
        },

        initialize: function (options) {
            $(document).off('click');

            this.CurrentModel = CurrentModel;

            this.startTime = options.startTime;
            this.collection = options.collection;
            this.parrentContentId = options.collection.parrentContentId;
            this.formUrl = 'easyErp/' + this.contentType + '/tform/';
            this.sort = options.sort;
            this.filter = options.filter;
            this.page = options.collection.currentPage;
            this.contentCollection = paymentCollection;

            this.forSale = options.forSale;

            ListViewBase.prototype.initialize.call(this, options);
        },

        gotoForm: function (e) {
            var id = $(e.target).closest('tr').data('id');
            var page = this.collection.currentPage;
            var countPerPage = this.collection.pageSize;
            var url = this.formUrl + id + '/p=' + page + '/c=' + countPerPage;

            if (this.filter) {
                url += '/filter=' + encodeURI(JSON.stringify(this.filter));
            }

            App.ownContentType = true;
            Backbone.history.navigate(url, {trigger: true});
        },

        recalcTotal: function () {
            var amount = 0;

            _.each(this.collection.toJSON(), function (model) {
                amount += parseFloat(model.paidAmount);
            });

            this.$el.find('#totalPaidAmount').text(helpers.currencySplitter(amount.toFixed(2)));
        },

        render: function () {
            var self = this;
            var $currentEl;

            $('.ui-dialog ').remove();

            $currentEl = this.$el;

            $currentEl.html('');
            $currentEl.append(this.template);
            $currentEl.append(new ListItemView({
                collection : this.collection,
                page       : this.page,
                itemsNumber: this.collection.namberToShow
            }).render());

            this.recalcTotal();

            // this.renderPagination($currentEl, this);

            // this.renderFilter();
            this.$listTable = $('#listTable');

            // $currentEl.append('<div id="timeRecivingDataFromServer">Created in ' + (new Date() - this.startTime) + 'ms</div>');

            return this;
        }
    });

    return PaymentListView;
});
