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
    'views/Quotations/list/ListItemView',
    'views/Filter/filterView',
    'common',
    'constants'
], function (Backbone, $, _, TFormBaseView, ContentTemplate, ListItemTemplate, QuotationModel, FormView, CreateView, ListItemView, FilterView, common, CONSTANTS) {
    'use strict';

    var QuotationsListView = TFormBaseView.extend({
        listTemplate   : _.template(ListItemTemplate),
        contentTemplate: _.template(ContentTemplate),
        CreateView     : CreateView,
        ListItemView   : ListItemView,
        listUrl        : 'easyErp/Quotations/list/',
        contentType    : CONSTANTS.QUOTATIONS, // needs in view.prototype.changeLocationHash
        viewType       : 'tform', // needs in view.prototype.changeLocationHash
        hasPagination  : true,
        hasAlphabet    : false,
        formView       : null,
        selectedId     : null,
        ContentModel   : QuotationModel,
        FormView       : FormView,

        events: {
            'click .saveBtn': 'saveCurrentQuotation'
        },

        renderList: function (quotations) {
            var $thisEl = this.$el;
            var $listHolder = $thisEl.find('#listContent');

            $listHolder.append(this.listTemplate({
                quotations: quotations
            }));
        },

        saveCurrentQuotation: function () {
            this.formView.saveItem();
        }
    });

    return QuotationsListView;
});
