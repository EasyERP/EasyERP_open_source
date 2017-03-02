define([
    'Backbone',
    'jQuery',
    'Underscore',
    'views/tformViewBase',
    'text!templates/stockTransactions/form/ContentTemplate.html',
    'text!templates/stockTransactions/form/ListItemTemplate.html',
    'models/stockTransactionModel',
    'text!templates/stockTransactions/form/FormTemplate.html',
    'views/stockTransactions/CreateView',
    'views/stockTransactions/form/FormView',
    'views/stockTransactions/list/ListItemView',
    'views/Filter/filterView',
    'helpers',
    'common',
    'constants'
], function (Backbone, $, _, TFormBaseView, ContentTemplate, ListItemTemplate, StockModel, formTemplate, CreateView, FormView, ListItemView, FilterView, helpers, common, CONSTANTS) {
    'use strict';

    var StockCorrectionsView = TFormBaseView.extend({
        listTemplate   : _.template(ListItemTemplate),
        contentTemplate: _.template(ContentTemplate),
        CreateView     : CreateView,
        ListItemView   : ListItemView,
        listUrl        : 'easyErp/stockTransactions/list/',
        contentType    : CONSTANTS.STOCKTRANSACTIONS,
        viewType       : 'tform',
        hasPagination  : true,
        hasAlphabet    : false,
        formView       : null,
        selectedId     : null,
        ContentModel   : StockModel,
        FormView       : FormView,
        forSales       : true,

        renderList: function (collection) {
            var $thisEl = this.$el;
            var $listHolder = $thisEl.find('#listContent');

            $listHolder.append(this.listTemplate({
                collection: collection
            }));
        }
    });

    return StockCorrectionsView;
});