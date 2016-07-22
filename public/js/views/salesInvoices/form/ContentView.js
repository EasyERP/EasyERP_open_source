define([
    'Backbone',
    'jQuery',
    'Underscore',
    'views/tformViewBase',
    'text!templates/Invoices/form/ContentTemplate.html',
    'text!templates/Invoices/form/ListItemTemplate.html',
    'models/InvoiceModel',
    'views/Invoices/form/FormView',
    'views/Invoices/CreateView',
    'views/Invoices/list/ListItemView',
    'views/Filter/filterView',
    'common',
    'constants'
], function (Backbone, $, _, TFormBaseView, ContentTemplate, ListItemTemplate, InvoiceModel, FormView, CreateView, ListItemView, FilterView, common, CONSTANTS) {
    'use strict';

    var InvoicesListView = TFormBaseView.extend({
        listTemplate   : _.template(ListItemTemplate),
        contentTemplate: _.template(ContentTemplate),
        CreateView     : CreateView,
        ListItemView   : ListItemView,
        listUrl        : 'easyErp/Invoices/list/',
        contentType    : CONSTANTS.SALESINVOICES, // needs in view.prototype.changeLocationHash
        viewType       : 'tform', // needs in view.prototype.changeLocationHash
        hasPagination  : true,
        hasAlphabet    : false,
        formView       : null,
        selectedId     : null,
        ContentModel   : InvoiceModel,
        FormView       : FormView,

        renderList: function(quotations){
            var $thisEl = this.$el;
            var $listHolder = $thisEl.find('#listContent');

            $listHolder.append(this.listTemplate({
                quotations: quotations
            }));
        }
    });

    return InvoicesListView;
});
