define([
    'Backbone',
    'jQuery',
    'Underscore',
    'views/tformViewBase',
    'text!templates/Quotations/form/ContentTemplate.html',
    'text!templates/Quotations/form/ListItemTemplate.html',
    'models/QuotationModel',
    'views/Quotations/form/FormView',
    'views/Quotations/CreateView',
    'views/Quotations/form/EditView',
    'constants',
    'helpers'
], function (Backbone, $, _, TFormBaseView, ContentTemplate, ListItemTemplate, QuotationModel, FormView, CreateView, EditView, CONSTANTS, helpers) {
    'use strict';

    var OrdersListView = TFormBaseView.extend({
        listTemplate   : _.template(ListItemTemplate),
        contentTemplate: _.template(ContentTemplate),
        CreateView     : CreateView,
        EditView       : EditView,

        listUrl        : 'easyErp/Quotations/list/',
        contentType    : CONSTANTS.QUOTATIONS, // needs in view.prototype.changeLocationHash
        viewType       : 'tform', // needs in view.prototype.changeLocationHash
        hasPagination  : true,
        hasAlphabet    : false,
        formView       : null,
        selectedId     : null,
        ContentModel   : QuotationModel,
        FormView       : FormView,

        renderList: function (quotations) {
            var $thisEl = this.$el;
            var $listHolder = $thisEl.find('#listContent');

            $listHolder.append(this.listTemplate({
                quotations      : quotations,
                currencyClass   : helpers.currencyClass,
                currencySplitter: helpers.currencySplitter
            }));
        }
    });

    return OrdersListView;
});
