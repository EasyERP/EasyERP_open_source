define([
    'Backbone',
    'jQuery',
    'Underscore',
    'views/tformViewBase',
    'text!templates/salesQuotations/form/ContentTemplate.html',
    'text!templates/salesQuotations/form/ListItemTemplate.html',
    'models/QuotationModel',
    'views/salesQuotations/form/FormView',
    'views/salesQuotations/CreateView',
    'views/Quotations/form/EditView',
    'constants',
    'helpers'
], function (Backbone,
             $,
             _,
             TFormBaseView,
             ContentTemplate,
             ListItemTemplate,
             QuotationModel,
             FormView,
             CreateView,
             EditView,
             CONSTANTS,
             helpers) {
    'use strict';

    var QuotationsListView = TFormBaseView.extend({
        listTemplate   : _.template(ListItemTemplate),
        contentTemplate: _.template(ContentTemplate),
        CreateView     : CreateView,
        EditView       : EditView,
        listUrl        : 'easyErp/salesQuotations/list/',
        contentType    : CONSTANTS.SALESQUOTATIONS, // needs in view.prototype.changeLocationHash
        viewType       : 'tform', // needs in view.prototype.changeLocationHash
        hasPagination  : true,
        hasAlphabet    : false,
        formView       : null,
        forSales       : true,
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

    return QuotationsListView;
});
