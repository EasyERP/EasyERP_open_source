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
    'views/salesQuotations/list/ListItemView',
    'common',
    'constants'
], function (Backbone,
             $,
             _,
             TFormBaseView,
             ContentTemplate,
             ListItemTemplate,
             QuotationModel,
             FormView,
             CreateView,
             ListItemView,
             common,
             CONSTANTS) {
    'use strict';

    var QuotationsListView = TFormBaseView.extend({
        listTemplate   : _.template(ListItemTemplate),
        contentTemplate: _.template(ContentTemplate),
        CreateView     : CreateView,
        ListItemView   : ListItemView,
        listUrl        : 'easyErp/salesQuotations/list/',
        contentType    : CONSTANTS.SALESQUOTATIONS, // needs in view.prototype.changeLocationHash
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
                quotations: quotations
            }));
        }

    });

    return QuotationsListView;
});
